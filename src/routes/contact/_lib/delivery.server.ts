import { contactDetails } from '#lib/data/contact.js';
import type { InquiryValues } from './inquiry';

type DeliverySettings = { apiKey?: string; from?: string };
export const isDeliveryConfigured = (settings: DeliverySettings) =>
	Boolean(settings.apiKey?.trim() && settings.from?.trim());

/** Server-only delivery. Plain text and validated reply-to keep submitted text out of HTML and headers. */
export const deliverInquiry = async (
	values: InquiryValues,
	settings: DeliverySettings,
	fetcher: typeof fetch = fetch
) => {
	if (!isDeliveryConfigured(settings)) return false;
	try {
		const response = await fetcher('https://api.resend.com/emails', {
			method: 'POST',
			headers: { Authorization: `Bearer ${settings.apiKey}`, 'Content-Type': 'application/json' },
			signal: AbortSignal.timeout(10000),
			body: JSON.stringify({
				from: settings.from,
				to: [contactDetails.email],
				reply_to: values.email,
				subject: 'Website inquiry',
				text: [
					`Name: ${values.name}`,
					`Email: ${values.email}`,
					`Company: ${values.company || 'Not supplied'}`,
					`Phone: ${values.phone || 'Not supplied'}`,
					`Reference: ${values.reference || 'Not supplied'}`,
					'',
					values.message
				].join('\n')
			})
		});
		if (!response.ok) return false;
		const result = await response.json();
		return typeof result.id === 'string' && result.id.length > 0;
	} catch {
		return false;
	}
};
