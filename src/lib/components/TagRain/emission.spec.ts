import { expect, it } from 'vitest';
import { createTagEmissionClock } from './emission';

it.each([2.85, 5, 12])(
	'emits at %s tags/second regardless of how many physics steps share a render frame',
	(rate) => {
		const collect = (stepsPerFrame: number) => {
			const clock = createTagEmissionClock();
			const emissions: number[] = [];
			for (let frame = 0; frame < 600 / stepsPerFrame; frame++) {
				for (let step = 0; step < stepsPerFrame; step++) {
					const time = (frame * stepsPerFrame + step + 1) / 60;
					clock.advance(rate, 1 / 60, () => emissions.push(time));
				}
			}
			return emissions;
		};
		const emissions = collect(1);
		expect(collect(3)).toEqual(emissions);
		expect(emissions.length).toBe(Math.floor(rate * 10));
		for (let index = 1; index < emissions.length; index++)
			expect(Math.abs(emissions[index] - emissions[index - 1] - 1 / rate)).toBeLessThanOrEqual(
				1 / 60 + 1e-8
			);
	}
);
