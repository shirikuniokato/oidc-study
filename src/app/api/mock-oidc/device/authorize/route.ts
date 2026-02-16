import { ISSUER_PATH, findClient } from "@/lib/oidc/config";
import {
	corsHeaders,
	jsonResponse,
	oauthErrorResponse,
} from "@/lib/oidc/cors-headers";
import {
	generateUserCode,
	storeDeviceCode,
} from "@/lib/oidc/device-code-store";
import type { NextRequest } from "next/server";

const DEVICE_CODE_EXPIRY_SECONDS = 600;
const POLLING_INTERVAL_SECONDS = 5;

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

	const clientId = params.get("client_id");
	const scope = params.get("scope") || "openid";
	const validations: string[] = [];

	if (!clientId) {
		return oauthErrorResponse("invalid_request", "client_id is required");
	}

	if (!findClient(clientId)) {
		return oauthErrorResponse("invalid_client", "Unknown client_id");
	}
	validations.push(`client_id: ${clientId} - 検証OK`);

	const baseUrl = new URL(request.url).origin;
	const deviceCode = crypto.randomUUID();
	const userCode = generateUserCode();

	storeDeviceCode({
		deviceCode,
		userCode,
		clientId,
		scope,
		expiresAt: Date.now() + DEVICE_CODE_EXPIRY_SECONDS * 1000,
		interval: POLLING_INTERVAL_SECONDS,
		status: "pending",
	});
	validations.push("device_code: 生成・保存完了");
	validations.push(`user_code: ${userCode} - 生成完了`);

	const verificationUri = `${baseUrl}${ISSUER_PATH}/device`;
	const verificationUriComplete = `${verificationUri}?user_code=${userCode}`;

	return jsonResponse({
		device_code: deviceCode,
		user_code: userCode,
		verification_uri: verificationUri,
		verification_uri_complete: verificationUriComplete,
		expires_in: DEVICE_CODE_EXPIRY_SECONDS,
		interval: POLLING_INTERVAL_SECONDS,
		_debug: {
			step: "device_authorization",
			validations,
			warnings: [],
		},
	});
}

export async function OPTIONS(): Promise<Response> {
	return new Response(null, { status: 204, headers: corsHeaders });
}
