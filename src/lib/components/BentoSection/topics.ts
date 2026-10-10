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
		| 'warehouse'
		| 'process';
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
		id: 'full-color-printing',
		title: 'Full color. Both sides.',
		description:
			'Four-color process printing for full-color tags and labels, with up to eight total colors supporting CMYK on both the face and back.',
		preview: 'process',
		columns: 'third'
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
