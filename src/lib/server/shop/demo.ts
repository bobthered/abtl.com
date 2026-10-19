import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { ShopMember } from './access';

// Development-only shared credentials. Never use this account for real customer data.
export const demoCredentials = { email: 'beta@example.com', password: 'FireBeta2026!' };
export const demoCookieName = 'abtl-demo-session';
export const demoMember: ShopMember = {
	companyId: 'demo-fire-company',
	companyName: 'Fire Suppression Demo',
	customerType: 'direct',
	markets: ['fire-suppression', 'shellfish'],
	userId: 'demo-buyer'
};
export const demoSessionSeconds = 60 * 60 * 24 * 30;
// Tests can use the process-local fallback; runtime callers supply SHOP_SESSION_SECRET.
const secret = randomBytes(32);
const sign = (payload: string, signingKey: string | Buffer) =>
	createHmac('sha256', signingKey).update(payload).digest('hex');
export const createDemoSession = (now = Date.now(), signingKey: string | Buffer = secret) => {
	const payload = `${now + demoSessionSeconds * 1000}.${randomBytes(16).toString('hex')}`;
	return `${payload}.${sign(payload, signingKey)}`;
};
export const verifyDemoSession = (
	token: string | undefined,
	isEnabled: boolean,
	now = Date.now(),
	signingKey: string | Buffer = secret
) => {
	if (!isEnabled || !token || token.length > 160) return undefined;
	const parts = token.split('.');
	if (
		parts.length !== 3 ||
		!/^\d+$/.test(parts[0]) ||
		!/^[a-f0-9]{32}$/.test(parts[1]) ||
		!/^[a-f0-9]{64}$/.test(parts[2])
	)
		return undefined;
	const expiry = Number(parts[0]);
	if (expiry <= now || expiry > now + demoSessionSeconds * 1000) return undefined;
	const expected = Buffer.from(sign(`${parts[0]}.${parts[1]}`, signingKey), 'hex');
	if (!timingSafeEqual(expected, Buffer.from(parts[2], 'hex'))) return undefined;
	return { ...demoMember, markets: [...demoMember.markets] };
};
