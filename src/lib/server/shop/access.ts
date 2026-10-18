export type ShopMember = {
	companyId: string;
	companyName: string;
	customerType: 'direct' | 'distributor';
	markets: string[];
	userId: string;
};

/** Only a verified server-side identity provider may populate this value. */
export const canAccessMarket = (member: ShopMember | undefined, market: string) =>
	Boolean(member?.userId && member.companyId && member.markets.includes(market));
