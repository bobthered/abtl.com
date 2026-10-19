import { expect, it, vi } from 'vitest';
import { deliverInvitationRequest } from './invitations.server';
import { validateInvitationRequest } from './invitations';

const values = {
	name: ' Pat Buyer ',
	company: ' Example Company ',
	email: ' pat@example.test ',
	market: 'fire-suppression',
	website: ''
};
it('validates and normalizes invitation requests without granting access', () => {
	expect(validateInvitationRequest(values)).toEqual({
		name: 'Pat Buyer',
		company: 'Example Company',
		email: 'pat@example.test',
		market: 'Fire Suppression'
	});
});
it('rejects invalid email, oversized data, unknown markets, and honeypot input', () => {
	for (const invalid of [
		{ email: 'pat@example.test\r\nBcc: other@example.test' },
		{ name: ' ' },
		{ company: 'x'.repeat(161) },
		{ market: 'unknown' },
		{ website: 'spam' }
	])
		expect(validateInvitationRequest({ ...values, ...invalid })).toBeNull();
});
it('sends a plain-text review request only to sales', async () => {
	const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: 'test-message' }));
	expect(
		await deliverInvitationRequest(
			validateInvitationRequest(values)!,
			{ apiKey: 'test-key', from: 'test@example.test' },
			fetcher
		)
	).toBe(true);
	const payload = JSON.parse(String(fetcher.mock.calls[0][1]?.body));
	expect(payload).toMatchObject({
		to: ['sales@abtl.com'],
		reply_to: 'pat@example.test',
		subject: 'Shop beta invitation request'
	});
	expect(payload.text).toContain('Market: Fire Suppression');
	expect(payload).not.toHaveProperty('html');
});
it('does not send without configuration or report rejected delivery as success', async () => {
	const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('', { status: 429 }));
	expect(await deliverInvitationRequest(validateInvitationRequest(values)!, {}, fetcher)).toBe(
		false
	);
	expect(fetcher).not.toHaveBeenCalled();
	expect(
		await deliverInvitationRequest(
			validateInvitationRequest(values)!,
			{ apiKey: 'test-key', from: 'test@example.test' },
			fetcher
		)
	).toBe(false);
});
