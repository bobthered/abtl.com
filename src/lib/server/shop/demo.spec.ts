import { describe, expect, it } from 'vitest';
import { createDemoSession, demoSessionSeconds, verifyDemoSession } from './demo';

describe('temporary demo sessions', () => {
	it('allows only signed unexpired development sessions', () => {
		const token = createDemoSession(1000);
		expect(verifyDemoSession(token, true, 1001)?.markets).toEqual(['fire-suppression']);
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
			token.replace('3601000', '3602000')
		]) {
			expect(verifyDemoSession(value, true, 1001)).toBeUndefined();
		}
	});
});
