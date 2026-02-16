import type { AuthorizationCode } from "./types";

const CODE_EXPIRY_SECONDS = 60;

const store = new Map<string, AuthorizationCode>();

export function storeAuthorizationCode(
	params: Omit<AuthorizationCode, "code" | "expiresAt">,
): AuthorizationCode {
	const code: AuthorizationCode = {
		...params,
		code: crypto.randomUUID(),
		expiresAt: Date.now() + CODE_EXPIRY_SECONDS * 1000,
	};

	store.set(code.code, code);
	return code;
}

export function consumeAuthorizationCode(
	code: string,
): AuthorizationCode | undefined {
	const stored = store.get(code);
	if (!stored) {
		return undefined;
	}

	store.delete(code);

	if (Date.now() > stored.expiresAt) {
		return undefined;
	}

	return stored;
}

export function cleanupExpiredCodes(): number {
	const now = Date.now();
	let removed = 0;

	for (const [code, stored] of store) {
		if (now > stored.expiresAt) {
			store.delete(code);
			removed++;
		}
	}

	return removed;
}
