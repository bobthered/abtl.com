import { advanceWeatherMotion, createWeatherMotion } from './weatherMotion';
import { expect, it } from 'vitest';

it('keeps motion continuous and forward when wind changes after a long run', () => {
	let motion = createWeatherMotion();
	for (let frame = 0; frame < 100000; frame++) motion = advanceWeatherMotion(motion, 0.4, 16);
	for (const target of [1, 0, 0.75, 0.2]) {
		for (let frame = 0; frame < 120; frame++) {
			const next = advanceWeatherMotion(motion, target, 16);
			expect(next.windOffset - motion.windOffset).toBeGreaterThan(0);
			expect(next.windOffset - motion.windOffset).toBeLessThanOrEqual(165 * 0.016 + 1e-8);
			expect(next.rainPhase - motion.rainPhase).toBeGreaterThan(0);
			expect(next.rainPhase - motion.rainPhase).toBeLessThanOrEqual(1.08 * 0.016 + 1e-8);
			expect(next.swingPhase - motion.swingPhase).toBeGreaterThan(0);
			expect(next.swingPhase - motion.swingPhase).toBeLessThanOrEqual(7.4 * 0.016 + 1e-8);
			expect(next.bendPhase - motion.bendPhase).toBeGreaterThan(0);
			expect(next.bendPhase - motion.bendPhase).toBeLessThanOrEqual(15 * 0.016 + 1e-8);
			motion = next;
		}
	}
});

it('accelerates and decelerates smoothly without overshooting the requested intensity', () => {
	let motion = createWeatherMotion();
	for (const target of [1, 0.25, 0.8, 0]) {
		const start = motion.intensity;
		for (let frame = 0; frame < 300; frame++) {
			const next = advanceWeatherMotion(motion, target, 16);
			expect(next.intensity).toBeGreaterThanOrEqual(Math.min(start, target));
			expect(next.intensity).toBeLessThanOrEqual(Math.max(start, target));
			expect(Math.abs(next.intensity - target)).toBeLessThanOrEqual(
				Math.abs(motion.intensity - target)
			);
			motion = next;
		}
		expect(motion.intensity).toBeCloseTo(target, 4);
	}
	expect(advanceWeatherMotion(motion, 1, 0)).toEqual(motion);
});
