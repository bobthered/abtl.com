import { dev } from '$app/env';
import { SHOP_SESSION_SECRET } from '$app/env/private';
import { demoCookieName, verifyDemoSession } from '#lib/server/shop/demo.js';
import type { Handle } from '@sveltejs/kit/hooks';
import { isAuthenticatedRoute } from '#lib/server/shop/routeAccess.js';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.shopMember = SHOP_SESSION_SECRET
		? verifyDemoSession(event.cookies.get(demoCookieName), dev, Date.now(), SHOP_SESSION_SECRET)
		: undefined;
	if (isAuthenticatedRoute(event.route.id) && !event.locals.shopMember) {
		event.cookies.delete(demoCookieName, { path: '/' });
		redirect(303, '/sign-in');
	}
	const response = await resolve(event);
	if (event.locals.shopMember || isAuthenticatedRoute(event.route.id))
		response.headers.set('cache-control', 'private, no-store');
	return response;
};
