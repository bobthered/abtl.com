import {
	BackSide,
	CanvasTexture,
	FrontSide,
	MeshBasicMaterial,
	MultiplyBlending,
	ShapeGeometry,
	SRGBColorSpace
} from 'three';
import { createTagShape, tagPathBounds, tagSvgFrame } from './profile';

const collectArtwork = (files: Record<string, string>) =>
	Object.entries(files)
		.sort(([first], [second]) => first.localeCompare(second))
		.map(([path, url]) => ({ name: path.split(/\/(?:fronts|backs)\//)[1], url }));

// Adding an SVG to either directory automatically includes it in the next build.
const artworkFiles = {
	backs: collectArtwork(
		import.meta.glob<string>('../../assets/tags/backs/**/*.svg', {
			eager: true,
			import: 'default',
			query: '?url'
		})
	),
	fronts: collectArtwork(
		import.meta.glob<string>('../../assets/tags/fronts/**/*.svg', {
			eager: true,
			import: 'default',
			query: '?url'
		})
	)
};

export const tagArtwork = {
	backs: artworkFiles.backs.map(({ url }) => url),
	fronts: artworkFiles.fronts.map(({ url }) => url)
};
export const tagArtworkNames = {
	backs: artworkFiles.backs.map(({ name }) => name),
	fronts: artworkFiles.fronts.map(({ name }) => name)
};
export const artworkCounts = {
	backs: tagArtwork.backs.length,
	fronts: tagArtwork.fronts.length
};

export type ArtworkPair = { backArtwork: number; frontArtwork: number };
export const createArtworkPairs = (fronts: string[], backs: string[]): ArtworkPair[] => {
	const frontIndices = new Map(fronts.map((name, index) => [name, index]));
	const backIndices = new Map(backs.map((name, index) => [name, index]));
	return [...new Set([...fronts, ...backs])].sort().map((name) => ({
		backArtwork: backIndices.get(name) ?? -1,
		frontArtwork: frontIndices.get(name) ?? -1
	}));
};
export const tagArtworkPairs = createArtworkPairs(
	artworkFiles.fronts.map(({ name }) => name),
	artworkFiles.backs.map(({ name }) => name)
);
export const chooseTagArtwork = (random: () => number, pairs = tagArtworkPairs): ArtworkPair => {
	if (!pairs.length) return { backArtwork: -1, frontArtwork: -1 };
	const index =
		pairs.length === 1 ? 0 : Math.min(pairs.length - 1, Math.floor(random() * pairs.length));
	return { ...pairs[index] };
};

export const createArtworkGeometry = () => {
	const geometry = new ShapeGeometry(createTagShape(), 6);
	const positions = geometry.getAttribute('position');
	const uv = geometry.getAttribute('uv');
	// Match the supplied artwork viewBox to the original path, including its small margins.
	for (let index = 0; index < positions.count; index++)
		uv.setXY(
			index,
			((positions.getX(index) + 0.5) * tagPathBounds.width) / tagSvgFrame.width,
			1 - (((1 - positions.getY(index)) / 2) * tagPathBounds.height) / tagSvgFrame.height
		);
	return geometry;
};

export const createArtworkAtlas = async () => {
	const urls = [...tagArtwork.fronts, ...tagArtwork.backs];
	const columns = Math.ceil(Math.sqrt((urls.length + 1) * 2));
	const rows = Math.ceil((urls.length + 1) / columns);
	// Keep the atlas within WebGL2's minimum supported texture size as the catalog grows.
	const tileWidth = 2 ** Math.floor(Math.log2(Math.min(512, 4096 / columns, 4096 / rows / 2)));
	const tileHeight = tileWidth * 2;
	const canvas = document.createElement('canvas');
	canvas.width = columns * tileWidth;
	canvas.height = rows * tileHeight;
	const context = canvas.getContext('2d');
	if (!context) throw new Error('Unable to prepare tag artwork.');
	await Promise.all(
		urls.map(async (url, index) => {
			const image = new Image();
			image.src = url;
			await image.decode();
			// Tile zero stays transparent for sides that have no artwork yet.
			const tile = index + 1;
			context.drawImage(
				image,
				(tile % columns) * tileWidth,
				Math.floor(tile / columns) * tileHeight,
				tileWidth,
				tileHeight
			);
		})
	);
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	return { columns, rows, texture };
};

export const createArtworkMaterial = (
	atlas: Awaited<ReturnType<typeof createArtworkAtlas>>,
	isBack = false
) => {
	// Multiply unlit ink into the already-lit stock so lighting is applied only once.
	const material = new MeshBasicMaterial({
		alphaTest: 0.01,
		blending: MultiplyBlending,
		depthWrite: false,
		map: atlas.texture,
		premultipliedAlpha: true,
		side: isBack ? BackSide : FrontSide,
		toneMapped: false,
		transparent: true
	});
	// Keep all designs in one instanced draw per face instead of adding a mesh per tag/design.
	material.onBeforeCompile = (shader) => {
		shader.vertexShader =
			`attribute float artworkIndex;\nvarying float vArtworkIndex;\n${shader.vertexShader}`.replace(
				'#include <uv_vertex>',
				'#include <uv_vertex>\nvArtworkIndex = artworkIndex;'
			);
		shader.fragmentShader = `varying float vArtworkIndex;\n${shader.fragmentShader}`.replace(
			'#include <map_fragment>',
			`vec2 artworkUv = vMapUv;
			${isBack ? `artworkUv.x = ${(tagPathBounds.width / tagSvgFrame.width).toFixed(8)} - artworkUv.x;` : ''}
			vec2 tile = vec2(mod(vArtworkIndex, ${atlas.columns.toFixed(1)}), ${atlas.rows.toFixed(1)} - 1.0 - floor(vArtworkIndex / ${atlas.columns.toFixed(1)}));
			diffuseColor *= texture2D(map, (tile + artworkUv) / vec2(${atlas.columns.toFixed(1)}, ${atlas.rows.toFixed(1)}));`
		);
	};
	material.customProgramCacheKey = () => `tag-artwork-${isBack}-${atlas.columns}-${atlas.rows}`;
	return material;
};
