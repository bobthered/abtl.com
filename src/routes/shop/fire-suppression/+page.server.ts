import { canAccessMarket } from '#lib/server/shop/access.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store' });
	if (!locals.shopMember) redirect(303, '/account/sign-in');
	if (!canAccessMarket(locals.shopMember, 'fire-suppression'))
		error(403, 'Your company does not have access to this market.');
	return { companyName: locals.shopMember.companyName };
};
