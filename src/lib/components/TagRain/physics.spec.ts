import { createTagShape, createTagWorld, maxTagBodies, tagsPerSecond } from './physics';
import { expect, it } from 'vitest';
import { Quaternion, Vector3 } from 'three';

it('uses the annual production pace for emission', () => {
	expect(tagsPerSecond).toBeCloseTo(2.853881, 5);
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

it('caps bodies during a long visit and keeps depth within its boundaries', async () => {
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
	expect(simulation.tags.length).toBeLessThanOrEqual(maxTagBodies);
	expect(simulation.world.bodies.len()).toBe(simulation.tags.length + 5);
	expect(simulation.tags.every((tag) => Math.abs(tag.body.translation().z) < 2.5)).toBe(true);
	simulation.destroy();
}, 20_000);
