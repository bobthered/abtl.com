import RAPIER from '@dimforge/rapier3d-compat';
import { createTagEmissionClock } from './emission';
import {
	applyClothMaterial,
	clothParticleCount,
	createClothArtworkGeometry,
	createClothBody,
	createClothMaterial,
	createClothTexture,
	maxActiveClothTags,
	prepareClothGeometry
} from './cloth';
import {
	artworkCounts,
	chooseTagArtwork,
	createArtworkAtlas,
	createArtworkMaterial,
	tagArtworkPairs,
	tagArtworkNames
} from './artwork';
import type { ArtworkPair } from './artwork';
import { createPatchShape, createTagShape, patchOutline, tagHole, tagOutline } from './profile';
export { createTagShape } from './profile';
import {
	defaultRainSettings,
	getVisualPatchThickness,
	getVisualThickness,
	normalizeRainSettings,
	tagDimensionsInches
} from './settings';
import type { TagRainSettings } from './settings';
export { tagDimensionsInches, tagsPerSecond } from './settings';
import {
	AmbientLight,
	BufferAttribute,
	Color,
	DirectionalLight,
	DoubleSide,
	DynamicDrawUsage,
	Euler,
	ExtrudeGeometry,
	InstancedMesh,
	InstancedBufferAttribute,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	MeshDepthMaterial,
	MeshStandardMaterial,
	Object3D,
	OrthographicCamera,
	PCFShadowMap,
	RGBADepthPacking,
	PlaneGeometry,
	Quaternion,
	Raycaster,
	Scene,
	Sphere,
	ShadowMaterial,
	Vector3,
	Vector2,
	WebGLRenderer
} from 'three';

export type RainTag = {
	backArtwork: number;
	body: RAPIER.RigidBody;
	cloth?: RAPIER.SoftBody;
	clothPositions?: Float32Array;
	clothStillSeconds?: number;
	contactSeconds?: number;
	color: number;
	frontArtwork: number;
	phase: number;
	width: number;
};
export type TagSelection = {
	atlas: Awaited<ReturnType<typeof createArtworkAtlas>>;
	backArtwork: number;
	color: string;
	frontArtwork: number;
	name: string;
	patchThickness: number;
	rotation: { x: number; y: number; z: number; w: number };
	thickness: number;
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
	'tag-white',
	'tag-yellow'
];
// Percent shares: white stock dominates, while the remaining stocks share 25% equally.
export const tagColorWeights = tagColors.map((color) =>
	color === 'tag-white' ? 75 : 25 / (tagColors.length - 1)
);
const totalColorWeight = tagColorWeights.reduce((total, weight) => total + weight, 0);
export const chooseTagColor = (random = Math.random) => {
	let sample = random() * totalColorWeight;
	for (let index = 0; index < tagColorWeights.length; index++) {
		sample -= tagColorWeights[index];
		if (sample < 0) return index;
	}
	return tagColors.length - 1;
};
export const tagThickness = tagDimensionsInches.thickness / tagDimensionsInches.width;
// A single scene scale represents the same physical stock size on every tag.
export const tagWorldUnitsPerInch = 0.6 / tagDimensionsInches.width;
// True-scale stock is subpixel in this hero. Exaggerate only depth so its edge remains visible.
export const tagVisualThicknessScale = defaultRainSettings.thicknessScale;
export const tagVisualThickness = tagThickness * tagVisualThicknessScale;
// A collision-only clearance protects thin visible faces from the solver's residual compression.
const tagContactSkin = 0.002;
let initialization: Promise<void> | null = null;
const initializePhysics = () => (initialization ??= RAPIER.init());

const uploadInstances = (attribute: BufferAttribute, first: number, count: number) => {
	if (!count) return;
	attribute.addUpdateRange(first * attribute.itemSize, count * attribute.itemSize);
	attribute.needsUpdate = true;
};

export const createTagGeometry = (thickness = tagVisualThickness) => {
	const geometry = new ExtrudeGeometry(createTagShape(), {
		depth: thickness,
		bevelEnabled: false,
		curveSegments: 6
	});
	geometry.translate(0, 0, -thickness / 2);
	return geometry;
};

export const createPatchGeometry = (thickness = getVisualPatchThickness(defaultRainSettings)) => {
	const geometry = new ExtrudeGeometry(createPatchShape(), {
		depth: thickness,
		bevelEnabled: false,
		curveSegments: 6
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
	initialSettings = defaultRainSettings,
	initialArtworkPairs: ArtworkPair[] = tagArtworkPairs,
	isClothEnabled = false
) => {
	await initializePhysics();
	let settings = normalizeRainSettings(initialSettings);
	const world = new RAPIER.World({ x: 0, y: -settings.gravity, z: 0 });
	world.timestep = 1 / 60;
	world.integrationParameters.numSolverIterations = 8;
	world.integrationParameters.contact_natural_frequency = 60;
	// Thin paper needs tighter contacts and more CCD passes than Rapier's general-purpose defaults.
	world.integrationParameters.normalizedAllowedLinearError = 0.00005;
	world.integrationParameters.maxCcdSubsteps = 4;
	const tags: RainTag[] = [];
	const activeTags = new Set<RainTag>();
	const releasedTags = new Set<RainTag>();
	const depth = Math.min(2.2, height * 0.2);
	const normal = new Vector3();
	const orientation = new Quaternion();
	let boundaryWidth = width;
	let dropCenter = 0;
	let dropWidth = width;
	let elapsed = 0;
	let cleanupElapsed = 0;
	let cleanupExit = -3;
	let floorOpenRemaining = 0;
	let revision = 0;
	let spawnBoundary = { clearanceScale: 1, height };
	const clothPose = new Matrix4();
	const clothPoint = new Vector3();
	const clothScale = new Vector3();
	const updateClothPositions = (tag: RainTag) => {
		if (!tag.cloth) return;
		const position = tag.body.translation();
		const rotation = tag.body.rotation();
		clothPose
			.compose(
				new Vector3(position.x, position.y, position.z),
				new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
				clothScale.setScalar(tag.width)
			)
			.invert();
		const positions = tag.cloth.particlePositions();
		const local = (tag.clothPositions ??= new Float32Array(clothParticleCount * 3));
		for (let index = 0; index < clothParticleCount; index++)
			clothPoint
				.fromArray(positions, index * 3)
				.applyMatrix4(clothPose)
				.toArray(local, index * 3);
	};
	const freezeCloth = (tag: RainTag) => {
		if (!tag.cloth) return;
		const position = tag.cloth.centerOfMass();
		const rotation = tag.body.rotation();
		const velocities = tag.cloth.particleVelocities();
		const velocity = new Vector3();
		for (let index = 0; index < clothParticleCount; index++)
			velocity.add(clothPoint.fromArray(velocities, index * 3));
		velocity.divideScalar(clothParticleCount);
		// Keep a deformed convex collision envelope after retiring expensive particle constraints.
		const worldPositions = tag.cloth.particlePositions();
		const vertices: number[] = [];
		orientation.set(rotation.x, rotation.y, rotation.z, rotation.w).invert();
		const local = new Float32Array(worldPositions.length);
		for (let index = 0; index < clothParticleCount; index++) {
			clothPoint
				.fromArray(worldPositions, index * 3)
				.sub(new Vector3(position.x, position.y, position.z))
				.applyQuaternion(orientation)
				.divideScalar(tag.width)
				.toArray(local, index * 3);
			const clearance = getVisualThickness(settings) / 2 + getVisualPatchThickness(settings);
			for (const direction of [-1, 1])
				vertices.push(
					clothPoint.x * tag.width,
					clothPoint.y * tag.width,
					(clothPoint.z + direction * clearance) * tag.width
				);
		}
		world.removeSoftBody(tag.cloth);
		tag.cloth = undefined;
		tag.clothPositions = local;
		tag.body = world.createRigidBody(
			RAPIER.RigidBodyDesc.dynamic()
				.setTranslation(position.x, position.y, position.z)
				.setRotation(rotation)
				.setLinvel(velocity.x, velocity.y, velocity.z)
				.setLinearDamping(2.5)
				.setAngularDamping(4)
				.setCcdEnabled(true)
		);
		world.createCollider(
			RAPIER.ColliderDesc.roundConvexHull(new Float32Array(vertices), 0.01)!
				.setMass(0.048)
				.setFriction(0.65)
				.setRestitution(settings.bounce)
				.setContactSkin(tagContactSkin)
				.setCollisionGroups(releasedTags.has(tag) ? 0x00020003 : 0x00010003),
			tag.body
		);
	};
	const fixed = (x: number, y: number, z: number, halfX: number, halfY: number, halfZ: number) => {
		const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
		world.createCollider(
			RAPIER.ColliderDesc.cuboid(halfX, halfY, halfZ)
				.setFriction(0.8)
				.setCollisionGroups(0x00010001),
			body
		);
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
			if (tag.cloth) freezeCloth(tag);
			const position = tag.body.translation();
			tag.body.setTranslation({ ...position, x: position.x * ratio }, true);
			activeTags.add(tag);
		}
		revision++;
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
		const size = tagDimensionsInches.width * tagWorldUnitsPerInch;
		const thickness = getVisualThickness(settings);
		const patchThickness = getVisualPatchThickness(settings);
		// Subpixel sheets need a minimum collision depth to avoid degenerate thin convex contacts.
		// Rendering still uses the requested paper and patch thicknesses.
		const collisionThickness = Math.max(thickness, 0.01 / size);
		const collisionPatchThickness = Math.max(patchThickness, 0.001 / size);
		const radius = size * Math.hypot(0.5, 1, thickness / 2 + patchThickness);
		// A common pitch and vertical velocity keep the flight time consistent; yaw still varies.
		const rotation = new Quaternion().setFromEuler(
			isClothEnabled
				? new Euler(-Math.PI / 2 + 0.3, random() * Math.PI * 2, 0, 'YXZ')
				: new Euler(
						(random() - 0.5) * Math.PI,
						(random() - 0.5) * Math.PI,
						(random() - 0.5) * Math.PI
					)
		);
		let y = spawnBoundary.height + radius * spawnBoundary.clearanceScale;
		let x = dropCenter;
		let z = 0;
		let bestClearance = -Infinity;
		// Keep live cloth inside the guides; preserve the rigid collision baseline's drop bounds.
		const xRadius = Math.min(
			(Math.max(0.1, dropWidth - size * 2) / 2) * settings.dropSpreadX,
			isClothEnabled ? Math.max(0, boundaryWidth / 2 - Math.abs(dropCenter) - radius) : Infinity
		);
		const yRadius = Math.min(
			depth * 0.6 * settings.dropSpreadY,
			isClothEnabled ? Math.max(0, depth - radius) : Infinity
		);
		// Spread crowded emissions sideways/depthwise instead of changing their launch height.
		for (let attempt = 0; attempt < (isClothEnabled ? 24 : 1); attempt++) {
			const candidateX =
				dropCenter + (((random() + attempt * 0.61803398875) % 1) - 0.5) * xRadius * 2;
			// The control's Y axis is the drop plane's depth (world Z), not launch height.
			const candidateZ = (((random() + attempt * 0.41421356237) % 1) - 0.5) * yRadius * 2;
			let clearance = Infinity;
			for (const tag of activeTags) {
				const position = tag.body.translation();
				clearance = Math.min(
					clearance,
					Math.hypot(position.x - candidateX, position.y - y, position.z - candidateZ)
				);
			}
			if (clearance > bestClearance) {
				bestClearance = clearance;
				x = candidateX;
				z = candidateZ;
			}
			if (clearance > radius * 2 + 0.002) break;
		}
		// Preserve the collision stress-test/baseline mode's vertical queue for rigid burst drops.
		if (!isClothEnabled)
			for (const tag of activeTags) {
				const position = tag.body.translation();
				const clearance =
					radius + tag.width * Math.hypot(0.5, 1, thickness / 2 + patchThickness) + 0.002;
				if (Math.hypot(position.x - x, position.z - z) < clearance)
					y = Math.max(y, position.y + clearance);
			}
		const body = world.createRigidBody(
			RAPIER.RigidBodyDesc.dynamic()
				.setTranslation(x, y, z)
				.setRotation(rotation)
				.setLinvel((random() - 0.5) * 0.6, -0.35, (random() - 0.5) * 0.4)
				.setAngvel({
					x: isClothEnabled ? 0 : (random() - 0.5) * 1.8,
					y: (random() - 0.5) * (isClothEnabled ? 0.6 : 1.2),
					z: isClothEnabled ? 0 : (random() - 0.5) * 1.2
				})
				.setLinearDamping(0.035)
				.setAngularDamping(0.5)
				.setCcdEnabled(true)
		);
		// A thin convex hull matches the clipped outline; its small hole is visual only.
		const vertices: number[] = [];
		for (const z of [-collisionThickness / 2, collisionThickness / 2]) {
			for (const { x, y } of tagOutline) vertices.push(x * size, y * size, z * size);
		}
		// A rounded collision hull provides stable face contacts without rounding the rendered stock.
		const collider = RAPIER.ColliderDesc.roundConvexHull(new Float32Array(vertices), 0.01)!;
		world.createCollider(
			collider
				.setMass(0.04)
				.setFriction(0.65)
				.setRestitution(settings.bounce)
				.setContactSkin(tagContactSkin)
				.setCollisionGroups(0x00010003),
			body
		);
		// Raised patches on both faces participate in stacking, with the same depth as the rendering.
		for (const direction of [-1, 1]) {
			const patchVertices: number[] = [];
			for (const z of [-collisionPatchThickness / 2, collisionPatchThickness / 2])
				for (const { x, y } of patchOutline) patchVertices.push(x * size, y * size, z * size);
			const patchCollider = RAPIER.ColliderDesc.roundConvexHull(
				new Float32Array(patchVertices),
				0.002
			)!;
			world.createCollider(
				patchCollider
					.setTranslation(
						tagHole.center.x * size,
						tagHole.center.y * size,
						direction * (collisionThickness / 2 + collisionPatchThickness / 2) * size
					)
					.setMass(0.004)
					.setFriction(0.65)
					.setRestitution(settings.bounce)
					.setContactSkin(tagContactSkin)
					.setCollisionGroups(0x00010003),
				body
			);
		}
		const tag: RainTag = {
			...chooseTagArtwork(random, initialArtworkPairs),
			body,
			color: chooseTagColor(random),
			phase: random() * Math.PI * 2,
			width: size
		};
		tags.push(tag);
		activeTags.add(tag);
		if (isClothEnabled) {
			const clothTags = tags.filter((candidate) => candidate.cloth);
			if (clothTags.length >= maxActiveClothTags) freezeCloth(clothTags[0]);
			clothPose.compose(new Vector3(x, y, z), rotation, clothScale.setScalar(size));
			const velocity = body.linvel();
			const angular = body.angvel();
			world.removeRigidBody(body);
			tag.cloth = createClothBody(
				world,
				clothPose,
				Math.max(0.01, (thickness / 2 + patchThickness) * size),
				settings.bounce,
				settings.bendStiffness
			);
			tag.body = tag.cloth.rootBody();
			for (let index = 0; index < clothParticleCount; index++) {
				const point = tag.cloth.particlePosition(index);
				const offset = new Vector3(point.x - x, point.y - y, point.z - z);
				const spin = new Vector3(angular.x, angular.y, angular.z).cross(offset);
				tag.cloth.setParticleVelocity(index, {
					x: velocity.x + spin.x,
					y: velocity.y + spin.y,
					z: velocity.z + spin.z
				});
			}
			updateClothPositions(tag);
		}
	};
	const markDeparting = (tag: RainTag) => {
		if (tag.cloth) freezeCloth(tag);
		for (let index = 0; index < tag.body.numColliders(); index++)
			tag.body.collider(index).setCollisionGroups(0x00020003);
		tag.body.resetForces(false);
		tag.body.resetTorques(false);
		tag.body.setLinearDamping(0.035);
		tag.body.setAngularDamping(0.5);
		tag.body.wakeUp();
		tag.contactSeconds = 0;
		releasedTags.add(tag);
		activeTags.add(tag);
	};
	const restoreFloor = () => {
		// Check the whole compound tag, including its patches, before restoring floor contacts.
		// Refresh collider poses so a just-moved or rotated tag is tested at its current position.
		world.propagateModifiedBodyPositionsToColliders();
		const floorCollider = floor.collider(0);
		for (const tag of tags) {
			if (releasedTags.has(tag)) continue;
			let isIntersecting = tag.body.translation().y < 0;
			if (tag.cloth) {
				const positions = tag.cloth.particlePositions();
				for (let index = 1; index < positions.length; index += 3)
					isIntersecting ||= positions[index] <= tag.cloth.particleRadius() + tagContactSkin;
			}
			for (let index = 0; index < tag.body.numColliders() && !isIntersecting; index++) {
				const contact = floorCollider.contactCollider(tag.body.collider(index), tagContactSkin);
				isIntersecting = contact !== null && contact.distance <= tagContactSkin;
			}
			// Straddling paper finishes its descent; the floor catches only tags wholly above it.
			if (isIntersecting) markDeparting(tag);
		}
		floorCollider.setEnabled(true);
		revision++;
	};
	const releaseFloor = () => {
		cleanupElapsed = 0;
		floorOpenRemaining = settings.floorRemovalSeconds;
		floor.collider(0).setEnabled(false);
		for (const tag of tags) {
			if (tag.cloth) freezeCloth(tag);
			tag.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
			tag.body.setLinearDamping(0.035);
			tag.body.setAngularDamping(0.5);
			tag.body.resetForces(false);
			tag.body.resetTorques(false);
			tag.contactSeconds = 0;
			activeTags.add(tag);
		}
		revision++;
	};
	const isSupported = (tag: RainTag) => {
		if (floorOpenRemaining > 0 || releasedTags.has(tag)) return false;
		let isContact = false;
		for (let index = 0; index < tag.body.numColliders() && !isContact; index++) {
			const collider = tag.body.collider(index);
			world.contactPairsWith(collider, (other) => {
				const parent = other.parent();
				if (
					!parent ||
					parent.handle === tag.body.handle ||
					parent.translation().y >= tag.body.translation().y
				)
					return;
				world.contactPair(collider, other, (manifold) => {
					isContact ||= manifold.numSolverContacts() > 0;
				});
			});
		}
		return isContact;
	};
	const step = () => {
		elapsed += 1 / 60;
		// Count the interval while the floor is present, separately from its removal duration.
		if (floorOpenRemaining === 0) cleanupElapsed += 1 / 60;
		let isFloorChanged = false;
		if (floorOpenRemaining > 0) {
			floorOpenRemaining = Math.max(0, floorOpenRemaining - 1 / 60);
			if (floorOpenRemaining < 1e-8) floorOpenRemaining = 0;
			if (floorOpenRemaining === 0) {
				restoreFloor();
				isFloorChanged = true;
			}
		}
		if (
			settings.cleanupIntervalSeconds > 0 &&
			cleanupElapsed >= settings.cleanupIntervalSeconds &&
			floorOpenRemaining === 0
		) {
			releaseFloor();
			isFloorChanged = true;
		}
		const isChanged = activeTags.size > 0 || isFloorChanged;
		for (const tag of activeTags) {
			const isOnPile = isClothEnabled && isSupported(tag);
			tag.contactSeconds = isOnPile ? (tag.contactSeconds ?? 0) + 1 / 60 : 0;
			// Retain the bent surface and make settled pile contacts stable. Floor release reactivates
			// these bodies, so they still fall away normally when their support is removed.
			if (isClothEnabled && tag.contactSeconds > 1) {
				if (tag.cloth) freezeCloth(tag);
				tag.body.resetForces(false);
				tag.body.resetTorques(false);
				tag.body.setBodyType(RAPIER.RigidBodyType.Fixed, true);
				activeTags.delete(tag);
				continue;
			}
			if (tag.cloth) {
				const cloth = tag.cloth;
				if (cloth.isSleeping()) {
					freezeCloth(tag);
					continue;
				}
				cloth.resetForces(false);
				let maximumSpeed = 0;
				for (let index = 0; index < clothParticleCount; index++) {
					const velocity = cloth.particleVelocity(index);
					maximumSpeed = Math.max(maximumSpeed, Math.hypot(velocity.x, velocity.y, velocity.z));
					const mass = cloth.particleMass(index);
					const phase = tag.phase + index * 0.35;
					cloth.addParticleForce(
						index,
						{
							x:
								mass *
								(isOnPile
									? -velocity.x * 6
									: Math.sin(elapsed * 1.5 + phase) * 0.4 * settings.flutter - velocity.x * 0.5),
							y: isOnPile
								? -mass * velocity.y * 6
								: -mass * velocity.y * Math.abs(velocity.y) * 0.08 * settings.airDrag,
							z:
								mass *
								(isOnPile
									? -velocity.z * 6
									: Math.cos(elapsed * 2 + phase) * 0.35 * settings.flutter)
						},
						false
					);
				}
				// Retain the settled bend without paying for its particle constraints indefinitely.
				tag.clothStillSeconds = maximumSpeed < 0.12 ? (tag.clothStillSeconds ?? 0) + 1 / 60 : 0;
				if (tag.clothStillSeconds > 0.5) freezeCloth(tag);
				continue;
			}
			const { body, phase } = tag;
			// Only paper that has passed below the missing floor belongs to the departing pile.
			// Airborne tags retain normal floor collisions and can land when it returns.
			if ((floorOpenRemaining > 0 || isFloorChanged) && body.translation().y < 0) {
				if (!releasedTags.has(tag)) markDeparting(tag);
			}
			if (releasedTags.has(tag)) {
				// Gravity alone drops the pile; do not freeze it or apply ground-settling damping.
				continue;
			}
			if (body.isSleeping()) {
				activeTags.delete(tag);
				continue;
			}
			const velocity = body.linvel();
			const rotation = body.rotation();
			const spin = body.angvel();
			if (
				isOnPile &&
				(tag.contactSeconds ?? 0) > 1 &&
				Math.hypot(velocity.x, velocity.y, velocity.z) < 0.12 &&
				Math.hypot(spin.x, spin.y, spin.z) < 0.3
			) {
				body.sleep();
				activeTags.delete(tag);
				continue;
			}
			orientation.set(rotation.x, rotation.y, rotation.z, rotation.w);
			normal.set(0, 0, 1).applyQuaternion(orientation);
			body.resetForces(false);
			body.resetTorques(false);
			if (isOnPile || body.translation().y < 0.9) {
				if (floorOpenRemaining > 0) {
					body.setLinearDamping(0.035);
					body.setAngularDamping(0.5);
					continue;
				}
				// Dissipate motion near contact so light paper lands quietly rather than springing away.
				body.setLinearDamping(2.5);
				body.setAngularDamping(4);
				// A gentle settling torque prevents a thin sheet balancing on its edge or a wall.
				if (!isOnPile && Math.abs(normal.y) < 0.95) {
					const direction = normal.y < 0 ? -1 : 1;
					const strength = body.mass() * 0.08;
					body.addTorque(
						{ x: -normal.z * direction * strength, y: 0, z: normal.x * direction * strength },
						false
					);
				}
				continue;
			}
			const mass = body.mass();
			// Broadside paper catches more air than an edge-on tag, producing varied descent speeds.
			// Let gravity accelerate paper through the visible fall before broadside drag slows it.
			const drag = (0.035 + Math.abs(normal.y) * 0.165) * settings.airDrag;
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
		if (isChanged) {
			world.step();
			for (const tag of tags) if (tag.cloth) updateClothPositions(tag);
			// Sleeping dynamic paper costs no solver work, but can wake and shift under new impacts.
			// Rejoin woken tags before the next step so forces and rendering follow their real positions.
			for (const tag of tags) {
				if (tag.body.isFixed() || (tag.cloth ? tag.cloth.isSleeping() : tag.body.isSleeping()))
					activeTags.delete(tag);
				else {
					if (!activeTags.has(tag)) revision++;
					activeTags.add(tag);
				}
			}
		}
		// Delete only once the entire tag is below the camera's bottom edge.
		for (let index = tags.length - 1; index >= 0 && releasedTags.size; index--) {
			const tag = tags[index];
			if (!releasedTags.has(tag) || tag.body.translation().y >= cleanupExit) continue;
			activeTags.delete(tag);
			releasedTags.delete(tag);
			world.removeRigidBody(tag.body);
			tags.splice(index, 1);
			revision++;
		}
		return isChanged;
	};
	const clear = () => {
		for (const tag of tags) {
			if (tag.cloth) world.removeSoftBody(tag.cloth);
			else world.removeRigidBody(tag.body);
		}
		tags.length = 0;
		activeTags.clear();
		releasedTags.clear();
		floorOpenRemaining = 0;
		floor.collider(0).setEnabled(true);
		cleanupElapsed = 0;
		revision++;
	};
	const configure = (next: TagRainSettings) => {
		const isStiffnessChanged = next.bendStiffness !== settings.bendStiffness;
		if (next.cleanupIntervalSeconds !== settings.cleanupIntervalSeconds) cleanupElapsed = 0;
		settings = normalizeRainSettings(next);
		world.gravity = { x: 0, y: -settings.gravity, z: 0 };
		for (const tag of tags) {
			if (tag.cloth && isStiffnessChanged) {
				tag.cloth.setMaterial(createClothMaterial(settings.bendStiffness));
				tag.cloth.wakeUp();
			}
			for (let index = 0; index < tag.body.numColliders(); index++)
				tag.body.collider(index).setRestitution(settings.bounce);
			if (tag.body.isDynamic()) {
				tag.body.wakeUp();
				activeTags.add(tag);
			}
		}
	};
	const destroy = () => {
		tags.length = 0;
		activeTags.clear();
		releasedTags.clear();
		world.free();
	};
	return {
		activeTags,
		clear,
		configure,
		depth,
		destroy,
		getRevision: () => revision,
		isFloorOpen: () => floorOpenRemaining > 0,
		setCleanupExit: (next: number) => {
			cleanupExit = next;
		},
		setDropZone,
		setSpawnBoundary,
		setWidth,
		spawn,
		step,
		tags,
		world
	};
};

export const createTagRain = async (
	canvas: HTMLCanvasElement,
	onselect?: (selection: TagSelection) => void
) => {
	await initializePhysics();
	const artworkAtlas = await createArtworkAtlas();
	const renderer = new WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true,
		powerPreference: 'high-performance'
	});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFShadowMap;
	const scene = new Scene();
	const camera = new OrthographicCamera(-3, 3, 5, -5, 0.1, 80);
	let settings = { ...defaultRainSettings };
	const clothTexture = createClothTexture(maxTagBodies);
	const prepareGeometry = (
		source: ReturnType<typeof createTagGeometry>,
		count: number,
		x = 0,
		y = 0
	) => {
		const geometry = prepareClothGeometry(source, count, x, y);
		source.dispose();
		return geometry;
	};
	let geometry = prepareGeometry(createTagGeometry(), maxTagBodies);
	let patchGeometry = prepareGeometry(
		createPatchGeometry(),
		maxTagBodies * 2,
		tagHole.center.x,
		tagHole.center.y
	);
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
	const patchMaterial = new MeshStandardMaterial({
		color: 0xae621a,
		roughness: 1,
		side: DoubleSide
	});
	const floorGeometry = new PlaneGeometry(1, 4.8);
	// This plane supplies shadows, not an opaque surface that slices departing tags visually.
	const floorMaterial = new ShadowMaterial({ depthWrite: false, opacity: 0.12 });
	const floor = new Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = -0.002;
	floor.receiveShadow = true;
	scene.add(floor, new AmbientLight(0xffffff, 0.3));
	const light = new DirectionalLight(0xfff3e5, 2.8);
	light.position.set(-6, 8, 4);
	light.castShadow = true;
	light.shadow.mapSize.set(512, 512);
	light.shadow.camera.left = -8;
	light.shadow.camera.right = 8;
	light.shadow.camera.top = 12;
	light.shadow.camera.bottom = -8;
	light.shadow.normalBias = 0.025;
	scene.add(light);
	const rimLight = new DirectionalLight(0xe4edff, 0.5);
	rimLight.position.set(5, 5, -6);
	scene.add(rimLight);
	applyClothMaterial(paperMaterial, clothTexture.texture);
	applyClothMaterial(edgeMaterial, clothTexture.texture);
	applyClothMaterial(patchMaterial, clothTexture.texture, {
		x: tagHole.center.x,
		y: tagHole.center.y,
		z: 0
	});
	const paper = new InstancedMesh(geometry, [paperMaterial, edgeMaterial], maxTagBodies);
	const patches = new InstancedMesh(patchGeometry, patchMaterial, maxTagBodies * 2);
	paper.count = patches.count = 0;
	paper.castShadow = paper.receiveShadow = true;
	const depthMaterial = new MeshDepthMaterial({ depthPacking: RGBADepthPacking });
	applyClothMaterial(depthMaterial, clothTexture.texture);
	paper.customDepthMaterial = depthMaterial;
	// The paper casts the tag silhouette; tiny reinforcement shadows add a costly extra pass.
	patches.receiveShadow = true;
	// Bounds change as the pile grows. Avoid stale instance bounds clipping newly spawned tags.
	paper.frustumCulled = patches.frustumCulled = false;
	// Picking must not use a cached aggregate bound from an earlier, smaller pile.
	paper.boundingSphere = new Sphere(new Vector3(), 1000);
	paper.instanceMatrix.setUsage(DynamicDrawUsage);
	patches.instanceMatrix.setUsage(DynamicDrawUsage);
	scene.add(paper, patches);
	const hoverMaterial = new MeshBasicMaterial({
		color: 0x7f87c7,
		depthWrite: false,
		opacity: 0.3,
		side: DoubleSide,
		transparent: true
	});
	const hoverHalo = new Mesh(geometry, hoverMaterial);
	// CPU-deformed geometry makes both hover highlighting and raycasting match the visible cloth.
	const pickGeometry = geometry.clone();
	const pickMesh = new Mesh(pickGeometry, hoverMaterial);
	const pickPosition = new Vector3();
	const pickNormal = new Vector3();
	const pickEdge = new Vector3();
	const getClothPoint = (tag: RainTag, vertex: number, target: Vector3) => {
		const indices = geometry.getAttribute('clothIndices');
		const weights = geometry.getAttribute('clothWeights');
		const points = tag.clothPositions!;
		target.set(0, 0, 0);
		for (let component = 0; component < 4; component++) {
			const particle = indices.array[vertex * 4 + component] * 3;
			const weight = weights.array[vertex * 4 + component];
			target.x += points[particle] * weight;
			target.y += points[particle + 1] * weight;
			target.z += points[particle + 2] * weight;
		}
		const a = indices.getX(vertex) * 3,
			b = indices.getY(vertex) * 3,
			c = indices.getZ(vertex) * 3;
		pickNormal
			.set(points[b] - points[a], points[b + 1] - points[a + 1], points[b + 2] - points[a + 2])
			.cross(
				pickEdge.set(
					points[c] - points[a],
					points[c + 1] - points[a + 1],
					points[c + 2] - points[a + 2]
				)
			)
			.normalize();
		target.addScaledVector(pickNormal, geometry.getAttribute('position').getZ(vertex));
	};
	const deformPickMesh = (tag: RainTag, matrix: Matrix4) => {
		const positions = pickGeometry.getAttribute('position');
		for (let vertex = 0; vertex < positions.count; vertex++) {
			getClothPoint(tag, vertex, pickPosition);
			positions.setXYZ(vertex, pickPosition.x, pickPosition.y, pickPosition.z);
		}
		positions.needsUpdate = true;
		pickGeometry.computeBoundingSphere();
		pickMesh.matrixAutoUpdate = false;
		pickMesh.matrixWorld.copy(matrix);
	};
	hoverHalo.matrixAutoUpdate = false;
	hoverHalo.visible = false;
	scene.add(hoverHalo);
	const haloScale = new Matrix4().makeScale(1.08, 1.08, 1.08);
	const hitResults: ReturnType<Raycaster['intersectObject']> = [];
	const pointer = new Vector2();
	const raycaster = new Raycaster();
	let hoveredIndex: number | null = null;
	let hoverFrame: number | null = null;
	let isPointerInside = false;
	let isPointerDirty = false;
	let lastPickTime = 0;
	const pickTag = () => {
		if (!isPointerInside || !paper.count) return null;
		raycaster.setFromCamera(pointer, camera);
		hitResults.length = 0;
		let nearest = Infinity;
		let selected: number | null = null;
		const matrix = new Matrix4();
		for (let index = 0; index < (world?.tags.length ?? 0); index++) {
			const tag = world!.tags[index];
			paper.getMatrixAt(index, matrix);
			// Reject most tags with a cheap sphere before deforming the picking mesh.
			const center = new Vector3().setFromMatrixPosition(matrix);
			if (!raycaster.ray.intersectsSphere(new Sphere(center, tag.width * 1.5))) continue;
			if (tag.clothPositions) deformPickMesh(tag, matrix);
			else {
				pickMesh.geometry = geometry;
				pickMesh.matrixWorld.copy(matrix);
			}
			if (tag.clothPositions) pickMesh.geometry = pickGeometry;
			hitResults.length = 0;
			raycaster.intersectObject(pickMesh, false, hitResults);
			if (hitResults[0]?.distance < nearest) {
				nearest = hitResults[0].distance;
				selected = index;
			}
		}
		return selected;
	};
	const backArtworkGeometry = createClothArtworkGeometry(geometry, maxTagBodies);
	const frontArtworkGeometry = createClothArtworkGeometry(geometry, maxTagBodies);
	const backArtworkIndices = new InstancedBufferAttribute(new Float32Array(maxTagBodies), 1);
	const frontArtworkIndices = new InstancedBufferAttribute(new Float32Array(maxTagBodies), 1);
	backArtworkIndices.setUsage(DynamicDrawUsage);
	frontArtworkIndices.setUsage(DynamicDrawUsage);
	backArtworkGeometry.setAttribute('artworkIndex', backArtworkIndices);
	frontArtworkGeometry.setAttribute('artworkIndex', frontArtworkIndices);
	const backArtworkMaterial = createArtworkMaterial(artworkAtlas, true);
	const frontArtworkMaterial = createArtworkMaterial(artworkAtlas);
	applyClothMaterial(backArtworkMaterial, clothTexture.texture);
	applyClothMaterial(frontArtworkMaterial, clothTexture.texture);
	const backInk = new InstancedMesh(backArtworkGeometry, backArtworkMaterial, maxTagBodies);
	const frontInk = new InstancedMesh(frontArtworkGeometry, frontArtworkMaterial, maxTagBodies);
	const inks = [backInk, frontInk];
	for (const ink of inks) {
		ink.count = 0;
		ink.frustumCulled = false;
		ink.receiveShadow = true;
		ink.instanceMatrix.setUsage(DynamicDrawUsage);
	}
	scene.add(backInk, frontInk);
	const artworkOffsets = [-1, 1].map((direction) =>
		new Matrix4().makeTranslation(0, 0, direction * (getVisualThickness(settings) / 2 + 0.0002))
	);
	const transform = new Object3D();
	const patchTransform = new Matrix4();
	const patchOffsets = [-1, 1].map((direction) =>
		new Matrix4().makeTranslation(
			tagHole.center.x,
			tagHole.center.y,
			direction * (getVisualThickness(settings) / 2 + getVisualPatchThickness(settings) / 2)
		)
	);
	const renderedSleeping = new Set<number>();
	let paletteVersion = 0;
	let renderedPaletteVersion = -1;
	let renderedRevision = -1;
	let accumulator = 0;
	let frame: number | null = null;
	let height = 0;
	let isActive = false;
	let isDestroyed = false;
	let lastTime = 0;
	const emissionClock = createTagEmissionClock();
	let resizeVersion = 0;
	let width = 0;
	let world: Awaited<ReturnType<typeof createTagWorld>> | null = null;
	const readPalette = () => {
		const styles = getComputedStyle(canvas);
		hoverMaterial.color.set(styles.getPropertyValue('--color-primary-400').trim());
		palette.forEach((color, index) =>
			color.set(styles.getPropertyValue(`--color-${tagColors[index]}`).trim())
		);
		paletteVersion++;
	};
	const draw = () => {
		if (isDestroyed) return;
		const tags = world?.tags ?? [];
		const revision = world?.getRevision() ?? 0;
		if (revision !== renderedRevision) {
			// Waking or removing tags invalidates settled-instance caches and compacted indices.
			renderedSleeping.clear();
			paper.count = patches.count = backInk.count = frontInk.count = 0;
			hoveredIndex = null;
			isPointerDirty = true;
			renderedRevision = revision;
		}
		const isPaletteChanged = renderedPaletteVersion !== paletteVersion;
		const firstNew = paper.count;
		const newCount = Math.max(0, tags.length - firstNew);
		let firstMoved = tags.length;
		let lastMoved = -1;
		for (let index = 0; index < tags.length; index++) {
			const tag = tags[index];
			if (index >= paper.count) {
				for (const mesh of [paper, backInk, frontInk])
					mesh.geometry.getAttribute('clothRow').setX(index, index);
				patches.geometry.getAttribute('clothRow').setX(index * 2, index);
				patches.geometry.getAttribute('clothRow').setX(index * 2 + 1, index);
				frontArtworkIndices.setX(index, tag.frontArtwork + 1);
				backArtworkIndices.setX(
					index,
					tag.backArtwork < 0 ? 0 : artworkCounts.fronts + tag.backArtwork + 1
				);
			}
			if (isPaletteChanged || index >= paper.count) paper.setColorAt(index, palette[tag.color]);
			if (
				renderedSleeping.has(index) &&
				!tag.cloth &&
				(tag.body.isFixed() || tag.body.isSleeping())
			)
				continue;
			renderedSleeping.delete(index);
			firstMoved = Math.min(firstMoved, index);
			lastMoved = index;
			const position = tag.body.translation();
			const rotation = tag.body.rotation();
			transform.position.set(position.x, position.y, position.z);
			transform.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
			transform.scale.setScalar(tag.width);
			transform.updateMatrix();
			paper.setMatrixAt(index, transform.matrix);
			const textureOffset =
				((index % 1024) * clothTexture.texture.image.width +
					Math.floor(index / 1024) * clothParticleCount) *
				4;
			for (let particle = 0; particle < clothParticleCount; particle++) {
				const start = textureOffset + particle * 4;
				for (let axis = 0; axis < 3; axis++)
					clothTexture.data[start + axis] = tag.clothPositions?.[particle * 3 + axis] ?? 0;
				clothTexture.data[start + 3] = tag.clothPositions ? 1 : 0;
			}
			clothTexture.texture.addUpdateRange(textureOffset, clothParticleCount * 4);
			for (let side = 0; side < 2; side++) {
				patchTransform.multiplyMatrices(transform.matrix, patchOffsets[side]);
				patches.setMatrixAt(index * 2 + side, patchTransform);
				patchTransform.multiplyMatrices(transform.matrix, artworkOffsets[side]);
				inks[side].setMatrixAt(index, patchTransform);
				patches.geometry
					.getAttribute('clothDepth')
					.setX(
						index * 2 + side,
						(side === 0 ? -1 : 1) *
							(getVisualThickness(settings) / 2 + getVisualPatchThickness(settings) / 2)
					);
				inks[side].geometry
					.getAttribute('clothDepth')
					.setX(index, (side === 0 ? -1 : 1) * (getVisualThickness(settings) / 2 + 0.0002));
			}
			if (!tag.cloth && (tag.body.isFixed() || tag.body.isSleeping())) renderedSleeping.add(index);
		}
		paper.count = tags.length;
		backInk.count = artworkCounts.backs ? tags.length : 0;
		frontInk.count = artworkCounts.fronts ? tags.length : 0;
		patches.count = tags.length * 2;
		const movedCount = Math.max(0, lastMoved - firstMoved + 1);
		if (movedCount) clothTexture.texture.needsUpdate = true;
		for (const mesh of [paper, patches, backInk, frontInk]) {
			const multiplier = mesh === patches ? 2 : 1;
			uploadInstances(
				mesh.geometry.getAttribute('clothRow') as BufferAttribute,
				firstNew * multiplier,
				newCount * multiplier
			);
			uploadInstances(
				mesh.geometry.getAttribute('clothDepth') as BufferAttribute,
				firstMoved * multiplier,
				movedCount * multiplier
			);
		}
		uploadInstances(paper.instanceMatrix, firstMoved, movedCount);
		uploadInstances(patches.instanceMatrix, firstMoved * 2, movedCount * 2);
		for (const ink of inks)
			if (ink.count) uploadInstances(ink.instanceMatrix, firstMoved, movedCount);
		if (backInk.count) uploadInstances(backArtworkIndices, firstNew, newCount);
		if (frontInk.count) uploadInstances(frontArtworkIndices, firstNew, newCount);
		if (paper.instanceColor) {
			if (firstNew === 0 && newCount) paper.instanceColor.setUsage(DynamicDrawUsage);
			uploadInstances(
				paper.instanceColor,
				isPaletteChanged ? 0 : firstNew,
				isPaletteChanged ? tags.length : newCount
			);
		}
		renderedPaletteVersion = paletteVersion;
		// Limit raycasting to 30Hz while still tracking tags moving under a stationary pointer.
		if (isPointerDirty || performance.now() - lastPickTime >= 1000 / 30) {
			hoveredIndex = pickTag();
			lastPickTime = performance.now();
			isPointerDirty = false;
			canvas.classList.toggle('cursor-pointer', hoveredIndex !== null);
			if (hoveredIndex === null) delete canvas.dataset.hoveredTag;
			else canvas.dataset.hoveredTag = String(hoveredIndex);
		}
		hoverHalo.visible = hoveredIndex !== null;
		if (hoveredIndex !== null) {
			paper.getMatrixAt(hoveredIndex, hoverHalo.matrix);
			const tag = tags[hoveredIndex];
			if (tag.clothPositions) {
				deformPickMesh(tag, hoverHalo.matrix);
				hoverHalo.geometry = pickGeometry;
			} else hoverHalo.geometry = geometry;
			hoverHalo.matrix.multiply(haloScale);
		}
		floor.visible = !(world?.isFloorOpen() ?? false);
		renderer.render(scene, camera);
		canvas.dataset.tagCount = String(world?.tags.length ?? 0);
		canvas.dataset.isFloorOpen = String(world?.isFloorOpen() ?? false);
		canvas.dataset.renderer = 'webgl-3d';
		canvas.dataset.backDesigns = String(artworkCounts.backs);
		canvas.dataset.frontDesigns = String(artworkCounts.fronts);
		canvas.dataset.activeClothTags = String(tags.filter((tag) => tag.cloth).length);
		canvas.dataset.settledTags = String(tags.filter((tag) => tag.body.isFixed()).length);
	};
	const inspectTag = (index: number | null = hoveredIndex) => {
		if (!world?.tags.length || !onselect) return;
		if (index === null) {
			// Keyboard entry chooses a visible tag nearest the center of the canvas.
			let nearest = Infinity;
			const projected = new Vector3();
			for (let candidate = 0; candidate < world.tags.length; candidate++) {
				const position = world.tags[candidate].body.translation();
				projected.set(position.x, position.y, position.z).project(camera);
				if (Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1) continue;
				const distance = projected.x ** 2 + projected.y ** 2;
				if (distance < nearest) {
					nearest = distance;
					index = candidate;
				}
			}
		}
		if (index === null) return;
		const tag = world.tags[index];
		if (!tag) return;
		const name =
			tagArtworkNames.fronts[tag.frontArtwork] ?? tagArtworkNames.backs[tag.backArtwork] ?? 'Tag';
		canvas.focus({ preventScroll: true });
		onselect({
			atlas: artworkAtlas,
			backArtwork: tag.backArtwork,
			color: palette[tag.color].getStyle(),
			frontArtwork: tag.frontArtwork,
			name: name.replace(/\.svg$/, '').replaceAll('-', ' '),
			patchThickness: getVisualPatchThickness(settings),
			rotation: tag.body.rotation(),
			thickness: getVisualThickness(settings)
		});
	};
	const queuePointerDraw = () => {
		isPointerDirty = true;
		if (isActive || hoverFrame !== null) return;
		hoverFrame = requestAnimationFrame(() => {
			hoverFrame = null;
			draw();
		});
	};
	const onpointermove = (event: PointerEvent) => {
		const rect = canvas.getBoundingClientRect();
		pointer.set(
			((event.clientX - rect.left) / rect.width) * 2 - 1,
			1 - ((event.clientY - rect.top) / rect.height) * 2
		);
		isPointerInside = true;
		queuePointerDraw();
	};
	const onpointerleave = () => {
		isPointerInside = false;
		queuePointerDraw();
	};
	const onclick = (event: MouseEvent) => {
		onpointermove(event as PointerEvent);
		const index = pickTag();
		if (index !== null) inspectTag(index);
	};
	const onkeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		inspectTag();
	};
	canvas.addEventListener('pointermove', onpointermove);
	canvas.addEventListener('pointerleave', onpointerleave);
	canvas.addEventListener('click', onclick);
	canvas.addEventListener('keydown', onkeydown);
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
		if (world) {
			world.setSpawnBoundary(getTagSpawnBoundary(camera, world.depth));
			const bottom = new Vector3(0, -1, 0).unproject(camera);
			const direction = camera.getWorldDirection(new Vector3());
			const slope = direction.y / direction.z;
			// Include scene depth and the entire rotated tag, so deletion is never visible.
			world.setCleanupExit(bottom.y - bottom.z * slope - Math.abs(world.depth * slope) - 2);
		}
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
		// Bound fill-rate cost on large/high-DPI displays while retaining sharper small canvases.
		renderer.setPixelRatio(
			Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1_500_000 / (width * height)))
		);
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
			renderedSleeping.clear();
			updateDropZone();
			draw();
			return;
		}
		const nextWorld = await createTagWorld(
			viewWidth,
			viewHeight,
			Math.random,
			settings,
			tagArtworkPairs,
			true
		);
		if (isDestroyed || version !== resizeVersion) {
			nextWorld.destroy();
			return;
		}
		world = nextWorld;
		updateDropZone();
		emissionClock.reset();
		readPalette();
		draw();
	};
	const tick = (time: number) => {
		frame = null;
		if (!isActive || isDestroyed) return;
		// Preserve the configured cadence on slower frames without replaying a long tab stall.
		const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.25) : 0;
		lastTime = time;
		accumulator += delta;
		let isWorldChanged = false;
		while (accumulator >= 1 / 60) {
			if (world) {
				const simulation = world;
				emissionClock.advance(settings.tagsPerSecond, 1 / 60, () => {
					isWorldChanged ||= simulation.tags.length < maxTagBodies;
					simulation.spawn();
				});
			} else emissionClock.reset();
			// Advance the cleanup clock even when every tag has settled; idle worlds skip Rapier solving.
			const isStepChanged = world?.step() ?? false;
			isWorldChanged ||= isStepChanged;
			accumulator -= 1 / 60;
		}
		if (isWorldChanged || isPointerDirty) draw();
		frame = requestAnimationFrame(tick);
	};
	const update = (nextIsActive: boolean) => {
		if (isActive === nextIsActive) return;
		isActive = nextIsActive;
		lastTime = 0;
		accumulator = 0;
		emissionClock.reset();
		if (isActive) frame = requestAnimationFrame(tick);
		else if (frame !== null) {
			cancelAnimationFrame(frame);
			frame = null;
		}
	};
	const clear = () => {
		world?.clear();
		renderedSleeping.clear();
		paper.count = patches.count = backInk.count = frontInk.count = 0;
		hoveredIndex = null;
		isPointerDirty = true;
		emissionClock.reset();
		draw();
	};
	const configure = (next: TagRainSettings) => {
		const normalized = normalizeRainSettings(next);
		const isZoomChanged = normalized.cameraZoom !== settings.cameraZoom;
		const isShapeChanged =
			getVisualThickness(normalized) !== getVisualThickness(settings) ||
			getVisualPatchThickness(normalized) !== getVisualPatchThickness(settings);
		settings = normalized;
		world?.configure(settings);
		if (isShapeChanged) {
			// Rebuild geometry and colliders together so changes never leave mismatched pile contacts.
			geometry.dispose();
			geometry = prepareGeometry(createTagGeometry(getVisualThickness(settings)), maxTagBodies);
			paper.geometry = geometry;
			hoverHalo.geometry = geometry;
			patchGeometry.dispose();
			patchGeometry = prepareGeometry(
				createPatchGeometry(getVisualPatchThickness(settings)),
				maxTagBodies * 2,
				tagHole.center.x,
				tagHole.center.y
			);
			patches.geometry = patchGeometry;
			artworkOffsets.forEach((offset, side) =>
				offset.makeTranslation(
					0,
					0,
					(side === 0 ? -1 : 1) * (getVisualThickness(settings) / 2 + 0.0002)
				)
			);
			patchOffsets.forEach((offset, side) =>
				offset.makeTranslation(
					tagHole.center.x,
					tagHole.center.y,
					(side === 0 ? -1 : 1) *
						(getVisualThickness(settings) / 2 + getVisualPatchThickness(settings) / 2)
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
		inspectTag,
		update,
		destroy: () => {
			isDestroyed = true;
			if (frame !== null) cancelAnimationFrame(frame);
			if (hoverFrame !== null) cancelAnimationFrame(hoverFrame);
			canvas.removeEventListener('pointermove', onpointermove);
			canvas.removeEventListener('pointerleave', onpointerleave);
			canvas.removeEventListener('click', onclick);
			canvas.removeEventListener('keydown', onkeydown);
			canvas.classList.remove('cursor-pointer');
			observer.disconnect();
			themeObserver.disconnect();
			world?.destroy();
			geometry.dispose();
			pickGeometry.dispose();
			clothTexture.texture.dispose();
			depthMaterial.dispose();
			patchGeometry.dispose();
			backArtworkGeometry.dispose();
			frontArtworkGeometry.dispose();
			backArtworkMaterial.dispose();
			frontArtworkMaterial.dispose();
			backInk.dispose();
			frontInk.dispose();
			artworkAtlas.texture.dispose();
			floorGeometry.dispose();
			floorMaterial.dispose();
			paper.dispose();
			patches.dispose();
			paperMaterial.dispose();
			edgeMaterial.dispose();
			patchMaterial.dispose();
			hoverMaterial.dispose();
			light.shadow.map?.dispose();
			renderer.dispose();
			renderer.forceContextLoss();
			renderedSleeping.clear();
			scene.clear();
		}
	};
};
