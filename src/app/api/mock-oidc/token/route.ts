import { consumeAuthorizationCode } from "@/lib/oidc/authorization-code-store";
import { findClient } from "@/lib/oidc/config";
import {
	corsHeaders,
	jsonResponse,
	oauthErrorResponse,
} from "@/lib/oidc/cors-headers";
import { getByDeviceCode } from "@/lib/oidc/device-code-store";
import { verifyCodeChallenge } from "@/lib/oidc/pkce";
import {
	getRefreshTokenSession,
	revokeRefreshToken,
	storeRefreshTokenSession,
} from "@/lib/oidc/session-store";
import {
	issueAccessToken,
	issueIdToken,
	issueRefreshToken,
} from "@/lib/oidc/token-issuer";
import type { DebugInfo } from "@/lib/oidc/types";
import type { NextRequest } from "next/server";

function validateClientCredentials(
	clientId: string | null,
	clientSecret: string | null,
): { error?: string; errorDescription?: string } {
	if (!clientId) {
		return {
			error: "invalid_request",
			errorDescription: "client_id is required",
		};
	}

	const client = findClient(clientId);
	if (!client) {
		return { error: "invalid_client", errorDescription: "Unknown client" };
	}

	if (clientSecret && client.clientSecret !== clientSecret) {
		return {
			error: "invalid_client",
			errorDescription: "Invalid client_secret",
		};
	}

	return {};
}

async function handleAuthorizationCode(
	params: URLSearchParams,
): Promise<Response> {
	const code = params.get("code");
	const redirectUri = params.get("redirect_uri");
	const clientId = params.get("client_id");
	const clientSecret = params.get("client_secret");
	const codeVerifier = params.get("code_verifier");

	const validations: string[] = [];
	const warnings: string[] = [];

	const clientValidation = validateClientCredentials(clientId, clientSecret);
	if (clientValidation.error) {
		return oauthErrorResponse(
			clientValidation.error,
			clientValidation.errorDescription as string,
		);
	}
	validations.push(`client_id: ${clientId} - 検証OK`);

	if (!code) {
		return oauthErrorResponse("invalid_request", "code is required");
	}

	const authCode = consumeAuthorizationCode(code);
	if (!authCode) {
		return oauthErrorResponse(
			"invalid_grant",
			"Invalid or expired authorization code",
		);
	}
	validations.push("authorization_code: 有効 - 消費済み");

	if (authCode.clientId !== clientId) {
		return oauthErrorResponse("invalid_grant", "client_id mismatch");
	}

	if (redirectUri && authCode.redirectUri !== redirectUri) {
		return oauthErrorResponse("invalid_grant", "redirect_uri mismatch");
	}
	validations.push("redirect_uri: 一致 - 検証OK");

	// PKCE検証
	if (authCode.codeChallenge) {
		if (!codeVerifier) {
			return oauthErrorResponse(
				"invalid_request",
				"code_verifier is required for PKCE",
			);
		}
		const isValid = await verifyCodeChallenge(
			codeVerifier,
			authCode.codeChallenge,
			authCode.codeChallengeMethod || "S256",
		);
		if (!isValid) {
			return oauthErrorResponse("invalid_grant", "PKCE verification failed");
		}
		validations.push("PKCE: code_verifier検証OK");
	} else {
		warnings.push("PKCEが使用されていません");
	}

	const accessToken = await issueAccessToken(
		authCode.sub,
		authCode.scope,
		authCode.clientId,
	);
	validations.push("access_token: 発行完了");

	const scopes = authCode.scope.split(" ");
	let idToken: string | undefined;
	if (scopes.includes("openid")) {
		idToken = await issueIdToken(
			authCode.sub,
			authCode.clientId,
			authCode.nonce,
			authCode.scope,
		);
		validations.push("id_token: 発行完了 (openidスコープあり)");
	}

	const refreshToken = await issueRefreshToken(
		authCode.sub,
		authCode.clientId,
		authCode.scope,
	);
	storeRefreshTokenSession(refreshToken, {
		sub: authCode.sub,
		clientId: authCode.clientId,
		scope: authCode.scope,
	});
	validations.push("refresh_token: 発行完了");

	const debug: DebugInfo = { step: "token_exchange", validations, warnings };

	return jsonResponse({
		access_token: accessToken,
		token_type: "Bearer" as const,
		expires_in: 3600,
		id_token: idToken,
		refresh_token: refreshToken,
		scope: authCode.scope,
		_debug: debug,
	});
}

async function handleRefreshToken(params: URLSearchParams): Promise<Response> {
	const refreshToken = params.get("refresh_token");
	const clientId = params.get("client_id");
	const clientSecret = params.get("client_secret");

	const validations: string[] = [];

	const clientValidation = validateClientCredentials(clientId, clientSecret);
	if (clientValidation.error) {
		return oauthErrorResponse(
			clientValidation.error,
			clientValidation.errorDescription as string,
		);
	}
	validations.push(`client_id: ${clientId} - 検証OK`);

	if (!refreshToken) {
		return oauthErrorResponse("invalid_request", "refresh_token is required");
	}

	const session = getRefreshTokenSession(refreshToken);
	if (!session) {
		return oauthErrorResponse("invalid_grant", "Invalid refresh_token");
	}
	validations.push("refresh_token: セッション検証OK");

	if (session.clientId !== clientId) {
		return oauthErrorResponse("invalid_grant", "client_id mismatch");
	}

	// 古いリフレッシュトークンを無効化
	revokeRefreshToken(refreshToken);
	validations.push("旧refresh_token: 無効化完了");

	const accessToken = await issueAccessToken(
		session.sub,
		session.scope,
		session.clientId,
	);
	validations.push("access_token: 再発行完了");

	const scopes = session.scope.split(" ");
	let idToken: string | undefined;
	if (scopes.includes("openid")) {
		idToken = await issueIdToken(
			session.sub,
			session.clientId,
			undefined,
			session.scope,
		);
		validations.push("id_token: 再発行完了");
	}

	const newRefreshToken = await issueRefreshToken(
		session.sub,
		session.clientId,
		session.scope,
	);
	storeRefreshTokenSession(newRefreshToken, {
		sub: session.sub,
		clientId: session.clientId,
		scope: session.scope,
	});
	validations.push("refresh_token: ローテーション完了");

	const debug: DebugInfo = { step: "refresh_token", validations, warnings: [] };

	return jsonResponse({
		access_token: accessToken,
		token_type: "Bearer" as const,
		expires_in: 3600,
		id_token: idToken,
		refresh_token: newRefreshToken,
		scope: session.scope,
		_debug: debug,
	});
}

async function handleClientCredentials(
	params: URLSearchParams,
): Promise<Response> {
	const clientId = params.get("client_id");
	const clientSecret = params.get("client_secret");
	const scope = params.get("scope") || "";

	const validations: string[] = [];

	const clientValidation = validateClientCredentials(clientId, clientSecret);
	if (clientValidation.error) {
		return oauthErrorResponse(
			clientValidation.error,
			clientValidation.errorDescription as string,
		);
	}

	if (!clientSecret) {
		return oauthErrorResponse(
			"invalid_client",
			"client_secret is required for client_credentials",
		);
	}

	const client = findClient(clientId as string);
	if (client?.clientSecret !== clientSecret) {
		return oauthErrorResponse("invalid_client", "Invalid client_secret");
	}
	validations.push(`client認証: ${clientId} - 検証OK`);

	const accessToken = await issueAccessToken(
		clientId as string,
		scope,
		clientId as string,
	);
	validations.push("access_token: 発行完了 (client_credentials)");

	const debug: DebugInfo = {
		step: "client_credentials",
		validations,
		warnings: ["client_credentialsではid_token/refresh_tokenは発行されません"],
	};

	return jsonResponse({
		access_token: accessToken,
		token_type: "Bearer" as const,
		expires_in: 3600,
		scope,
		_debug: debug,
	});
}

async function handleDeviceCode(params: URLSearchParams): Promise<Response> {
	const deviceCode = params.get("device_code");
	const clientId = params.get("client_id");

	const validations: string[] = [];

	if (!clientId || !findClient(clientId)) {
		return oauthErrorResponse("invalid_client", "Invalid client_id");
	}
	validations.push(`client_id: ${clientId} - 検証OK`);

	if (!deviceCode) {
		return oauthErrorResponse("invalid_request", "device_code is required");
	}

	const stored = getByDeviceCode(deviceCode);
	if (!stored) {
		return oauthErrorResponse(
			"invalid_grant",
			"Invalid or expired device_code",
		);
	}
	validations.push("device_code: 有効");

	if (stored.clientId !== clientId) {
		return oauthErrorResponse("invalid_grant", "client_id mismatch");
	}

	if (stored.status === "pending") {
		validations.push("status: pending - ユーザー認可待ち");
		return jsonResponse(
			{
				error: "authorization_pending",
				error_description: "The user has not yet completed authorization",
				_debug: { step: "device_code_polling", validations, warnings: [] },
			},
			400,
		);
	}

	if (stored.status === "denied") {
		validations.push("status: denied - ユーザーが拒否");
		return jsonResponse(
			{
				error: "access_denied",
				error_description: "The user denied the authorization request",
				_debug: { step: "device_code_polling", validations, warnings: [] },
			},
			400,
		);
	}

	// status === "approved"
	validations.push("status: approved - トークン発行");
	const sub = stored.sub as string;

	const accessToken = await issueAccessToken(
		sub,
		stored.scope,
		stored.clientId,
	);
	validations.push("access_token: 発行完了");

	const scopes = stored.scope.split(" ");
	let idToken: string | undefined;
	if (scopes.includes("openid")) {
		idToken = await issueIdToken(sub, stored.clientId, undefined, stored.scope);
		validations.push("id_token: 発行完了");
	}

	const refreshToken = await issueRefreshToken(
		sub,
		stored.clientId,
		stored.scope,
	);
	storeRefreshTokenSession(refreshToken, {
		sub,
		clientId: stored.clientId,
		scope: stored.scope,
	});
	validations.push("refresh_token: 発行完了");

	const debug: DebugInfo = {
		step: "device_code_exchange",
		validations,
		warnings: [],
	};

	return jsonResponse({
		access_token: accessToken,
		token_type: "Bearer" as const,
		expires_in: 3600,
		id_token: idToken,
		refresh_token: refreshToken,
		scope: stored.scope,
		_debug: debug,
	});
}

export async function POST(request: NextRequest): Promise<Response> {
	const contentType = request.headers.get("content-type") || "";
	if (!contentType.includes("application/x-www-form-urlencoded")) {
		return oauthErrorResponse(
			"invalid_request",
			"Content-Type must be application/x-www-form-urlencoded",
		);
	}

	const body = await request.text();
	const params = new URLSearchParams(body);
	const grantType = params.get("grant_type");

	switch (grantType) {
		case "authorization_code":
			return handleAuthorizationCode(params);
		case "refresh_token":
			return handleRefreshToken(params);
		case "client_credentials":
			return handleClientCredentials(params);
		case "urn:ietf:params:oauth:grant-type:device_code":
			return handleDeviceCode(params);
		default:
			return oauthErrorResponse(
				"unsupported_grant_type",
				`Unsupported grant_type: ${grantType}`,
			);
	}
}

export async function OPTIONS(): Promise<Response> {
	return new Response(null, { status: 204, headers: corsHeaders });
}
