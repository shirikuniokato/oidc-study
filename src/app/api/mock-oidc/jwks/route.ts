import { corsHeaders, jsonResponse } from "@/lib/oidc/cors-headers";
import { getJwks } from "@/lib/oidc/keys";

export async function GET(): Promise<Response> {
	const jwks = await getJwks();

	return jsonResponse({
		...jwks,
		_debug: {
			step: "jwks",
			validations: ["公開鍵セットを返却"],
			warnings: [],
		},
	});
}

export async function OPTIONS(): Promise<Response> {
	return new Response(null, { status: 204, headers: corsHeaders });
}
