import RAPIER from '@dimforge/rapier3d-compat';
import {
	BufferAttribute,
	BufferGeometry,
	DataTexture,
	FloatType,
	InstancedBufferAttribute,
	Matrix4,
	RGBAFormat,
	Vector3
} from 'three';
import type { Material } from 'three';
import { tagOutline, tagPathBounds, tagSvgFrame } from './profile';

// 24 particles per tag: stiff in-plane edges, compliant bending, and no global shape matching.
export const maxActiveClothTags = 12;
const rows = [-1, -2 / 3, -1 / 3, 0, 1 / 3, 2 / 3, tagOutline[2].y, 1];
export const clothParticleCount = rows.length * 3;
export const clothRestPositions = new Float32Array(
	rows.flatMap((y, row) => {
		const left = row === rows.length - 1 ? tagOutline[4].x : -0.5;
		const right = row === rows.length - 1 ? tagOutline[3].x : 0.5;
		return [left, (left + right) / 2, right].flatMap((x) => [x, y, 0]);
	})
);
export const clothTriangles = new Uint32Array(
	rows.slice(1).flatMap((_, row) =>
		[0, 1].flatMap((column) => {
			const a = row * 3 + column;
			return [a, a + 1, a + 3, a + 1, a + 4, a + 3];
		})
	)
);

export const createClothBody = (
	world: RAPIER.World,
	pose: Matrix4,
	radius: number,
	bounce: number
) => {
	const positions = clothRestPositions.slice();
	const point = new Vector3();
	for (let index = 0; index < clothParticleCount; index++) {
		point
			.fromArray(positions, index * 3)
			.applyMatrix4(pose)
			.toArray(positions, index * 3);
	}
	const material = RAPIER.SoftBodyMaterial.uniform(120, 1);
	material.bendSoftness = { naturalFrequency: 5, dampingRatio: 1 };
	const description = RAPIER.SoftBodyDesc.trimesh(positions, clothTriangles)!;
	// Trimesh's default shape matching makes paper rigid; structural edges resist stretching instead.
	const edges = new Set<string>();
	const pairs: number[] = [];
	for (let triangle = 0; triangle < clothTriangles.length; triangle += 3) {
		for (let side = 0; side < 3; side++) {
			const a = clothTriangles[triangle + side];
			const b = clothTriangles[triangle + ((side + 1) % 3)];
			const key = `${Math.min(a, b)}:${Math.max(a, b)}`;
			if (!edges.has(key)) pairs.push(a, b);
			edges.add(key);
		}
	}
	return world.createSoftBody(
		description
			.setEdges(pairs)
			.setMaterial(material)
			.setShapeMatching(false)
			.setMass(0.048)
			.setParticleRadius(radius)
			.setLinearDamping(0.8)
			.setSelfContacts(true)
			.setAdditionalPgsIterations(2)
			.setSurfaceCollider(
				RAPIER.ColliderDesc.ball(radius)
					.setFriction(0.65)
					.setRestitution(bounce)
					.setCollisionGroups(0x00010003)
			)
	);
};

// Keep the exact outline and hole by subdividing the original triangles, rather than replacing
// the artwork with a rectangular plane. Vertex normals and UVs are interpolated together.
export const subdivideClothGeometry = (source: BufferGeometry) => {
	const geometry = source.index ? source.toNonIndexed() : source.clone();
	const attributes = ['position', 'normal', 'uv'];
	const output: Record<string, number[]> = Object.fromEntries(attributes.map((name) => [name, []]));
	const groups = geometry.groups.length
		? geometry.groups
		: [{ start: 0, count: geometry.getAttribute('position').count, materialIndex: 0 }];
	geometry.clearGroups();
	const append = (vertices: number[][], depth: number) => {
		const longest = Math.max(
			...vertices.map((a, index) => {
				const b = vertices[(index + 1) % 3];
				return Math.hypot(a[0] - b[0], a[1] - b[1]);
			})
		);
		if (longest > 0.3 && depth < 4) {
			const [a, b, c] = vertices;
			const midpoint = (a: number[], b: number[]) => a.map((v, i) => (v + b[i]) / 2);
			const ab = midpoint(a, b),
				bc = midpoint(b, c),
				ca = midpoint(c, a);
			for (const triangle of [
				[a, ab, ca],
				[ab, b, bc],
				[ca, bc, c],
				[ab, bc, ca]
			])
				append(triangle, depth + 1);
			return;
		}
		for (const vertex of vertices) {
			output.position.push(...vertex.slice(0, 3));
			output.normal.push(...vertex.slice(3, 6));
			output.uv.push(...vertex.slice(6, 8));
		}
	};
	for (const group of groups) {
		const start = output.position.length / 3;
		for (let index = group.start; index < group.start + group.count; index += 3) {
			append(
				[0, 1, 2].map((offset) =>
					attributes.flatMap((name) => {
						const attribute = source.getAttribute(name);
						const vertex = source.index ? source.index.getX(index + offset) : index + offset;
						return Array.from(
							{ length: attribute.itemSize },
							(_, component) => attribute.array[vertex * attribute.itemSize + component]
						);
					})
				),
				0
			);
		}
		geometry.addGroup(start, output.position.length / 3 - start, group.materialIndex);
	}
	for (const name of attributes)
		geometry.setAttribute(
			name,
			new BufferAttribute(new Float32Array(output[name]), name === 'uv' ? 2 : 3)
		);
	return geometry;
};

export const clothWeightsAt = (x: number, y: number) => {
	let row = 0;
	while (row < rows.length - 2 && y > rows[row + 1]) row++;
	const v = Math.min(1, Math.max(0, (y - rows[row]) / (rows[row + 1] - rows[row])));
	const left = clothRestPositions[row * 9] * (1 - v) + clothRestPositions[(row + 1) * 9] * v;
	const right =
		clothRestPositions[row * 9 + 6] * (1 - v) + clothRestPositions[(row + 1) * 9 + 6] * v;
	const u = Math.min(2, Math.max(0, ((x - left) / (right - left)) * 2));
	const column = Math.min(1, Math.floor(u));
	const fraction = u - column;
	const a = row * 3 + column;
	return {
		indices: [a, a + 1, a + 3, a + 4],
		weights: [(1 - fraction) * (1 - v), fraction * (1 - v), (1 - fraction) * v, fraction * v]
	};
};

export const prepareClothGeometry = (source: BufferGeometry, count: number, x = 0, y = 0) => {
	const geometry = subdivideClothGeometry(source);
	const position = geometry.getAttribute('position');
	const indices: number[] = [],
		weights: number[] = [];
	for (let index = 0; index < position.count; index++) {
		const mapping = clothWeightsAt(position.getX(index) + x, position.getY(index) + y);
		indices.push(...mapping.indices);
		weights.push(...mapping.weights);
	}
	geometry.setAttribute('clothIndices', new BufferAttribute(new Float32Array(indices), 4));
	geometry.setAttribute('clothWeights', new BufferAttribute(new Float32Array(weights), 4));
	geometry.setAttribute('clothRow', new InstancedBufferAttribute(new Float32Array(count), 1));
	geometry.setAttribute('clothDepth', new InstancedBufferAttribute(new Float32Array(count), 1));
	return geometry;
};

export const createClothTexture = (capacity: number) => {
	// Tile tag rows within a 1024-high texture instead of exceeding mobile GPU texture limits.
	const columns = Math.ceil(capacity / 1024);
	const data = new Float32Array(columns * clothParticleCount * 1024 * 4);
	const texture = new DataTexture(data, columns * clothParticleCount, 1024, RGBAFormat, FloatType);
	texture.needsUpdate = true;
	return { data, texture, columns };
};

export const createClothArtworkGeometry = (paper: BufferGeometry, capacity: number) => {
	const geometry = new BufferGeometry();
	const positions = paper.getAttribute('position');
	const normals = paper.getAttribute('normal');
	const indices = paper.getAttribute('clothIndices');
	const weights = paper.getAttribute('clothWeights');
	const output = {
		position: [] as number[],
		normal: [] as number[],
		uv: [] as number[],
		clothIndices: [] as number[],
		clothWeights: [] as number[]
	};
	// Reuse the paper's face triangles exactly. Different triangulations of a bent quad can
	// intersect even when their vertices share the same deformation, causing ink to flicker.
	for (let index = 0; index < positions.count; index++) {
		if (normals.getZ(index) < 0.99) continue;
		const x = positions.getX(index),
			y = positions.getY(index);
		output.position.push(x, y, 0);
		output.normal.push(0, 0, 1);
		output.uv.push(
			((x + 0.5) * tagPathBounds.width) / tagSvgFrame.width,
			1 - ((1 - y) * tagPathBounds.height) / (2 * tagSvgFrame.height)
		);
		for (let component = 0; component < 4; component++) {
			output.clothIndices.push(indices.array[index * 4 + component]);
			output.clothWeights.push(weights.array[index * 4 + component]);
		}
	}
	for (const name of ['position', 'normal', 'uv', 'clothIndices', 'clothWeights'] as const)
		geometry.setAttribute(
			name,
			new BufferAttribute(
				new Float32Array(output[name]),
				name === 'uv' ? 2 : name.startsWith('cloth') ? 4 : 3
			)
		);
	geometry.setAttribute('clothRow', new InstancedBufferAttribute(new Float32Array(capacity), 1));
	geometry.setAttribute('clothDepth', new InstancedBufferAttribute(new Float32Array(capacity), 1));
	return geometry;
};

export const applyClothMaterial = (
	material: Material,
	texture: DataTexture,
	offset = { x: 0, y: 0, z: 0 }
) => {
	const previous = material.onBeforeCompile;
	const previousCacheKey = material.customProgramCacheKey.bind(material);
	const originalKey = previousCacheKey();
	material.onBeforeCompile = (shader, renderer) => {
		previous.call(material, shader, renderer);
		shader.uniforms.clothTexture = { value: texture };
		shader.uniforms.clothOffset = { value: new Vector3(offset.x, offset.y, offset.z) };
		shader.vertexShader =
			`
uniform sampler2D clothTexture;
uniform vec3 clothOffset;
attribute vec4 clothIndices;
attribute vec4 clothWeights;
attribute float clothRow;
attribute float clothDepth;
vec3 clothPoint(float index) {
  int tag = int(clothRow);
  return texelFetch(clothTexture, ivec2((tag / 1024) * ${clothParticleCount} + int(index), tag % 1024), 0).xyz;
}
` + shader.vertexShader;
		shader.vertexShader = shader.vertexShader.replace(
			'void main() {',
			`
void main() {
vec3 ca = clothPoint(clothIndices.x), cb = clothPoint(clothIndices.y);
vec3 cc = clothPoint(clothIndices.z), cd = clothPoint(clothIndices.w);
float isCloth = texelFetch(clothTexture, ivec2((int(clothRow) / 1024) * ${clothParticleCount}, int(clothRow) % 1024), 0).w;
vec3 clothNormal = normalize(cross(cb - ca, cc - ca) + cross(cd - cb, cc - cb));
vec3 clothTangent = normalize(cb - ca);
vec3 clothBitangent = normalize(cc - ca);
`
		);
		shader.vertexShader = shader.vertexShader.replace(
			'#include <beginnormal_vertex>',
			`
#include <beginnormal_vertex>
if (isCloth > 0.5) objectNormal = normalize(clothTangent * normal.x + clothBitangent * normal.y + clothNormal * normal.z);
`
		);
		shader.vertexShader = shader.vertexShader.replace(
			'#include <begin_vertex>',
			`
#include <begin_vertex>
if (isCloth > 0.5) transformed = ca * clothWeights.x + cb * clothWeights.y + cc * clothWeights.z + cd * clothWeights.w + clothNormal * (position.z + clothDepth) - vec3(clothOffset.xy, clothDepth);
`
		);
	};
	material.customProgramCacheKey = () =>
		`${originalKey}:cloth-v1:${offset.x}:${offset.y}:${offset.z}`;
};
