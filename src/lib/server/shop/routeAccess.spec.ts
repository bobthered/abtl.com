import { expect, it } from 'vitest';
import { isAuthenticatedRoute } from './routeAccess';

it('protects exact authenticated group segments including nested routes and endpoints', () => {
	for (const route of [
		'/(authenticated)/shop',
		'/(authenticated)/shop/fire-suppression',
		'/(other)/(authenticated)/orders/[id]'
	])
		expect(isAuthenticatedRoute(route)).toBe(true);
	for (const route of [
		null,
		'/sign-in',
		'/account/sign-out',
		'/markets/fire-suppression',
		'/(unauthenticated)/page',
		'/authenticated/page'
	])
		expect(isAuthenticatedRoute(route)).toBe(false);
});
