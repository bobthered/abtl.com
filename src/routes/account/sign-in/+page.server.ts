import { dev } from '$app/env';
import {
	createDemoSession,
	demoCookieName,
	demoCredentials,
	demoSessionSeconds
} from '#lib/server/shop/demo.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store' });
	if (locals.shopMember) redirect(303, '/shop/fire-suppression');
	return { isDemoEnabled: dev, demoCredentials: dev ? demoCredentials : null };
};
export const actions: Actions = {
	default: async ({ cookies, request }) => {
		if (!dev) return fail(503, { message: 'Customer sign-in is not available yet.' });
		if (Number(request.headers.get('content-length')) > 4096)
			return fail(413, { message: 'Please check your sign-in details.' });
		const values = await request.formData();
		const email = values.get('email');
		const password = values.get('password');
		if (
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			email.trim().toLowerCase() !== demoCredentials.email ||
			password !== demoCredentials.password
		)
			return fail(400, { message: 'The email or password is incorrect.' });
		cookies.set(demoCookieName, createDemoSession(), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: demoSessionSeconds
		});
		redirect(303, '/shop/fire-suppression');
	}
};
