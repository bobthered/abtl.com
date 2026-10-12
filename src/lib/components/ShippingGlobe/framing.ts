import { Box3, MathUtils, Matrix4, Quaternion, Vector3 } from 'three';

// Face the midpoint of the connection toward the viewer, so distant endpoints
// remain on the visible hemisphere instead of centering only the destination.
export const frameShippingRoute = (
	points: readonly Vector3[],
	origin: Vector3,
	destination: Vector3,
	width: number,
	height: number,
	fov = 40,
	distance = 3.85
) => {
	const midpoint = origin.clone().normalize().add(destination.clone().normalize()).normalize();
	const rotation = new Quaternion()
		.setFromRotationMatrix(new Matrix4().lookAt(midpoint, new Vector3(), new Vector3(0, 1, 0)))
		.invert();
	const rotatedPoints = points.map((point) => point.clone().applyQuaternion(rotation));
	const position = new Box3().setFromPoints(rotatedPoints).getCenter(new Vector3());
	position.z = distance;
	const padding = Math.min(56, Math.min(width, height) * 0.16);
	const horizontalLimit = 1 - (padding * 2) / width;
	const verticalLimit = 1 - (padding * 2) / height;
	const focalLength = 1 / Math.tan(MathUtils.degToRad(fov / 2));
	let horizontalExtent = 0;
	let verticalExtent = 0;
	for (const point of rotatedPoints) {
		const depth = distance - point.z;
		horizontalExtent = Math.max(
			horizontalExtent,
			(Math.abs(point.x - position.x) * focalLength) / depth / (width / height)
		);
		verticalExtent = Math.max(
			verticalExtent,
			(Math.abs(point.y - position.y) * focalLength) / depth
		);
	}
	// Let nearby destinations fill the view too; a fixed zoom cap makes short
	// connections such as Canada look distant despite ample space in the canvas.
	const zoom = Math.min(
		horizontalLimit / Math.max(horizontalExtent, 0.001),
		verticalLimit / Math.max(verticalExtent, 0.001)
	);
	return { position, rotation, zoom };
};
