import { CONTACT_FROM_EMAIL, RESEND_API_KEY } from '$app/env/private';
import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { deliverInvitationRequest } from './_lib/invitations.server';
import { validateInvitationRequest, type InvitationRequest } from './_lib/invitations';

export const requestInvitation = form('unchecked', async (values: InvitationRequest) => {
	const request = validateInvitationRequest(values);
	if (!request) invalid('Please enter your name, company, a valid work email, and a market.');
	const isSent = await deliverInvitationRequest(request, {
		apiKey: RESEND_API_KEY,
		from: CONTACT_FROM_EMAIL
	});
	if (!isSent)
		invalid(
			'We could not send your request. Please email sales@abtl.com to request a beta invitation.'
		);
	return { isSent: true };
});
