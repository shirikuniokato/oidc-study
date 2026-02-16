interface RefreshTokenSession {
	readonly sub: string;
	readonly clientId: string;
	readonly scope: string;
}

const store = new Map<string, RefreshTokenSession>();

export function storeRefreshTokenSession(
	refreshToken: string,
	session: RefreshTokenSession,
): void {
	store.set(refreshToken, session);
}

export function getRefreshTokenSession(
	refreshToken: string,
): RefreshTokenSession | undefined {
	return store.get(refreshToken);
}

export function revokeRefreshToken(refreshToken: string): boolean {
	return store.delete(refreshToken);
}

export function revokeByClientId(clientId: string): number {
	let revoked = 0;

	for (const [token, session] of store) {
		if (session.clientId === clientId) {
			store.delete(token);
			revoked++;
		}
	}

	return revoked;
}
