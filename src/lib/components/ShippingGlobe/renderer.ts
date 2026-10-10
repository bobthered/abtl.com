import * as THREE from 'three';
import { globePosition } from './geometry';
import land from './land.json';
import { shippingLocations, shippingOrigin } from './shippingLocations';

export const createShippingGlobe = (
	canvas: HTMLCanvasElement,
	palette: () => { north: string; south: string; surface: string }
) => {
	const renderer = new THREE.WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true,
		powerPreference: 'low-power'
	});
	renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
	const scene = new THREE.Scene();
	const globe = new THREE.Group();
	globe.rotation.y = (65 * Math.PI) / 180;
	globe.rotation.z = -0.12;
	scene.add(globe);
	const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
	camera.position.z = 3.85;
	const resources: Array<{ dispose: () => void }> = [];
	const keep = <T extends { dispose: () => void }>(resource: T) => {
		resources.push(resource);
		return resource;
	};
	const readColor = (css: string) => {
		const context = new OffscreenCanvas(1, 1).getContext('2d')!;
		context.fillStyle = css;
		context.fillRect(0, 0, 1, 1);
		const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
		return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
	};
	let north = new THREE.Color();
	let south = new THREE.Color();
	const material = keep(new THREE.MeshBasicMaterial());
	globe.add(new THREE.Mesh(keep(new THREE.SphereGeometry(0.995, 48, 32)), material));
	const geometry = keep(new THREE.BufferGeometry());
	const positions = land.flatMap(([lat, lon]) => [...globePosition(lat, lon, 1.002)]);
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute(
		'color',
		new THREE.Float32BufferAttribute(new Float32Array(positions.length), 3)
	);
	const dotMaterial = keep(
		new THREE.PointsMaterial({ size: 0.017, vertexColors: true, sizeAttenuation: true })
	);
	globe.add(new THREE.Points(geometry, dotMaterial));
	const gridMaterial = keep(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.09 }));
	for (let latitude = -60; latitude <= 60; latitude += 30) {
		const points = Array.from(
			{ length: 145 },
			(_, i) => new THREE.Vector3(...globePosition(latitude, i * 2.5, 1.001))
		);
		globe.add(new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints(points)), gridMaterial));
	}
	for (let longitude = 0; longitude < 180; longitude += 30) {
		const points = Array.from(
			{ length: 145 },
			(_, i) => new THREE.Vector3(...globePosition(i * 2.5, longitude, 1.001))
		);
		globe.add(new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints(points)), gridMaterial));
	}
	const origin = new THREE.Vector3(
		...globePosition(shippingOrigin.latitude, shippingOrigin.longitude)
	);
	const markerGeometry = keep(new THREE.SphereGeometry(0.018, 10, 8));
	const routes = shippingLocations.map((location, index) => {
		const destination = new THREE.Vector3(...globePosition(location.latitude, location.longitude));
		const distance = origin.angleTo(destination);
		const points = Array.from({ length: 81 }, (_, i) => {
			const t = i / 80;
			return origin
				.clone()
				.lerp(destination, t)
				.normalize()
				.multiplyScalar(1.015 + Math.sin(t * Math.PI) * Math.min(0.48, distance * 0.24));
		});
		const color = north.clone();
		const lineMaterial = keep(
			new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.28 })
		);
		const line = new THREE.Line(
			keep(new THREE.BufferGeometry().setFromPoints(points)),
			lineMaterial
		);
		const markerMaterial = keep(new THREE.MeshBasicMaterial({ color }));
		const marker = new THREE.Mesh(markerGeometry, markerMaterial);
		marker.position.copy(destination.multiplyScalar(1.014));
		const light = new THREE.Mesh(markerGeometry, markerMaterial);
		light.scale.setScalar(0.6);
		globe.add(line, marker, light);
		return { location, index, points, lineMaterial, markerMaterial, marker, light };
	});
	let activeId: string | undefined;
	let frame = 0;
	let isInView = false;
	let isDisposed = false;
	let isHovered = false;
	let previous = 0;
	let elapsed = 0;
	let targetRotation: number | undefined;
	const motion = matchMedia('(prefers-reduced-motion: reduce)');
	const draw = () => renderer.render(scene, camera);
	const recolor = () => {
		const colors = palette();
		north = readColor(colors.north);
		south = readColor(colors.south);
		material.color.copy(readColor(colors.surface));
		gridMaterial.color.copy(north);
		const attribute = geometry.getAttribute('color');
		land.forEach(([lat], i) => {
			const color = north.clone().lerp(south, (90 - lat) / 180);
			attribute.setXYZ(i, color.r, color.g, color.b);
		});
		attribute.needsUpdate = true;
		routes.forEach((route) => {
			const color = north.clone().lerp(south, (90 - route.location.latitude) / 180);
			route.lineMaterial.color.copy(color);
			route.markerMaterial.color.copy(color);
		});
		draw();
	};
	const render = (time: number) => {
		frame = 0;
		if (isDisposed || !isInView || document.hidden || motion.matches) return;
		if (previous && time - previous < 1000 / 30) {
			frame = requestAnimationFrame(render);
			return;
		}
		const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
		previous = time;
		elapsed += delta * (isHovered ? 2 : 1);
		if (targetRotation !== undefined)
			globe.rotation.y += (targetRotation - globe.rotation.y) * Math.min(1, delta * 3);
		else globe.rotation.y += delta * (isHovered ? 0.14 : 0.045);
		routes.forEach((route) => {
			const progress = (elapsed * 0.11 + route.index / 11) % 1;
			const exact = progress * 80;
			route.light.position
				.copy(route.points[Math.floor(exact)])
				.lerp(route.points[Math.min(80, Math.floor(exact) + 1)], exact % 1);
			route.marker.scale.setScalar(1 + 0.18 * Math.sin(elapsed * 2 + route.index));
		});
		draw();
		frame = requestAnimationFrame(render);
	};
	const updatePlayback = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		previous = 0;
		if (isInView && !document.hidden && !motion.matches && !isDisposed)
			frame = requestAnimationFrame(render);
		else draw();
	};
	const resize = new ResizeObserver(() => {
		const width = canvas.clientWidth,
			height = canvas.clientHeight;
		if (!width || !height) return;
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		draw();
	});
	resize.observe(canvas);
	const visibility = new IntersectionObserver(([entry]) => {
		isInView = entry.isIntersecting;
		updatePlayback();
	});
	visibility.observe(canvas);
	const themeObserver = new MutationObserver(recolor);
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme', 'class']
	});
	const host = canvas.closest('[data-bento-topic]') ?? canvas.parentElement!;
	const enter = () => {
		isHovered = true;
	};
	const leave = () => {
		isHovered = false;
	};
	host.addEventListener('pointerenter', enter);
	host.addEventListener('pointerleave', leave);
	host.addEventListener('focusin', enter);
	host.addEventListener('focusout', leave);
	document.addEventListener('visibilitychange', updatePlayback);
	motion.addEventListener('change', updatePlayback);
	recolor();
	return {
		select: (id: string | undefined) => {
			if (activeId === id) return;
			activeId = id;
			const active = shippingLocations.find((location) => location.id === id);
			targetRotation = active ? (-active.longitude * Math.PI) / 180 : undefined;
			if (targetRotation !== undefined) {
				while (targetRotation - globe.rotation.y > Math.PI) targetRotation -= Math.PI * 2;
				while (targetRotation - globe.rotation.y < -Math.PI) targetRotation += Math.PI * 2;
				if (motion.matches) globe.rotation.y = targetRotation;
			}
			routes.forEach((route) => {
				const isActive = route.location.id === id;
				route.lineMaterial.opacity = isActive ? 0.95 : id ? 0.1 : 0.28;
				route.light.visible = !id || isActive;
			});
			draw();
		},
		dispose: () => {
			isDisposed = true;
			cancelAnimationFrame(frame);
			resize.disconnect();
			visibility.disconnect();
			themeObserver.disconnect();
			host.removeEventListener('pointerenter', enter);
			host.removeEventListener('pointerleave', leave);
			host.removeEventListener('focusin', enter);
			host.removeEventListener('focusout', leave);
			document.removeEventListener('visibilitychange', updatePlayback);
			motion.removeEventListener('change', updatePlayback);
			resources.forEach((resource) => resource.dispose());
			renderer.dispose();
			renderer.forceContextLoss();
		}
	};
};
