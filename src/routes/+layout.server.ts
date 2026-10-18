import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => ({
	isShopSignedIn: Boolean(locals.shopMember)
});
