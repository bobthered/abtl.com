import type { LandingPageContent } from './landingPages.js';

export const navigationPages: Record<string, LandingPageContent> = {
	'products/tags': {
		eyebrow: 'Tags',
		title: 'Tags that stay with the story.',
		description:
			'Choose a stock color, build a printed design, or explore waterproof synthetics. Add the information and attachment your application needs.',
		heading: 'Choose the foundation.',
		cards: [
			[
				'Stock colors',
				'White, manila, colored, and fluorescent stocks offer different ways to make identification visible.',
				'/about/stock-colors',
				'Explore stock colors'
			],
			[
				'Waterproof synthetics',
				'Discuss Tyvek, Valeron, Polyart, Tundra, or V-Max for outdoor use and demanding handling.',
				'/about/synthetic-materials',
				'Explore synthetic stocks'
			],
			[
				'Attachments',
				'Consider wire, string, or elastic for the item you need to identify.',
				'/products/attachments',
				'Explore attachments'
			]
		],
		detailTitle: 'Plan the whole tag.',
		detail:
			'Share dimensions, face and back artwork, changing data, and how the tag will attach. Those decisions work together.',
		detailHref: '/capabilities/printing',
		detailLabel: 'Explore printing',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'products/labels': {
		eyebrow: 'Labels',
		title: 'Your message. Right on the product.',
		description:
			'Build a label around the information it needs to carry, from full-color artwork to a different barcode on every piece.',
		heading: 'Make every piece useful.',
		cards: [
			[
				'Full-color artwork',
				'Explore four-color process for brand imagery and printed information.',
				'/about/full-color-printing',
				'Explore printing'
			],
			[
				'Changing information',
				'Add barcodes, QR codes, sequential numbering, or personalized information.',
				'/about/variable-data',
				'Explore variable data'
			],
			[
				'Planned supply',
				'Discuss producing in volume and warehousing finished labels for later releases.',
				'/about/warehousing',
				'Explore warehousing'
			]
		],
		detailTitle: 'Start with the surface.',
		detail:
			'Tell us what the label will be applied to, the conditions it will encounter, the dimensions, and the information it needs to carry. Ask our team to confirm the material and adhesive for your application.',
		detailHref: '/contact',
		detailLabel: 'Discuss a label project',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'products/attachments': {
		eyebrow: 'Tag attachments',
		title: 'A tag is only useful if it stays with the item.',
		description:
			'Wire, string, and elastic connect the printed tag to the object it identifies. Start with the way the product will be handled.',
		heading: 'Three ways to make the connection.',
		cards: [
			[
				'Wire',
				'Discuss wire when the attachment point and handling call for this option. Include the environment where the tag will be used.',
				'/contact',
				'Discuss wire'
			],
			[
				'String',
				'Consider string for a tied attachment. Share how the tag will be fastened, handled, and removed.',
				'/contact',
				'Discuss string'
			],
			[
				'Elastic',
				'Consider elastic for a looped attachment. Tell us about the item and the fit you need.',
				'/contact',
				'Discuss elastic'
			]
		],
		detailTitle: 'Material and attachment work together.',
		detail:
			'Outdoor exposure and repeated handling affect the whole tag, including the attachment. Discuss the complete application with our team.',
		detailHref: '/about/synthetic-materials',
		detailLabel: 'Explore synthetic materials',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'markets/equipment-service': {
		eyebrow: 'Equipment & service',
		title: 'Keep the record with the equipment.',
		description:
			'Tags and labels can carry inspection records, asset identifiers, service information, and links to more detailed records.',
		heading: 'Connect the printed piece to the work.',
		cards: [
			[
				'Scannable identifiers',
				'Use barcode or QR-code content to connect identification to your own records or destination URLs.',
				'/about/variable-data',
				'Explore variable data'
			],
			[
				'Clear printed information',
				'Plan fields, numbering, and face and back content around the information someone needs at the point of use.',
				'/capabilities/printing',
				'Explore printing'
			],
			[
				'Exposed environments',
				'Discuss waterproof synthetics and attachments for equipment used outdoors.',
				'/about/synthetic-materials',
				'Explore outdoor stocks'
			]
		],
		detailTitle: 'Tell us how it will be used.',
		detail:
			'Describe the equipment, the handling, the exposure, and whether information will be added in the field. We can discuss the stock and printing requirements together.',
		detailHref: '/contact',
		detailLabel: 'Discuss your application',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'markets/retail': {
		eyebrow: 'Retail & brand presentation',
		title: 'A finishing touch that tells your story.',
		description:
			'Use tags and labels to introduce a product, carry useful details, and connect customers to more information.',
		heading: 'Give the design room to work.',
		cards: [
			[
				'Full color',
				'Explore four-color process for product imagery and brand artwork.',
				'/about/full-color-printing',
				'Explore full-color printing'
			],
			[
				'Stock color',
				'Choose a stock color that works with your artwork and the way the product is presented.',
				'/about/stock-colors',
				'Explore stock colors'
			],
			[
				'Digital connections',
				'Use a QR code to link to the destination you choose, or a barcode for your existing workflow.',
				'/about/variable-data',
				'Explore scannable data'
			]
		],
		detailTitle: 'Think about both sides.',
		detail:
			'A tag can introduce the product on the face and carry supporting details on the back. Eight total print colors allow four-color process on both sides.',
		detailHref: '/about/full-color-printing',
		detailLabel: 'Explore face and back printing',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'markets/outdoor': {
		eyebrow: 'Outdoor identification',
		title: 'Identification that belongs outdoors.',
		description:
			'Waterproof synthetic tags offer an alternative to paper for wet and exposed environments. Match the material to the handling and conditions.',
		heading: 'Consider the whole environment.',
		cards: [
			[
				'Water exposure',
				'Explore waterproof synthetic options, including Tyvek, Valeron, Polyart, Tundra, and V-Max.',
				'/about/synthetic-materials',
				'Explore synthetic materials'
			],
			[
				'Handling & durability',
				'Different synthetics offer different durability characteristics. Describe abrasion, bending, and repeated handling to our team.',
				'/resources/material-guide',
				'Plan your material'
			],
			[
				'Attachment',
				'Consider how wire, string, or elastic will connect the tag to the item.',
				'/products/attachments',
				'Explore attachments'
			]
		],
		detailTitle: 'Waterproof is the starting point.',
		detail:
			'Discuss your expected use, exposure, and service life with our team so the stock, printing, and attachment can be considered together.',
		detailHref: '/contact',
		detailLabel: 'Discuss outdoor identification',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'capabilities/printing': {
		eyebrow: 'Printing',
		title: 'Make the artwork do more.',
		description:
			'Four-color process brings full-color imagery to tags and labels. Up to eight total colors make CMYK printing on both the face and back possible.',
		heading: 'Plan the printed piece.',
		cards: [
			[
				'Full-color artwork',
				'See how cyan, magenta, yellow, and black work together in four-color process.',
				'/about/full-color-printing',
				'Explore four-color process'
			],
			[
				'Variable information',
				'Combine a shared design with data that changes from one piece to the next.',
				'/about/variable-data',
				'Explore changing data'
			],
			[
				'Artwork preparation',
				'Start with the dimensions, stock, face and back content, and available artwork files.',
				'/resources/artwork',
				'Plan your artwork'
			]
		],
		detailTitle: 'Stock is part of the design.',
		detail:
			'A colored stock changes the starting point for your artwork. Physical samples and a conversation about ink and stock help you plan the finished appearance.',
		detailHref: '/about/stock-colors',
		detailLabel: 'Explore stock colors',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'capabilities/variable-data': {
		eyebrow: 'Variable data',
		title: 'Same design. Individual information.',
		description:
			'Produce tags and labels with barcodes, QR codes, sequential numbering, or mailing personalization. Plan the design and the changing records together.',
		heading: 'What needs to change?',
		cards: [
			[
				'Codes',
				'Define what each barcode or QR code should contain and how it will be used.',
				'/about/variable-data',
				'See variable data in action'
			],
			[
				'Sequences',
				'Discuss your starting number, sequence, formatting, and any fields that need to correspond.',
				'/resources/ordering',
				'Plan the records'
			],
			[
				'Personalization',
				'Include recipient-specific information for mailing applications. Discuss the data format with our team.',
				'/contact',
				'Discuss personalized printing'
			]
		],
		detailTitle: 'Good data starts before printing.',
		detail:
			'Confirm the source records, field mapping, intended code content, and how you will review the information. Share a representative sample with our team to discuss requirements.',
		detailHref: '/about/variable-data',
		detailLabel: 'Explore variable data',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'capabilities/fulfillment': {
		eyebrow: 'Warehousing & fulfillment',
		title: 'Produce ahead. Release when needed.',
		description:
			'A larger production run can create manufacturing efficiencies. Warehouse finished tags and labels for later shipments rather than shipping the entire run at once.',
		heading: 'Connect production to demand.',
		cards: [
			[
				'Production in volume',
				'Discuss your total expected usage and how a larger run could affect unit pricing.',
				'/about/warehousing',
				'Explore warehousing'
			],
			[
				'Later releases',
				'Once finished product is made and on the shelf, it is available for immediate release. Discuss quantities and release arrangements.',
				'/about/warehousing',
				'Explore release planning'
			],
			[
				'Delivery destinations',
				'We ship across all 50 states and internationally. Tell us where your products need to go.',
				'/about/shipping',
				'Explore shipping'
			]
		],
		detailTitle: 'Plan the details together.',
		detail:
			'Share your product, expected usage, release quantities, and destinations. Ask our team to confirm storage and shipping arrangements for your order.',
		detailHref: '/contact',
		detailLabel: 'Discuss a supply plan',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'resources/artwork': {
		eyebrow: 'Artwork planning',
		title: 'Give your artwork a useful brief.',
		description:
			'You do not need every detail resolved before getting in touch. A clear starting point helps us discuss what your tag or label needs.',
		heading: 'Bring the essentials.',
		cards: [
			[
				'Dimensions & stock',
				'Share the intended size, stock preference, and attachment needs. Include a sample or photo if you are matching an existing product.',
				'/resources/material-guide',
				'Consider the material'
			],
			[
				'Face & back',
				'Identify what belongs on each side and share the artwork files you have available. Ask our team to confirm production-file requirements.',
				'/about/full-color-printing',
				'Explore both sides'
			],
			[
				'Changing fields',
				'Identify which text, numbers, or codes change and which remain part of the shared design.',
				'/about/variable-data',
				'Explore variable fields'
			]
		],
		detailTitle: 'Review before production.',
		detail:
			'Discuss the proofing process, color expectations, and data review with our team. Screen artwork and physical stock can look different, so request samples when material appearance matters.',
		detailHref: '/about/stock-colors',
		detailLabel: 'Explore stock samples',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'resources/material-guide': {
		eyebrow: 'Material guide',
		title: 'Choose for the conditions.',
		description:
			'A material decision starts with the application. Consider where the printed piece will live, what it will encounter, and how it will attach.',
		heading: 'Ask three useful questions.',
		cards: [
			[
				'Where will it be used?',
				'Describe indoor or outdoor use, wet conditions, and the expected duration. Waterproof synthetic options are available for outdoor applications.',
				'/about/synthetic-materials',
				'Explore synthetic stocks'
			],
			[
				'How will it be handled?',
				'Describe bending, repeated handling, and abrasion. Different materials offer different durability characteristics.',
				'/contact',
				'Discuss durability'
			],
			[
				'How will it attach?',
				'For tags, consider wire, string, or elastic. For labels, discuss the application surface and adhesive requirements.',
				'/products/attachments',
				'Explore tag attachments'
			]
		],
		detailTitle: 'Get a feel for the real material.',
		detail:
			'Physical samples let you assess the stock color and feel. Explore stock colors and ask our team about material samples for your application.',
		detailHref: '/about/stock-colors',
		detailLabel: 'Explore colors & samples',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	},
	'resources/ordering': {
		eyebrow: 'Ordering guide',
		title: 'Plan the run. Plan what comes next.',
		description:
			'Bring your quantity, product details, artwork, data, and delivery needs together in one project brief.',
		heading: 'Build a useful order brief.',
		cards: [
			[
				'Product & quantity',
				'Share the product type, dimensions, material, attachment, and approximate volume. Include an existing reference when available.',
				'/products',
				'Explore products'
			],
			[
				'Artwork & records',
				'Include face and back artwork and explain any changing fields, codes, or numbering sequences.',
				'/resources/artwork',
				'Plan your artwork'
			],
			[
				'Timing & delivery',
				'Tell us when and where the product is needed. Discuss warehousing if you want to release finished stock over time.',
				'/capabilities/fulfillment',
				'Plan fulfillment'
			]
		],
		detailTitle: 'An existing order?',
		detail:
			'Include your order reference and the question you need help with. For a warehouse release, share the product and quantity you want to discuss.',
		detailHref: '/contact',
		detailLabel: 'Contact our team',
		cta: "Let's work through the details.",
		ctaText:
			'Share your application and the details you know. Our team can help you consider the next steps.'
	}
};
