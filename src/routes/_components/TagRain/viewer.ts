import {
	AmbientLight,
	Color,
	DirectionalLight,
	Euler,
	Group,
	InstancedBufferAttribute,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshStandardMaterial,
	OrthographicCamera,
	Quaternion,
	Scene,
	WebGLRenderer
} from 'three';
import { artworkCounts, createArtworkGeometry, createArtworkMaterial } from './artwork';
import { createPatchGeometry, createTagGeometry } from './physics';
import type { TagSelection } from './physics';
import { tagHole } from './profile';

export const createTagViewer = (canvas: HTMLCanvasElement, selection: TagSelection) => {
	const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
	const scene = new Scene();
	const camera = new OrthographicCamera(-1, 1, 1.25, -1.25, 0.1, 20);
	camera.position.z = 5;
	const tag = new Group();
	const geometry = createTagGeometry(selection.thickness);
	const paperMaterial = new MeshStandardMaterial({
		color: new Color(selection.color),
		roughness: 0.9
	});
	const edgeMaterial = new MeshStandardMaterial({ color: 0x888888, roughness: 1 });
	tag.add(new Mesh(geometry, [paperMaterial, edgeMaterial]));
	const patchGeometry = createPatchGeometry(selection.patchThickness);
	const patchMaterial = new MeshStandardMaterial({ color: 0xae621a, roughness: 1 });
	for (const direction of [-1, 1]) {
		const patch = new Mesh(patchGeometry, patchMaterial);
		patch.position.set(
			tagHole.center.x,
			tagHole.center.y,
			(direction * (selection.thickness + selection.patchThickness)) / 2
		);
		tag.add(patch);
	}
	const inks = [false, true].map((isBack) => {
		const inkGeometry = createArtworkGeometry();
		const tile = isBack
			? selection.backArtwork < 0
				? 0
				: artworkCounts.fronts + selection.backArtwork + 1
			: selection.frontArtwork + 1;
		inkGeometry.setAttribute(
			'artworkIndex',
			new InstancedBufferAttribute(new Float32Array([tile]), 1)
		);
		const material = createArtworkMaterial(selection.atlas, isBack);
		const ink = new InstancedMesh(inkGeometry, material, 1);
		ink.setMatrixAt(
			0,
			new Matrix4().makeTranslation(0, 0, (isBack ? -1 : 1) * (selection.thickness / 2 + 0.0002))
		);
		tag.add(ink);
		return ink;
	});
	tag.quaternion.copy(selection.rotation);
	scene.add(tag, new AmbientLight(0xffffff, 1.4));
	const light = new DirectionalLight(0xffffff, 2);
	light.position.set(-3, 5, 7);
	scene.add(light);
	const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
	let frame: number | null = null;
	let isBack = false;
	let isDestroyed = false;
	let isOpening = true;
	let startTime = performance.now();
	const start = tag.quaternion.clone();
	const target = new Quaternion();
	const render = () => {
		if (!isDestroyed) renderer.render(scene, camera);
	};
	const animate = (time: number) => {
		frame = null;
		if (isDestroyed) return;
		const progress = preference.matches ? 1 : Math.min(1, (time - startTime) / 520);
		const eased = 1 - (1 - progress) ** 3;
		tag.quaternion.slerpQuaternions(start, target, eased);
		tag.scale.setScalar(isOpening ? 0.7 + 0.3 * eased : 1);
		render();
		if (progress < 1) frame = requestAnimationFrame(animate);
		else isOpening = false;
	};
	const resize = () => {
		const rect = canvas.getBoundingClientRect();
		if (!rect.width || !rect.height) return;
		renderer.setSize(rect.width, rect.height, false);
		const halfWidth = (1.25 * rect.width) / rect.height;
		camera.left = -halfWidth;
		camera.right = halfWidth;
		camera.updateProjectionMatrix();
		render();
	};
	const observer = new ResizeObserver(resize);
	observer.observe(canvas);
	resize();
	frame = requestAnimationFrame(animate);
	return {
		setSide: (nextIsBack: boolean) => {
			if (isBack === nextIsBack || isDestroyed) return;
			isBack = nextIsBack;
			isOpening = false;
			tag.scale.setScalar(1);
			start.copy(tag.quaternion);
			target.setFromEuler(new Euler(0, isBack ? Math.PI : 0, 0));
			startTime = performance.now();
			if (frame !== null) cancelAnimationFrame(frame);
			frame = requestAnimationFrame(animate);
		},
		destroy: () => {
			isDestroyed = true;
			if (frame !== null) cancelAnimationFrame(frame);
			observer.disconnect();
			for (const ink of inks) {
				ink.geometry.dispose();
				(ink.material as ReturnType<typeof createArtworkMaterial>).dispose();
				ink.dispose();
			}
			geometry.dispose();
			patchGeometry.dispose();
			paperMaterial.dispose();
			edgeMaterial.dispose();
			patchMaterial.dispose();
			// The texture belongs to the rain renderer and is shared across viewer openings.
			renderer.dispose();
			renderer.forceContextLoss();
			scene.clear();
		}
	};
};
