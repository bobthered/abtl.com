import { dev } from '$app/env';
import { SHOP_SESSION_SECRET } from '$app/env/private';
import { demoCredentials } from '#lib/server/shop/demo.js';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store' });
	if (locals.shopMember) redirect(303, '/shop');
	return {
		isDemoEnabled: dev && Boolean(SHOP_SESSION_SECRET),
		demoCredentials: dev ? demoCredentials : null
	};
};
