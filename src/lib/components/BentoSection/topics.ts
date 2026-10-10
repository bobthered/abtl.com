export type Topic = {
	columns: 'full' | 'third' | 'wide';
	description: string;
	id: string;
	preview: 'globe' | 'columns' | 'fan' | 'print' | 'layers' | 'shape' | 'feed' | 'sequence';
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
		columns: 'wide'
	}
];

export const topicHref = (topic: Topic) => `/tags/${topic.slug ?? topic.id}`;
