export type NavigationLink = { href: string; label: string; description: string };
export type NavigationSection = NavigationLink & { children: NavigationLink[] };

export const navigation: NavigationSection[] = [
	{
		href: '/products',
		label: 'Products',
		description: 'Start with the product. Build in the details.',
		children: [
			{
				href: '/products/tags',
				label: 'Tags',
				description: 'Paper and synthetic tags, stock colors, and attachments.'
			},
			{
				href: '/products/labels',
				label: 'Labels',
				description: 'Printed identification for your products and workflow.'
			},
			{
				href: '/products/attachments',
				label: 'Tag attachments',
				description: 'Wire, string, and elastic options.'
			}
		]
	},
	{
		href: '/markets',
		label: 'Markets',
		description: 'Start with the way you will use it.',
		children: [
			{
				href: '/markets/equipment-service',
				label: 'Equipment & service',
				description: 'Keep identification and inspection records with equipment.'
			},
			{
				href: '/markets/retail',
				label: 'Retail & brand presentation',
				description: 'Give your product a considered finishing touch.'
			},
			{
				href: '/markets/outdoor',
				label: 'Outdoor identification',
				description: 'Explore materials for wet and exposed environments.'
			}
		]
	},
	{
		href: '/capabilities',
		label: 'Capabilities',
		description: 'Bring material, artwork, and information together.',
		children: [
			{
				href: '/capabilities/printing',
				label: 'Printing',
				description: 'Plan face and back artwork with four-color process.'
			},
			{
				href: '/capabilities/variable-data',
				label: 'Variable data',
				description: 'Barcodes, QR codes, numbering, and personalization.'
			},
			{
				href: '/capabilities/fulfillment',
				label: 'Warehousing & fulfillment',
				description: 'Produce in volume and plan later releases.'
			}
		]
	},
	{
		href: '/about',
		label: 'About',
		description: 'Explore the details behind our tags and labels.',
		children: [
			{
				href: '/about/stock-colors',
				label: 'Stock colors',
				description: 'Find a stock color that gives your message a purpose.'
			},
			{
				href: '/about/shipping',
				label: 'Shipping',
				description: 'All 50 states and international destinations.'
			},
			{
				href: '/about/variable-data',
				label: 'Variable data',
				description: 'Give every printed piece its own information.'
			},
			{
				href: '/about/full-color-printing',
				label: 'Full-color printing',
				description: 'Full-color artwork on the face and back.'
			},
			{
				href: '/about/synthetic-materials',
				label: 'Synthetic materials',
				description: 'Waterproof stocks for outdoor applications.'
			},
			{
				href: '/about/warehousing',
				label: 'Warehousing',
				description: 'Produce in volume. Release on demand.'
			}
		]
	},
	{
		href: '/resources',
		label: 'Resources',
		description: 'Make your next project easier to plan.',
		children: [
			{
				href: '/resources/artwork',
				label: 'Artwork planning',
				description: 'Prepare a useful brief for your printed piece.'
			},
			{
				href: '/resources/material-guide',
				label: 'Material guide',
				description: 'Consider stock, exposure, handling, and attachments.'
			},
			{
				href: '/resources/ordering',
				label: 'Ordering guide',
				description: 'Plan quantities, changing data, and deliveries.'
			}
		]
	},
	{
		href: '/news',
		label: 'News',
		description: '',
		children: []
	},
	{
		href: '/careers',
		label: 'Careers',
		description: '',
		children: []
	}
];

export const contactNavigation = { href: '/contact', label: 'Contact' };
