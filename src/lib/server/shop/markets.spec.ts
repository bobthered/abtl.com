import { expect, it } from 'vitest';
import { getAssignedMarkets } from './markets';
import type { ShopMember } from './access';

const member: ShopMember = {
	companyId: 'company',
	companyName: 'Example',
	customerType: 'distributor',
	userId: 'buyer',
	markets: ['shellfish', 'fire-suppression', 'fire-suppression', 'unknown']
};
it('returns only recognized assigned markets without duplicates and links only published catalogs', () => {
	const markets = getAssignedMarkets(member);
	expect(markets.map((market) => market.id)).toEqual(['fire-suppression', 'shellfish']);
	expect(markets[0].href).toBe('/shop/fire-suppression');
	expect(markets[1].href).toBeNull();
	expect(getAssignedMarkets({ ...member, markets: [] })).toEqual([]);
	expect(getAssignedMarkets({ ...member, companyId: '' })).toEqual([]);
});
