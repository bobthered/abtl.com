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
		poNumber: 'PO-DEMO-2409',
		sku: 'FS-DEMO-001',
		description: 'Annual inspection tag - main service team',
		date: '2026-09-12',
		productId: 'tag-inspection',
		reference: 'Annual inspection tag',
		artwork: 'DEMO-ART-101',
		quantity: 1000
	},
	{
		id: 'demo-service',
		orderNumber: 'DEMO-1031',
		poNumber: 'PO-DEMO-2408',
		sku: 'FS-DEMO-002',
		description: 'Service contact label - equipment cabinets',
		date: '2026-08-20',
		productId: 'label-call-service',
		reference: 'Service contact label',
		artwork: 'DEMO-ART-102',
		quantity: 500
	},
	{
		id: 'demo-collar',
		orderNumber: 'DEMO-1018',
		poNumber: 'PO-DEMO-2407',
		sku: 'FS-DEMO-003',
		description: 'Small green collar - service department',
		date: '2026-07-08',
		productId: 'collars',
		reference: 'Small / Green collar',
		artwork: 'DEMO-ART-103',
		quantity: 250
	},
	...Array.from({ length: 15 }, (_, index) => {
		const product = fireProducts[index % fireProducts.length];
		return {
			id: `demo-line-${index + 4}`,
			orderNumber: `DEMO-${1000 - Math.floor(index / 3)}`,
			poNumber: `PO-DEMO-${2406 - Math.floor(index / 3)}`,
			sku: `FS-DEMO-${String(index + 4).padStart(3, '0')}`,
			description: `${product.name} - sample layout ${index + 1}`,
			date: `2026-${String(6 - Math.floor(index / 3)).padStart(2, '0')}-${String(20 - (index % 3)).padStart(2, '0')}`,
			productId: product.id,
			reference: `Demo service program ${index + 1}`,
			artwork: `DEMO-ART-${104 + index}`,
			quantity: 500
		};
	})
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
