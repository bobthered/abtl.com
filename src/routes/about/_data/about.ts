/**
 * Research checked 2026-10-13. Keep factual copy grounded in these primary sources:
 * Founding (1911), Caledonia, company positioning and markets:
 * https://www.linkedin.com/company/abtaglabel
 * Product formats and industrial/agricultural/fire-service specialties:
 * https://www.ennis.com/allen-bailey-tag-label/
 * Acquisition date (April 30, 2018): Ennis 2018 annual report, note 18:
 * https://www.ennis.com/wp-content/uploads/2023/01/2018-Annual-Report.pdf
 * Production volume, press sequence, shipping reach and current printing options:
 * company owner instructions in this project. Never expose shipment volumes.
 */
export const applications = [
	{
		title: 'Fire service & maintenance',
		description: 'Tags that carry service and inspection information alongside fire equipment.',
		href: '/markets/equipment-service',
		icon: 'fire'
	},
	{
		title: 'Industry & agriculture',
		description: 'Custom identification for working environments, materials, and products.',
		href: '/markets/outdoor',
		icon: 'industry'
	},
	{
		title: 'Retail, hospitality & service',
		description: 'Stock and custom tags that put useful information into everyday interactions.',
		href: '/markets/retail',
		icon: 'retail'
	}
] as const;

export const milestones = [
	{
		year: '1911',
		title: 'A company takes shape.',
		description:
			'Allen-Bailey begins a story in tag and label manufacturing that now spans more than a century.',
		image: '/images/about/workshop-1911-placeholder.webp',
		alt: 'Generated historical placeholder: an imagined early printing workshop, not an archival Allen-Bailey photograph'
	},
	{
		year: '2011',
		title: 'A century of making our mark.',
		description:
			'One hundred years after 1911: a milestone in a continuing manufacturing story. A moment to look back, and keep looking forward.',
		image: '/images/about/centenary-2011-placeholder.webp',
		alt: 'Generated anniversary placeholder: an imagined workplace celebration, not a record of an actual Allen-Bailey anniversary event'
	},
	{
		year: '2018',
		title: 'A new chapter with Ennis.',
		description:
			'On April 30, Allen-Bailey joins the Ennis family of print businesses, bringing its tag and label expertise to a broader manufacturing network.',
		image: '/images/about/ennis-2018-placeholder.webp',
		alt: 'Generated placeholder: an imagined industrial building, not the actual facility or acquisition event'
	},
	{
		year: 'Today',
		title: 'The next mark is yours.',
		description:
			'From our home in Caledonia, New York, we produce stock and custom tags and labels for the way businesses identify, organize, and communicate.',
		image: '/images/about/press-today-placeholder.webp',
		alt: 'Generated placeholder: a modern printing press, not actual Allen-Bailey equipment'
	}
] as const;

export const processSteps = [
	{
		title: 'Start with the stock.',
		description:
			'Paper or synthetic. White, manila, or color. The material sets the foundation for how the tag looks and works.',
		href: '/about/stock-colors',
		label: 'Explore stock colors'
	},
	{
		title: 'Give it a message.',
		description:
			'Ink goes onto the face, the back, or both. Full-color artwork and changing data turn material into useful information.',
		href: '/about/full-color-printing',
		label: 'Explore printing'
	},
	{
		title: 'Finish the details.',
		description:
			'For patched tags, the patch is added, the top corners are clipped, and a guillotine separates the tags before they stack on a conveyor.',
		href: '/products/attachments',
		label: 'Explore attachments'
	},
	{
		title: 'Plan what comes next.',
		description:
			'Ship the finished product, or warehouse a larger run for later releases. Build the supply plan around your business.',
		href: '/about/warehousing',
		label: 'Explore warehousing'
	}
] as const;
