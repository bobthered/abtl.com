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
	contact: {
		eyebrow: 'Start a conversation',
		title: 'What can we help you make?',
		description:
			'Planning a new product, revisiting an existing design, or exploring materials? Tell us what you have in mind.',
		heading: 'Give us a useful starting point.',
		cards: [
			[
				'A new project',
				'Include the application, approximate quantity, size, artwork, and when you need the product. We can work through the remaining details together.',
				"mailto:sales@abtl.com'subject=New%20tag%20or%20label%20project",
				'Email your project'
			],
			[
				'Materials & samples',
				'See stock colors and request individual colors or a selection of samples from the stock-color page.',
				'/capabilities/stock-colors',
				'Explore colors & samples'
			],
			[
				'An existing order',
				'Include your order reference and the question you need help with. For warehouse releases, include the product and quantity you want to discuss.',
				"mailto:sales@abtl.com'subject=Existing%20order%20question",
				'Ask about an order'
			]
		],
		detailTitle: 'Talk to our team.',
		detail:
			'Email sales@abtl.com with your questions or project details. Attaching artwork or a photo of an existing product can help explain what you need.',
		detailHref: 'mailto:sales@abtl.com',
		detailLabel: 'Email sales@abtl.com',
		cta: 'Your next tag or label starts here.',
		ctaText: "No finished specification required. Start with the problem you're trying to solve."
	},
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
