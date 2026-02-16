export interface OidcClient {
	readonly clientId: string;
	readonly clientSecret: string;
	readonly redirectUris: readonly string[];
	readonly name: string;
}

export interface TestUser {
	readonly sub: string;
	readonly name: string;
	readonly email: string;
	readonly emailVerified: boolean;
	readonly picture: string;
}

export interface AuthorizationRequest {
	readonly clientId: string;
	readonly redirectUri: string;
	readonly responseType: string;
	readonly scope: string;
	readonly state?: string;
	readonly nonce?: string;
	readonly codeChallenge?: string;
	readonly codeChallengeMethod?: string;
}

export interface AuthorizationCode {
	readonly code: string;
	readonly clientId: string;
	readonly redirectUri: string;
	readonly scope: string;
	readonly sub: string;
	readonly nonce?: string;
	readonly codeChallenge?: string;
	readonly codeChallengeMethod?: string;
	readonly expiresAt: number;
}

export interface DeviceCode {
	readonly deviceCode: string;
	readonly userCode: string;
	readonly clientId: string;
	readonly scope: string;
	readonly expiresAt: number;
	readonly interval: number;
	readonly status: "pending" | "approved" | "denied";
	readonly sub?: string;
}

export interface TokenResponse {
	readonly access_token: string;
	readonly token_type: "Bearer";
	readonly expires_in: number;
	readonly id_token?: string;
	readonly refresh_token?: string;
	readonly scope: string;
}

export interface DebugInfo {
	readonly step: string;
	readonly validations: readonly string[];
	readonly warnings: readonly string[];
}
