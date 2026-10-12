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
	pulseDuration: number;
	pulsePhase: number;
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
	// Stable random directions and varied radii form a loose volume with scattered outer points.
	const particles: Particle[] = Array.from({ length: count }, (_, index) => {
		const y = 1 - 2 * sample(index + 1031);
		const radius = Math.sqrt(1 - y * y);
		const angle = sample(index + 2077) * Math.PI * 2;
		const distance = 18 + Math.pow(sample(index + 4093), 0.6) * 115;
		return {
			x: 0,
			y: 0,
			z: 0,
			vx: 0,
			vy: 0,
			vz: 0,
			sx: Math.cos(angle) * radius * distance,
			sy: y * distance,
			sz: Math.sin(angle) * radius * distance,
			seed: sample(index + 43),
			size: 1.1 + sample(index + 7) * 0.9,
			pulseDuration: 5 + sample(index + 8191) * 5,
			pulsePhase: sample(index + 16381) * Math.PI * 2
		};
	});
	let colors = ['#4851a3', '#a348a0'];
	let elapsed = 0;
	let frame = 0;
	let isDark = false;
	let isDragging = false;
	let isInitialized = false;
	let isInView = false;
	let isPaused = false;
	let isPointerActive = false;
	let lastFrame = 0;
	let motionElapsed = 0;
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
			// Two corkscrew currents turn through a deep cylinder, rather than a flat grid.
			const progress = index / count;
			const angle = progress * Math.PI * 8 + (index % 2) * Math.PI + elapsed * 0.55 + rotation;
			const radius = 100 + (seed - 0.5) * 45 + pulse * 18;
			return [
				(progress - 0.5) * width * 0.78,
				Math.cos(angle) * radius * 0.7,
				Math.sin(angle) * radius * 1.9
			];
		}
		// A thick torus knot rotates in three dimensions, passing in front of and behind itself.
		const angle = (index / count) * Math.PI * 2;
		const tube = seed * Math.PI * 2 + elapsed * 0.35;
		const radius = 110 + 38 * Math.cos(3 * angle) + Math.cos(tube) * (14 + pulse * 12);
		const x = radius * Math.cos(2 * angle);
		const y = radius * Math.sin(2 * angle);
		const z = 80 * Math.sin(3 * angle) + Math.sin(tube) * 24;
		const turn = elapsed * 0.22 + rotation + 0.7;
		const tilt = 0.7 + Math.sin(elapsed * 0.18) * 0.25;
		const turnedX = x * Math.cos(turn) + z * Math.sin(turn);
		const turnedZ = -x * Math.sin(turn) + z * Math.cos(turn);
		return [
			turnedX * 1.5,
			(y * Math.cos(tilt) - turnedZ * Math.sin(tilt)) * 0.7,
			(y * Math.sin(tilt) + turnedZ * Math.cos(tilt)) * 1.65
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
			context.fillStyle = colors[index % colors.length];
			// Positive z is closer to the camera. Smoothly fade distant points into the backdrop.
			const depth = Math.max(0, Math.min(1, (particle.z + 100) / 200));
			const fade = depth * depth * (3 - 2 * depth);
			// Pale surfaces need a higher visibility floor without flattening the depth cue.
			context.globalAlpha = isDark ? 0.015 + Math.pow(fade, 1.5) * 0.985 : 0.12 + fade * 0.88;
			// Independent 5?10 second cycles; effects do not jump this animation clock.
			const sizePulse = preference.matches
				? 1
				: 1 +
					Math.sin((motionElapsed / particle.pulseDuration) * Math.PI * 2 + particle.pulsePhase) *
						0.3;
			context.beginPath();
			context.arc(
				canvas.width / 2 + particle.x * perspective * unit,
				canvas.height / 2 + particle.y * perspective * unit,
				particle.size * sizePulse * perspective * unit,
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
		motionElapsed += delta;
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
		// Read layout once per frame, rather than once for each particle.
		const unit = Math.min(canvas.clientWidth / width, canvas.clientHeight / height);
		const cursorX = ((pointerX - 0.5) * canvas.clientWidth) / unit;
		const cursorY = ((pointerY - 0.5) * canvas.clientHeight) / unit;
		for (let index = 0; index < count; index++) {
			const particle = particles[index];
			const goal = target(particle, index);
			if (phase !== 'settled') {
				const center = sphere(particle, index);
				for (let axis = 0; axis < 3; axis++)
					goal[axis] =
						phase === 'release' ? center[axis] + (goal[axis] - center[axis]) * blend : center[axis];
			} else if (isPointerActive) {
				// Repel in projected screen space so the field stays under the cursor at any depth.
				const perspective = 700 / (700 - goal[2]);
				const dx = goal[0] * perspective - cursorX;
				const dy = goal[1] * perspective - cursorY;
				const distance = Math.hypot(dx, dy);
				const force = Math.exp(-(distance * distance) / (2 * 100 * 100));
				const direction = distance > 0.01 ? Math.atan2(dy, dx) : particle.seed * Math.PI * 2;
				goal[0] += (Math.cos(direction) * force * 155) / perspective;
				goal[1] += (Math.sin(direction) * force * 155) / perspective;
				goal[2] -= force * 40;
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
		isDark = document.documentElement.dataset.theme === 'dark';
		const bounds = canvas.getBoundingClientRect();
		const ratio = Math.min(devicePixelRatio || 1, 1.75);
		canvas.width = Math.max(1, Math.round(bounds.width * ratio));
		canvas.height = Math.max(1, Math.round(bounds.height * ratio));
		width = bounds.width < 700 ? 600 : 1000;
		colors = ['primary', 'secondary'].map(
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
		isPointerActive = true;
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
	const leave = () => {
		isPointerActive = false;
	};
	const up = () => {
		isDragging = false;
	};
	const key = (event: KeyboardEvent) => {
		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter'].includes(event.key))
			return;
		event.preventDefault();
		isPointerActive = true;
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
	canvas.addEventListener('pointerleave', leave);
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
		canvas.removeEventListener('pointerleave', leave);
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
