export type NavigationLink = { href: string; label: string; description: string };
export type NavigationSection = NavigationLink & { children: NavigationLink[] };

export const navigation: NavigationSection[] = [
	{
		href: '/capabilities',
		label: 'Capabilities',
		description: 'Bring material, artwork, information, and delivery together.',
		children: [
			{
				href: '/capabilities/attachments',
				label: 'Attachments',
				description: 'Patches, eyelets, wire, string, and elastic.'
			},
			{
				href: '/capabilities/stock-colors',
				label: 'Stock colors',
				description: 'Find a stock color that gives your message a purpose.'
			},
			{
				href: '/capabilities/shipping',
				label: 'Shipping',
				description: 'All 50 states and international destinations.'
			},
			{
				href: '/capabilities/variable-data',
				label: 'Variable data',
				description: 'Give every printed piece its own information.'
			},
			{
				href: '/capabilities/full-color-printing',
				label: 'Full-color printing',
				description: 'Full-color artwork on the face and back.'
			},
			{
				href: '/capabilities/synthetic-materials',
				label: 'Synthetic materials',
				description: 'Waterproof stocks for outdoor applications.'
			},
			{
				href: '/capabilities/warehousing',
				label: 'Warehousing',
				description: 'Produce in volume. Release on demand.'
			}
		]
	},
	{
		href: '/markets',
		label: 'Markets',
		description: 'Start with the way you will use it.',
		children: [
			{
				href: '/markets/beverage',
				label: 'Beverage',
				description: 'Craft beer can labels, elastic growler tags, and wine labels.'
			},
			{
				href: '/markets/fire-suppression',
				label: 'Fire Suppression',
				description: 'Inspection tags, service labels, and collars for fire-service teams.'
			},
			{
				href: '/markets/hospitality',
				label: 'Hospitality',
				description: 'Claim checks, guest-service tags, and thoughtful printed details.'
			},
			{
				href: '/markets/merchandise-tags',
				label: 'Merchandise Tags',
				description: 'Scalloped marking and jewelry tags in 21 stock colors.'
			},
			{
				href: '/markets/shellfish',
				label: 'Shellfish',
				description: 'Standard, pinfed, and laser-compatible sheeted shellfish tags.'
			},
			{
				href: '/markets/tree-tags',
				label: 'Tree Tags',
				description: 'Standard and custom tree-shaped tags on your choice of substrate.'
			}
		]
	},
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
		href: '/about',
		label: 'About',
		description: 'Our Caledonia roots and more than a century of manufacturing.',
		children: []
	},
	{
		href: '/careers',
		label: 'Careers',
		description: '',
		children: []
	},
	{
		href: '/news',
		label: 'News',
		description: '',
		children: []
	}
]
	.map((section) => ({
		...section,
		children: [...section.children].sort((first, second) =>
			first.label.localeCompare(second.label, 'en')
		)
	}))
	.sort(
		(first, second) =>
			Number(second.children.length > 0) - Number(first.children.length > 0) ||
			first.label.localeCompare(second.label)
	);

export const contactNavigation = { href: '/contact', label: 'Contact' };

// Contact joins the main links on desktop, mobile, and in the footer.
export const allNavigation = [
	...navigation,
	{ ...contactNavigation, description: '', children: [] }
].sort(
	(first, second) =>
		Number(second.children.length > 0) - Number(first.children.length > 0) ||
		first.label.localeCompare(second.label)
);

// Products remains available in the footer; primary navigation focuses on capabilities and markets.
export const mainNavigation = allNavigation.filter((section) => section.href !== '/products');
export const mobileNavigation = allNavigation.filter((section) => section.href !== '/products');
