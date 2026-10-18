import { expect, it } from 'vitest';
import { demoMember } from './demo';
import { searchFireOrders } from './orderSearch';

it('searches PO, SKU, description, order number, and artwork across company order lines', () => {
	for (const q of [
		'PO-DEMO-2409',
		'FS-DEMO-001',
		'main service team',
		'DEMO-1042',
		'DEMO-ART-101'
	]) {
		expect(
			searchFireOrders(demoMember, new URLSearchParams({ q })).orders.map((order) => order.id)
		).toEqual(['demo-inspection']);
	}
	expect(
		searchFireOrders({ ...demoMember, companyId: 'other' }, new URLSearchParams())
	).toMatchObject({ orders: [], pagination: { total: 0 } });
});
it('combines inclusive dates, product type, and keywords', () => {
	expect(
		searchFireOrders(
			demoMember,
			new URLSearchParams({
				q: 'inspection',
				type: 'tag-inspection',
				from: '2026-09-12',
				to: '2026-09-12'
			})
		).orders.map((order) => order.id)
	).toEqual(['demo-inspection']);
	expect(
		searchFireOrders(demoMember, new URLSearchParams({ type: 'collars', to: '2026-06-01' }))
			.pagination.total
	).toBe(1);
	expect(
		searchFireOrders(demoMember, new URLSearchParams({ from: '2026-02-30' })).filterError
	).toBeTruthy();
	expect(
		searchFireOrders(demoMember, new URLSearchParams({ from: '2026-10-01', to: '2026-01-01' }))
			.filterError
	).toBeTruthy();
});
it('paginates deterministically, clamps invalid pages, and retains filters in links', () => {
	const first = searchFireOrders(demoMember, new URLSearchParams({ q: 'DEMO', sort: 'oldest' }));
	expect(first.orders).toHaveLength(10);
	expect(first.nextHref).toContain('q=DEMO');
	expect(first.nextHref).toContain('sort=oldest');
	const last = searchFireOrders(demoMember, new URLSearchParams({ q: 'DEMO', page: '999' }));
	expect(last.pagination).toMatchObject({ page: 2, pageCount: 2, total: 18 });
	expect(last.orders).toHaveLength(8);
	expect(last.nextHref).toBeNull();
	expect(
		searchFireOrders(demoMember, new URLSearchParams({ page: '-3', sort: 'invalid' })).pagination
			.page
	).toBe(1);
});
