import equipment from '#lib/assets/tags/photos/white-equipment.webp';
import nursery from '#lib/assets/tags/photos/backgrounds/nursery.webp';
import packing from '#lib/assets/tags/photos/backgrounds/packing.webp';
import parts from '#lib/assets/tags/photos/manila-parts.webp';
import textile from '#lib/assets/tags/photos/backgrounds/textile.webp';
import warehouse from '#lib/assets/tags/photos/blue-warehouse.webp';

// Preview content only. Replace with approved customer names, photography and stories.
export const stories = [
	{
		id: 'equipment',
		image: equipment,
		alt: 'White inspection tag attached to equipment',
		category: 'Equipment & service',
		title: 'Every inspection has a story.',
		description:
			'A preview of how a customer could use inspection tags to keep service details with their equipment.'
	},
	{
		id: 'nursery',
		image: nursery,
		alt: 'Plant nursery setting for a customer story preview',
		category: 'Nursery & garden',
		title: 'A little detail. A growing connection.',
		description:
			'A preview story about identifying plants and helping their next owner care for them.'
	},
	{
		id: 'warehouse',
		image: warehouse,
		alt: 'Blue tag in a warehouse setting',
		category: 'Warehousing & logistics',
		title: 'Keep the next move in sight.',
		description:
			'A preview story about tags that help teams recognize, organize and move inventory.'
	},
	{
		id: 'textile',
		image: textile,
		alt: 'Textile setting for a customer story preview',
		category: 'Retail & textiles',
		title: 'Make the first impression count.',
		description: 'A preview story about bringing a brand and its product details together on a tag.'
	},
	{
		id: 'parts',
		image: parts,
		alt: 'Manila tag identifying parts',
		category: 'Parts & manufacturing',
		title: 'The right details, right where they belong.',
		description:
			'A preview story about keeping identification with a part as it moves through production.'
	},
	{
		id: 'packing',
		image: packing,
		alt: 'Packing setting for a customer story preview',
		category: 'Packaging & fulfillment',
		title: 'Carry the story through to delivery.',
		description:
			'A preview story about the finishing details that connect a product with its recipient.'
	}
];
