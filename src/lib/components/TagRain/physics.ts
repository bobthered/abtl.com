import RAPIER from '@dimforge/rapier3d-compat';
import { productionProjection } from '#lib/productionMetric.js';
import {
	AmbientLight,
	DirectionalLight,
	DoubleSide,
	Euler,
	ExtrudeGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	OrthographicCamera,
	Path,
	PCFShadowMap,
	PlaneGeometry,
	Quaternion,
	RingGeometry,
	Scene,
	ShadowMaterial,
	Shape,
	Vector3,
	WebGLRenderer
} from 'three';

export type RainTag = {
	body: RAPIER.RigidBody;
	color: number;
	phase: number;
	width: number;
};

export const maxTagBodies = 80;
export const tagColors = [
	'tag-manila',
	'tag-blue-light',
	'tag-salmon',
	'tag-buff',
	'tag-lilac',
	'tag-green-light',
	'abtl-blue-400'
];
export const tagsPerSecond =
	productionProjection.target /
	((productionProjection.endsAt - productionProjection.startsAt) / 1000);
const thickness = 0.025;
let initialization: Promise<void> | null = null;
const initializePhysics = () => (initialization ??= RAPIER.init());

export const createTagShape = () => {
	const shape = new Shape();
	shape.moveTo(-0.5, -1);
	shape.lineTo(0.5, -1);
	shape.lineTo(0.5, 0.775);
	shape.lineTo(0.275, 1);
	shape.lineTo(-0.275, 1);
	shape.lineTo(-0.5, 0.775);
	shape.closePath();
	const hole = new Path();
	hole.absarc(0, 0.63, 0.075, 0, Math.PI * 2, true);
	shape.holes.push(hole);
	return shape;
};

export const createTagWorld = async (width: number, height: number, random = Math.random) => {
	await initializePhysics();
	const world = new RAPIER.World({ x: 0, y: -3.2, z: 0 });
	world.timestep = 1 / 60;
	world.integrationParameters.numSolverIterations = 8;
	const tags: RainTag[] = [];
	const depth = Math.min(2.2, height * 0.2);
	const normal = new Vector3();
	const orientation = new Quaternion();
	let elapsed = 0;
	const fixed = (x: number, y: number, z: number, halfX: number, halfY: number, halfZ: number) => {
		const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
		world.createCollider(RAPIER.ColliderDesc.cuboid(halfX, halfY, halfZ).setFriction(0.8), body);
	};
	fixed(0, -0.12, 0, width / 2 + 1, 0.12, depth + 1);
	// Guide airborne tags, but leave room at ground level to spread flat instead of leaning on walls.
	const wallCenter = (height + 2) / 2;
	const wallHalfHeight = (height - 2) / 2;
	fixed(-width / 2 - 0.15, wallCenter, 0, 0.15, wallHalfHeight, depth);
	fixed(width / 2 + 0.15, wallCenter, 0, 0.15, wallHalfHeight, depth);
	fixed(0, wallCenter, -depth, width, wallHalfHeight, 0.15);
	fixed(0, wallCenter, depth, width, wallHalfHeight, 0.15);
	const spawn = () => {
		const size = 0.48 + random() * 0.22;
		const rotation = new Quaternion().setFromEuler(
			new Euler((random() - 0.5) * Math.PI, (random() - 0.5) * Math.PI, (random() - 0.5) * Math.PI)
		);
		const body = world.createRigidBody(
			RAPIER.RigidBodyDesc.dynamic()
				.setTranslation(
					(random() - 0.5) * Math.max(0.1, width - size * 2),
					height + size,
					(random() - 0.5) * depth * 1.2
				)
				.setRotation(rotation)
				.setLinvel((random() - 0.5) * 0.6, -0.35, (random() - 0.5) * 0.4)
				.setAngvel({
					x: (random() - 0.5) * 1.8,
					y: (random() - 0.5) * 1.2,
					z: (random() - 0.5) * 1.2
				})
				.setLinearDamping(0.35)
				.setAngularDamping(0.5)
				.setCcdEnabled(true)
		);
		// A thin convex hull matches the clipped outline; its small hole is visual only.
		const vertices: number[] = [];
		for (const z of [-thickness / 2, thickness / 2]) {
			for (const [x, y] of [
				[-0.5, -1],
				[0.5, -1],
				[0.5, 0.775],
				[0.275, 1],
				[-0.275, 1],
				[-0.5, 0.775]
			])
				vertices.push(x * size, y * size, z * size);
		}
		const collider = RAPIER.ColliderDesc.convexHull(new Float32Array(vertices))!;
		world.createCollider(collider.setMass(0.04).setFriction(0.65).setRestitution(0.02), body);
		tags.push({
			body,
			color: Math.floor(random() * tagColors.length),
			phase: random() * Math.PI * 2,
			width: size
		});
		if (tags.length > maxTagBodies) {
			const index = tags.findIndex((tag) => tag.body.translation().y < 0.8);
			const [retired] = tags.splice(index < 0 ? 0 : index, 1);
			world.removeRigidBody(retired.body);
		}
	};
	const step = () => {
		elapsed += 1 / 60;
		for (const tag of tags) {
			const { body, phase } = tag;
			const rotation = body.rotation();
			orientation.set(rotation.x, rotation.y, rotation.z, rotation.w);
			normal.set(0, 0, 1).applyQuaternion(orientation);
			if (body.isSleeping() && Math.abs(normal.y) > 0.95) continue;
			body.resetForces(false);
			body.resetTorques(false);
			if (body.translation().y < 0.9) {
				body.setLinearDamping(1.2);
				body.setAngularDamping(1.8);
				// A gentle settling torque prevents a thin sheet balancing on its edge or a wall.
				if (Math.abs(normal.y) < 0.95) {
					const direction = normal.y < 0 ? -1 : 1;
					const strength = body.mass() * 0.3;
					body.addTorque(
						{ x: -normal.z * direction * strength, y: 0, z: normal.x * direction * strength },
						true
					);
				}
				continue;
			}
			const velocity = body.linvel();
			const mass = body.mass();
			// Broadside paper catches more air than an edge-on tag, producing varied descent speeds.
			const drag = 0.35 + Math.abs(normal.y) * 1.65;
			body.addForce(
				{
					x: mass * (Math.sin(elapsed * 1.5 + phase) * 0.55 - velocity.x * 0.5),
					y: -mass * velocity.y * Math.abs(velocity.y) * drag,
					z: mass * (Math.cos(elapsed * 1.1 + phase) * 0.3 - velocity.z * 0.7)
				},
				false
			);
			body.addTorque(
				{
					x: mass * Math.sin(elapsed * 2 + phase) * 0.025,
					y: mass * Math.cos(elapsed + phase) * 0.012,
					z: mass * Math.sin(elapsed * 1.7 + phase) * 0.018
				},
				false
			);
		}
		world.step();
	};
	const destroy = () => {
		tags.length = 0;
		world.free();
	};
	return { destroy, spawn, step, tags, world };
};

export const createTagRain = async (canvas: HTMLCanvasElement) => {
	await initializePhysics();
	const renderer = new WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true,
		powerPreference: 'low-power'
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFShadowMap;
	const scene = new Scene();
	const camera = new OrthographicCamera(-3, 3, 5, -5, 0.1, 80);
	const geometry = new ExtrudeGeometry(createTagShape(), {
		depth: thickness,
		bevelEnabled: false,
		curveSegments: 12
	});
	geometry.translate(0, 0, -thickness / 2);
	const ring = new RingGeometry(0.075, 0.17, 24);
	const materials = tagColors.map(
		() => new MeshStandardMaterial({ roughness: 0.9, metalness: 0, side: DoubleSide })
	);
	const patchMaterial = new MeshStandardMaterial({ roughness: 1, side: DoubleSide });
	const floorGeometry = new PlaneGeometry(30, 4.8);
	const floorMaterial = new ShadowMaterial({ opacity: 0.12 });
	const floor = new Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = -0.002;
	floor.receiveShadow = true;
	scene.add(floor, new AmbientLight(0xffffff, 1.7));
	const light = new DirectionalLight(0xffffff, 2);
	light.position.set(-3, 12, 7);
	light.castShadow = true;
	light.shadow.mapSize.set(512, 512);
	light.shadow.camera.left = -8;
	light.shadow.camera.right = 8;
	light.shadow.camera.top = 12;
	light.shadow.camera.bottom = -8;
	light.shadow.normalBias = 0.025;
	scene.add(light);
	const meshes = new Map<number, Group>();
	let accumulator = 0;
	let frame: number | null = null;
	let height = 0;
	let isActive = false;
	let isDestroyed = false;
	let lastTime = 0;
	let lastTotal: number | null = null;
	let nextSpawn = 0;
	let pending = 0;
	let resizeVersion = 0;
	let simulationTime = 0;
	let width = 0;
	let world: Awaited<ReturnType<typeof createTagWorld>> | null = null;
	const readPalette = () => {
		const styles = getComputedStyle(canvas);
		materials.forEach((material, index) =>
			material.color.set(styles.getPropertyValue(`--color-${tagColors[index]}`).trim())
		);
		patchMaterial.color.set(styles.getPropertyValue('--color-tag-buff').trim());
	};
	const draw = () => {
		if (isDestroyed) return;
		const handles = new Set<number>();
		for (const tag of world?.tags ?? []) {
			handles.add(tag.body.handle);
			let group = meshes.get(tag.body.handle);
			if (!group) {
				group = new Group();
				const paper = new Mesh(geometry, materials[tag.color]);
				paper.castShadow = true;
				paper.receiveShadow = true;
				group.add(paper);
				for (const direction of [-1, 1]) {
					const patch = new Mesh(ring, patchMaterial);
					patch.position.set(0, 0.63, direction * (thickness / 2 + 0.001));
					group.add(patch);
				}
				group.scale.setScalar(tag.width);
				meshes.set(tag.body.handle, group);
				scene.add(group);
			}
			const position = tag.body.translation();
			const rotation = tag.body.rotation();
			group.position.set(position.x, position.y, position.z);
			group.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
		}
		for (const [handle, mesh] of meshes)
			if (!handles.has(handle)) {
				scene.remove(mesh);
				meshes.delete(handle);
			}
		renderer.render(scene, camera);
		canvas.dataset.tagCount = String(world?.tags.length ?? 0);
		canvas.dataset.renderer = 'webgl-3d';
	};
	const resize = async () => {
		const rect = canvas.getBoundingClientRect();
		const nextWidth = Math.round(rect.width);
		const nextHeight = Math.round(rect.height);
		if (width === nextWidth && height === nextHeight) return;
		width = nextWidth;
		height = nextHeight;
		const version = ++resizeVersion;
		world?.destroy();
		world = null;
		for (const mesh of meshes.values()) scene.remove(mesh);
		meshes.clear();
		if (!width || !height) return;
		renderer.setSize(width, height, false);
		const viewHeight = height < 400 ? 5.6 : 10.5;
		const viewWidth = (viewHeight * width) / height;
		camera.left = -viewWidth / 2;
		camera.right = viewWidth / 2;
		camera.top = viewHeight / 2;
		camera.bottom = -viewHeight / 2;
		camera.position.set(2, viewHeight * 0.42 + 8, 12);
		camera.lookAt(0, viewHeight * 0.42, 0);
		camera.updateProjectionMatrix();
		const nextWorld = await createTagWorld(viewWidth * 0.85, viewHeight);
		if (isDestroyed || version !== resizeVersion) {
			nextWorld.destroy();
			return;
		}
		world = nextWorld;
		pending = 0;
		readPalette();
		draw();
	};
	const tick = (time: number) => {
		frame = null;
		if (!isActive || isDestroyed) return;
		const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
		lastTime = time;
		simulationTime += delta;
		accumulator += delta;
		if (pending > 0 && simulationTime >= nextSpawn && world) {
			world.spawn();
			pending--;
			nextSpawn = Math.max(nextSpawn + 1 / tagsPerSecond, simulationTime);
		}
		while (accumulator >= 1 / 60) {
			world?.step();
			accumulator -= 1 / 60;
		}
		draw();
		frame = requestAnimationFrame(tick);
	};
	const update = (nextIsActive: boolean, total: number | null) => {
		if (nextIsActive && isActive && total !== null && lastTotal !== null)
			pending = Math.min(4, pending + Math.max(0, total - lastTotal));
		lastTotal = total;
		if (isActive === nextIsActive) return;
		isActive = nextIsActive;
		lastTime = 0;
		nextSpawn = simulationTime;
		accumulator = 0;
		pending = 0;
		if (isActive) frame = requestAnimationFrame(tick);
		else if (frame !== null) {
			cancelAnimationFrame(frame);
			frame = null;
		}
	};
	const observer = new ResizeObserver(() => {
		void resize();
	});
	const themeObserver = new MutationObserver(() => {
		readPalette();
		draw();
	});
	observer.observe(canvas);
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme']
	});
	await resize();
	return {
		update,
		destroy: () => {
			isDestroyed = true;
			if (frame !== null) cancelAnimationFrame(frame);
			observer.disconnect();
			themeObserver.disconnect();
			world?.destroy();
			geometry.dispose();
			ring.dispose();
			floorGeometry.dispose();
			floorMaterial.dispose();
			materials.forEach((material) => material.dispose());
			patchMaterial.dispose();
			light.shadow.map?.dispose();
			renderer.dispose();
			renderer.forceContextLoss();
			meshes.clear();
			scene.clear();
		}
	};
};
