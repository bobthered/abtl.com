import { canAccessMarket, type ShopMember } from './access';

// Only published shop routes get links; assigned future markets remain visible as coming soon.
const markets = [
	{
		id: 'beverage',
		name: 'Beverage',
		description: 'Labels and tags for your beverage products.',
		href: null
	},
	{
		id: 'fire-suppression',
		name: 'Fire Suppression',
		description: 'Inspection tags, service labels, and extinguisher collars.',
		href: '/shop/fire-suppression'
	},
	{
		id: 'hospitality',
		name: 'Hospitality',
		description: 'Claim tags and printed details for guest services.',
		href: null
	},
	{
		id: 'merchandise-tags',
		name: 'Merchandise Tags',
		description: 'Marking and jewelry tags for your merchandise.',
		href: null
	},
	{
		id: 'shellfish',
		name: 'Shellfish',
		description: 'Standard, pinfed, and laser-compatible shellfish tags.',
		href: null
	},
	{
		id: 'tree-tags',
		name: 'Tree Tags',
		description: 'Standard and custom-shaped tags for trees.',
		href: null
	}
];

export const getAssignedMarkets = (member: ShopMember) =>
	markets.filter((market) => canAccessMarket(member, market.id));
