import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { topics } from '#lib/components/BentoSection/topics.js';

export const load: PageLoad = ({ params }) => {
	const topic = topics.find((item) => item.id === params.topic);
	if (!topic) error(404, 'Tag topic not found');
	return { topic };
};
