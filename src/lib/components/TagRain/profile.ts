import { Path, Shape, Vector2 } from 'three';

export const tagPathBounds = { height: 473.751, width: 236.749 };
export const tagSvgFrame = { height: 474, width: 237 };

const toPatchPoint = (x: number, y: number) =>
	new Vector2((x - 23.5975) / 236.749, ((35.5338 - y) / 473.751) * 2);

export const createPatchShape = () => {
	const shape = new Shape();
	const start = toPatchPoint(39.6455, 8.60281);
	shape.moveTo(start.x, start.y);
	for (const [x, y] of [
		[39.6455, -0.0000380204],
		[7.49207, -0.0000380204],
		[7.49207, 8.60281]
	]) {
		const point = toPatchPoint(x, y);
		shape.lineTo(point.x, point.y);
	}
	for (const curve of [
		[7.49207, 12.2004, 0, 24.7136, 0, 32.3779],
		[0, 40.0423, 8.1164, 53.3376, 8.1164, 56.1531]
	]) {
		const first = toPatchPoint(curve[0], curve[1]);
		const second = toPatchPoint(curve[2], curve[3]);
		const end = toPatchPoint(curve[4], curve[5]);
		shape.bezierCurveTo(first.x, first.y, second.x, second.y, end.x, end.y);
	}
	const bottom = toPatchPoint(39.0212, 56.1531);
	shape.lineTo(bottom.x, bottom.y);
	for (const curve of [
		[39.0212, 53.3376, 47.1376, 40.0423, 47.1376, 32.3779],
		[47.1376, 24.7136, 39.6455, 12.2004, 39.6455, 8.60281]
	]) {
		const first = toPatchPoint(curve[0], curve[1]);
		const second = toPatchPoint(curve[2], curve[3]);
		const end = toPatchPoint(curve[4], curve[5]);
		shape.bezierCurveTo(first.x, first.y, second.x, second.y, end.x, end.y);
	}
	shape.closePath();
	const hole = new Path();
	const holeStart = toPatchPoint(23.5975, 46.7957);
	hole.moveTo(holeStart.x, holeStart.y);
	for (const curve of [
		[17.3903, 46.7957, 12.3594, 41.7541, 12.3594, 35.5338],
		[12.3594, 29.3147, 17.3903, 24.2719, 23.5975, 24.2719],
		[29.8022, 24.2719, 34.8356, 29.3147, 34.8356, 35.5338],
		[34.8356, 41.7541, 29.8022, 46.7957, 23.5975, 46.7957]
	]) {
		const first = toPatchPoint(curve[0], curve[1]);
		const second = toPatchPoint(curve[2], curve[3]);
		const end = toPatchPoint(curve[4], curve[5]);
		hole.bezierCurveTo(first.x, first.y, second.x, second.y, end.x, end.y);
	}
	hole.closePath();
	shape.holes.push(hole);
	return shape;
};

// Sample the curved patch once for its convex collision hull; the punched hole is visual only.
export const patchOutline = createPatchShape().getPoints(6);

// Coordinates from src/lib/assets/tag-shape.svg, normalized to the physical 1:2 stock size.
// Use the path bounds rather than the slightly larger viewBox so the paper stays centered.
const toTagPoint = (x: number, y: number) => new Vector2(x / 236.749 - 0.5, 1 - (y / 473.751) * 2);
export const tagOutline = [
	toTagPoint(0, 473.751),
	toTagPoint(236.749, 473.751),
	toTagPoint(236.749, 36.6593),
	toTagPoint(208.566, 0),
	toTagPoint(28.1844, 0),
	toTagPoint(0, 36.6593)
];
export const tagHole = {
	center: toTagPoint(117.745, 35.5908),
	radiusX: 11.274 / 236.749,
	radiusY: (11.2798 / 473.751) * 2
};

export const createTagShape = () => {
	const shape = new Shape(tagOutline);
	shape.closePath();
	const hole = new Path();
	const start = toTagPoint(117.745, 46.8706);
	hole.moveTo(start.x, start.y);
	// Reverse the SVG hole's winding for Three.js while retaining its exact cubic curves.
	for (const curve of [
		[111.518, 46.8706, 106.471, 41.8198, 106.471, 35.5908],
		[106.471, 29.3619, 111.518, 24.311, 117.745, 24.311],
		[123.973, 24.311, 129.019, 29.3619, 129.019, 35.5908],
		[129.019, 41.8198, 123.973, 46.8706, 117.745, 46.8706]
	]) {
		const first = toTagPoint(curve[0], curve[1]);
		const second = toTagPoint(curve[2], curve[3]);
		const end = toTagPoint(curve[4], curve[5]);
		hole.bezierCurveTo(first.x, first.y, second.x, second.y, end.x, end.y);
	}
	hole.closePath();
	shape.holes.push(hole);
	return shape;
};
