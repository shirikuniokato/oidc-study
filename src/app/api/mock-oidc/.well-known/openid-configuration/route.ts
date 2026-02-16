import { getDiscoveryDocument } from "@/lib/oidc/config";
import { corsHeaders, jsonResponse } from "@/lib/oidc/cors-headers";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
	const baseUrl = new URL(request.url).origin;
	const document = getDiscoveryDocument(baseUrl);

	return jsonResponse({
		...document,
		_debug: {
			step: "discovery",
			validations: ["ディスカバリドキュメントを生成"],
			warnings: [],
		},
	});
}

export async function OPTIONS(): Promise<Response> {
	return new Response(null, { status: 204, headers: corsHeaders });
}
