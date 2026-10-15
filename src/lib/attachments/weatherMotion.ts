export type WeatherMotion = {
	bendPhase: number;
	intensity: number;
	rainPhase: number;
	swingPhase: number;
	windOffset: number;
};

export const createWeatherMotion = (): WeatherMotion => ({
	bendPhase: 0,
	intensity: 0,
	rainPhase: 0,
	swingPhase: 0,
	windOffset: 0
});

export const advanceWeatherMotion = (
	motion: WeatherMotion,
	target: number,
	delta: number
): WeatherMotion => {
	const milliseconds = Math.max(0, Math.min(delta, 80));
	const seconds = milliseconds / 1000;
	const intensity =
		motion.intensity +
		(Math.min(1, Math.max(0, target)) - motion.intensity) * (1 - Math.exp(-milliseconds / 420));
	const averageIntensity = (motion.intensity + intensity) / 2;
	// Integrate speed rather than multiplying the entire elapsed time by a changing speed.
	return {
		bendPhase: motion.bendPhase + seconds * (5 + averageIntensity * 10),
		intensity,
		rainPhase: motion.rainPhase + seconds * (0.28 + averageIntensity * 0.8),
		swingPhase: motion.swingPhase + seconds * (2.4 + averageIntensity * 5),
		windOffset: motion.windOffset + seconds * (35 + averageIntensity * 130)
	};
};
