import shipmentPoints from '#lib/data/shipments/points.json';
import * as THREE from 'three';
import { continentPoints, globePosition } from './geometry';
import { frameShippingRoute } from './framing';
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
	const baseZoom = 2.1;
	const bentoHost = canvas.closest('[data-bento-topic]');
	camera.zoom = baseZoom;
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
			uniforms: {
				pixelRatio: { value: renderer.getPixelRatio() },
				gradientNorth: { value: north },
				gradientSouth: { value: south },
				strokeOpacity: { value: 0.42 },
				pointScale: { value: 1 },
				layerOpacity: { value: 1 },
				ringWidth: { value: 0.025 },
				haloOpacity: { value: 0.18 }
			},
			vertexShader: `
            attribute vec3 color;
            uniform float pixelRatio;
            uniform float pointScale;
            varying vec3 pointColor;
            void main() {
                pointColor = color;
                vec4 positionInView = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * positionInView;
                gl_PointSize = pointScale * pixelRatio * max(10.0, 20.0 / -positionInView.z);
            }
        `,
			fragmentShader: `
            uniform vec3 gradientNorth;
            uniform vec3 gradientSouth;
            uniform float strokeOpacity;
            uniform float layerOpacity;
            uniform float ringWidth;
            uniform float haloOpacity;
            varying vec3 pointColor;
            void main() {
                vec2 offset = gl_PointCoord - 0.5;
                float radius = length(offset);
                float edge = clamp(fwidth(radius), 0.015, 0.045);
                float ring = 1.0 - smoothstep(ringWidth, ringWidth + edge, abs(radius - 0.3));
                // A radial halo fades around the ring, keeping its center transparent.
                float halo = exp(-pow((radius - 0.3) / 0.1, 2.0))
                    * smoothstep(0.18, 0.23, radius)
                    * (1.0 - smoothstep(0.44, 0.5, radius));
                float alpha = (ring * strokeOpacity + halo * haloOpacity) * layerOpacity;
                if (alpha < 0.01) discard;
                vec3 gradient = mix(gradientNorth, gradientSouth,
                    clamp(0.5 + offset.x - offset.y, 0.0, 1.0));
                gl_FragColor = vec4(mix(pointColor, gradient, 0.65), alpha);
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
	const markerMaterial = keep(destinationMaterial.clone());
	const markers = new THREE.Points(markerGeometry, markerMaterial);
	markers.frustumCulled = false;
	globe.add(markers);
	// A mesh tube gives the selected arc a reliable width on WebGL implementations
	// that clamp native line widths to one pixel. Only one selected tube is rendered.
	const selectedRouteMaterial = keep(
		new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.95,
			depthWrite: false
		})
	);
	const selectedRoute = new THREE.Mesh(new THREE.BufferGeometry(), selectedRouteMaterial);
	selectedRoute.visible = false;
	globe.add(selectedRoute);
	const endpointGeometry = keep(new THREE.BufferGeometry());
	const endpointPositions = new THREE.Float32BufferAttribute(new Float32Array(6), 3);
	const endpointColors = new THREE.Float32BufferAttribute(new Float32Array(6), 3);
	endpointGeometry.setAttribute('position', endpointPositions);
	endpointGeometry.setAttribute('color', endpointColors);
	const endpointMaterial = keep(destinationMaterial.clone());
	endpointMaterial.uniforms.pointScale.value = 2.4;
	endpointMaterial.uniforms.strokeOpacity.value = 0.95;
	endpointMaterial.uniforms.ringWidth.value = 0.045;
	endpointMaterial.uniforms.haloOpacity.value = 0.26;
	const endpoints = new THREE.Points(endpointGeometry, endpointMaterial);
	endpoints.frustumCulled = false;
	endpoints.visible = false;
	globe.add(endpoints);
	const movingPosition = new THREE.Vector3();
	let activeId: string | undefined;
	let frame = 0;
	let isInView = false;
	let isDisposed = false;
	let isHovered = false;
	let isDark = false;
	let previous = 0;
	let elapsed = 0;
	let targetRotation: THREE.Quaternion | undefined;
	let targetZoom = baseZoom;
	const targetCameraPosition = camera.position.clone();
	const motion = matchMedia('(prefers-reduced-motion: reduce)');
	const draw = () => renderer.render(scene, camera);
	const updateCamera = (amount: number) => {
		if (targetRotation) globe.quaternion.slerp(targetRotation, amount);
		camera.position.lerp(targetCameraPosition, amount);
		camera.lookAt(camera.position.x, camera.position.y, 0);
		const zoom = targetZoom * (!activeId && bentoHost && isHovered && !motion.matches ? 1.18 : 1);
		const nextZoom = THREE.MathUtils.lerp(camera.zoom, zoom, amount);
		if (Math.abs(nextZoom - camera.zoom) > 0.0001) {
			camera.zoom = nextZoom;
			camera.updateProjectionMatrix();
		}
	};
	const fitSelectedRoute = () => {
		const active = routes.find((route) => route.location.id === activeId);
		if (active) {
			const framing = frameShippingRoute(
				active.points,
				origin,
				active.destination,
				Math.max(1, canvas.clientWidth),
				Math.max(1, canvas.clientHeight),
				camera.fov
			);
			targetRotation = framing.rotation;
			targetCameraPosition.copy(framing.position);
			targetZoom = framing.zoom;
			// Keep the arc near two screen pixels even when short connections zoom in.
			const midpoint = active.points[40].clone().applyQuaternion(framing.rotation);
			const radius =
				((framing.position.z - midpoint.z) *
					Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
					2) /
				(Math.max(1, canvas.clientHeight) * framing.zoom);
			selectedRoute.geometry.dispose();
			selectedRoute.geometry = new THREE.TubeGeometry(
				new THREE.CatmullRomCurve3(active.points),
				80,
				radius,
				6,
				false
			);
		} else {
			targetRotation = undefined;
			targetCameraPosition.set(0, 0.45, 3.85);
			targetZoom = baseZoom;
		}
		if (motion.matches) updateCamera(1);
	};
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
	const updateSelection = () => {
		const active = routes.find((route) => route.location.id === activeId);
		destinationMaterial.uniforms.layerOpacity.value = active ? 0.4 : 1;
		markerMaterial.uniforms.layerOpacity.value = active ? 0.45 : 1;
		endpoints.visible = !!active;
		selectedRoute.visible = !!active;
		routes.forEach((route) => {
			const color = north.clone().lerp(south, (90 - route.location.latitude) / 180);
			// The active arc is drawn by the thicker tube; other arcs become background context.
			const opacity = active ? (route === active ? 0 : isDark ? 0.09 : 0.14) : isDark ? 0.18 : 0.3;
			for (let i = route.index * 160; i < (route.index + 1) * 160; i++) {
				routeColors.setXYZW(i, color.r, color.g, color.b, opacity);
			}
		});
		routeColors.needsUpdate = true;
		if (active) {
			const destinationColor = north.clone().lerp(south, (90 - active.location.latitude) / 180);
			const originColor = north.clone().lerp(south, (90 - shippingOrigin.latitude) / 180);
			selectedRouteMaterial.color.copy(destinationColor);
			endpointPositions.setXYZ(0, origin.x * 1.025, origin.y * 1.025, origin.z * 1.025);
			endpointPositions.setXYZ(1, active.destination.x, active.destination.y, active.destination.z);
			endpointPositions.needsUpdate = true;
			endpointColors.setXYZ(0, originColor.r, originColor.g, originColor.b);
			endpointColors.setXYZ(1, destinationColor.r, destinationColor.g, destinationColor.b);
			endpointColors.needsUpdate = true;
		}
	};
	const recolor = () => {
		const colors = palette();
		isDark = colors.isDark;
		north = readColor(colors.north);
		south = readColor(colors.south);
		for (const ringMaterial of [destinationMaterial, markerMaterial, endpointMaterial]) {
			ringMaterial.uniforms.gradientNorth.value.copy(north);
			ringMaterial.uniforms.gradientSouth.value.copy(south);
		}
		destinationMaterial.uniforms.strokeOpacity.value = colors.isDark ? 0.5 : 0.42;
		markerMaterial.uniforms.strokeOpacity.value = destinationMaterial.uniforms.strokeOpacity.value;
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
			markerColors.setXYZ(route.index, color.r, color.g, color.b);
			markerColors.setXYZ(route.index + routes.length, color.r, color.g, color.b);
		});
		updateSelection();
		markerColors.needsUpdate = true;
		updateMarkers();
		draw();
	};
	const render = (time: number) => {
		frame = 0;
		if (isDisposed || !isInView || document.hidden || motion.matches) return;
		const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
		previous = time;
		updateCamera(1 - Math.exp(-delta * 7));
		elapsed += delta * (isHovered ? 2 : 1);
		if (!targetRotation) globe.rotation.y += delta * (isHovered ? 0.14 : 0.045);
		updateMarkers();
		draw();
		frame = requestAnimationFrame(render);
	};
	const updatePlayback = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		previous = 0;
		if (motion.matches) updateCamera(1);
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
		fitSelectedRoute();
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
	const host = bentoHost ?? canvas.parentElement!;
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
			fitSelectedRoute();
			updateSelection();
			updateMarkers();
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
			selectedRoute.geometry.dispose();
			resources.forEach((resource) => resource.dispose());
			renderer.dispose();
			renderer.forceContextLoss();
		}
	};
};
