import { exportJWK, generateKeyPair } from "jose";
import type { JWK } from "jose";

interface KeyPairWithKid {
	readonly publicKey: CryptoKey;
	readonly privateKey: CryptoKey;
	readonly kid: string;
}

let cachedKeyPair: KeyPairWithKid | null = null;

export async function getKeyPair(): Promise<KeyPairWithKid> {
	if (cachedKeyPair) {
		return cachedKeyPair;
	}

	const { publicKey, privateKey } = await generateKeyPair("RS256");
	const kid = crypto.randomUUID();

	cachedKeyPair = { publicKey, privateKey, kid };
	return cachedKeyPair;
}

interface JwkSet {
	readonly keys: readonly JWK[];
}

export async function getJwks(): Promise<JwkSet> {
	const { publicKey, kid } = await getKeyPair();
	const jwk = await exportJWK(publicKey);

	return {
		keys: [
			{
				...jwk,
				kid,
				alg: "RS256",
				use: "sig",
			},
		],
	};
}
