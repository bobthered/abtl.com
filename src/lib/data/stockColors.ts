/** Stock names and color tokens supplied by Allen-Bailey. Keep physics imports out of the page. */
export const stockColors = [
	{
		className: 'text-tag-blue-dark',
		fanClass:
			'-rotate-20 motion-safe:group-hover:-rotate-40 motion-safe:group-focus-visible:-rotate-40',
		id: 'blue-dark',
		name: 'Blue (Dark)'
	},
	{
		className: 'text-tag-blue-light',
		fanClass:
			'-rotate-18 motion-safe:group-hover:-rotate-36 motion-safe:group-focus-visible:-rotate-36',
		id: 'blue-light',
		name: 'Blue (Light)'
	},
	{
		className: 'text-tag-brown',
		fanClass:
			'-rotate-16 motion-safe:group-hover:-rotate-32 motion-safe:group-focus-visible:-rotate-32',
		id: 'brown',
		name: 'Brown'
	},
	{
		className: 'text-tag-buff',
		fanClass:
			'-rotate-14 motion-safe:group-hover:-rotate-28 motion-safe:group-focus-visible:-rotate-28',
		id: 'buff',
		name: 'Buff'
	},
	{
		className: 'text-tag-fluorescent-green',
		fanClass:
			'-rotate-12 motion-safe:group-hover:-rotate-24 motion-safe:group-focus-visible:-rotate-24',
		id: 'fluorescent-green',
		name: 'Fluorescent Green'
	},
	{
		className: 'text-tag-fluorescent-orange',
		fanClass:
			'-rotate-10 motion-safe:group-hover:-rotate-20 motion-safe:group-focus-visible:-rotate-20',
		id: 'fluorescent-orange',
		name: 'Fluorescent Orange'
	},
	{
		className: 'text-tag-fluorescent-pink',
		fanClass:
			'-rotate-8 motion-safe:group-hover:-rotate-16 motion-safe:group-focus-visible:-rotate-16',
		id: 'fluorescent-pink',
		name: 'Fluorescent Pink'
	},
	{
		className: 'text-tag-fluorescent-red',
		fanClass:
			'-rotate-6 motion-safe:group-hover:-rotate-12 motion-safe:group-focus-visible:-rotate-12',
		id: 'fluorescent-red',
		name: 'Fluorescent Red'
	},
	{
		className: 'text-tag-fluorescent-yellow',
		fanClass:
			'-rotate-4 motion-safe:group-hover:-rotate-8 motion-safe:group-focus-visible:-rotate-8',
		id: 'fluorescent-yellow',
		name: 'Fluorescent Yellow'
	},
	{
		className: 'text-tag-gray',
		fanClass:
			'-rotate-2 motion-safe:group-hover:-rotate-4 motion-safe:group-focus-visible:-rotate-4',
		id: 'gray',
		name: 'Gray'
	},
	{
		className: 'text-tag-green-dark',
		fanClass: 'rotate-0 motion-safe:group-hover:rotate-0 motion-safe:group-focus-visible:rotate-0',
		id: 'green-dark',
		name: 'Green (Dark)'
	},
	{
		className: 'text-tag-green-light',
		fanClass: 'rotate-2 motion-safe:group-hover:rotate-4 motion-safe:group-focus-visible:rotate-4',
		id: 'green-light',
		name: 'Green (Light)'
	},
	{
		className: 'text-tag-ivory',
		fanClass: 'rotate-4 motion-safe:group-hover:rotate-8 motion-safe:group-focus-visible:rotate-8',
		id: 'ivory',
		name: 'Ivory'
	},
	{
		className: 'text-tag-lilac',
		fanClass:
			'rotate-6 motion-safe:group-hover:rotate-12 motion-safe:group-focus-visible:rotate-12',
		id: 'lilac',
		name: 'Lilac'
	},
	{
		className: 'text-tag-manila',
		fanClass:
			'rotate-8 motion-safe:group-hover:rotate-16 motion-safe:group-focus-visible:rotate-16',
		id: 'manila',
		name: 'Manila'
	},
	{
		className: 'text-tag-orange',
		fanClass:
			'rotate-10 motion-safe:group-hover:rotate-20 motion-safe:group-focus-visible:rotate-20',
		id: 'orange',
		name: 'Orange'
	},
	{
		className: 'text-tag-pink',
		fanClass:
			'rotate-12 motion-safe:group-hover:rotate-24 motion-safe:group-focus-visible:rotate-24',
		id: 'pink',
		name: 'Pink'
	},
	{
		className: 'text-tag-red',
		fanClass:
			'rotate-14 motion-safe:group-hover:rotate-28 motion-safe:group-focus-visible:rotate-28',
		id: 'red',
		name: 'Red'
	},
	{
		className: 'text-tag-salmon',
		fanClass:
			'rotate-16 motion-safe:group-hover:rotate-32 motion-safe:group-focus-visible:rotate-32',
		id: 'salmon',
		name: 'Salmon'
	},
	{
		className: 'text-tag-yellow',
		fanClass:
			'rotate-18 motion-safe:group-hover:rotate-36 motion-safe:group-focus-visible:rotate-36',
		id: 'yellow',
		name: 'Yellow'
	},
	{
		className: 'text-tag-white',
		fanClass:
			'rotate-20 motion-safe:group-hover:rotate-40 motion-safe:group-focus-visible:rotate-40',
		id: 'white',
		name: 'White'
	}
];

/** Dialog group order is independent of the decorative fan's stacking order. */
export const stockColorGroups = [
	{
		id: 'white-and-manila',
		name: 'White & Manila',
		colors: ['white', 'manila'].flatMap((id) => stockColors.filter((color) => color.id === id))
	},
	{
		id: 'colored-stocks',
		name: 'Colored stocks',
		colors: stockColors.filter(
			(color) => !['white', 'manila'].includes(color.id) && !color.id.startsWith('fluorescent-')
		)
	},
	{
		id: 'fluorescent-stocks',
		name: 'Fluorescent stocks',
		colors: stockColors.filter((color) => color.id.startsWith('fluorescent-'))
	}
];
