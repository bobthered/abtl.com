import { describe, expect, it } from 'vitest';
import { createDemoSession, demoSessionSeconds, verifyDemoSession } from './demo';

describe('temporary demo sessions', () => {
	it('allows only signed unexpired development sessions', () => {
		const token = createDemoSession(1000);
		expect(verifyDemoSession(token, true, 1001)?.markets).toEqual([
			'fire-suppression',
			'shellfish'
		]);
		expect(verifyDemoSession(token, false, 1001)).toBeUndefined();
		expect(verifyDemoSession(token, true, 1000 + demoSessionSeconds * 1000)).toBeUndefined();
	});
	it('rejects missing, forged, malformed, and tampered tokens', () => {
		const token = createDemoSession(1000);
		for (const value of [
			undefined,
			'true',
			'demo-buyer',
			token + 'x',
			'9'.repeat(1000),
			token.replace(token.split('.')[0], String(1000 + demoSessionSeconds * 1000 + 1))
		]) {
			expect(verifyDemoSession(value, true, 1001)).toBeUndefined();
		}
	});
	it('uses a stable external signing key across requests and rejects a different key', () => {
		const key = 'a'.repeat(64);
		const token = createDemoSession(1000, key);
		expect(verifyDemoSession(token, true, 2000, key)?.userId).toBe('demo-buyer');
		expect(verifyDemoSession(token, true, 2000, 'b'.repeat(64))).toBeUndefined();
		expect(demoSessionSeconds).toBe(30 * 24 * 60 * 60);
	});
});
