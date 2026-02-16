import type { DeviceCode } from "./types";

const store = new Map<string, DeviceCode>();
const userCodeIndex = new Map<string, string>();

const USER_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const USER_CODE_LENGTH = 8;

export function generateUserCode(): string {
	const values = new Uint8Array(USER_CODE_LENGTH);
	crypto.getRandomValues(values);

	let code = "";
	for (const value of values) {
		code += USER_CODE_CHARS[value % USER_CODE_CHARS.length];
	}
	return code;
}

export function storeDeviceCode(deviceCode: DeviceCode): void {
	store.set(deviceCode.deviceCode, deviceCode);
	userCodeIndex.set(deviceCode.userCode, deviceCode.deviceCode);
}

export function getByDeviceCode(deviceCode: string): DeviceCode | undefined {
	const stored = store.get(deviceCode);
	if (!stored) {
		return undefined;
	}

	if (Date.now() > stored.expiresAt) {
		store.delete(deviceCode);
		userCodeIndex.delete(stored.userCode);
		return undefined;
	}

	return stored;
}

export function getByUserCode(userCode: string): DeviceCode | undefined {
	const deviceCode = userCodeIndex.get(userCode);
	if (!deviceCode) {
		return undefined;
	}
	return getByDeviceCode(deviceCode);
}

export function approveDeviceCode(
	userCode: string,
	sub: string,
): DeviceCode | undefined {
	const current = getByUserCode(userCode);
	if (!current || current.status !== "pending") {
		return undefined;
	}

	const updated: DeviceCode = { ...current, status: "approved", sub };
	store.set(current.deviceCode, updated);
	return updated;
}

export function denyDeviceCode(userCode: string): DeviceCode | undefined {
	const current = getByUserCode(userCode);
	if (!current || current.status !== "pending") {
		return undefined;
	}

	const updated: DeviceCode = { ...current, status: "denied" };
	store.set(current.deviceCode, updated);
	return updated;
}
