/**
 * Owner-provided centennial history (IMG_2260.jpg and IMG_2261.jpg), read 2026-10-14,
 * supplies founders, Dansville origins, the 1913 move, paper/press evolution,
 * label production around 1964, the 1967 name change, and the 1991 acquisition.
 * Photo dates are not inferred from nearby prose; period staffing/leadership is not current data.
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
		href: '/markets/fire-suppression',
		icon: 'fire'
	},
	{
		title: 'Industry & agriculture',
		description: 'Custom identification for working environments, materials, and products.',
		href: '/capabilities/synthetic-materials',
		icon: 'industry'
	},
	{
		title: 'Retail, hospitality & service',
		description: 'Stock and custom tags that put useful information into everyday interactions.',
		href: '/products/tags',
		icon: 'retail'
	}
] as const;

export const milestones = [
	{
		year: '1911',
		title: 'It started with a plant and a purpose.',
		description:
			'Samuel Allen and James Bailey founded the company in Dansville, New York. Their first machine made wooden nursery stakes for Kelly Bros. Nurseries. Marked with wax crayon and attached with hand-twisted galvanized wire, the stakes helped identify plants. Useful information, attached to the thing that needed it.',
		photo: {
			src: '/images/about/archive-wooden-nursery-tag-wide.webp',
			alt: 'AI-extended company archive: a wooden nursery tag with a twisted wire attachment',
			width: 1200,
			height: 667
		}
	},
	{
		year: '1913',
		title: 'A small town with connections.',
		description:
			'Two years later, Allen-Bailey moved to Caledonia. The draw was practical: proximity to four major railroad lines. Our small-town home and our wider reach have been connected from the beginning.',
		photo: {
			src: '/images/about/archive-horse-drawn-tag-wagon-wide.webp',
			alt: 'AI-extended company archive: a horse-drawn wagon with Allen-Bailey markings and a Tree Labels sign',
			width: 1200,
			height: 667
		}
	},
	{
		year: '1920s & beyond',
		title: 'New materials. A new way to make.',
		description:
			'In the mid-to-late 1920s, more durable paper and rope stocks began replacing wooden stakes. After difficult years in the 1930s, Elmer Floback purchased the company and developed a press that turned a roll of paper into finished products in one pass. Seven of those presses were installed in Caledonia.',
		photo: {
			src: '/images/about/archive-industry-handshake-wide.webp',
			alt: 'AI-extended company archive: two men shaking hands in front of a Tag Manufacturers Institute banner',
			width: 1200,
			height: 667
		}
	},
	{
		year: '1964–1967',
		title: 'Tags made room for labels.',
		description:
			'Around 1964, Allen-Bailey began producing pressure-sensitive labels on a flexographic press, giving tag customers another way to identify their products. In 1967, the company adopted the name Allen-Bailey Tag & Label, Inc. As applications changed, the business grew with them.',
		photo: {
			src: '/images/about/archive-company-gathering-wide.webp',
			alt: 'AI-extended company archive: a group gathered around a table, raising their glasses',
			width: 1200,
			height: 667
		}
	},
	{
		year: '1991',
		title: 'A broader chapter in industrial tags.',
		description:
			'Allen-Bailey acquired Avery Dennison’s Industrial Tag Division in Framingham, Massachusetts, and opened a manufacturing and office facility in Hopkinton. That operation produced manifold tags using bond and carbon papers, expanding the company’s industrial tag business.',
		photo: {
			src: '/images/about/archive-hand-finishing-color-wide.webp',
			alt: 'AI-restored, colorized and extended archive photo of a worker hand-finishing tags at a workbench; original photo date unverified',
			width: 1200,
			height: 667
		}
	},
	{
		year: '2011',
		title: 'A century worth remembering.',
		description:
			'The company’s centennial history brought together the wooden stakes, early photographs, changing materials, and people behind its first hundred years. It also recognized employees whose families had worked here for more than one generation. That history is part of the work we carry forward.',
		photo: {
			src: '/images/about/archive-press-operator-wide.webp',
			alt: 'AI-restored and extended archive color photo of a worker operating a tag printing press; original photo date unverified',
			width: 1200,
			height: 667
		}
	},
	{
		year: '2018',
		title: 'A new chapter with Ennis.',
		description:
			'On April 30, Allen-Bailey joined the Ennis family of print businesses, bringing its tag and label expertise to a broader manufacturing network.',
		photo: {
			src: '/images/about/safety-celebration-wide.webp',
			alt: 'AI-cleaned and extended owner-provided group photo at a safety celebration outside an industrial building; photo date unverified',
			width: 1200,
			height: 667
		}
	},
	{
		year: 'Today',
		title: 'The next mark is yours.',
		description:
			'From our home in Caledonia, New York, we produce stock and custom tags and labels for the way businesses identify, organize, and communicate. More than a century after those first nursery stakes, the next application could be yours.',
		photo: {
			src: '/images/about/tag-cord-reel-editorial-wide.webp',
			alt: 'AI-enhanced and extended owner-provided photo of an orange cord reel, yellow guide pulley and white strung tags on a workshop bench',
			width: 1200,
			height: 667
		}
	}
] as const;

export const processSteps = [
	{
		title: 'Start with the stock.',
		description:
			'Paper or synthetic. White, manila, or color. The material sets the foundation for how the tag looks and works.',
		href: '/capabilities/stock-colors',
		label: 'Explore stock colors'
	},
	{
		title: 'Give it a message.',
		description:
			'Ink goes onto the face, the back, or both. Full-color artwork and changing data turn material into useful information.',
		href: '/capabilities/full-color-printing',
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
		href: '/capabilities/warehousing',
		label: 'Explore warehousing'
	}
] as const;
