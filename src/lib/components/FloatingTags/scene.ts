export type TagDepth = 'far' | 'middle' | 'near';
export type TagPlacement = {
	className: string;
	color: string;
	depth: TagDepth;
	id: string;
	rotation: [number, number, number];
};
export type TagSettings = {
	blurScale: number;
	closestDistance: number;
	maxDistance: number;
	parallaxSpeed: number;
	tagCount: number;
};

export const defaultSettings: TagSettings = {
	blurScale: 1,
	closestDistance: -80,
	maxDistance: 240,
	parallaxSpeed: 1,
	tagCount: 9
};

export const settingLimits = {
	blurScale: { min: 0, max: 40 },
	closestDistance: { min: -3000, max: 5000 },
	maxDistance: { min: 0, max: 16000 },
	parallaxSpeed: { min: 0, max: 30 },
	tagCount: { min: 0, max: 360 }
};

export const depths = {
	far: { closeness: 0, travel: 70 },
	middle: { closeness: 0.5, travel: 180 },
	near: { closeness: 1, travel: 360 }
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

export const createTags = (count: number): TagPlacement[] =>
	Array.from({ length: count }, (_, index) => {
		const seed = tags[index % tags.length];
		if (index < tags.length) return seed;
		const positions = [
			'top-1/4 left-1/4',
			'top-1/2 right-1/4',
			'bottom-12 left-1/3',
			'top-40 right-12',
			'bottom-1/4 left-12'
		];
		return {
			...seed,
			className: positions[(index - tags.length) % positions.length],
			id: `${seed.id}-${index}`,
			rotation: [seed.rotation[0], -seed.rotation[1], seed.rotation[2] + index * 7]
		};
	});

export const normalizeSettings = (value: Partial<TagSettings>): TagSettings => {
	const clamp = (input: unknown, fallback: number, min: number, max: number) =>
		typeof input === 'number' && Number.isFinite(input)
			? Math.min(max, Math.max(min, input))
			: fallback;
	const maxDistance = clamp(
		value.maxDistance,
		defaultSettings.maxDistance,
		settingLimits.maxDistance.min,
		settingLimits.maxDistance.max
	);
	return {
		blurScale: clamp(
			value.blurScale,
			defaultSettings.blurScale,
			settingLimits.blurScale.min,
			settingLimits.blurScale.max
		),
		closestDistance: clamp(
			value.closestDistance,
			defaultSettings.closestDistance,
			settingLimits.closestDistance.min,
			Math.min(settingLimits.closestDistance.max, maxDistance)
		),
		maxDistance,
		parallaxSpeed: clamp(
			value.parallaxSpeed,
			defaultSettings.parallaxSpeed,
			settingLimits.parallaxSpeed.min,
			settingLimits.parallaxSpeed.max
		),
		tagCount: Math.round(
			clamp(
				value.tagCount,
				defaultSettings.tagCount,
				settingLimits.tagCount.min,
				settingLimits.tagCount.max
			)
		)
	};
};

export const getTagFrames = (
	tag: TagPlacement,
	settings: TagSettings = defaultSettings
): Keyframe[] => {
	const { closeness, travel } = depths[tag.depth];
	const distance = -(
		settings.maxDistance +
		(settings.closestDistance - settings.maxDistance) * closeness
	);
	const filter = `blur(${closeness * 8 * settings.blurScale}px)`;
	// Keep the enlarged closest-distance range in front of the perspective's camera plane.
	const perspective = Math.max(900, -settings.closestDistance * 2);
	const [x, y, z] = tag.rotation;
	return [
		{
			filter,
			transform: `perspective(${perspective}px) translate3d(0, 0, ${distance}px) rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`
		},
		{
			filter,
			transform: `perspective(${perspective}px) translate3d(0, -${travel * settings.parallaxSpeed}px, ${distance}px) rotateX(${x + 8 * settings.parallaxSpeed}deg) rotateY(${y - 10 * settings.parallaxSpeed}deg) rotateZ(${z + 6 * settings.parallaxSpeed}deg)`
		}
	];
};
