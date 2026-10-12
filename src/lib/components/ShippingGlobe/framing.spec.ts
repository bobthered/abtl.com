import { PerspectiveCamera, Vector3 } from 'three';
import { expect, test } from 'vitest';
import { frameShippingRoute } from './framing';
import { globePosition } from './geometry';
import { internationalLocations, shippingOrigin } from './shippingLocations';

const origin = new Vector3(...globePosition(shippingOrigin.latitude, shippingOrigin.longitude));

test.each([
	[320, 320],
	[280, 384],
	[768, 384],
	[384, 768]
])('fits every international connection inside a %i by %i canvas', (width, height) => {
	for (const location of internationalLocations) {
		const destination = new Vector3(...globePosition(location.latitude, location.longitude));
		const points = Array.from({ length: 81 }, (_, index) => {
			const progress = index / 80;
			return origin
				.clone()
				.lerp(destination, progress)
				.normalize()
				.multiplyScalar(
					1.015 + Math.sin(progress * Math.PI) * Math.min(0.48, origin.angleTo(destination) * 0.24)
				);
		});
		const framing = frameShippingRoute(points, origin, destination, width, height);
		const camera = new PerspectiveCamera(40, width / height, 0.1, 20);
		camera.position.copy(framing.position);
		camera.lookAt(camera.position.x, camera.position.y, 0);
		camera.zoom = framing.zoom;
		camera.updateMatrixWorld();
		camera.updateProjectionMatrix();
		expect(framing.zoom).toBeGreaterThan(0);
		if (location.country === 'CA') {
			const projectedOrigin = origin
				.clone()
				.multiplyScalar(1.025)
				.applyQuaternion(framing.rotation)
				.project(camera);
			const projectedDestination = destination
				.clone()
				.multiplyScalar(1.014)
				.applyQuaternion(framing.rotation)
				.project(camera);
			// A nearby connection should use the available space, not hit a global zoom cap.
			expect(
				Math.max(
					Math.abs(projectedOrigin.x - projectedDestination.x),
					Math.abs(projectedOrigin.y - projectedDestination.y)
				)
			).toBeGreaterThan(1.2);
		}
		for (const point of [
			...points,
			origin.clone().multiplyScalar(1.025),
			destination.clone().multiplyScalar(1.014)
		]) {
			const projected = point.clone().applyQuaternion(framing.rotation).project(camera);
			// Leave room for the endpoint rings, rather than merely fitting their centers.
			expect(Math.abs(projected.x), location.name).toBeLessThanOrEqual(1 - 32 / width);
			expect(Math.abs(projected.y), location.name).toBeLessThanOrEqual(1 - 32 / height);
		}
		for (const point of [origin, destination]) {
			const rotated = point.clone().applyQuaternion(framing.rotation);
			expect(rotated.dot(camera.position.clone().sub(rotated)), location.name).toBeGreaterThan(0);
		}
	}
});
