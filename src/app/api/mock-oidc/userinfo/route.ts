import { ISSUER_PATH, findUserBySub } from "@/lib/oidc/config";
import {
	corsHeaders,
	jsonResponse,
	oauthErrorResponse,
} from "@/lib/oidc/cors-headers";
import { getKeyPair } from "@/lib/oidc/keys";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

function extractBearerToken(authHeader: string | null): string | undefined {
	if (!authHeader?.startsWith("Bearer ")) {
		return undefined;
	}
	return authHeader.slice(7);
}

export async function GET(request: NextRequest): Promise<Response> {
	const authHeader = request.headers.get("authorization");
	const token = extractBearerToken(authHeader);
	const validations: string[] = [];

	if (!token) {
		return oauthErrorResponse("invalid_token", "Bearer token is required", 401);
	}
	validations.push("Bearer token: 抽出完了");

	const { publicKey } = await getKeyPair();

	let payload: { sub?: string; scope?: string };
	try {
		const result = await jwtVerify(token, publicKey, { issuer: ISSUER_PATH });
		payload = result.payload as { sub?: string; scope?: string };
		validations.push("JWT署名: 検証OK");
		validations.push(`issuer: ${ISSUER_PATH} - 検証OK`);
	} catch {
		return oauthErrorResponse(
			"invalid_token",
			"Token verification failed",
			401,
		);
	}

	if (!payload.sub) {
		return oauthErrorResponse("invalid_token", "Token has no sub claim", 401);
	}
	validations.push(`sub: ${payload.sub} - 取得完了`);

	const user = findUserBySub(payload.sub);
	if (!user) {
		return oauthErrorResponse("invalid_token", "User not found", 401);
	}
	validations.push(`user: ${user.name} - 特定完了`);

	// scopeに基づいてクレームを制限
	const scopes = (payload.scope || "").split(" ");
	const claims: Record<string, unknown> = { sub: user.sub };

	if (scopes.includes("profile")) {
		claims.name = user.name;
		claims.picture = user.picture;
		validations.push("profile scope: name, picture を返却");
	}

	if (scopes.includes("email")) {
		claims.email = user.email;
		claims.email_verified = user.emailVerified;
		validations.push("email scope: email, email_verified を返却");
	}

	return jsonResponse({
		...claims,
		_debug: {
			step: "userinfo",
			validations,
			warnings: [],
		},
	});
}

export async function OPTIONS(): Promise<Response> {
	return new Response(null, { status: 204, headers: corsHeaders });
}
