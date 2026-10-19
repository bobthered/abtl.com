import { sendSalesEmail, type DeliverySettings } from '#lib/server/email.js';
import type { validateInvitationRequest } from './invitations';

export const deliverInvitationRequest = (
	request: NonNullable<ReturnType<typeof validateInvitationRequest>>,
	settings: DeliverySettings,
	fetcher: typeof fetch = fetch
) =>
	sendSalesEmail(
		{
			replyTo: request.email,
			subject: 'Shop beta invitation request',
			text: [
				'Beta invitation request - review required; no account access has been granted.',
				`Name: ${request.name}`,
				`Company: ${request.company}`,
				`Email: ${request.email}`,
				`Market: ${request.market}`
			].join('\n')
		},
		settings,
		fetcher
	);
