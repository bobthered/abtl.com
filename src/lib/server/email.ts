import { contactDetails } from '#lib/data/contact.js';

export type DeliverySettings = { apiKey?: string; from?: string };
export const isDeliveryConfigured = (settings: DeliverySettings) =>
	Boolean(settings.apiKey?.trim() && settings.from?.trim());

/** Server-only plain-text sales delivery. Callers validate visitor input before invoking. */
export const sendSalesEmail = async (
	message: { replyTo: string; subject: string; text: string },
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
				reply_to: message.replyTo,
				subject: message.subject,
				text: message.text
			})
		});
		if (!response.ok) return false;
		const result = await response.json();
		return typeof result.id === 'string' && result.id.length > 0;
	} catch {
		return false;
	}
};
