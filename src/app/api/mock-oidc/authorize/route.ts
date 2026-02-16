import { storeAuthorizationCode } from "@/lib/oidc/authorization-code-store";
import { TEST_USERS, findClient, findUserBySub } from "@/lib/oidc/config";
import { corsHeaders } from "@/lib/oidc/cors-headers";
import { type NextRequest, NextResponse } from "next/server";

function validateAuthorizationParams(params: URLSearchParams): {
	error?: string;
	errorDescription?: string;
} {
	const clientId = params.get("client_id");
	if (!clientId) {
		return {
			error: "invalid_request",
			errorDescription: "client_id is required",
		};
	}

	const client = findClient(clientId);
	if (!client) {
		return { error: "invalid_client", errorDescription: "Unknown client_id" };
	}

	const redirectUri = params.get("redirect_uri");
	if (!redirectUri) {
		return {
			error: "invalid_request",
			errorDescription: "redirect_uri is required",
		};
	}

	// redirect_uriは相対パスまたは絶対パスで照合
	const matchesRedirect = client.redirectUris.some(
		(uri) => redirectUri === uri || redirectUri.endsWith(uri),
	);
	if (!matchesRedirect) {
		return {
			error: "invalid_request",
			errorDescription: "redirect_uri is not registered",
		};
	}

	const responseType = params.get("response_type");
	if (responseType !== "code") {
		return {
			error: "unsupported_response_type",
			errorDescription: "Only response_type=code is supported",
		};
	}

	return {};
}

function buildLoginHtml(params: URLSearchParams, actionUrl: string): string {
	return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mock OIDC - ログイン</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
    .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 400px; width: 100%; }
    h2 { margin-top: 0; color: #333; }
    .user-btn { display: block; width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; text-align: left; font-size: 16px; }
    .user-btn:hover { background: #f0f7ff; border-color: #3b82f6; }
    .info { color: #666; font-size: 14px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Mock OIDC Provider</h2>
    <p class="info">テストユーザーを選択してログインしてください</p>
    ${TEST_USERS.map(
			(user) => `
    <form method="POST" action="${actionUrl}">
      ${Array.from(params.entries())
				.map(
					([key, value]) =>
						`<input type="hidden" name="${key}" value="${escapeHtml(value)}">`,
				)
				.join("\n      ")}
      <input type="hidden" name="sub" value="${user.sub}">
      <button type="submit" class="user-btn">
        <strong>${escapeHtml(user.name)}</strong><br>
        <small>${escapeHtml(user.email)}</small>
      </button>
    </form>`,
		).join("\n")}
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function issueCodeAndRedirect(params: URLSearchParams, sub: string): Response {
	const clientId = params.get("client_id") as string;
	const redirectUri = params.get("redirect_uri") as string;
	const scope = params.get("scope") || "openid";
	const state = params.get("state");
	const nonce = params.get("nonce");
	const codeChallenge = params.get("code_challenge");
	const codeChallengeMethod = params.get("code_challenge_method");

	const authCode = storeAuthorizationCode({
		clientId,
		redirectUri,
		scope,
		sub,
		nonce: nonce || undefined,
		codeChallenge: codeChallenge || undefined,
		codeChallengeMethod: codeChallengeMethod || undefined,
	});

	const redirectUrl = new URL(redirectUri, "http://localhost");
	redirectUrl.searchParams.set("code", authCode.code);
	if (state) {
		redirectUrl.searchParams.set("state", state);
	}

	// 相対パスのredirect_uriの場合、パスのみでリダイレクト
	const location = redirectUri.startsWith("http")
		? redirectUrl.toString()
		: `${redirectUri}?${redirectUrl.searchParams.toString()}`;

	const debugInfo = {
		step: "authorization",
		validations: [
			`client_id: ${clientId} - 検証OK`,
			`redirect_uri: ${redirectUri} - 検証OK`,
			"response_type: code - 検証OK",
			`sub: ${sub} - ユーザー特定`,
			codeChallenge ? "code_challenge: PKCE検証用に保存" : "PKCE: なし",
		],
		warnings: !codeChallenge ? ["PKCEが使用されていません"] : [],
	};

	return new Response(null, {
		status: 302,
		headers: {
			Location: location,
			"X-Debug-Info": JSON.stringify(debugInfo),
			...corsHeaders,
		},
	});
}

export async function GET(request: NextRequest): Promise<Response> {
	const params = request.nextUrl.searchParams;

	const validation = validateAuthorizationParams(params);
	if (validation.error) {
		return NextResponse.json(
			{
				error: validation.error,
				error_description: validation.errorDescription,
			},
			{ status: 400, headers: corsHeaders },
		);
	}

	// login_hintがある場合はユーザーを直接特定
	const loginHint = params.get("login_hint");
	if (loginHint) {
		const user = findUserBySub(loginHint);
		if (!user) {
			return NextResponse.json(
				{
					error: "invalid_request",
					error_description: "Unknown login_hint user",
				},
				{ status: 400, headers: corsHeaders },
			);
		}
		return issueCodeAndRedirect(params, user.sub);
	}

	// login_hintがない場合はログインフォームを表示
	const actionUrl = new URL(request.url).pathname;
	const html = buildLoginHtml(params, actionUrl);

	return new Response(html, {
		status: 200,
		headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
	});
}

export async function POST(request: NextRequest): Promise<Response> {
	const formData = await request.formData();
	const params = new URLSearchParams();

	for (const [key, value] of formData.entries()) {
		if (typeof value === "string") {
			params.set(key, value);
		}
	}

	const validation = validateAuthorizationParams(params);
	if (validation.error) {
		return NextResponse.json(
			{
				error: validation.error,
				error_description: validation.errorDescription,
			},
			{ status: 400, headers: corsHeaders },
		);
	}

	const sub = params.get("sub");
	if (!sub || !findUserBySub(sub)) {
		return NextResponse.json(
			{ error: "invalid_request", error_description: "Invalid user selection" },
			{ status: 400, headers: corsHeaders },
		);
	}

	return issueCodeAndRedirect(params, sub);
}

export async function OPTIONS(): Promise<Response> {
	return new Response(null, { status: 204, headers: corsHeaders });
}
