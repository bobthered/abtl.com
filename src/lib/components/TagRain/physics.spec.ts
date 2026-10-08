import {
	chooseTagColor,
	createTagGeometry,
	createPatchGeometry,
	createTagShape,
	createTagWorld,
	getTagSpawnBoundary,
	maxTagBodies,
	tagColors,
	tagDimensionsInches,
	tagThickness,
	tagVisualThickness,
	tagWorldUnitsPerInch,
	tagsPerSecond
} from './physics';
import { expect, it } from 'vitest';
import { defaultRainSettings, getVisualPatchThickness, getVisualThickness } from './settings';
import { Mesh, MeshBasicMaterial, OrthographicCamera, Quaternion, Raycaster, Vector3 } from 'three';
import { createPatchShape, tagHole, tagOutline } from './profile';
import RAPIER from '@dimforge/rapier3d-compat';

// Measure the visible paper, independently of the collision-only safety margin.
const createVisiblePaperShape = (settings = defaultRainSettings) => {
	const size = tagDimensionsInches.width * tagWorldUnitsPerInch;
	const thickness = getVisualThickness(settings);
	const vertices = [-thickness / 2, thickness / 2].flatMap((z) =>
		tagOutline.flatMap(({ x, y }) => [x * size, y * size, z * size])
	);
	return RAPIER.ColliderDesc.convexHull(new Float32Array(vertices))!.shape;
};

it('extrudes the supplied patch with an open hole and the shared thickness scale', () => {
	const thickness = getVisualPatchThickness(defaultRainSettings);
	const geometry = createPatchGeometry(thickness);
	const material = new MeshBasicMaterial();
	try {
		geometry.computeBoundingBox();
		const bounds = geometry.boundingBox!;
		expect(bounds.max.z - bounds.min.z).toBeCloseTo((0.0008 / 2.625) * 50, 7);
		expect(bounds.min.z).toBeCloseTo(-thickness / 2, 7);
		expect(bounds.max.x - bounds.min.x).toBeCloseTo(47.1376 / 236.749, 7);
		expect(bounds.max.y - bounds.min.y).toBeCloseTo((56.1531380204 / 473.751) * 2, 7);
		expect(bounds.max.y + tagHole.center.y).toBeCloseTo(1, 3);
		expect(createPatchShape().holes).toHaveLength(1);
		const mesh = new Mesh(geometry, material);
		const ray = new Raycaster(new Vector3(0, 0, 1), new Vector3(0, 0, -1));
		expect(ray.intersectObject(mesh)).toHaveLength(0);
		ray.ray.origin.y = 0.12;
		expect(ray.intersectObject(mesh).length).toBeGreaterThan(0);
	} finally {
		geometry.dispose();
		material.dispose();
	}
});

it.each([0.25, 1, 3])('spawns the entire tag above the tilted camera at zoom %s', async (zoom) => {
	const settings = {
		...defaultRainSettings,
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
					for (const z of [-1, 1].map(
						(direction) =>
							direction * (getVisualThickness(settings) / 2 + getVisualPatchThickness(settings))
					)) {
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

it('keeps burst emissions separated even when random positions repeat', async () => {
	const simulation = await createTagWorld(6, 7, () => 0.5);
	try {
		for (let index = 0; index < 8; index++) simulation.spawn();
		for (let index = 1; index < simulation.tags.length; index++) {
			const previous = simulation.tags[index - 1].body.translation();
			const current = simulation.tags[index].body.translation();
			expect(current.y - previous.y).toBeGreaterThan(1.2);
		}
	} finally {
		simulation.destroy();
	}
});

it.each([1, 50])(
	'stacks thin paper without penetrating at thickness scale %s',
	async (thicknessScale) => {
		const simulation = await createTagWorld(6, 7, () => 0.5, {
			...defaultRainSettings,
			flutter: 0,
			thicknessScale
		});
		try {
			for (let index = 0; index < 2; index++) {
				simulation.spawn();
				const body = simulation.tags[index].body;
				body.setTranslation({ x: 0, y: 0.2 + index * 0.4, z: 0 }, true);
				body.setRotation(
					new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2),
					true
				);
				body.setAngvel({ x: 0, y: 0, z: 0 }, true);
			}
			for (let index = 0; index < 600; index++) simulation.step();
			const shape = createVisiblePaperShape({ ...defaultRainSettings, thicknessScale });
			const first = simulation.tags[0].body;
			const second = simulation.tags[1].body;
			const contact = shape.contactShape(
				first.translation(),
				first.rotation(),
				shape,
				second.translation(),
				second.rotation(),
				0.1
			);
			expect(contact).not.toBeNull();
			expect(contact!.distance).toBeGreaterThanOrEqual(-0.00015);
		} finally {
			simulation.destroy();
		}
	}
);

it('keeps released and newly emitted paper collidable while bypassing the restored floor', async () => {
	const simulation = await createTagWorld(6, 7, () => 0.5, {
		...defaultRainSettings,
		cleanupIntervalSeconds: 1,
		floorRemovalSeconds: 1,
		gravity: 0
	});
	try {
		simulation.spawn();
		for (let index = 0; index < 61; index++) simulation.step();
		simulation.tags[0].body.setTranslation({ x: 0, y: -0.1, z: 0 }, true);
		for (let index = 0; index < 61; index++) simulation.step();
		expect(simulation.isFloorOpen()).toBe(false);
		simulation.spawn();
		const released = simulation.tags[0].body.collider(0).collisionGroups();
		const fresh = simulation.tags[1].body.collider(0).collisionGroups();
		const floor = simulation.world.getRigidBody(0).collider(0).collisionGroups();
		const isCollisionAllowed = (first: number, second: number) =>
			((first >>> 16) & second & 0xffff) !== 0 && ((second >>> 16) & first & 0xffff) !== 0;
		expect(isCollisionAllowed(released, fresh)).toBe(true);
		expect(isCollisionAllowed(released, floor)).toBe(false);
		expect(isCollisionAllowed(fresh, floor)).toBe(true);
	} finally {
		simulation.destroy();
	}
});

it('keeps every tag at 2.625 by 5.25 inches regardless of randomized motion', async () => {
	let sample = 0.05;
	const simulation = await createTagWorld(20, 10.5, () => sample);
	try {
		for (sample of [0.05, 0.5, 0.95]) simulation.spawn();
		for (const tag of simulation.tags) {
			expect(tag.width / tagWorldUnitsPerInch).toBeCloseTo(2.625, 10);
			expect((tag.width * 2) / tagWorldUnitsPerInch).toBeCloseTo(5.25, 10);
		}
	} finally {
		simulation.destroy();
	}
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
	expect(simulation.tags[0].body.numColliders()).toBe(3);
	expect(simulation.tags[0].body.collider(1).restitution()).toBeCloseTo(0.5);
	expect(simulation.tags[0].body.collider(2).restitution()).toBeCloseTo(0.5);
	simulation.clear();
	expect(simulation.tags).toHaveLength(0);
	expect(simulation.activeTags.size).toBe(0);
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
	expect(
		points.some(
			(point) => Math.abs(point.x - (208.566 / 236.749 - 0.5)) < 0.000001 && point.y === 1
		)
	).toBe(true);
	expect(
		points.some(
			(point) => point.x === 0.5 && Math.abs(point.y - (1 - (36.6593 / 473.751) * 2)) < 0.000001
		)
	).toBe(true);
	const hole = shape.holes[0].getPoints(24);
	expect(Math.min(...hole.map((point) => point.x))).toBeCloseTo(106.471 / 236.749 - 0.5, 7);
	expect(Math.max(...hole.map((point) => point.x))).toBeCloseTo(129.019 / 236.749 - 0.5, 7);
	expect(Math.min(...hole.map((point) => point.y))).toBeCloseTo(1 - (46.8706 / 473.751) * 2, 7);
	expect(Math.max(...hole.map((point) => point.y))).toBeCloseTo(1 - (24.311 / 473.751) * 2, 7);
	expect(tagHole.center.x).toBeCloseTo(117.745 / 236.749 - 0.5, 7);
	expect(tagHole.center.y).toBeCloseTo(1 - (35.5908 / 473.751) * 2, 7);
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
	// The reinforced head can lift the resting paper slightly above the floor.
	expect(body.translation().y).toBeLessThan(0.2);
	expect(Math.abs(normal.y)).toBeGreaterThan(0.85);
	expect(Math.abs(body.linvel().y)).toBeLessThan(0.1);
	simulation.destroy();
	expect(simulation.tags).toHaveLength(0);
});

it('preserves every tag beyond the old limit and lets sleeping paper wake under new forces', async () => {
	let seed = 17;
	const random = () => {
		seed = (seed * 1664525 + 1013904223) >>> 0;
		return seed / 4294967296;
	};
	const simulation = await createTagWorld(6, 7, random, {
		...defaultRainSettings,
		cleanupIntervalSeconds: 0
	});
	for (let index = 0; index < 120; index++) {
		simulation.spawn();
		for (let step = 0; step < 21; step++) simulation.step();
	}
	expect(simulation.tags).toHaveLength(120);
	expect(maxTagBodies).toBeGreaterThanOrEqual(10_000);
	expect(simulation.tags.some((tag) => tag.body.isSleeping())).toBe(true);
	for (let index = 0; index < 120; index++) simulation.step();
	const settled = simulation.tags.find((tag) => tag.body.isSleeping())!;
	expect(settled.body.isDynamic()).toBe(true);
	expect(simulation.tags).toContain(settled);
	expect(simulation.activeTags.has(settled)).toBe(false);
	expect(simulation.activeTags.size).toBeLessThan(simulation.tags.length);
	expect(simulation.world.bodies.len()).toBe(simulation.tags.length + 5);
	expect(simulation.tags.every((tag) => Math.abs(tag.body.translation().z) < 2.5)).toBe(true);
	const position = settled.body.translation();
	const revision = simulation.getRevision();
	settled.body.applyImpulse({ x: 0.01, y: 0.01, z: 0 }, true);
	simulation.step();
	expect(simulation.activeTags.has(settled)).toBe(true);
	expect(settled.body.translation()).not.toEqual(position);
	expect(simulation.getRevision()).toBeGreaterThan(revision);
	simulation.destroy();
}, 20_000);

it('includes white stock and all 20 supplied tag colors, including every fluorescent shade', () => {
	expect(tagColors).toHaveLength(21);
	expect(new Set(tagColors).size).toBe(21);
	expect(tagColors).toContain('tag-white');
	expect(tagColors.filter((color) => color.startsWith('tag-fluorescent-'))).toHaveLength(5);
});

it.each([17, 91])(
	'settles a dense pile without intersecting paper (seed %s)',
	async (initialSeed) => {
		let seed = initialSeed;
		const random = () => {
			seed = (seed * 1664525 + 1013904223) >>> 0;
			return seed / 4294967296;
		};
		const simulation = await createTagWorld(6, 7, random, {
			...defaultRainSettings,
			cleanupIntervalSeconds: 0
		});
		try {
			simulation.setDropZone(0, 2);
			simulation.setSpawnBoundary({ height: 1.5, clearanceScale: 1 });
			for (let index = 0; index < 60; index++) {
				simulation.spawn();
				for (let step = 0; step < 21; step++) simulation.step();
			}
			for (let step = 0; step < 2400; step++) simulation.step();
			let minimumDistance = 0;
			let deepestContact = '';
			const shape = createVisiblePaperShape();
			for (let first = 0; first < simulation.tags.length; first++)
				for (let second = first + 1; second < simulation.tags.length; second++) {
					const firstBody = simulation.tags[first].body;
					const secondBody = simulation.tags[second].body;
					const contact = shape.contactShape(
						firstBody.translation(),
						firstBody.rotation(),
						shape,
						secondBody.translation(),
						secondBody.rotation(),
						0
					);
					if (contact && contact.distance < minimumDistance) {
						minimumDistance = contact.distance;
						deepestContact = JSON.stringify(
							[first, second].map((index) => ({
								index,
								position: simulation.tags[index].body.translation(),
								isSleeping: simulation.tags[index].body.isSleeping(),
								rotation: simulation.tags[index].body.rotation()
							}))
						);
					}
				}
			expect(simulation.tags.every((tag) => tag.body.isDynamic())).toBe(true);
			expect(simulation.tags.every((tag) => tag.body.translation().y < 1.5)).toBe(true);
			expect(simulation.tags.some((tag) => tag.body.isSleeping())).toBe(true);
			expect(minimumDistance, deepestContact).toBeGreaterThanOrEqual(-0.00015);
		} finally {
			simulation.destroy();
		}
	},
	30_000
);

it('allocates 75% of stock selections to white and splits 25% evenly across other colors', () => {
	const counts = Array.from({ length: tagColors.length }, () => 0);
	const sampleCount = 8000;
	for (let index = 0; index < sampleCount; index++)
		counts[chooseTagColor(() => (index + 0.5) / sampleCount)]++;
	for (const [index, color] of tagColors.entries())
		expect(counts[index]).toBe(color === 'tag-white' ? 6000 : 100);
	expect(chooseTagColor(() => 0)).toBe(0);
	expect(chooseTagColor(() => 1 - Number.EPSILON)).toBe(tagColors.length - 1);
});

it('uses weighted stock selection when spawning tags', async () => {
	const simulation = await createTagWorld(20, 10.5, () => 0.5);
	try {
		simulation.spawn();
		expect(tagColors[simulation.tags[0].color]).toBe('tag-white');
	} finally {
		simulation.destroy();
	}
});

it('visibly accelerates even broadside paper under gravity during the fall', async () => {
	const simulation = await createTagWorld(20, 30, () => 0.5);
	try {
		simulation.spawn();
		const { body } = simulation.tags[0];
		body.setTranslation({ x: 0, y: 20, z: 0 }, true);
		body.setRotation(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2), true);
		body.setAngvel({ x: 0, y: 0, z: 0 }, true);
		const speeds: number[] = [];
		for (let sample = 0; sample < 3; sample++) {
			for (let step = 0; step < 30; step++) simulation.step();
			speeds.push(-body.linvel().y);
		}
		expect(speeds[1] - speeds[0]).toBeGreaterThan(0.5);
		expect(speeds[2] - speeds[1]).toBeGreaterThan(0.3);
		expect(body.translation().y).toBeLessThan(18);
	} finally {
		simulation.destroy();
	}
});

it('releases the floor after 30 seconds and restores it after two seconds', async () => {
	const simulation = await createTagWorld(6, 7, () => 0.5);
	try {
		simulation.spawn();
		const tag = simulation.tags[0];
		for (let index = 0; index < 1799; index++) simulation.step();
		expect(simulation.isFloorOpen()).toBe(false);
		expect(tag.body.isSleeping()).toBe(true);
		expect(simulation.activeTags.size).toBe(0);
		// The settled pile leaves without an artificial sideways impulse.
		for (let index = 0; index < 2; index++) simulation.step();
		expect(simulation.isFloorOpen()).toBe(true);
		expect(tag.body.isDynamic()).toBe(true);
		expect(tag.body.linvel().y).toBeLessThan(0);
		expect(Math.abs(tag.body.linvel().x)).toBeLessThan(0.01);
		const startY = tag.body.translation().y;
		for (let index = 0; index < 30; index++) simulation.step();
		expect(tag.body.translation().y).toBeLessThan(startY - 0.3);
		expect(simulation.tags).toContain(tag);
		for (let index = 0; index < 300; index++) simulation.step();
		expect(simulation.tags).toHaveLength(0);
		expect(simulation.activeTags.size).toBe(0);
		expect(simulation.world.bodies.len()).toBe(5);
		expect(simulation.world.colliders.len()).toBe(5);
		expect(simulation.isFloorOpen()).toBe(false);
		simulation.spawn();
		expect(simulation.tags).toHaveLength(1);
	} finally {
		simulation.destroy();
	}
});

it('supports shorter release intervals, disabling releases, and clearing while the floor is open', async () => {
	const simulation = await createTagWorld(6, 7, () => 0.5, {
		...defaultRainSettings,
		cleanupIntervalSeconds: 0
	});
	try {
		simulation.spawn();
		for (let index = 0; index < 3700; index++) simulation.step();
		expect(simulation.tags).toHaveLength(1);
		expect(simulation.isFloorOpen()).toBe(false);
		simulation.configure({ ...defaultRainSettings, cleanupIntervalSeconds: 6 });
		for (let index = 0; index < 361; index++) simulation.step();
		expect(simulation.isFloorOpen()).toBe(true);
		simulation.spawn();
		expect(simulation.tags).toHaveLength(2);
		simulation.clear();
		expect(simulation.isFloorOpen()).toBe(false);
		expect(simulation.world.bodies.len()).toBe(5);
		simulation.spawn();
		expect(simulation.tags[0].body.collider(0).collisionGroups()).toBe(0x00010003);
	} finally {
		simulation.destroy();
	}
});

it('keeps emitting through the removal period and catches airborne tags when the floor returns', async () => {
	const simulation = await createTagWorld(6, 7, () => 0.5, {
		...defaultRainSettings,
		cleanupIntervalSeconds: 1,
		floorRemovalSeconds: 1
	});
	try {
		simulation.spawn();
		const departing = simulation.tags[0];
		departing.body.setTranslation({ x: 0, y: 0.03, z: 0 }, true);
		departing.body.setRotation(
			new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2),
			true
		);
		for (let index = 0; index < 61; index++) simulation.step();
		expect(simulation.isFloorOpen()).toBe(true);
		simulation.configure({
			...defaultRainSettings,
			cleanupIntervalSeconds: 0,
			floorRemovalSeconds: 1
		});
		for (let index = 0; index < 30; index++) simulation.step();
		simulation.spawn();
		const arriving = simulation.tags[1];
		arriving.body.setTranslation({ x: 0, y: 2, z: 0 }, true);
		arriving.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
		for (let index = 0; index < 30; index++) simulation.step();
		expect(simulation.isFloorOpen()).toBe(false);
		expect(arriving.body.translation().y).toBeGreaterThan(0);
		for (let index = 0; index < 900; index++) simulation.step();
		expect(simulation.tags).not.toContain(departing);
		expect(simulation.tags).toContain(arriving);
		expect(arriving.body.translation().y).toBeGreaterThan(0);
		expect(arriving.body.translation().y).toBeLessThan(0.2);
		expect(arriving.body.isSleeping()).toBe(true);
	} finally {
		simulation.destroy();
	}
});

it('uses the configured removal duration even with no pile and accepts continuous emissions', async () => {
	const simulation = await createTagWorld(6, 7, () => 0.5, {
		...defaultRainSettings,
		cleanupIntervalSeconds: 1,
		floorRemovalSeconds: 2,
		gravity: 0
	});
	try {
		while (!simulation.isFloorOpen()) simulation.step();
		expect(simulation.isFloorOpen()).toBe(true);
		for (let index = 0; index < 119; index++) {
			if (index % 6 === 0) simulation.spawn();
			simulation.step();
		}
		expect(simulation.tags).toHaveLength(20);
		expect(simulation.isFloorOpen()).toBe(true);
		simulation.step();
		expect(simulation.isFloorOpen()).toBe(false);
		for (let index = 0; index < 59; index++) simulation.step();
		expect(simulation.isFloorOpen()).toBe(false);
	} finally {
		simulation.destroy();
	}
});

it('absorbs a paper landing without a visible rebound', async () => {
	const simulation = await createTagWorld(6, 7, () => 0.5, {
		...defaultRainSettings,
		cleanupIntervalSeconds: 0
	});
	try {
		simulation.spawn();
		const body = simulation.tags[0].body;
		body.setTranslation({ x: 0, y: 0.4, z: 0 }, true);
		body.setRotation(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2), true);
		body.setLinvel({ x: 0, y: -3, z: 0 }, true);
		body.setAngvel({ x: 0, y: 0, z: 0 }, true);
		let isLanded = false;
		let highestRebound = 0;
		for (let index = 0; index < 600; index++) {
			simulation.step();
			const height = body.translation().y;
			isLanded ||= height < 0.08;
			if (isLanded) highestRebound = Math.max(highestRebound, height);
		}
		expect(isLanded).toBe(true);
		expect(highestRebound).toBeLessThan(0.1);
		expect(body.isSleeping()).toBe(true);
	} finally {
		simulation.destroy();
	}
});

it.each([0, Math.PI / 4])(
	'lets a tilted tag crossing the returning floor finish falling (angle %s)',
	async (angle) => {
		const simulation = await createTagWorld(6, 7, () => 0.5, {
			...defaultRainSettings,
			cleanupIntervalSeconds: 1,
			floorRemovalSeconds: 0.1,
			flutter: 0,
			gravity: 0
		});
		try {
			simulation.spawn();
			while (!simulation.isFloorOpen()) simulation.step();
			for (let index = 0; index < 5; index++) simulation.step();
			expect(simulation.isFloorOpen()).toBe(true);
			const tag = simulation.tags[0];
			// Its center is above the floor, but its lower edge crosses the floor volume.
			tag.body.setTranslation({ x: 0, y: 0.2, z: 0 }, true);
			tag.body.setRotation(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), angle), true);
			tag.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
			tag.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
			simulation.step();
			expect(simulation.isFloorOpen()).toBe(false);
			expect(tag.body.translation().y).toBeCloseTo(0.2, 6);
			for (let index = 0; index < tag.body.numColliders(); index++)
				expect(tag.body.collider(index).collisionGroups()).toBe(0x00020003);
			simulation.configure({ ...defaultRainSettings, cleanupIntervalSeconds: 0 });
			for (let index = 0; index < 300; index++) simulation.step();
			expect(simulation.tags).not.toContain(tag);
		} finally {
			simulation.destroy();
		}
	}
);

it('checks patch clearance as well as paper before restoring the floor', async () => {
	const simulation = await createTagWorld(6, 7, () => 0.5, {
		...defaultRainSettings,
		cleanupIntervalSeconds: 1,
		floorRemovalSeconds: 0.1,
		flutter: 0,
		gravity: 0
	});
	try {
		simulation.spawn();
		while (!simulation.isFloorOpen()) simulation.step();
		for (let index = 0; index < 5; index++) simulation.step();
		const body = simulation.tags[0].body;
		body.setTranslation({ x: 0, y: 0.02, z: 0 }, true);
		body.setRotation(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2), true);
		body.setLinvel({ x: 0, y: 0, z: 0 }, true);
		body.setAngvel({ x: 0, y: 0, z: 0 }, true);
		simulation.world.propagateModifiedBodyPositionsToColliders();
		const floor = simulation.world.getRigidBody(0).collider(0);
		expect(floor.contactCollider(body.collider(0), 0.002)).toBeNull();
		expect(
			[1, 2].some((index) => floor.contactCollider(body.collider(index), 0.002) !== null)
		).toBe(true);
		simulation.step();
		expect(simulation.isFloorOpen()).toBe(false);
		expect(body.collider(0).collisionGroups()).toBe(0x00020003);
		expect(body.translation().y).toBeCloseTo(0.02, 6);
	} finally {
		simulation.destroy();
	}
});
