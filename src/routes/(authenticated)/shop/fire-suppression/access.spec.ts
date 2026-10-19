import { expect, it } from 'vitest';
import { load } from './+page.server';

it('redirects the legacy fire suppression shop URL while retaining search filters', async () => {
	const event = {
		url: new URL('http://localhost/shop/fire-suppression?q=DEMO&page=2')
	} as Parameters<typeof load>[0];
	await expect(async () => load(event)).rejects.toMatchObject({
		status: 303,
		location: '/shop?q=DEMO&page=2'
	});
});
