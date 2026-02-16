import type { OidcClient, TestUser } from "./types";

export const ISSUER_PATH = "/api/mock-oidc";

export const TEST_CLIENT: OidcClient = {
	clientId: "demo-client",
	clientSecret: "demo-secret",
	redirectUris: ["/simulator/callback"],
	name: "Demo Application",
};

export const TEST_USERS: readonly TestUser[] = [
	{
		sub: "alice",
		name: "Alice Tanaka",
		email: "alice@example.com",
		emailVerified: true,
		picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
	},
	{
		sub: "bob",
		name: "Bob Suzuki",
		email: "bob@example.com",
		emailVerified: true,
		picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
	},
];

export function findUserBySub(sub: string): TestUser | undefined {
	return TEST_USERS.find((user) => user.sub === sub);
}

export function findClient(clientId: string): OidcClient | undefined {
	if (clientId === TEST_CLIENT.clientId) {
		return TEST_CLIENT;
	}
	return undefined;
}

interface DiscoveryDocument {
	readonly issuer: string;
	readonly authorization_endpoint: string;
	readonly token_endpoint: string;
	readonly userinfo_endpoint: string;
	readonly jwks_uri: string;
	readonly device_authorization_endpoint: string;
	readonly scopes_supported: readonly string[];
	readonly response_types_supported: readonly string[];
	readonly grant_types_supported: readonly string[];
	readonly subject_types_supported: readonly string[];
	readonly id_token_signing_alg_values_supported: readonly string[];
	readonly token_endpoint_auth_methods_supported: readonly string[];
	readonly code_challenge_methods_supported: readonly string[];
}

export function getDiscoveryDocument(baseUrl: string): DiscoveryDocument {
	const issuer = `${baseUrl}${ISSUER_PATH}`;

	return {
		issuer,
		authorization_endpoint: `${issuer}/authorize`,
		token_endpoint: `${issuer}/token`,
		userinfo_endpoint: `${issuer}/userinfo`,
		jwks_uri: `${issuer}/jwks`,
		device_authorization_endpoint: `${issuer}/device/authorize`,
		scopes_supported: ["openid", "profile", "email"],
		response_types_supported: ["code"],
		grant_types_supported: [
			"authorization_code",
			"refresh_token",
			"urn:ietf:params:oauth:grant-type:device_code",
		],
		subject_types_supported: ["public"],
		id_token_signing_alg_values_supported: ["RS256"],
		token_endpoint_auth_methods_supported: ["client_secret_post"],
		code_challenge_methods_supported: ["S256"],
	};
}
