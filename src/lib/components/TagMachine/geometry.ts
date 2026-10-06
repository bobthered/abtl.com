export type Point = [number, number, number];

/** Join the end caps at their projected tangents, rather than at a horizontal diameter. */
export const cylinderSide = (x: number, y: number, z: number, radius: number, depth: number) => {
	const tangentAngle = Math.atan2(-0.62, 0.86 * 0.4 + 0.32 * 0.62);
	const arc = (offset: number, isReversed: boolean) =>
		Array.from({ length: 33 }, (_, index): Point => {
			const fraction = isReversed ? 1 - index / 32 : index / 32;
			const angle = tangentAngle + fraction * Math.PI;
			return [x + Math.cos(angle) * radius, y + offset, z + Math.sin(angle) * radius];
		});
	return polygon([...arc(0, false), ...arc(depth, true)]);
};

export const disc = (x: number, y: number, z: number, radius: number) =>
	polygon(
		Array.from({ length: 32 }, (_, index): Point => {
			const angle = (index / 32) * Math.PI * 2;
			return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, z];
		})
	);

/** A fixed isometric camera, shared by every machine surface and moving part. */
export const project = ([x, y, z]: Point): [number, number] => [
	105 + x * 0.86 - y * 0.62,
	170 + x * 0.32 + y * 0.4 - z
];

export const polygon = (points: Point[]) =>
	points.map((point, index) => `${index ? 'L' : 'M'}${project(point).join(' ')}`).join(' ') + 'Z';

export const box = (
	x: number,
	y: number,
	z: number,
	width: number,
	depth: number,
	height: number
) => [
	polygon([
		[x, y + depth, z],
		[x + width, y + depth, z],
		[x + width, y + depth, z + height],
		[x, y + depth, z + height]
	]),
	polygon([
		[x + width, y, z],
		[x + width, y + depth, z],
		[x + width, y + depth, z + height],
		[x + width, y, z + height]
	]),
	polygon([
		[x, y, z + height],
		[x + width, y, z + height],
		[x + width, y + depth, z + height],
		[x, y + depth, z + height]
	])
];

export const ring = (x: number, y: number, z: number, radius: number) =>
	polygon(
		Array.from({ length: 48 }, (_, index): Point => {
			const angle = (index / 48) * Math.PI * 2;
			return [x + Math.cos(angle) * radius, y, z + Math.sin(angle) * radius];
		})
	);

export const tag = (x: number, y: number, z: number) =>
	polygon([
		[x + 5, y, z],
		[x + 25, y, z],
		[x + 30, y + 5, z],
		[x + 30, y + 60, z],
		[x, y + 60, z],
		[x, y + 5, z]
	]);
