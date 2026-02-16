import { SignJWT } from "jose";
import { ISSUER_PATH, findUserBySub } from "./config";
import { getKeyPair } from "./keys";

const ACCESS_TOKEN_EXPIRY = 3600;
const ID_TOKEN_EXPIRY = 3600;
const REFRESH_TOKEN_EXPIRY = 86400;

export async function issueAccessToken(
	sub: string,
	scope: string,
	clientId: string,
): Promise<string> {
	const { privateKey, kid } = await getKeyPair();

	return new SignJWT({ scope, client_id: clientId })
		.setProtectedHeader({ alg: "RS256", kid, typ: "at+jwt" })
		.setIssuer(ISSUER_PATH)
		.setSubject(sub)
		.setAudience(clientId)
		.setIssuedAt()
		.setExpirationTime(`${ACCESS_TOKEN_EXPIRY}s`)
		.setJti(crypto.randomUUID())
		.sign(privateKey);
}

export async function issueIdToken(
	sub: string,
	clientId: string,
	nonce?: string,
	scope?: string,
): Promise<string> {
	const { privateKey, kid } = await getKeyPair();
	const user = findUserBySub(sub);

	const claims: Record<string, unknown> = {};

	if (user && scope) {
		const scopes = scope.split(" ");
		if (scopes.includes("profile")) {
			claims.name = user.name;
			claims.picture = user.picture;
		}
		if (scopes.includes("email")) {
			claims.email = user.email;
			claims.email_verified = user.emailVerified;
		}
	}

	if (nonce) {
		claims.nonce = nonce;
	}

	return new SignJWT(claims)
		.setProtectedHeader({ alg: "RS256", kid, typ: "JWT" })
		.setIssuer(ISSUER_PATH)
		.setSubject(sub)
		.setAudience(clientId)
		.setIssuedAt()
		.setExpirationTime(`${ID_TOKEN_EXPIRY}s`)
		.sign(privateKey);
}

export async function issueRefreshToken(
	sub: string,
	clientId: string,
	scope: string,
): Promise<string> {
	const { privateKey, kid } = await getKeyPair();

	return new SignJWT({ scope, client_id: clientId })
		.setProtectedHeader({ alg: "RS256", kid, typ: "rt+jwt" })
		.setIssuer(ISSUER_PATH)
		.setSubject(sub)
		.setIssuedAt()
		.setExpirationTime(`${REFRESH_TOKEN_EXPIRY}s`)
		.setJti(crypto.randomUUID())
		.sign(privateKey);
}
