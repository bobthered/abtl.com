import { dev } from '$app/env';
import { demoCookieName, verifyDemoSession } from '#lib/server/shop/demo.js';
import type { Handle } from '@sveltejs/kit/hooks';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.shopMember = verifyDemoSession(event.cookies.get(demoCookieName), dev);
	const response = await resolve(event);
	if (event.locals.shopMember) response.headers.set('cache-control', 'private, no-store');
	return response;
};
