import { describe, expect, it, vi } from 'vitest';
import { actions, load } from './+page.server';
import { demoMember } from '#lib/server/shop/demo.js';
import type { ShopMember } from '#lib/server/shop/access.js';

const event = (values: Record<string, string>, member: ShopMember = demoMember) => {
	const body = new FormData();
	for (const [key, value] of Object.entries(values)) body.set(key, value);
	return {
		locals: { shopMember: member },
		request: new Request('http://localhost/shop', { method: 'POST', body }),
		url: new URL('http://localhost/shop?q=DEMO-ART-102'),
		setHeaders: vi.fn()
	} as unknown as Parameters<NonNullable<typeof actions.reorder>>[0];
};
describe('company-scoped reorder review', () => {
	it('searches only the current company history by artwork', async () => {
		const result = await load(event({}) as unknown as Parameters<typeof load>[0]);
		expect(result?.orders.map((order: { artwork: string }) => order.artwork)).toEqual([
			'DEMO-ART-102'
		]);
	});
	it('rejects another company order even if its id is known', async () => {
		const result = await actions.reorder!(
			event(
				{ orderId: 'demo-inspection', quantity: '500' },
				{ ...demoMember, companyId: 'another-company' }
			)
		);
		expect(result).toMatchObject({ status: 404 });
	});
	it('prepares a reorder from trusted order data and validates quantity', async () => {
		expect(
			await actions.reorder!(
				event({ orderId: 'demo-inspection', quantity: '500', product: 'forged' })
			)
		).toMatchObject({ draft: { product: 'Inspection tags', quantity: 500 } });
		expect(
			await actions.reorder!(event({ orderId: 'demo-inspection', quantity: '1.5' }))
		).toMatchObject({ status: 400 });
	});
});
