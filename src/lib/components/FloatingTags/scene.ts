export type TagDepth = 'far' | 'middle' | 'near';
export type TagPlacement = {
	className: string;
	color: string;
	depth: TagDepth;
	id: string;
	position?: [number, number];
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

const colors = [
	'text-tag-blue-dark',
	'text-tag-blue-light',
	'text-tag-brown',
	'text-tag-buff',
	'text-tag-gray',
	'text-tag-green-dark',
	'text-tag-green-light',
	'text-tag-ivory',
	'text-tag-lilac',
	'text-tag-manila',
	'text-tag-orange',
	'text-tag-pink',
	'text-tag-red',
	'text-tag-salmon',
	'text-tag-yellow',
	'text-tag-fluorescent-green',
	'text-tag-fluorescent-orange',
	'text-tag-fluorescent-pink',
	'text-tag-fluorescent-red',
	'text-tag-fluorescent-yellow'
];

// Indexed randomness keeps SSR/hydration identical and preserves positions when count changes.
const random = (index: number, channel: number): number => {
	let seed = Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(channel + 1, 0x85ebca6b);
	seed = Math.imul(seed ^ (seed >>> 16), 0x7feb352d);
	seed = Math.imul(seed ^ (seed >>> 15), 0x846ca68b);
	return ((seed ^ (seed >>> 16)) >>> 0) / 4294967296;
};

export const createTags = (count: number): TagPlacement[] => {
	const result = tags.slice(0, count);
	// Approximate anchors of the initial art-directed tags, in viewport percentages.
	const positions: [number, number][] = [
		[0, 50],
		[100, 100],
		[98, 25],
		[0, 88],
		[25, 16],
		[66, 20],
		[75, 75],
		[33, 50],
		[50, 96]
	];
	for (let index = tags.length; index < count; index += 1) {
		let bestDistance = -1;
		let position: [number, number] = [0, 0];
		// Choose the least crowded of several random candidates to avoid repeated clusters.
		for (let candidate = 0; candidate < 20; candidate += 1) {
			const point: [number, number] = [
				random(index, candidate * 2) * 96,
				12 + random(index, candidate * 2 + 1) * 84
			];
			const distance = Math.min(
				...positions.map(([x, y]) => (point[0] - x) ** 2 + (point[1] - y) ** 2)
			);
			if (distance > bestDistance) {
				bestDistance = distance;
				position = point;
			}
		}
		positions.push(position);
		const depthChoice = random(index, 41);
		result.push({
			className: 'top-0 left-0',
			color: colors[Math.floor(random(index, 42) * colors.length)],
			depth: depthChoice < 0.6 ? 'far' : depthChoice < 0.9 ? 'middle' : 'near',
			id: `floating-tag-${index}`,
			position,
			rotation: [
				random(index, 43) * 60 - 30,
				random(index, 44) * 90 - 45,
				random(index, 45) * 80 - 40
			]
		});
	}
	return result;
};

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
	const position = tag.position ? { left: `${tag.position[0]}%`, top: `${tag.position[1]}%` } : {};
	const [x, y, z] = tag.rotation;
	return [
		{
			...position,
			filter,
			transform: `perspective(${perspective}px) translate3d(0, 0, ${distance}px) rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`
		},
		{
			...position,
			filter,
			transform: `perspective(${perspective}px) translate3d(0, -${travel * settings.parallaxSpeed}px, ${distance}px) rotateX(${x + 8 * settings.parallaxSpeed}deg) rotateY(${y - 10 * settings.parallaxSpeed}deg) rotateZ(${z + 6 * settings.parallaxSpeed}deg)`
		}
	];
};
