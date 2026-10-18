import { describe, expect, it, vi } from 'vitest';
import { deliverInquiry } from './delivery.server';
import { validateInquiry } from './inquiry';

const validForm = () => {
	const form = new FormData();
	for (const [key, value] of Object.entries({
		name: ' Pat Customer ',
		email: 'pat@example.test',
		company: 'Example Co.',
		phone: '',
		reference: '',
		message: 'Please help with outdoor tags.'
	}))
		form.set(key, value);
	return form;
};
describe('inquiry validation', () => {
	it('accepts a useful inquiry and trims input', () => {
		const result = validateInquiry(validForm());
		expect(result.isValid).toBe(true);
		expect(result.values.name).toBe('Pat Customer');
	});
	it('rejects missing and whitespace-only required values', () => {
		const form = validForm();
		form.set('name', '   ');
		form.set('email', 'bad email');
		form.set('message', '  ');
		const result = validateInquiry(form);
		expect(result.isValid).toBe(false);
		expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name']);
	});
	it('rejects oversized messages and bounds redisplayed text', () => {
		const form = validForm();
		form.set('message', 'x'.repeat(5001));
		const result = validateInquiry(form);
		expect(result.errors.message).toBeTruthy();
		expect(result.values.message).toHaveLength(5000);
	});
	it('rejects email header injection', () => {
		const form = validForm();
		form.set('email', 'pat@example.test\r\nBcc: other@example.test');
		expect(validateInquiry(form).isValid).toBe(false);
	});
});
describe('server-only inquiry delivery', () => {
	const settings = { apiKey: 'test-key', from: 'Website <website@example.test>' };
	it('addresses only sales and uses validated visitor email as reply-to', async () => {
		const values = validateInquiry(validForm()).values;
		const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: 'test-message' }));
		expect(await deliverInquiry(values, settings, fetcher)).toBe(true);
		const [url, init] = fetcher.mock.calls[0];
		expect(url).toBe('https://api.resend.com/emails');
		const payload = JSON.parse(String(init?.body));
		expect(payload.to).toEqual(['sales@abtl.com']);
		expect(payload.reply_to).toBe('pat@example.test');
		expect(payload.text).toContain('Name: Pat Customer\nEmail: pat@example.test');
		expect(payload).not.toHaveProperty('html');
	});
	it('does not attempt delivery without server configuration', async () => {
		const fetcher = vi.fn<typeof fetch>();
		expect(await deliverInquiry(validateInquiry(validForm()).values, {}, fetcher)).toBe(false);
		expect(fetcher).not.toHaveBeenCalled();
	});
	it('never treats provider rejection or a missing message id as success', async () => {
		const fetcher = vi
			.fn<typeof fetch>()
			.mockResolvedValueOnce(new Response('', { status: 429 }))
			.mockResolvedValueOnce(Response.json({}));
		const values = validateInquiry(validForm()).values;
		expect(await deliverInquiry(values, settings, fetcher)).toBe(false);
		expect(await deliverInquiry(values, settings, fetcher)).toBe(false);
	});
	it('handles network errors without exposing submitted data', async () => {
		const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error('provider unavailable'));
		expect(await deliverInquiry(validateInquiry(validForm()).values, settings, fetcher)).toBe(
			false
		);
	});
});
