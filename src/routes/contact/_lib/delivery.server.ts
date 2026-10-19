import { sendSalesEmail, type DeliverySettings } from '#lib/server/email.js';
import type { InquiryValues } from './inquiry';

export { isDeliveryConfigured } from '#lib/server/email.js';

export const deliverInquiry = (
	values: InquiryValues,
	settings: DeliverySettings,
	fetcher: typeof fetch = fetch
) =>
	sendSalesEmail(
		{
			replyTo: values.email,
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
		},
		settings,
		fetcher
	);
