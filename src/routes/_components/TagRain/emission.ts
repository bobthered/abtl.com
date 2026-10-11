export const createTagEmissionClock = () => {
	let fraction = 0;
	return {
		advance: (rate: number, seconds: number, emit: () => void) => {
			fraction += rate * seconds;
			while (fraction >= 1) {
				emit();
				fraction--;
			}
		},
		reset: () => {
			fraction = 0;
		}
	};
};
