import { describe, expect, it } from 'vitest';
import { canAccessMarket, type ShopMember } from './access';

const member: ShopMember = {
	companyId: 'company',
	companyName: 'Example',
	customerType: 'direct',
	markets: ['fire-suppression'],
	userId: 'buyer'
};
describe('market access', () => {
	it('denies anonymous customers and unrelated markets', () => {
		expect(canAccessMarket(undefined, 'fire-suppression')).toBe(false);
		expect(canAccessMarket(member, 'shellfish')).toBe(false);
	});
	it('requires a company and verified user identity', () => {
		expect(canAccessMarket({ ...member, companyId: '' }, 'fire-suppression')).toBe(false);
		expect(canAccessMarket({ ...member, userId: '' }, 'fire-suppression')).toBe(false);
	});
	it('supports multiple assigned markets independently of customer type', () => {
		expect(canAccessMarket(member, 'fire-suppression')).toBe(true);
		expect(
			canAccessMarket(
				{ ...member, customerType: 'distributor', markets: ['shellfish', 'fire-suppression'] },
				'shellfish'
			)
		).toBe(true);
	});
});
