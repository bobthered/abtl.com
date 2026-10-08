import { expect, it } from 'vitest';
import RAPIER from '@dimforge/rapier3d-compat';
import {
	clothParticleCount,
	clothRestPositions,
	clothWeightsAt,
	createClothArtworkGeometry,
	maxActiveClothTags,
	prepareClothGeometry
} from './cloth';
import { createTagGeometry, createTagWorld } from './physics';
import { defaultRainSettings } from './settings';

it('rests on support above the original floor and releases the resting tag with the floor cycle', async () => {
	const world = await createTagWorld(
		8,
		4,
		() => 0.6,
		{ ...defaultRainSettings, cleanupIntervalSeconds: 8 },
		[],
		true
	);
	try {
		const platform = world.world.createRigidBody(
			RAPIER.RigidBodyDesc.fixed().setTranslation(0, 2, 0)
		);
		world.world.createCollider(
			RAPIER.ColliderDesc.cuboid(5, 0.1, 3).setCollisionGroups(0x00010001),
			platform
		);
		world.spawn();
		for (let step = 0; step < 360; step++) world.step();
		const tag = world.tags[0];
		expect(tag.body.translation().y).toBeGreaterThan(1.5);
		expect(tag.body.isFixed()).toBe(true);
		expect(tag.cloth).toBeUndefined();
		const position = tag.body.translation();
		const rotation = tag.body.rotation();
		for (let step = 0; step < 90; step++) world.step();
		expect(tag.body.translation()).toEqual(position);
		expect(tag.body.rotation()).toEqual(rotation);
		world.world.removeRigidBody(platform);
		for (let step = 0; step < 31; step++) world.step();
		expect(world.isFloorOpen()).toBe(true);
		expect(tag.body.isDynamic()).toBe(true);
	} finally {
		world.destroy();
	}
});

it('uses identical face triangles for paper and ink to prevent bent-surface flicker', () => {
	const source = createTagGeometry();
	const paper = prepareClothGeometry(source, 1);
	const ink = createClothArtworkGeometry(paper, 1);
	try {
		const positions = paper.getAttribute('position');
		const normals = paper.getAttribute('normal');
		let inkIndex = 0;
		for (let index = 0; index < positions.count; index++) {
			if (normals.getZ(index) < 0.99) continue;
			expect(ink.getAttribute('position').getX(inkIndex)).toBe(positions.getX(index));
			expect(ink.getAttribute('position').getY(inkIndex)).toBe(positions.getY(index));
			inkIndex++;
		}
		expect(inkIndex).toBe(ink.getAttribute('position').count);
	} finally {
		source.dispose();
		paper.dispose();
		ink.dispose();
	}
});

it('maps the exact clipped outline to the cloth without changing the stock dimensions', () => {
	for (let particle = 0; particle < clothParticleCount; particle++) {
		const x = clothRestPositions[particle * 3];
		const y = clothRestPositions[particle * 3 + 1];
		const { indices, weights } = clothWeightsAt(x, y);
		expect(weights.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
		expect(
			indices.reduce(
				(sum, index, corner) => sum + clothRestPositions[index * 3] * weights[corner],
				0
			)
		).toBeCloseTo(x);
	}
});

it('simulates bending paper, keeps a bounded cloth budget, and clears all soft bodies', async () => {
	const world = await createTagWorld(
		8,
		4,
		() => 0.6,
		{ ...defaultRainSettings, cleanupIntervalSeconds: 0 },
		[],
		true
	);
	try {
		world.spawn();
		const tag = world.tags[0];
		expect(tag.cloth!.numParticles()).toBe(clothParticleCount);
		const initial = tag.cloth!.centerOfMass().y;
		expect(tag.body.translation().y).toBeCloseTo(initial, 1);
		// A local impulse should deform the surface, rather than rotate an entirely rigid plane.
		tag.cloth!.applyParticleImpulse(0, { x: 0, y: 0, z: 0.002 }, true);
		for (let step = 0; step < 60; step++) world.step();
		expect(tag.cloth!.centerOfMass().y).toBeLessThan(initial);
		expect(Array.from(tag.clothPositions!).every(Number.isFinite)).toBe(true);
		const positions = tag.clothPositions!;
		const a = [positions[0], positions[1], positions[2]];
		const b = [positions[6], positions[7], positions[8]];
		const c = [positions[63], positions[64], positions[65]];
		const normal = [
			(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
			(b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
			(b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
		];
		const distances = Array.from({ length: clothParticleCount }, (_, index) =>
			Math.abs(
				normal.reduce(
					(sum, value, axis) => sum + value * (positions[index * 3 + axis] - a[axis]),
					0
				)
			)
		);
		expect(Math.max(...distances)).toBeGreaterThan(0.00001);
		for (let index = 0; index < maxActiveClothTags + 3; index++) world.spawn();
		expect(world.tags.filter((tag) => tag.cloth).length).toBe(maxActiveClothTags);
		expect(world.tags[0].cloth).toBeUndefined();
		expect(world.tags[0].clothPositions).toBeDefined();
		world.clear();
		expect(world.world.bodies.len()).toBe(5);
	} finally {
		world.destroy();
	}
});

it('runs a complete floor-clearing cycle with bounded cloth work', async () => {
	let seed = 1234;
	const random = () => {
		seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
		return seed / 4294967296;
	};
	const world = await createTagWorld(8, 4, random, defaultRainSettings, [], true);
	const start = performance.now();
	let emission = 0;
	let maximum = 0;
	try {
		for (let step = 0; step < 40 * 60; step++) {
			emission += defaultRainSettings.tagsPerSecond / 60;
			while (emission >= 1) {
				world.spawn();
				emission--;
			}
			world.step();
			maximum = Math.max(maximum, world.tags.filter((tag) => tag.cloth).length);
		}
		expect(maximum).toBeLessThanOrEqual(maxActiveClothTags);
		expect(world.tags.length).toBeLessThan(40 * defaultRainSettings.tagsPerSecond);
		expect(
			world.tags.every((tag) => Array.from(tag.clothPositions ?? []).every(Number.isFinite))
		).toBe(true);
		console.info(
			`Cloth cycle CPU: ${((performance.now() - start) / (40 * 60)).toFixed(2)} ms/step; peak ${maximum} cloth tags; ${world.tags.length} remaining`
		);
	} finally {
		world.destroy();
	}
}, 60000);

it('lets cloth straddling the restored floor depart without being clipped', async () => {
	const world = await createTagWorld(
		8,
		4,
		() => 0.6,
		{ ...defaultRainSettings, cleanupIntervalSeconds: 0.1, floorRemovalSeconds: 0.1 },
		[],
		true
	);
	try {
		for (let step = 0; step < 7; step++) world.step();
		world.spawn();
		const tag = world.tags[0];
		const centerY = tag.cloth!.centerOfMass().y;
		for (let particle = 0; particle < clothParticleCount; particle++) {
			const position = tag.cloth!.particlePosition(particle);
			tag.cloth!.setParticlePosition(particle, {
				...position,
				y: position.y - centerY
			});
		}
		for (let step = 0; step < 6; step++) world.step();
		expect(world.isFloorOpen()).toBe(false);
		expect(tag.cloth).toBeUndefined();
		expect(tag.body.collider(0).collisionGroups()).toBe(0x00020003);
	} finally {
		world.destroy();
	}
});
