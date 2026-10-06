export type TagDepth = 'far' | 'middle' | 'near';
export type TagPlacement = {
	className: string;
	color: string;
	depth: TagDepth;
	id: string;
	rotation: [number, number, number];
};

export const depths = {
	far: { distance: -240, travel: 70 },
	middle: { distance: -80, travel: 180 },
	near: { distance: 80, travel: 360 }
};

export const tags: TagPlacement[] = [
	{
		id: 'blue-left',
		color: 'text-tag-blue-light',
		depth: 'near',
		className: 'top-1/2 -left-12 hidden lg:block',
		rotation: [18, -28, -24]
	},
	{
		id: 'manila-right',
		color: 'text-tag-manila',
		depth: 'near',
		className: '-right-8 -bottom-16 hidden sm:block',
		rotation: [-16, 30, 26]
	},
	{
		id: 'lilac-right',
		color: 'text-tag-lilac',
		depth: 'middle',
		className: 'top-1/4 -right-6 sm:right-12',
		rotation: [22, -24, 18]
	},
	{
		id: 'salmon-left',
		color: 'text-tag-salmon',
		depth: 'middle',
		className: 'bottom-12 -left-6 sm:left-16',
		rotation: [-20, 26, -16]
	},
	{
		id: 'green-upper',
		color: 'text-tag-green-light',
		depth: 'far',
		className: 'top-40 left-1/4 hidden sm:block',
		rotation: [26, 22, -32]
	},
	{
		id: 'blue-upper',
		color: 'text-tag-blue-dark',
		depth: 'far',
		className: 'top-48 right-1/3 hidden lg:block',
		rotation: [-24, -30, 24]
	},
	{
		id: 'yellow-lower',
		color: 'text-tag-yellow',
		depth: 'far',
		className: 'right-1/4 bottom-1/4',
		rotation: [20, 32, -20]
	},
	{
		id: 'buff-center',
		color: 'text-tag-buff',
		depth: 'far',
		className: 'top-1/2 left-1/3 hidden lg:block',
		rotation: [-18, 28, 32]
	},
	{
		id: 'pink-lower',
		color: 'text-tag-pink',
		depth: 'far',
		className: 'bottom-4 left-1/2',
		rotation: [30, -22, 12]
	}
];

export const getTagFrames = (tag: TagPlacement): Keyframe[] => {
	const { distance, travel } = depths[tag.depth];
	const [x, y, z] = tag.rotation;
	return [
		{
			transform: `perspective(900px) translate3d(0, 0, ${distance}px) rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`
		},
		{
			transform: `perspective(900px) translate3d(0, -${travel}px, ${distance}px) rotateX(${x + 8}deg) rotateY(${y - 10}deg) rotateZ(${z + 6}deg)`
		}
	];
};
