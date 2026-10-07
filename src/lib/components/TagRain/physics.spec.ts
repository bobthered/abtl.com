import {
	createTagGeometry,
	createTagShape,
	createTagWorld,
	maxTagBodies,
	tagColors,
	tagDimensionsInches,
	tagThickness,
	tagVisualThickness,
	tagsPerSecond
} from './physics';
import { expect, it } from 'vitest';
import { defaultRainSettings } from './settings';
import { Quaternion, Vector3 } from 'three';

it('uses the annual production pace for emission', () => {
	expect(tagsPerSecond).toBeCloseTo(2.853881, 5);
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
