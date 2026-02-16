import {
	corsHeaders,
	jsonResponse,
	oauthErrorResponse,
} from "@/lib/oidc/cors-headers";
import { revokeRefreshToken } from "@/lib/oidc/session-store";
import type { NextRequest } from "next/server";

// RFC 7009 トークン失効エンドポイント
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
	const token = params.get("token");
	const validations: string[] = [];

	if (!token) {
		// RFC 7009: tokenパラメータがない場合でも200を返す
		return jsonResponse({
			_debug: {
				step: "revocation",
				validations: ["token パラメータなし - 何もしない"],
				warnings: [],
			},
		});
	}

	const revoked = revokeRefreshToken(token);
	if (revoked) {
		validations.push("refresh_token: 失効完了");
	} else {
		validations.push(
			"token: セッションに存在しない（既に失効済みまたは不明なトークン）",
		);
	}

	// RFC 7009: 成功時は常に200を返す
	return jsonResponse({
		_debug: {
			step: "revocation",
			validations,
			warnings: [],
		},
	});
}

export async function OPTIONS(): Promise<Response> {
	return new Response(null, { status: 204, headers: corsHeaders });
}
