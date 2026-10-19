import { demoCookieName } from '#lib/server/shop/demo.js';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies }) => {
	cookies.delete(demoCookieName, { path: '/' });
	redirect(303, '/sign-in');
};
