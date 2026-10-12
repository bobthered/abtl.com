import shipmentPoints from '#lib/data/shipments/points.json';
import * as THREE from 'three';
import { continentPoints, globePosition } from './geometry';
import { shippingLocations, shippingOrigin } from './shippingLocations';

export const createShippingGlobe = (
	canvas: HTMLCanvasElement,
	palette: () => { north: string; south: string; isDark: boolean }
) => {
	const renderer = new THREE.WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true,
		powerPreference: 'high-performance'
	});
	renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
	const scene = new THREE.Scene();
	const globe = new THREE.Group();
	globe.rotation.y = (65 * Math.PI) / 180;
	globe.rotation.z = -0.12;
	scene.add(globe);
	const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
	camera.position.set(0, 0.45, 3.85);
	camera.lookAt(0, 0.45, 0);
	camera.zoom = 2.1;
	camera.updateProjectionMatrix();
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
	// Depth-only occlusion hides the far hemisphere without painting an opaque globe.
	const material = keep(new THREE.MeshBasicMaterial({ colorWrite: false }));
	globe.add(new THREE.Mesh(keep(new THREE.SphereGeometry(0.995, 48, 32)), material));
	const geometry = keep(new THREE.BufferGeometry());
	const positions = continentPoints.flatMap(([lat, lon]) => [...globePosition(lat, lon, 1.002)]);
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute(
		'color',
		new THREE.Float32BufferAttribute(new Float32Array(positions.length), 3)
	);
	const dotMaterial = keep(
		new THREE.PointsMaterial({ size: 0.0017, vertexColors: true, sizeAttenuation: true })
	);
	globe.add(new THREE.Points(geometry, dotMaterial));
	// Thousands of destinations share one draw call instead of individual meshes/arcs.
	const destinationGeometry = keep(new THREE.BufferGeometry());
	destinationGeometry.setAttribute(
		'position',
		new THREE.Float32BufferAttribute(
			shipmentPoints.flatMap(([latitude, longitude]) => [
				...globePosition(latitude, longitude, 1.018)
			]),
			3
		)
	);
	destinationGeometry.setAttribute(
		'color',
		new THREE.Float32BufferAttribute(new Float32Array(shipmentPoints.length * 3), 3)
	);
	const destinationMaterial = keep(
		new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			uniforms: { pixelRatio: { value: renderer.getPixelRatio() } },
			vertexShader: `
            attribute vec3 color;
            uniform float pixelRatio;
            varying vec3 pointColor;
            void main() {
                pointColor = color;
                vec4 positionInView = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * positionInView;
                gl_PointSize = pixelRatio * max(6.0, 12.0 / -positionInView.z);
            }
        `,
			fragmentShader: `
            varying vec3 pointColor;
            void main() {
                float radius = length(gl_PointCoord - 0.5);
                float edge = clamp(fwidth(radius), 0.025, 0.08);
                float alpha = smoothstep(0.28 - edge, 0.28 + edge, radius)
                    * (1.0 - smoothstep(0.46 - edge, 0.46 + edge, radius));
                if (alpha < 0.01) discard;
                gl_FragColor = vec4(pointColor, alpha * 0.85);
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
            }
        `
		})
	);
	globe.add(new THREE.Points(destinationGeometry, destinationMaterial));
	const origin = new THREE.Vector3(
		...globePosition(shippingOrigin.latitude, shippingOrigin.longitude)
	);
	const routePositions: number[] = [];
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
		for (let i = 1; i < points.length; i++) {
			routePositions.push(...points[i - 1].toArray(), ...points[i].toArray());
		}
		return { location, index, points, destination: destination.multiplyScalar(1.014) };
	});
	// RGBA vertex colors preserve route highlighting in a single draw call.
	const routeGeometry = keep(new THREE.BufferGeometry());
	routeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(routePositions, 3));
	const routeColors = new THREE.Float32BufferAttribute(
		new Float32Array((routePositions.length / 3) * 4),
		4
	);
	routeGeometry.setAttribute('color', routeColors);
	globe.add(
		new THREE.LineSegments(
			routeGeometry,
			keep(
				new THREE.LineBasicMaterial({
					vertexColors: true,
					transparent: true,
					depthWrite: false
				})
			)
		)
	);
	// Featured destinations and traveling lights use the same hollow ring shader.
	const markerGeometry = keep(new THREE.BufferGeometry());
	const markerPositions = new THREE.Float32BufferAttribute(new Float32Array(routes.length * 6), 3);
	markerPositions.setUsage(THREE.DynamicDrawUsage);
	const markerColors = new THREE.Float32BufferAttribute(new Float32Array(routes.length * 6), 3);
	markerGeometry.setAttribute('position', markerPositions);
	markerGeometry.setAttribute('color', markerColors);
	const markers = new THREE.Points(markerGeometry, destinationMaterial);
	markers.frustumCulled = false;
	globe.add(markers);
	const movingPosition = new THREE.Vector3();
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
	const updateMarkers = () => {
		routes.forEach((route) => {
			markerPositions.setXYZ(
				route.index,
				route.destination.x,
				route.destination.y,
				route.destination.z
			);
			const exact = ((elapsed * 0.11 + route.index / routes.length) % 1) * 80;
			movingPosition
				.copy(route.points[Math.floor(exact)])
				.lerp(route.points[Math.min(80, Math.floor(exact) + 1)], exact % 1);
			// Hide inactive traveling lights behind the depth-only globe.
			if (activeId && activeId !== route.location.id) movingPosition.set(0, 0, 0);
			markerPositions.setXYZ(
				route.index + routes.length,
				movingPosition.x,
				movingPosition.y,
				movingPosition.z
			);
		});
		markerPositions.needsUpdate = true;
	};
	const recolor = () => {
		const colors = palette();
		north = readColor(colors.north);
		south = readColor(colors.south);
		dotMaterial.size = colors.isDark ? 0.0017 : 0.0023;
		const attribute = geometry.getAttribute('color');
		continentPoints.forEach(([lat], i) => {
			const color = north.clone().lerp(south, (90 - lat) / 180);
			attribute.setXYZ(i, color.r, color.g, color.b);
		});
		attribute.needsUpdate = true;
		const destinationColors = destinationGeometry.getAttribute('color');
		shipmentPoints.forEach(([latitude], index) => {
			const color = north.clone().lerp(south, (90 - latitude) / 180);
			destinationColors.setXYZ(index, color.r, color.g, color.b);
		});
		destinationColors.needsUpdate = true;
		routes.forEach((route) => {
			const color = north.clone().lerp(south, (90 - route.location.latitude) / 180);
			const opacity =
				route.location.id === activeId ? 0.95 : activeId ? 0.1 : colors.isDark ? 0.18 : 0.3;
			for (let i = route.index * 160; i < (route.index + 1) * 160; i++) {
				routeColors.setXYZW(i, color.r, color.g, color.b, opacity);
			}
			markerColors.setXYZ(route.index, color.r, color.g, color.b);
			markerColors.setXYZ(route.index + routes.length, color.r, color.g, color.b);
		});
		routeColors.needsUpdate = true;
		markerColors.needsUpdate = true;
		updateMarkers();
		draw();
	};
	const render = (time: number) => {
		frame = 0;
		if (isDisposed || !isInView || document.hidden || motion.matches) return;
		const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
		previous = time;
		elapsed += delta * (isHovered ? 2 : 1);
		if (targetRotation !== undefined)
			globe.rotation.y += (targetRotation - globe.rotation.y) * Math.min(1, delta * 3);
		else globe.rotation.y += delta * (isHovered ? 0.14 : 0.045);
		updateMarkers();
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
			recolor();
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
