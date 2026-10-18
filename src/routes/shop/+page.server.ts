import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	redirect(303, locals.shopMember ? '/shop/fire-suppression' : '/account/sign-in');
};
