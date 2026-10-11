import equipment from '#lib/assets/tags/photos/white-equipment.webp';
import nursery from '#lib/assets/tags/photos/backgrounds/nursery.webp';
import packing from '#lib/assets/tags/photos/backgrounds/packing.webp';
import parts from '#lib/assets/tags/photos/manila-parts.webp';
import textile from '#lib/assets/tags/photos/backgrounds/textile.webp';
import warehouse from '#lib/assets/tags/photos/blue-warehouse.webp';

export type NewsPost = {
	id: string;
	image: string;
	alt: string;
	category: string;
	title: string;
	description: string;
	body: string[];
	isPreview: boolean;
	isPublished: boolean;
	publishedAt: string | null;
};

// Design previews only: no publication dates or company announcements are fabricated.
// Publishing a dated entry here updates both /news and the homepage automatically.
export const newsPosts: NewsPost[] = [
	{
		isPreview: true,
		isPublished: false,
		publishedAt: null,
		body: [
			'This is a design preview for a future news article. Published articles will appear here and in the homepage highlights.'
		],
		id: 'equipment',
		image: equipment,
		alt: 'White inspection tag attached to equipment',
		category: 'Equipment & service',
		title: 'Every inspection has a story.',
		description:
			'A preview of an article about keeping service and inspection details with equipment.'
	},
	{
		isPreview: true,
		isPublished: false,
		publishedAt: null,
		body: [
			'This is a design preview for a future news article. Published articles will appear here and in the homepage highlights.'
		],
		id: 'nursery',
		image: nursery,
		alt: 'Plant nursery setting for a news article preview',
		category: 'Nursery & garden',
		title: 'A little detail. A growing connection.',
		description:
			'A preview article about identifying plants and helping their next owner care for them.'
	},
	{
		isPreview: true,
		isPublished: false,
		publishedAt: null,
		body: [
			'This is a design preview for a future news article. Published articles will appear here and in the homepage highlights.'
		],
		id: 'warehouse',
		image: warehouse,
		alt: 'Blue tag in a warehouse setting',
		category: 'Warehousing & logistics',
		title: 'Keep the next move in sight.',
		description:
			'A preview article about tags that help teams recognize, organize and move inventory.'
	},
	{
		isPreview: true,
		isPublished: false,
		publishedAt: null,
		body: [
			'This is a design preview for a future news article. Published articles will appear here and in the homepage highlights.'
		],
		id: 'textile',
		image: textile,
		alt: 'Textile setting for a news article preview',
		category: 'Retail & textiles',
		title: 'Make the first impression count.',
		description:
			'A preview article about bringing a brand and its product details together on a tag.'
	},
	{
		isPreview: true,
		isPublished: false,
		publishedAt: null,
		body: [
			'This is a design preview for a future news article. Published articles will appear here and in the homepage highlights.'
		],
		id: 'parts',
		image: parts,
		alt: 'Manila tag identifying parts',
		category: 'Parts & manufacturing',
		title: 'The right details, right where they belong.',
		description:
			'A preview article about keeping identification with a part as it moves through production.'
	},
	{
		isPreview: true,
		isPublished: false,
		publishedAt: null,
		body: [
			'This is a design preview for a future news article. Published articles will appear here and in the homepage highlights.'
		],
		id: 'packing',
		image: packing,
		alt: 'Packing setting for a news article preview',
		category: 'Packaging & fulfillment',
		title: 'Carry the story through to delivery.',
		description:
			'A preview article about the finishing details that connect a product with its recipient.'
	}
];

/** Only dated, published posts go live; keep labeled design previews until the first publication. */
export const getNewsPosts = (posts: NewsPost[] = newsPosts) => {
	const published = posts.filter(
		(post) => post.isPublished && post.publishedAt && Number.isFinite(Date.parse(post.publishedAt))
	);
	return published.length
		? published.sort((a, b) => Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!))
		: posts.filter((post) => post.isPreview && !post.isPublished);
};
export const visibleNewsPosts = getNewsPosts();
export const newsHighlights = visibleNewsPosts.slice(0, 6);
