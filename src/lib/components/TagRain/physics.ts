import RAPIER from '@dimforge/rapier3d-compat';
import {
	defaultRainSettings,
	getVisualThickness,
	normalizeRainSettings,
	tagDimensionsInches
} from './settings';
import type { TagRainSettings } from './settings';
export { tagDimensionsInches, tagsPerSecond } from './settings';
import {
	AmbientLight,
	Color,
	DirectionalLight,
	DoubleSide,
	DynamicDrawUsage,
	Euler,
	ExtrudeGeometry,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshStandardMaterial,
	Object3D,
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
	restingSteps: number;
	width: number;
};

// Roughly an hour of continuous production; reaching capacity preserves the entire pile.
export const maxTagBodies = 10_000;
export const tagColors = [
	'tag-blue-dark',
	'tag-blue-light',
	'tag-brown',
	'tag-buff',
	'tag-fluorescent-green',
	'tag-fluorescent-orange',
	'tag-fluorescent-pink',
	'tag-fluorescent-red',
	'tag-fluorescent-yellow',
	'tag-gray',
	'tag-green-dark',
	'tag-green-light',
	'tag-ivory',
	'tag-lilac',
	'tag-manila',
	'tag-orange',
	'tag-pink',
	'tag-red',
	'tag-salmon',
	'tag-yellow'
];
export const tagThickness = tagDimensionsInches.thickness / tagDimensionsInches.width;
// True-scale stock is subpixel in this hero. Exaggerate only depth so its edge remains visible.
export const tagVisualThicknessScale = 50;
export const tagVisualThickness = tagThickness * tagVisualThicknessScale;
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

export const createTagGeometry = (thickness = tagVisualThickness) => {
	const geometry = new ExtrudeGeometry(createTagShape(), {
		depth: thickness,
		bevelEnabled: false,
		curveSegments: 12
	});
	geometry.translate(0, 0, -thickness / 2);
	return geometry;
};

export const getTagSpawnBoundary = (camera: OrthographicCamera, depth: number) => {
	camera.updateMatrixWorld();
	const top = new Vector3(0, 1, 0).unproject(camera);
	const direction = camera.getWorldDirection(new Vector3());
	const slope = direction.y / direction.z;
	// The tilted camera sees higher at the back of the scene. Account for the entire depth.
	return {
		clearanceScale: Math.hypot(1, slope),
		height: top.y - top.z * slope + Math.abs(depth * slope) + 0.5
	};
};

export const createTagWorld = async (
	width: number,
	height: number,
	random = Math.random,
	initialSettings = defaultRainSettings
) => {
	await initializePhysics();
	let settings = normalizeRainSettings(initialSettings);
	const world = new RAPIER.World({ x: 0, y: -settings.gravity, z: 0 });
	world.timestep = 1 / 60;
	world.integrationParameters.numSolverIterations = 8;
	const tags: RainTag[] = [];
	const depth = Math.min(2.2, height * 0.2);
	const normal = new Vector3();
	const orientation = new Quaternion();
	let boundaryWidth = width;
	let dropCenter = 0;
	let dropWidth = width;
	let elapsed = 0;
	let spawnBoundary = { clearanceScale: 1, height };
	const fixed = (x: number, y: number, z: number, halfX: number, halfY: number, halfZ: number) => {
		const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
		world.createCollider(RAPIER.ColliderDesc.cuboid(halfX, halfY, halfZ).setFriction(0.8), body);
		return body;
	};
	const floor = fixed(0, -0.12, 0, width / 2 + 1, 0.12, depth + 1);
	// Guide airborne tags, but leave room at ground level to spread flat instead of leaning on walls.
	const wallCenter = (height + 2) / 2;
	const wallHalfHeight = (height - 2) / 2;
	const leftWall = fixed(-width / 2 - 0.15, wallCenter, 0, 0.15, wallHalfHeight, depth);
	const rightWall = fixed(width / 2 + 0.15, wallCenter, 0, 0.15, wallHalfHeight, depth);
	const backWall = fixed(0, wallCenter, -depth, width, wallHalfHeight, 0.15);
	const frontWall = fixed(0, wallCenter, depth, width, wallHalfHeight, 0.15);
	const setDropZone = (center: number, span: number) => {
		dropCenter = Math.min(boundaryWidth / 2, Math.max(-boundaryWidth / 2, center));
		dropWidth = Math.max(0.1, Math.min(boundaryWidth, span));
	};
	const setSpawnBoundary = (boundary: ReturnType<typeof getTagSpawnBoundary>) => {
		spawnBoundary = boundary;
	};
	const setWidth = (nextWidth: number) => {
		if (nextWidth === boundaryWidth) return;
		const ratio = nextWidth / boundaryWidth;
		// Preserve the accumulated pile's relative placement when the hero changes width.
		for (const tag of tags) {
			const position = tag.body.translation();
			tag.body.setTranslation({ ...position, x: position.x * ratio }, true);
		}
		boundaryWidth = nextWidth;
		floor.collider(0).setHalfExtents({ x: nextWidth / 2 + 1, y: 0.12, z: depth + 1 });
		leftWall.setTranslation({ x: -nextWidth / 2 - 0.15, y: wallCenter, z: 0 }, true);
		rightWall.setTranslation({ x: nextWidth / 2 + 0.15, y: wallCenter, z: 0 }, true);
		for (const wall of [backWall, frontWall])
			wall.collider(0).setHalfExtents({ x: nextWidth, y: wallHalfHeight, z: 0.15 });
		setDropZone(dropCenter * ratio, dropWidth * ratio);
	};
	const spawn = () => {
		if (tags.length >= maxTagBodies) return;
		const size = (0.48 + random() * 0.22) * settings.sizeScale;
		const thickness = getVisualThickness(settings);
		const radius = size * Math.hypot(0.5, 1, thickness / 2);
		const rotation = new Quaternion().setFromEuler(
			new Euler((random() - 0.5) * Math.PI, (random() - 0.5) * Math.PI, (random() - 0.5) * Math.PI)
		);
		const body = world.createRigidBody(
			RAPIER.RigidBodyDesc.dynamic()
				.setTranslation(
					dropCenter + (random() - 0.5) * Math.max(0.1, dropWidth - size * 2),
					spawnBoundary.height + radius * spawnBoundary.clearanceScale,
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
		world.createCollider(
			collider.setMass(0.04).setFriction(0.65).setRestitution(settings.bounce),
			body
		);
		tags.push({
			body,
			color: Math.floor(random() * tagColors.length),
			phase: random() * Math.PI * 2,
			restingSteps: 0,
			width: size
		});
	};
	const step = () => {
		elapsed += 1 / 60;
		for (const tag of tags) {
			const { body, phase } = tag;
			if (body.isFixed()) continue;
			const velocity = body.linvel();
			const spin = body.angvel();
			const isResting =
				Math.hypot(velocity.x, velocity.y, velocity.z) < 0.06 &&
				Math.hypot(spin.x, spin.y, spin.z) < 0.12;
			tag.restingSteps = isResting ? tag.restingSteps + 1 : 0;
			// Keep resting paper visible and collidable without repeatedly solving the whole pile.
			if (tag.restingSteps >= 120 || body.isSleeping()) {
				body.setBodyType(RAPIER.RigidBodyType.Fixed, true);
				continue;
			}
			const rotation = body.rotation();
			orientation.set(rotation.x, rotation.y, rotation.z, rotation.w);
			normal.set(0, 0, 1).applyQuaternion(orientation);
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
			const mass = body.mass();
			// Broadside paper catches more air than an edge-on tag, producing varied descent speeds.
			const drag = (0.35 + Math.abs(normal.y) * 1.65) * settings.airDrag;
			body.addForce(
				{
					x: mass * (Math.sin(elapsed * 1.5 + phase) * 0.55 * settings.flutter - velocity.x * 0.5),
					y: -mass * velocity.y * Math.abs(velocity.y) * drag,
					z: mass * (Math.cos(elapsed * 1.1 + phase) * 0.3 * settings.flutter - velocity.z * 0.7)
				},
				false
			);
			body.addTorque(
				{
					x: mass * Math.sin(elapsed * 2 + phase) * 0.025 * settings.flutter,
					y: mass * Math.cos(elapsed + phase) * 0.012 * settings.flutter,
					z: mass * Math.sin(elapsed * 1.7 + phase) * 0.018 * settings.flutter
				},
				false
			);
		}
		world.step();
	};
	const clear = () => {
		for (const tag of tags) world.removeRigidBody(tag.body);
		tags.length = 0;
	};
	const configure = (next: TagRainSettings) => {
		settings = normalizeRainSettings(next);
		world.gravity = { x: 0, y: -settings.gravity, z: 0 };
		for (const tag of tags) {
			tag.body.collider(0).setRestitution(settings.bounce);
			if (tag.body.isDynamic()) tag.body.wakeUp();
		}
	};
	const destroy = () => {
		tags.length = 0;
		world.free();
	};
	return {
		clear,
		configure,
		depth,
		destroy,
		setDropZone,
		setSpawnBoundary,
		setWidth,
		spawn,
		step,
		tags,
		world
	};
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
	let settings = { ...defaultRainSettings };
	let geometry = createTagGeometry();
	const ring = new RingGeometry(0.075, 0.17, 24);
	const palette = tagColors.map(() => new Color());
	const paperMaterial = new MeshStandardMaterial({
		roughness: 0.9,
		metalness: 0,
		side: DoubleSide
	});
	// ExtrudeGeometry assigns group 0 to the faces and group 1 to the cut edges (including the hole).
	const edgeMaterial = new MeshStandardMaterial({
		color: 0x888888,
		roughness: 1,
		metalness: 0,
		side: DoubleSide
	});
	const patchMaterial = new MeshStandardMaterial({ roughness: 1, side: DoubleSide });
	const floorGeometry = new PlaneGeometry(1, 4.8);
	const floorMaterial = new ShadowMaterial({ opacity: 0.12 });
	const floor = new Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = -0.002;
	floor.receiveShadow = true;
	scene.add(floor, new AmbientLight(0xffffff, 1.05));
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
	const paper = new InstancedMesh(geometry, [paperMaterial, edgeMaterial], maxTagBodies);
	const patches = new InstancedMesh(ring, patchMaterial, maxTagBodies * 2);
	paper.count = patches.count = 0;
	paper.castShadow = paper.receiveShadow = true;
	// Bounds change as the pile grows. Avoid stale instance bounds clipping newly spawned tags.
	paper.frustumCulled = patches.frustumCulled = false;
	paper.instanceMatrix.setUsage(DynamicDrawUsage);
	patches.instanceMatrix.setUsage(DynamicDrawUsage);
	scene.add(paper, patches);
	const transform = new Object3D();
	const patchTransform = new Matrix4();
	const patchOffsets = [-1, 1].map((direction) =>
		new Matrix4().makeTranslation(0, 0.63, direction * (getVisualThickness(settings) / 2 + 0.001))
	);
	const renderedFixed = new Set<number>();
	let paletteVersion = 0;
	let renderedPaletteVersion = -1;
	let accumulator = 0;
	let frame: number | null = null;
	let height = 0;
	let isActive = false;
	let isDestroyed = false;
	let lastTime = 0;
	let emissionAccumulator = 0;
	let resizeVersion = 0;
	let width = 0;
	let world: Awaited<ReturnType<typeof createTagWorld>> | null = null;
	const readPalette = () => {
		const styles = getComputedStyle(canvas);
		palette.forEach((color, index) =>
			color.set(styles.getPropertyValue(`--color-${tagColors[index]}`).trim())
		);
		paletteVersion++;
		patchMaterial.color.set(styles.getPropertyValue('--color-tag-buff').trim());
	};
	const draw = () => {
		if (isDestroyed) return;
		const tags = world?.tags ?? [];
		const isPaletteChanged = renderedPaletteVersion !== paletteVersion;
		for (let index = 0; index < tags.length; index++) {
			const tag = tags[index];
			if (isPaletteChanged || index >= paper.count) paper.setColorAt(index, palette[tag.color]);
			if (renderedFixed.has(index)) continue;
			const position = tag.body.translation();
			const rotation = tag.body.rotation();
			transform.position.set(position.x, position.y, position.z);
			transform.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
			transform.scale.setScalar(tag.width);
			transform.updateMatrix();
			paper.setMatrixAt(index, transform.matrix);
			patchOffsets.forEach((offset, side) => {
				patchTransform.multiplyMatrices(transform.matrix, offset);
				patches.setMatrixAt(index * 2 + side, patchTransform);
			});
			if (tag.body.isFixed()) renderedFixed.add(index);
		}
		paper.count = tags.length;
		patches.count = tags.length * 2;
		paper.instanceMatrix.needsUpdate = patches.instanceMatrix.needsUpdate = true;
		if (paper.instanceColor) paper.instanceColor.needsUpdate = true;
		renderedPaletteVersion = paletteVersion;
		renderer.render(scene, camera);
		canvas.dataset.tagCount = String(world?.tags.length ?? 0);
		canvas.dataset.renderer = 'webgl-3d';
	};
	const dropZone = canvas.closest('[data-tag-hero]')?.querySelector('[data-tag-drop-zone]');
	const updateCamera = () => {
		const viewport = canvas.getBoundingClientRect();
		const zone = dropZone?.getBoundingClientRect();
		const viewWidth = camera.right - camera.left;
		const anchor =
			zone && viewport.width
				? ((zone.left + zone.width / 2 - viewport.left) / viewport.width - 0.5) * viewWidth
				: 0;
		// Zoom around the pile's ground anchor, keeping the emitter aligned with the container.
		const centerX = anchor * (1 - 1 / settings.cameraZoom);
		const centerY = ((camera.top - camera.bottom) * 0.42) / settings.cameraZoom;
		camera.zoom = settings.cameraZoom;
		camera.position.set(centerX, centerY + 8, 12);
		camera.lookAt(centerX, centerY, 0);
		camera.updateProjectionMatrix();
		canvas.dataset.cameraZoom = String(settings.cameraZoom);
	};
	const updateDropZone = () => {
		if (world) world.setSpawnBoundary(getTagSpawnBoundary(camera, world.depth));
		if (!world || !dropZone) return;
		const viewport = canvas.getBoundingClientRect();
		if (!viewport.width) return;
		const zone = dropZone.getBoundingClientRect();
		const viewWidth = (camera.right - camera.left) / camera.zoom;
		const center =
			camera.position.x +
			((zone.left + zone.width / 2 - viewport.left) / viewport.width - 0.5) * viewWidth;
		world.setDropZone(center, (zone.width / viewport.width) * viewWidth);
		canvas.dataset.dropCenter = String(zone.left + zone.width / 2 - viewport.left);
		canvas.dataset.dropWidth = String(zone.width);
	};
	const resize = async () => {
		const rect = canvas.getBoundingClientRect();
		const nextWidth = Math.round(rect.width);
		const nextHeight = Math.round(rect.height);
		if (width === nextWidth && height === nextHeight) {
			updateCamera();
			updateDropZone();
			return;
		}
		width = nextWidth;
		height = nextHeight;
		const version = ++resizeVersion;
		if (!width || !height) return;
		renderer.setSize(width, height, false);
		const viewHeight = 10.5;
		const viewWidth = (viewHeight * width) / height;
		camera.left = -viewWidth / 2;
		camera.right = viewWidth / 2;
		camera.top = viewHeight / 2;
		camera.bottom = -viewHeight / 2;
		updateCamera();
		floor.scale.x = viewWidth + 2;
		if (world) {
			world.setWidth(viewWidth);
			renderedFixed.clear();
			updateDropZone();
			draw();
			return;
		}
		const nextWorld = await createTagWorld(viewWidth, viewHeight, Math.random, settings);
		if (isDestroyed || version !== resizeVersion) {
			nextWorld.destroy();
			return;
		}
		world = nextWorld;
		updateDropZone();
		emissionAccumulator = 0;
		readPalette();
		draw();
	};
	const tick = (time: number) => {
		frame = null;
		if (!isActive || isDestroyed) return;
		const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
		lastTime = time;
		accumulator += delta;
		if (world) {
			emissionAccumulator += delta * settings.tagsPerSecond;
			while (emissionAccumulator >= 1) {
				world.spawn();
				emissionAccumulator--;
			}
		}
		while (accumulator >= 1 / 60) {
			world?.step();
			accumulator -= 1 / 60;
		}
		draw();
		frame = requestAnimationFrame(tick);
	};
	const update = (nextIsActive: boolean) => {
		if (isActive === nextIsActive) return;
		isActive = nextIsActive;
		lastTime = 0;
		accumulator = 0;
		emissionAccumulator = 0;
		if (isActive) frame = requestAnimationFrame(tick);
		else if (frame !== null) {
			cancelAnimationFrame(frame);
			frame = null;
		}
	};
	const clear = () => {
		world?.clear();
		renderedFixed.clear();
		paper.count = patches.count = 0;
		emissionAccumulator = 0;
		draw();
	};
	const configure = (next: TagRainSettings) => {
		const normalized = normalizeRainSettings(next);
		const isZoomChanged = normalized.cameraZoom !== settings.cameraZoom;
		const isShapeChanged =
			getVisualThickness(normalized) !== getVisualThickness(settings) ||
			normalized.sizeScale !== settings.sizeScale;
		settings = normalized;
		world?.configure(settings);
		if (isShapeChanged) {
			// Rebuild geometry and colliders together so changes never leave mismatched pile contacts.
			geometry.dispose();
			geometry = createTagGeometry(getVisualThickness(settings));
			paper.geometry = geometry;
			patchOffsets.forEach((offset, side) =>
				offset.makeTranslation(
					0,
					0.63,
					(side === 0 ? -1 : 1) * (getVisualThickness(settings) / 2 + 0.001)
				)
			);
			clear();
		}
		if (isZoomChanged) {
			updateCamera();
			updateDropZone();
			draw();
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
	if (dropZone) observer.observe(dropZone);
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme']
	});
	await resize();
	return {
		clear,
		configure,
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
			paper.dispose();
			patches.dispose();
			paperMaterial.dispose();
			edgeMaterial.dispose();
			patchMaterial.dispose();
			light.shadow.map?.dispose();
			renderer.dispose();
			renderer.forceContextLoss();
			renderedFixed.clear();
			scene.clear();
		}
	};
};
