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
	products: {
		eyebrow: 'Tags & labels',
		title: 'The right identification. Made for your world.',
		description:
			"From a stock tag to a fully printed label, start with the job your product needs to do. We'll help bring together the material, print, data, and finishing.",
		heading: 'Start with the product. Build in the details.',
		cards: [
			[
				'Tags',
				'Hang, tie, or attach your message. Explore stock colors, synthetic materials, and wire, string, or elastic attachments.',
				'/about/stock-colors',
				'Explore stock colors'
			],
			[
				'Labels',
				'Put your message on the product itself. Combine full-color artwork with barcodes, QR codes, or personalized information.',
				'/about/variable-data',
				'Explore variable data'
			],
			[
				'Outdoor identification',
				'Waterproof synthetic tags for exposed environments. Compare Tyvek, Valeron, Polyart, Tundra, and V-Max with our team.',
				'/about/synthetic-materials',
				'Explore synthetic materials'
			]
		],
		detailTitle: 'One product. Many possibilities.',
		detail:
			'Choose full-color printing on the face and back, add changing information to each piece, or plan a larger run with later releases from our warehouse.',
		detailHref: '/capabilities',
		detailLabel: 'See our capabilities',
		cta: 'Tell us what you need to identify.',
		ctaText:
			"Share your application, quantities, dimensions, and artwork. Let's work through the options together."
	},
	markets: {
		eyebrow: 'Applications & markets',
		title: 'Different environments. One clear message.',
		description:
			'A tag or label can carry an inspection record, identify inventory, introduce a product, or connect a customer to more information. Start with your application.',
		heading: 'What does your tag or label need to do?',
		cards: [
			[
				'Equipment & service',
				'Keep identification and inspection information with the item. Sequential numbering and scannable codes can connect the printed piece to your records.',
				'/about/variable-data',
				'Explore identification'
			],
			[
				'Inventory & distribution',
				'Identify products as they move through your workflow. Plan production in volume and release finished stock when you need it.',
				'/about/warehousing',
				'Explore warehousing'
			],
			[
				'Retail & brand presentation',
				'Give your product a considered finishing touch with full-color tags and labels, including artwork on both sides.',
				'/about/full-color-printing',
				'Explore full-color printing'
			],
			[
				'Outdoor use',
				'Choose a waterproof synthetic tag and an attachment suited to the handling and exposure you describe.',
				'/about/synthetic-materials',
				'Explore outdoor materials'
			]
		],
		detailTitle: 'The application comes first.',
		detail:
			'Tell us where the product will live, how it will attach, what it needs to communicate, and how long you expect to use it. Those details guide the material and printing conversation.',
		detailHref: '/contact',
		detailLabel: 'Discuss your application',
		cta: 'Bring us the challenge.',
		ctaText: "We'll help you consider stock, artwork, data, and attachments for your use case."
	},
	capabilities: {
		eyebrow: 'What we can do',
		title: 'Every detail working together.',
		description:
			'Color, changing data, durable materials, and fulfillment options. Build a tag or label around the way your business works.',
		heading: 'Explore the possibilities.',
		cards: [
			[
				'Full-color printing',
				'Four-color process creates full-color artwork. Up to eight total colors allow CMYK on both the face and back.',
				'/about/full-color-printing',
				'See printing in action'
			],
			[
				'Variable data',
				'Barcodes, QR codes, sequential numbering, and mailing personalization make each printed piece its own.',
				'/about/variable-data',
				'Explore variable data'
			],
			[
				'Stock colors',
				'Start with white or manila, introduce a colored stock, or make your message stand out with a fluorescent option.',
				'/about/stock-colors',
				'Explore stock colors'
			],
			[
				'Synthetic materials',
				'Explore waterproof stocks for outdoor use, with different durability characteristics to discuss for your application.',
				'/about/synthetic-materials',
				'Compare materials'
			],
			[
				'Warehousing',
				'Produce in volume for manufacturing efficiencies. Keep finished goods on our shelves for later shipments.',
				'/about/warehousing',
				'Plan later releases'
			],
			[
				'Shipping',
				'Reach destinations across all 50 states and internationally. Talk with us about your delivery requirements.',
				'/about/shipping',
				'Explore our reach'
			]
		],
		detailTitle: "Don't stop at the printed surface.",
		detail:
			'Wire, string, and elastic attachments help a tag stay with the item it identifies. Include the attachment and handling requirements in your project brief.',
		detailHref: '/about/synthetic-materials',
		detailLabel: 'Explore attachments',
		cta: "Let's put the pieces together.",
		ctaText: "Tell us your goals. We'll help you plan a product and a production approach."
	},
	about: {
		eyebrow: 'Allen-Bailey Tag & Label',
		title: 'Built for endless possibilities.',
		description:
			'We manufacture tags and labels that help businesses identify, organize, and communicate. From the stock you choose to the information you print, every detail has a purpose.',
		heading: 'More than a printed piece.',
		cards: [
			[
				'Made to communicate',
				'Stock colors, full-color artwork, and variable information bring your message to the product.',
				'/capabilities',
				'Explore our capabilities'
			],
			[
				'Made for your environment',
				'Paper and waterproof synthetic options let you start with the conditions where the tag will be used.',
				'/products',
				'Explore our products'
			],
			[
				'Made for your schedule',
				'Production in volume, warehousing, and later releases connect manufacturing to the way you order.',
				'/about/warehousing',
				'Explore warehousing'
			]
		],
		detailTitle: 'Over 90 million tags produced last year.',
		detail:
			'That scale begins with individual details: material, artwork, data, and finishing. We bring those decisions together for the tags and labels your business needs.',
		detailHref: '/about/shipping',
		detailLabel: 'See where we ship',
		cta: "Let's make something that works.",
		ctaText:
			'Bring your idea, an existing product, or a new application. Start a conversation with our team.'
	},
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
				'/about/stock-colors',
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
	},
	resources: {
		eyebrow: 'Project resources',
		title: 'A clearer path from idea to print.',
		description:
			'Explore materials, printing, and ordering options before your next project. Use these guides to start a more useful conversation with our team.',
		heading: 'Explore before you specify.',
		cards: [
			[
				'Choose your stock',
				'Compare stock colors and explore waterproof synthetic options. Ask for samples to assess the physical material.',
				'/about/stock-colors',
				'Explore colors & samples'
			],
			[
				'Plan your artwork',
				'Consider what belongs on the face and back. Explore four-color process and discuss artwork preparation with our team.',
				'/about/full-color-printing',
				'Explore printing'
			],
			[
				'Prepare changing data',
				'Think through the records, numbering, barcode content, or destination URLs each piece should carry.',
				'/about/variable-data',
				'Explore variable data'
			],
			[
				'Plan your supply',
				'Consider your total usage and release schedule. A larger production run with warehousing can support later shipments.',
				'/about/warehousing',
				'Explore warehousing'
			]
		],
		detailTitle: 'Your project checklist.',
		detail:
			"Start with the application, quantity, dimensions, material, attachment, face and back artwork, variable data, and delivery needs. If some details are undecided, tell us what you know and we'll discuss the rest.",
		detailHref: '/contact',
		detailLabel: 'Talk through your brief',
		cta: 'Need a hand choosing?',
		ctaText: "Send your questions or a reference product. We'll help you work through the options."
	}
};
