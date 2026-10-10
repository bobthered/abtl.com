/** Transparent orbital artwork and an interaction-only QR scanning loop. */
export const qrScan = (element: HTMLElement) => {
	const artwork = element.querySelector<HTMLCanvasElement>('[data-qr-artwork]');
	const scan = element.querySelector<HTMLCanvasElement>('[data-qr-scan]');
	const accent = element.querySelector<HTMLElement>('[data-qr-accent]');
	const trigger = element.closest('a, button');
	const artContext = artwork?.getContext('2d');
	const scanContext = scan?.getContext('2d');
	if (!artwork || !scan || !accent || !trigger || !artContext || !scanContext) return;

	const preference = matchMedia('(prefers-reduced-motion: reduce)');
	const particlesPerOrbit = 1000;
	// Seeded samples stay fixed across frames, theme changes, and resizes.
	const sample = (seed: number) => {
		const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
		return value - Math.floor(value);
	};
	const particles = Array.from({ length: 4 }, (_, orbit) =>
		Array.from({ length: particlesPerOrbit }, (_, index) => {
			const seed = (orbit * particlesPerOrbit + index + 1) * 4;
			return {
				angle: ((index + sample(seed)) / particlesPerOrbit) * Math.PI * 2,
				binormal: (sample(seed + 1) * 2 - 1) * 18,
				normal: (sample(seed + 2) * 2 - 1) * 18,
				radius: 0.7 + sample(seed + 3) * 0.6
			};
		})
	);
	let artworkHeight = 0;
	let artworkWidth = 0;
	let frame = 0;
	let isFocused = trigger.matches(':focus-visible');
	let isHovered = trigger.matches(':hover');
	let isInView = false;
	let lastFrame = 0;
	let start = 0;
	let orbitElapsed = 0;
	let primary = '';
	let secondary = '';
	let scanColor = '';
	let scanSize = 0;

	const resizeCanvas = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
		const bounds = canvas.getBoundingClientRect();
		const ratio = Math.min(devicePixelRatio || 1, 2);
		canvas.width = Math.round(bounds.width * ratio);
		canvas.height = Math.round(bounds.height * ratio);
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		return bounds;
	};
	const readLayout = () => {
		const bounds = resizeCanvas(artwork, artContext);
		artworkHeight = bounds.height;
		artworkWidth = bounds.width;
		scanSize = resizeCanvas(scan, scanContext).width;
		scanColor = getComputedStyle(scan).color;
		primary = getComputedStyle(artwork).color;
		secondary = getComputedStyle(accent).color;
	};
	const drawArtwork = () => {
		const width = artworkWidth;
		const height = artworkHeight;
		artContext.clearRect(0, 0, width, height);
		artContext.save();
		artContext.translate(width * 0.5, height * 0.55);
		artContext.rotate(-0.5);
		const stroke = artContext.createLinearGradient(-width / 2, 0, width / 2, 0);
		stroke.addColorStop(0, primary);
		stroke.addColorStop(1, secondary);
		artContext.strokeStyle = stroke;
		artContext.lineWidth = 1;
		for (let orbit = 0; orbit < 4; orbit += 1) {
			const radiusX = width * (0.62 + orbit * 0.08);
			const radiusY = height * (0.22 + orbit * 0.04);
			artContext.globalAlpha = 0.26;
			artContext.beginPath();
			artContext.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
			artContext.stroke();
			const tilt = Math.min(radiusY / radiusX, 1);
			const depthProjection = Math.sqrt(1 - tilt * tilt);
			artContext.globalAlpha = 1;
			artContext.fillStyle = orbit % 2 === 0 ? primary : secondary;
			artContext.beginPath();
			for (const particle of particles[orbit]) {
				const angle = particle.angle + orbit * 0.37 + orbitElapsed / (16000 + orbit * 4500);
				// Project both perpendicular directions: radial normal and orbit-plane normal.
				const x = Math.cos(angle) * (radiusX + particle.normal);
				const y =
					Math.sin(angle) * (radiusY + particle.normal * tilt) +
					particle.binormal * depthProjection;
				artContext.moveTo(x + particle.radius, y);
				artContext.arc(x, y, particle.radius, 0, Math.PI * 2);
			}
			// Batch flat particles into one fill per orbit, without per-particle gradients.
			artContext.fill();
		}
		artContext.restore();
	};
	const drawScan = (progress: number) => {
		const size = scanSize;
		const inset = size * 0.04;
		scanContext.clearRect(0, 0, size, size);
		scanContext.strokeStyle = scanColor;
		scanContext.lineWidth = 2;
		// These brackets illustrate a scanner; the tile retains its separate focus outline.
		for (const [x, y, dx, dy] of [
			[inset, inset, 1, 1],
			[size - inset, inset, -1, 1],
			[inset, size - inset, 1, -1],
			[size - inset, size - inset, -1, -1]
		]) {
			scanContext.beginPath();
			scanContext.moveTo(x, y + dy * 14);
			scanContext.lineTo(x, y);
			scanContext.lineTo(x + dx * 14, y);
			scanContext.stroke();
		}
		if (preference.matches) return;
		// Sweep down, briefly acknowledge a read, then repeat without a flashing reset.
		if (progress < 0.72) {
			const y = inset + (size - inset * 2) * (progress / 0.72);
			const trail = scanContext.createLinearGradient(0, y - 48, 0, y);
			trail.addColorStop(0, 'transparent');
			trail.addColorStop(1, scanColor);
			scanContext.globalAlpha = 0.16;
			scanContext.fillStyle = trail;
			scanContext.fillRect(
				inset,
				Math.max(inset, y - 48),
				size - inset * 2,
				Math.min(48, y - inset)
			);
			scanContext.globalAlpha = 0.9;
			scanContext.beginPath();
			scanContext.moveTo(inset, y);
			scanContext.lineTo(size - inset, y);
			scanContext.stroke();
		} else {
			scanContext.globalAlpha = Math.sin(((progress - 0.72) / 0.28) * Math.PI) * 0.1;
			scanContext.fillStyle = scanColor;
			scanContext.fillRect(inset, inset, size - inset * 2, size - inset * 2);
		}
		scanContext.globalAlpha = 1;
	};
	const animate = (time: number) => {
		if (!start) start = time;
		if (time - lastFrame >= 1000 / 30) {
			// Advance by visible frame time only, preserving orbital phase after a pause.
			if (lastFrame) orbitElapsed += Math.min(time - lastFrame, 100);
			drawArtwork();
			if (isHovered || isFocused) drawScan(((time - start) % 2200) / 2200);
			lastFrame = time;
		}
		frame = requestAnimationFrame(animate);
	};
	const update = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		start = 0;
		lastFrame = 0;
		const isVisible = isInView && !document.hidden;
		const isActive = isVisible && (isHovered || isFocused);
		element.dataset.qrScanning = isActive ? (preference.matches ? 'static' : 'active') : 'idle';
		element.dataset.qrOrbiting = isVisible && !preference.matches ? 'active' : 'static';
		scanContext.clearRect(0, 0, scanSize, scanSize);
		drawArtwork();
		if (preference.matches) {
			if (isActive) drawScan(0);
		} else if (isVisible) frame = requestAnimationFrame(animate);
	};
	const blur = () => {
		isFocused = false;
		update();
	};
	const enter = (event: Event) => {
		if ((event as PointerEvent).pointerType === 'touch') return;
		isHovered = true;
		update();
	};
	const focus = () => {
		isFocused = trigger.matches(':focus-visible');
		update();
	};
	const leave = () => {
		isHovered = false;
		update();
	};
	const redraw = () => {
		readLayout();
		update();
	};
	const intersection = new IntersectionObserver(([entry]) => {
		isInView = entry.isIntersecting;
		update();
	});
	const resize = new ResizeObserver(redraw);
	const theme = new MutationObserver(redraw);
	intersection.observe(element);
	resize.observe(element);
	theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	readLayout();
	update();
	trigger.addEventListener('pointerenter', enter);
	trigger.addEventListener('pointerleave', leave);
	trigger.addEventListener('pointercancel', leave);
	trigger.addEventListener('focusin', focus);
	trigger.addEventListener('focusout', blur);
	preference.addEventListener('change', update);
	document.addEventListener('visibilitychange', update);
	return () => {
		cancelAnimationFrame(frame);
		intersection.disconnect();
		resize.disconnect();
		theme.disconnect();
		trigger.removeEventListener('pointerenter', enter);
		trigger.removeEventListener('pointerleave', leave);
		trigger.removeEventListener('pointercancel', leave);
		trigger.removeEventListener('focusin', focus);
		trigger.removeEventListener('focusout', blur);
		preference.removeEventListener('change', update);
		document.removeEventListener('visibilitychange', update);
	};
};
