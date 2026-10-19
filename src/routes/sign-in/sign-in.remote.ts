import { dev } from '$app/env';
import { SHOP_SESSION_SECRET } from '$app/env/private';
import {
	createDemoSession,
	demoCookieName,
	demoCredentials,
	demoSessionSeconds
} from '#lib/server/shop/demo.js';
import { form, getRequestEvent } from '$app/server';
import { invalid, redirect } from '@sveltejs/kit';

export const signIn = form('unchecked', async (values: { email?: string; _password?: string }) => {
	if (!dev || !SHOP_SESSION_SECRET) invalid('Customer sign-in is not available yet.');
	const { cookies } = getRequestEvent();
	if (
		typeof values.email !== 'string' ||
		values.email.length > 254 ||
		typeof values._password !== 'string' ||
		values._password.length > 128 ||
		values.email.trim().toLowerCase() !== demoCredentials.email ||
		values._password !== demoCredentials.password
	)
		invalid('The email or password is incorrect.');
	cookies.set(demoCookieName, createDemoSession(Date.now(), SHOP_SESSION_SECRET), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: demoSessionSeconds
	});
	redirect(303, '/shop');
});
