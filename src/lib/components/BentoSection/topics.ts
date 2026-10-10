export type Topic = {
	columns: 'full' | 'third' | 'wide';
	description: string;
	id: string;
	preview:
		| 'globe'
		| 'columns'
		| 'fan'
		| 'print'
		| 'layers'
		| 'shape'
		| 'feed'
		| 'sequence'
		| 'data'
		| 'warehouse';
	slug?: string;
	title: string;
};

export const topics: Topic[] = [
	{
		id: 'colors',
		slug: 'stock-colors',
		title: 'What color will you choose?',
		description: 'Explore stock tag colors.',
		preview: 'columns',
		columns: 'wide'
	},
	{
		id: 'shipping',
		title: 'Your tags. A world of possibilities.',
		description: 'Tags and labels shipped to all 50 states and internationally.',
		preview: 'globe',
		columns: 'third'
	},
	{
		id: 'variable-data',
		title: 'One design. A different story on every piece.',
		description:
			'Variable data tags and labels with barcodes, QR codes, sequential numbering, and personalization for mailings.',
		preview: 'data',
		columns: 'third'
	},
	{
		id: 'materials',
		title: 'The right material for the job.',
		description: 'Explore paper and synthetic options.',
		preview: 'layers',
		columns: 'third'
	},
	{
		id: 'shapes',
		title: 'A shape that fits.',
		description: 'Explore sizes, shapes, and details.',
		preview: 'shape',
		columns: 'third'
	},
	{
		id: 'formats',
		title: 'Ready for your workflow.',
		description: 'Explore single, continuous, and roll formats.',
		preview: 'feed',
		columns: 'third'
	},
	{
		id: 'numbering',
		title: 'Keep every number in order.',
		description: 'Explore consecutive numbering.',
		preview: 'sequence',
		columns: 'wide'
	},
	{
		id: 'warehousing',
		title: 'Produce in volume. Release on demand.',
		description:
			'Lower your unit price with a larger production run. Warehouse finished tags and labels for later shipments, available for immediate release from stock.',
		preview: 'warehouse',
		columns: 'full'
	}
];

export const topicHref = (topic: Topic) => `/tags/${topic.slug ?? topic.id}`;
