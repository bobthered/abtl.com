import blueDark from '#lib/assets/tags/photos/blue-dark.webp';
import blueLight from '#lib/assets/tags/photos/blue-warehouse.webp';
import brown from '#lib/assets/tags/photos/brown.webp';
import buff from '#lib/assets/tags/photos/buff.webp';
import fluorescentGreen from '#lib/assets/tags/photos/fluorescent-green.webp';
import fluorescentOrange from '#lib/assets/tags/photos/fluorescent-orange.webp';
import fluorescentPink from '#lib/assets/tags/photos/fluorescent-pink.webp';
import fluorescentRed from '#lib/assets/tags/photos/fluorescent-red.webp';
import fluorescentYellow from '#lib/assets/tags/photos/yellow-workshop.webp';
import gray from '#lib/assets/tags/photos/gray.webp';
import greenDark from '#lib/assets/tags/photos/green-dark.webp';
import greenLight from '#lib/assets/tags/photos/green-light.webp';
import ivory from '#lib/assets/tags/photos/ivory.webp';
import lilac from '#lib/assets/tags/photos/lilac.webp';
import manila from '#lib/assets/tags/photos/manila-parts.webp';
import orange from '#lib/assets/tags/photos/orange.webp';
import pink from '#lib/assets/tags/photos/pink.webp';
import red from '#lib/assets/tags/photos/red.webp';
import salmon from '#lib/assets/tags/photos/salmon.webp';
import white from '#lib/assets/tags/photos/white-equipment.webp';
import yellow from '#lib/assets/tags/photos/yellow.webp';
import { stockColorGroups } from './stockColors';

const photos: Record<string, { alt: string; context: string; image: string }> = {
	'blue-dark': {
		alt: 'blue dark paper tag with the supplied clipped top corners and brown reinforcement patch on a warehouse packing bench beside cartons.',
		context: 'Warehouse organization',
		image: blueDark
	},
	'blue-light': {
		alt: 'blue light paper tag with the supplied clipped top corners and brown reinforcement patch on a warehouse packing bench beside cartons.',
		context: 'Warehouse organization',
		image: blueLight
	},
	brown: {
		alt: 'brown paper tag with the supplied clipped top corners and brown reinforcement patch on a wooden maintenance bench beside tools.',
		context: 'Equipment identification',
		image: brown
	},
	buff: {
		alt: 'buff paper tag with the supplied clipped top corners and brown reinforcement patch on a wooden maintenance bench beside tools.',
		context: 'Equipment identification',
		image: buff
	},
	'fluorescent-green': {
		alt: 'fluorescent green paper tag with the supplied clipped top corners and brown reinforcement patch on a warehouse packing bench beside cartons.',
		context: 'Warehouse organization',
		image: fluorescentGreen
	},
	'fluorescent-orange': {
		alt: 'fluorescent orange paper tag with the supplied clipped top corners and brown reinforcement patch on a workshop surface beside copper fittings and a parts bin.',
		context: 'Parts identification',
		image: fluorescentOrange
	},
	'fluorescent-pink': {
		alt: 'fluorescent pink paper tag with the supplied clipped top corners and brown reinforcement patch on a potting bench beside garden materials.',
		context: 'Nursery organization',
		image: fluorescentPink
	},
	'fluorescent-red': {
		alt: 'fluorescent red paper tag with the supplied clipped top corners and brown reinforcement patch on a workshop cart beside a hose and toolbox.',
		context: 'Service organization',
		image: fluorescentRed
	},
	'fluorescent-yellow': {
		alt: 'fluorescent yellow paper tag with the supplied clipped top corners and brown reinforcement patch on a machining bench beside steel fittings.',
		context: 'Parts staging',
		image: fluorescentYellow
	},
	gray: {
		alt: 'gray paper tag with the supplied clipped top corners and brown reinforcement patch on a machining bench beside steel fittings.',
		context: 'Parts staging',
		image: gray
	},
	'green-dark': {
		alt: 'green dark paper tag with the supplied clipped top corners and brown reinforcement patch on a machining bench beside steel fittings.',
		context: 'Parts staging',
		image: greenDark
	},
	'green-light': {
		alt: 'green light paper tag with the supplied clipped top corners and brown reinforcement patch on a potting bench beside garden materials.',
		context: 'Nursery organization',
		image: greenLight
	},
	ivory: {
		alt: 'ivory paper tag with the supplied clipped top corners and brown reinforcement patch on a textile cutting table beside fabric and yarn.',
		context: 'Textile identification',
		image: ivory
	},
	lilac: {
		alt: 'lilac paper tag with the supplied clipped top corners and brown reinforcement patch on a textile cutting table beside fabric and yarn.',
		context: 'Textile identification',
		image: lilac
	},
	manila: {
		alt: 'manila paper tag with the supplied clipped top corners and brown reinforcement patch on a workshop surface beside copper fittings and a parts bin.',
		context: 'Parts identification',
		image: manila
	},
	orange: {
		alt: 'orange paper tag with the supplied clipped top corners and brown reinforcement patch on a workshop cart beside a hose and toolbox.',
		context: 'Service organization',
		image: orange
	},
	pink: {
		alt: 'pink paper tag with the supplied clipped top corners and brown reinforcement patch on a textile cutting table beside fabric and yarn.',
		context: 'Textile identification',
		image: pink
	},
	red: {
		alt: 'red paper tag with the supplied clipped top corners and brown reinforcement patch on a workshop cart beside a hose and toolbox.',
		context: 'Service organization',
		image: red
	},
	salmon: {
		alt: 'salmon paper tag with the supplied clipped top corners and brown reinforcement patch on a potting bench beside garden materials.',
		context: 'Nursery organization',
		image: salmon
	},
	white: {
		alt: 'white paper tag with the supplied clipped top corners and brown reinforcement patch on a wooden maintenance bench beside tools.',
		context: 'Equipment identification',
		image: white
	},
	yellow: {
		alt: 'yellow paper tag with the supplied clipped top corners and brown reinforcement patch on a workshop surface beside copper fittings and a parts bin.',
		context: 'Parts identification',
		image: yellow
	}
};

/** One exact SVG composite on a photographic background for each stock color, in the same order as the palette. */
export const stockPhotoExamples = stockColorGroups
	.flatMap((group) => group.colors)
	.map((color) => ({
		...photos[color.id],
		color: color.name,
		id: color.id
	}));
