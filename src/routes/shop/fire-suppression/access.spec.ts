import { describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';
import type { ShopMember } from '#lib/server/shop/access.js';

const member: ShopMember = {
	companyId: 'company',
	companyName: 'Example',
	customerType: 'direct',
	markets: ['fire-suppression'],
	userId: 'buyer'
};
const event = (shopMember?: ShopMember) =>
	({
		locals: { shopMember },
		setHeaders: vi.fn(),
		url: new URL('http://localhost/shop/fire-suppression')
	}) as unknown as Parameters<typeof load>[0];

describe('fire suppression shop boundary', () => {
	it('redirects anonymous visitors before returning catalog data', async () => {
		await expect(async () => load(event())).rejects.toMatchObject({
			status: 303,
			location: '/account/sign-in'
		});
	});
	it('forbids an authenticated buyer from another market', async () => {
		await expect(async () =>
			load(event({ ...member, markets: ['shellfish'] }))
		).rejects.toMatchObject({ status: 403 });
	});
	it('returns only display context to an authorized buyer and prevents caching', async () => {
		const request = event(member);
		expect(await load(request)).toMatchObject({
			companyName: 'Example',
			orders: [],
			isDemo: false,
			query: ''
		});
		expect(request.setHeaders).toHaveBeenCalledWith({ 'cache-control': 'private, no-store' });
	});
});
