import { labels, tags } from '../../../routes/markets/fire-suppression/_components/products';
import { canAccessMarket, type ShopMember } from './access';

export const fireProducts = [
	...tags.map((product) => ({ ...product, id: `tag-${product.id}`, format: 'tag' as const })),
	...labels.map((product) => ({ ...product, id: `label-${product.id}`, format: 'label' as const })),
	{
		id: 'collars',
		name: 'Extinguisher collars',
		headline: 'Plan your collar order.',
		description: 'Choose the collar sizes and company information for your service program.',
		fields: [],
		format: 'collar' as const
	}
];

// Synthetic review fixtures only. Real history must be fetched by verified company AND market.
const demoOrders = [
	{
		id: 'demo-inspection',
		orderNumber: 'DEMO-1042',
		date: '2026-09-12',
		productId: 'tag-inspection',
		reference: 'Annual inspection tag',
		artwork: 'DEMO-ART-101',
		quantity: 1000
	},
	{
		id: 'demo-service',
		orderNumber: 'DEMO-1031',
		date: '2026-08-20',
		productId: 'label-call-service',
		reference: 'Service contact label',
		artwork: 'DEMO-ART-102',
		quantity: 500
	},
	{
		id: 'demo-collar',
		orderNumber: 'DEMO-1018',
		date: '2026-07-08',
		productId: 'collars',
		reference: 'Small / Green collar',
		artwork: 'DEMO-ART-103',
		quantity: 250
	}
];

export const getFireOrders = (member: ShopMember) =>
	member.companyId === 'demo-fire-company' && canAccessMarket(member, 'fire-suppression')
		? demoOrders.map((order) => ({
				...order,
				product: fireProducts.find((product) => product.id === order.productId)!
			}))
		: [];

export const parseDraftQuantity = (value: FormDataEntryValue | null) =>
	typeof value === 'string' && /^[1-9]\d{0,6}$/.test(value) ? Number(value) : null;
