import {
	createTagGeometry,
	createTagShape,
	createTagWorld,
	getTagSpawnBoundary,
	maxTagBodies,
	tagColors,
	tagDimensionsInches,
	tagThickness,
	tagVisualThickness,
	tagsPerSecond
} from './physics';
import { expect, it } from 'vitest';
import { defaultRainSettings, getVisualThickness } from './settings';
import { OrthographicCamera, Quaternion, Vector3 } from 'three';

it.each([0.25, 1, 3])('spawns the entire tag above the tilted camera at zoom %s', async (zoom) => {
	const settings = {
		...defaultRainSettings,
		sizeScale: 2,
		thicknessInches: 0.05,
		thicknessScale: 200
	};
	const camera = new OrthographicCamera(-8, 8, 5.25, -5.25, 0.1, 80);
	camera.zoom = zoom;
	const centerY = (10.5 * 0.42) / zoom;
	camera.position.set(0, centerY + 8, 12);
	camera.lookAt(0, centerY, 0);
	camera.updateProjectionMatrix();
	for (const sample of [0.05, 0.5, 0.95]) {
		const simulation = await createTagWorld(16, 10.5, () => sample, settings);
		try {
			simulation.setSpawnBoundary(getTagSpawnBoundary(camera, simulation.depth));
			simulation.spawn();
			const tag = simulation.tags[0];
			const position = tag.body.translation();
			const rotation = tag.body.rotation();
			const orientation = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
			for (const x of [-0.5, 0.5])
				for (const y of [-1, 1])
					for (const z of [-getVisualThickness(settings) / 2, getVisualThickness(settings) / 2]) {
						const corner = new Vector3(x, y, z)
							.multiplyScalar(tag.width)
							.applyQuaternion(orientation)
							.add(new Vector3(position.x, position.y, position.z))
							.project(camera);
						expect(corner.y).toBeGreaterThan(1);
					}
		} finally {
			simulation.destroy();
		}
	}
});

it('uses the annual production pace for emission', () => {
	expect(tagsPerSecond).toBeCloseTo(2.853881, 5);
});

it('anchors emission on the right while preserving the pile on resize', async () => {
	const simulation = await createTagWorld(20, 10.5, () => 0.65);
	simulation.setDropZone(6, 4);
	simulation.spawn();
	const tag = simulation.tags[0];
	const position = tag.body.translation();
	expect(position.x).toBeGreaterThan(4);
	expect(position.x).toBeLessThan(8);
	simulation.setWidth(10);
	expect(tag.body.translation().x).toBeCloseTo(position.x / 2);
	expect(simulation.tags).toContain(tag);
	expect(simulation.world.bodies.len()).toBe(6);
	simulation.setDropZone(3, 2);
	simulation.spawn();
	expect(simulation.tags[1].body.translation().x).toBeGreaterThan(2);
	expect(simulation.tags[1].body.translation().x).toBeLessThan(4);
	simulation.destroy();
});

it('applies gravity and bounce controls and clears tags without losing the scene boundaries', async () => {
	const simulation = await createTagWorld(6, 7);
	simulation.spawn();
	simulation.configure({ ...defaultRainSettings, gravity: 0, bounce: 0.5 });
	expect(simulation.world.gravity.y).toBeCloseTo(0);
	expect(simulation.tags[0].body.collider(0).restitution()).toBeCloseTo(0.5);
	simulation.clear();
	expect(simulation.tags).toHaveLength(0);
	expect(simulation.world.bodies.len()).toBe(5);
	simulation.spawn();
	expect(simulation.tags).toHaveLength(1);
	simulation.destroy();
});

it('extrudes the supplied stock proportions with distinct face and edge material groups', () => {
	expect(tagDimensionsInches.height / tagDimensionsInches.width).toBe(2);
	expect(tagThickness).toBeCloseTo(0.0013 / 2.625, 10);
	const geometry = createTagGeometry();
	geometry.computeBoundingBox();
	const bounds = geometry.boundingBox!;
	expect(bounds.max.z - bounds.min.z).toBeCloseTo(tagVisualThickness, 7);
	expect(bounds.min.z).toBeCloseTo(-tagVisualThickness / 2, 7);
	expect(new Set(geometry.groups.map((group) => group.materialIndex))).toEqual(new Set([0, 1]));
	geometry.dispose();
});

it('keeps the 1:2 outline, clipped top corners, and punched hole', () => {
	const shape = createTagShape();
	const points = shape.getPoints();
	expect(
		Math.max(...points.map((point) => point.x)) - Math.min(...points.map((point) => point.x))
	).toBe(1);
	expect(
		Math.max(...points.map((point) => point.y)) - Math.min(...points.map((point) => point.y))
	).toBe(2);
	expect(shape.holes).toHaveLength(1);
	expect(points.some((point) => point.x === 0.275 && point.y === 1)).toBe(true);
});

it('tumbles in three dimensions and settles flat on the floor', async () => {
	const simulation = await createTagWorld(6, 7, () => 0.65);
	simulation.spawn();
	const body = simulation.tags[0].body;
	const initialRotation = body.rotation();
	for (let index = 0; index < 1200; index++) simulation.step();
	const rotation = body.rotation();
	const normal = new Vector3(0, 0, 1).applyQuaternion(
		new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
	);
	expect(rotation).not.toEqual(initialRotation);
	expect(body.translation().y).toBeGreaterThanOrEqual(0);
	expect(body.translation().y).toBeLessThan(0.12);
	expect(Math.abs(normal.y)).toBeGreaterThan(0.85);
	expect(Math.abs(body.linvel().y)).toBeLessThan(0.1);
	simulation.destroy();
	expect(simulation.tags).toHaveLength(0);
});

it('preserves every tag beyond the old limit and freezes settled paper in the pile', async () => {
	let seed = 17;
	const random = () => {
		seed = (seed * 1664525 + 1013904223) >>> 0;
		return seed / 4294967296;
	};
	const simulation = await createTagWorld(6, 7, random);
	for (let index = 0; index < 120; index++) {
		simulation.spawn();
		for (let step = 0; step < 21; step++) simulation.step();
	}
	expect(simulation.tags).toHaveLength(120);
	expect(maxTagBodies).toBeGreaterThanOrEqual(10_000);
	expect(simulation.tags.some((tag) => tag.body.isFixed())).toBe(true);
	const settled = simulation.tags.find((tag) => tag.body.isFixed())!;
	const position = settled.body.translation();
	for (let index = 0; index < 120; index++) simulation.step();
	expect(settled.body.translation()).toEqual(position);
	expect(simulation.tags).toContain(settled);
	expect(new Set(simulation.tags.map((tag) => tag.color)).size).toBe(tagColors.length);
	expect(simulation.world.bodies.len()).toBe(simulation.tags.length + 5);
	expect(simulation.tags.every((tag) => Math.abs(tag.body.translation().z) < 2.5)).toBe(true);
	simulation.destroy();
}, 20_000);

it('includes all 20 supplied tag colors, including every fluorescent shade', () => {
	expect(tagColors).toHaveLength(20);
	expect(new Set(tagColors).size).toBe(20);
	expect(tagColors.filter((color) => color.startsWith('tag-fluorescent-'))).toHaveLength(5);
});
