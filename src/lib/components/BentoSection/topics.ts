export type Topic = {
	columns: 'full' | 'third' | 'wide';
	description: string;
	id: string;
	preview: 'columns' | 'fan' | 'print' | 'layers' | 'shape' | 'feed' | 'sequence';
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
		id: 'printing',
		title: 'Make your mark.',
		description: 'Explore custom printing.',
		preview: 'print',
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
		columns: 'full'
	}
];

export const topicHref = (topic: Topic) => `/tags/${topic.slug ?? topic.id}`;
