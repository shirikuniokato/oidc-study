// 教育用途のため全オリジンからのアクセスを許可するCORSヘッダー
export const corsHeaders: Record<string, string> = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function jsonResponse(
	body: unknown,
	status = 200,
	extraHeaders?: Record<string, string>,
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			...corsHeaders,
			...extraHeaders,
		},
	});
}

export function oauthErrorResponse(
	error: string,
	errorDescription: string,
	status = 400,
): Response {
	return jsonResponse({ error, error_description: errorDescription }, status);
}
