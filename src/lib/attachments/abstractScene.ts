import type { Attachment } from 'svelte/attachments';

type Particle = {
	x: number;
	y: number;
	z: number;
	vx: number;
	vy: number;
	vz: number;
	sx: number;
	sy: number;
	sz: number;
	seed: number;
	size: number;
};
type Point = [number, number, number];

/** One persistent point cloud, four formations, and an interruptible spring-driven sphere transition. */
export const abstractScene: Attachment<HTMLCanvasElement> = (canvas) => {
	const context = canvas.getContext('2d');
	if (!context) return;
	const preference = matchMedia('(prefers-reduced-motion: reduce)');
	const surface = canvas.parentElement!;
	const count = 1200;
	const sample = (index: number) => {
		const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
		return value - Math.floor(value);
	};
	// Fibonacci distribution gives every point its own stable place on the gathering sphere.
	const particles: Particle[] = Array.from({ length: count }, (_, index) => {
		const y = 1 - (2 * (index + 0.5)) / count;
		const radius = Math.sqrt(1 - y * y);
		const angle = index * Math.PI * (3 - Math.sqrt(5));
		return {
			x: 0,
			y: 0,
			z: 0,
			vx: 0,
			vy: 0,
			vz: 0,
			sx: Math.cos(angle) * radius * 90,
			sy: y * 90,
			sz: Math.sin(angle) * radius * 90,
			seed: sample(index + 43),
			size: 1.1 + sample(index + 7) * 0.9
		};
	});
	let colors = ['#4851a3', '#a348a0', '#c75362'];
	let elapsed = 0;
	let frame = 0;
	let isDragging = false;
	let isInitialized = false;
	let isInView = false;
	let isPaused = false;
	let lastFrame = 0;
	let phase: 'gather' | 'sphere' | 'release' | 'settled' = 'settled';
	let pointerX = 0.5;
	let pointerY = 0.5;
	let pulse = 0;
	let rotation = 0;
	let scene = 0;
	let transitionTime = 0;
	let width = 1000;
	const height = 460;

	const target = (particle: Particle, index: number): Point => {
		const seed = particle.seed;
		if (scene === 0) {
			const angle = (index / count) * Math.PI * 2 + elapsed * (0.14 + seed * 0.06);
			return [
				Math.sin(angle) * width * 0.46,
				Math.sin(angle * 2 + seed * 0.9) * 60 +
					(seed - 0.5) * 180 +
					Math.sin(angle * 8 + elapsed) * pulse * 22,
				Math.cos(angle + seed) * 45
			];
		}
		if (scene === 1) {
			const band = index % 3;
			const angle = (index / count) * Math.PI * 2 + elapsed * (0.2 + band * 0.08);
			const radius = 160 + (seed - 0.5) * 24;
			const tilt = band * 0.8 + 0.4 + pulse * 0.15;
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;
			const z = y * Math.sin(tilt);
			const turn = rotation + elapsed * 0.14 + (pointerX - 0.5) * 0.7;
			return [
				x * Math.cos(turn) + z * Math.sin(turn),
				y * Math.cos(tilt),
				-x * Math.sin(turn) + z * Math.cos(turn)
			];
		}
		if (scene === 2) {
			const x = ((index % 40) / 39) * width * 0.92 - width * 0.46;
			const y = (Math.floor(index / 40) / 29) * 300 - 150;
			const distance = Math.hypot(x - (pointerX - 0.5) * width, y - (pointerY - 0.5) * height);
			const wave = Math.sin(distance * 0.035 - elapsed * 2) * (10 + pulse * 22);
			return [x, y + Math.sin(x * 0.009 + elapsed) * 18, wave + Math.exp(-distance / 100) * 70];
		}
		const cell = Math.floor(index / 30);
		const column = cell % 8;
		const row = Math.floor(cell / 8);
		const x = ((column - 3.5) * width) / 9;
		const y = (row - 2) * 65;
		const size = Math.min(width / 22, 35);
		const fold = 0.7 + Math.sin(column * 0.5 + row * 0.7 + elapsed * 0.6 + pulse) * 0.3;
		const corners: Point[] = [
			[0, -size * fold, 35],
			[-size, 0, 0],
			[0, size * 0.55, -15],
			[size, 0, 0]
		];
		const edge = Math.floor(((index % 30) / 30) * 4);
		const progress = (((index % 30) / 30) * 4) % 1;
		const a = corners[edge];
		const b = corners[(edge + 1) % 4];
		return [
			x + a[0] + (b[0] - a[0]) * progress + (pointerX - 0.5) * size,
			y + a[1] + (b[1] - a[1]) * progress,
			a[2] + (b[2] - a[2]) * progress + Math.sin(column * 0.4 + elapsed) * 15
		];
	};
	const sphere = (particle: Particle, index: number): Point => {
		const turn = elapsed * 0.3;
		// Small moving targets excite the underdamped springs without random per-frame impulses.
		const jiggle = 2.5 + pulse * 3;
		return [
			particle.sx * Math.cos(turn) +
				particle.sz * Math.sin(turn) +
				Math.sin(elapsed * 9 + index) * jiggle,
			particle.sy + Math.sin(elapsed * 7 + index * 0.3) * jiggle,
			-particle.sx * Math.sin(turn) +
				particle.sz * Math.cos(turn) +
				Math.cos(elapsed * 8 + index) * jiggle
		];
	};
	const snap = () => {
		particles.forEach((particle, index) => {
			[particle.x, particle.y, particle.z] = target(particle, index);
			particle.vx = particle.vy = particle.vz = 0;
		});
		phase = 'settled';
	};
	const draw = () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.save();
		// Uniform projection keeps the gathering sphere round on every viewport.
		const scale = canvas.width / width;
		const verticalScale = canvas.height / height;
		const unit = Math.min(scale, verticalScale);
		for (let index = 0; index < count; index++) {
			const particle = particles[index];
			const perspective = 700 / (700 - particle.z);
			context.fillStyle = colors[index % 3];
			context.globalAlpha = Math.max(0.25, Math.min(0.95, 0.65 + particle.z / 400));
			context.beginPath();
			context.arc(
				canvas.width / 2 + particle.x * perspective * unit,
				canvas.height / 2 + particle.y * perspective * unit,
				particle.size * perspective * unit,
				0,
				Math.PI * 2
			);
			context.fill();
		}
		context.restore();
		canvas.dataset.particlePhase = phase;
		canvas.dataset.particleCount = String(count);
	};
	const advance = (delta: number) => {
		elapsed += delta;
		pulse = Math.max(0, pulse - delta * 0.4);
		if (phase !== 'settled') {
			transitionTime += delta;
			phase =
				transitionTime < 1.05
					? 'gather'
					: transitionTime < 1.65
						? 'sphere'
						: transitionTime < 3.1
							? 'release'
							: 'settled';
		}
		const progress = Math.max(0, Math.min(1, (transitionTime - 1.65) / 1.45));
		const blend = progress * progress * (3 - 2 * progress);
		// Integrate at <=120Hz steps for consistent spring stability on slower devices.
		const steps = Math.max(1, Math.ceil(delta * 120));
		const step = delta / steps;
		for (let index = 0; index < count; index++) {
			const particle = particles[index];
			const goal = target(particle, index);
			if (phase !== 'settled') {
				const center = sphere(particle, index);
				for (let axis = 0; axis < 3; axis++)
					goal[axis] =
						phase === 'release' ? center[axis] + (goal[axis] - center[axis]) * blend : center[axis];
			} else {
				const dx = goal[0] - (pointerX - 0.5) * width;
				const dy = goal[1] - (pointerY - 0.5) * height;
				const force = Math.exp(-Math.hypot(dx, dy) / 110);
				goal[0] += Math.tanh(dx / 50) * force * 32;
				goal[1] += Math.tanh(dy / 50) * force * 32;
			}
			for (let iteration = 0; iteration < steps; iteration++) {
				const stiffness = phase === 'settled' ? 75 : 110;
				const damping = phase === 'settled' ? 16 : 11;
				particle.vx += ((goal[0] - particle.x) * stiffness - particle.vx * damping) * step;
				particle.vy += ((goal[1] - particle.y) * stiffness - particle.vy * damping) * step;
				particle.vz += ((goal[2] - particle.z) * stiffness - particle.vz * damping) * step;
				particle.x += particle.vx * step;
				particle.y += particle.vy * step;
				particle.z += particle.vz * step;
			}
		}
	};
	const tick = (time: number) => {
		frame = 0;
		if (lastFrame && time - lastFrame < 30) {
			frame = requestAnimationFrame(tick);
			return;
		}
		const delta = lastFrame ? Math.min((time - lastFrame) / 1000, 0.08) : 0;
		lastFrame = time;
		advance(delta);
		draw();
		if (isInView && !isPaused && !preference.matches && !document.hidden)
			frame = requestAnimationFrame(tick);
	};
	const refresh = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		lastFrame = 0;
		if (preference.matches && phase !== 'settled') snap();
		draw();
		if (isInView && !isPaused && !preference.matches && !document.hidden)
			frame = requestAnimationFrame(tick);
	};
	const resize = () => {
		const bounds = canvas.getBoundingClientRect();
		const ratio = Math.min(devicePixelRatio || 1, 1.75);
		canvas.width = Math.max(1, Math.round(bounds.width * ratio));
		canvas.height = Math.max(1, Math.round(bounds.height * ratio));
		width = bounds.width < 700 ? 600 : 1000;
		colors = ['primary', 'secondary', 'tertiary'].map(
			(name) => getComputedStyle(surface.querySelector(`[data-scene-color="${name}"]`)!).color
		);
		if (!isInitialized) {
			snap();
			isInitialized = true;
		}
		refresh();
	};
	const select = (event: Event) => {
		const next = (event as CustomEvent<number>).detail;
		if (!Number.isInteger(next) || next < 0 || next > 3) return;
		scene = next;
		transitionTime = 0;
		phase = 'gather';
		// Paused and reduced-motion users get the new formation immediately.
		if (isPaused || preference.matches) snap();
		refresh();
	};
	const action = () => {
		pulse = 1.5;
		rotation += Math.PI / 5;
		elapsed += 0.4;
		if (isPaused || preference.matches) snap();
		draw();
	};
	const move = (event: PointerEvent) => {
		const bounds = canvas.getBoundingClientRect();
		const nextX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
		if (isDragging) rotation += (nextX - pointerX) * 3;
		pointerX = nextX;
		pointerY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
		if (isPaused || preference.matches) {
			snap();
			draw();
		}
	};
	const down = (event: PointerEvent) => {
		isDragging = true;
		move(event);
		if (event.pointerType !== 'touch') canvas.setPointerCapture(event.pointerId);
	};
	const up = () => {
		isDragging = false;
	};
	const key = (event: KeyboardEvent) => {
		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter'].includes(event.key))
			return;
		event.preventDefault();
		if (event.key === ' ' || event.key === 'Enter') action();
		else {
			pointerX = Math.max(
				0,
				Math.min(
					1,
					pointerX + (event.key === 'ArrowRight' ? 0.08 : event.key === 'ArrowLeft' ? -0.08 : 0)
				)
			);
			pointerY = Math.max(
				0,
				Math.min(
					1,
					pointerY + (event.key === 'ArrowDown' ? 0.08 : event.key === 'ArrowUp' ? -0.08 : 0)
				)
			);
			rotation += event.key === 'ArrowRight' ? 0.2 : event.key === 'ArrowLeft' ? -0.2 : 0;
			if (isPaused || preference.matches) snap();
			draw();
		}
	};
	const pause = (event: Event) => {
		isPaused = (event as CustomEvent<boolean>).detail;
		refresh();
	};
	const observer = new IntersectionObserver(([entry]) => {
		isInView = entry.isIntersecting;
		refresh();
	});
	const sizes = new ResizeObserver(resize);
	const theme = new MutationObserver(resize);
	observer.observe(canvas);
	sizes.observe(canvas);
	theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	preference.addEventListener('change', refresh);
	document.addEventListener('visibilitychange', refresh);
	canvas.addEventListener('pointermove', move);
	canvas.addEventListener('pointerdown', down);
	canvas.addEventListener('pointerup', up);
	canvas.addEventListener('pointercancel', up);
	canvas.addEventListener('click', action);
	canvas.addEventListener('keydown', key);
	canvas.addEventListener('scene-action', action);
	canvas.addEventListener('scene-pause', pause);
	canvas.addEventListener('scene-select', select);
	resize();
	return () => {
		cancelAnimationFrame(frame);
		observer.disconnect();
		sizes.disconnect();
		theme.disconnect();
		preference.removeEventListener('change', refresh);
		document.removeEventListener('visibilitychange', refresh);
		canvas.removeEventListener('pointermove', move);
		canvas.removeEventListener('pointerdown', down);
		canvas.removeEventListener('pointerup', up);
		canvas.removeEventListener('pointercancel', up);
		canvas.removeEventListener('click', action);
		canvas.removeEventListener('keydown', key);
		canvas.removeEventListener('scene-action', action);
		canvas.removeEventListener('scene-pause', pause);
		canvas.removeEventListener('scene-select', select);
	};
};
