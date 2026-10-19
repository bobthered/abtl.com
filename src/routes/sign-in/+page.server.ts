import { dev } from '$app/env';
import { CONTACT_FROM_EMAIL, RESEND_API_KEY, SHOP_SESSION_SECRET } from '$app/env/private';
import { demoCredentials } from '#lib/server/shop/demo.js';
import { isDeliveryConfigured } from '#lib/server/email.js';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store' });
	if (locals.shopMember) redirect(303, '/shop');
	return {
		isInvitationDeliveryConfigured: isDeliveryConfigured({
			apiKey: RESEND_API_KEY,
			from: CONTACT_FROM_EMAIL
		}),
		isDemoEnabled: dev && Boolean(SHOP_SESSION_SECRET),
		demoCredentials: dev ? demoCredentials : null
	};
};
