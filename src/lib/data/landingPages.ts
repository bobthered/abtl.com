export type LandingPageContent = {
	eyebrow: string;
	title: string;
	description: string;
	heading: string;
	cards: [string, string, string, string][];
	detailTitle: string;
	detail: string;
	detailHref: string;
	detailLabel: string;
	cta: string;
	ctaText: string;
};

export const landingPages: Record<string, LandingPageContent> = {
	careers: {
		eyebrow: 'Careers',
		title: 'Help make the details matter.',
		description:
			'Interested in the people and processes behind tags and labels? Get to know our work and ask about current opportunities at Allen-Bailey Tag & Label.',
		heading: 'Get to know the work.',
		cards: [
			[
				'Manufacturing',
				'Our products bring together materials, printing, and finishing. Explore the capabilities behind the finished piece.',
				'/capabilities',
				'Explore our work'
			],
			[
				'Customer applications',
				'Every project starts with a practical need: identifying, organizing, or communicating. See the applications that shape our products.',
				'/markets',
				'Explore applications'
			],
			[
				'The company',
				'Learn what we make and how production, warehousing, and shipping fit together.',
				'/about',
				'Get to know Allen-Bailey'
			]
		],
		detailTitle: 'Ask about current opportunities.',
		detail:
			"We haven't published a list of open roles here yet. Contact us to ask about current openings and the appropriate person to speak with before sending application materials.",
		detailHref: "mailto:sales@abtl.com'subject=Careers%20inquiry",
		detailLabel: 'Ask about careers',
		cta: 'Interested in joining us?',
		ctaText: "Introduce yourself and let us know the kind of work you're interested in."
	}
};
