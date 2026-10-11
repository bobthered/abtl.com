import { topics } from '#lib/components/BentoSection/topics.js';
import type { PageServerLoad } from './$types';

// Shuffle per page request on the server, so SSR and hydration share one order.
export const load: PageServerLoad = () => {
	const bentoTopics = [...topics];
	for (let index = bentoTopics.length - 1; index > 0; index -= 1) {
		const other = Math.floor(Math.random() * (index + 1));
		[bentoTopics[index], bentoTopics[other]] = [bentoTopics[other], bentoTopics[index]];
	}
	return { bentoTopics };
};
