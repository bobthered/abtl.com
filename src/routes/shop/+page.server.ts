import { getAssignedMarkets } from '#lib/server/shop/markets.js';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store' });
	if (!locals.shopMember) redirect(303, '/account/sign-in');
	return {
		companyName: locals.shopMember.companyName,
		markets: getAssignedMarkets(locals.shopMember)
	};
};
