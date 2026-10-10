import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { topicHref, topics } from '#lib/components/BentoSection/topics.js';

export const load: PageLoad = ({ params, url }) => {
	// Preserve links to the former printing placeholder.
	if (params.topic === 'printing') redirect(308, `/tags/variable-data${url.search}`);
	const topic = topics.find(
		(item) => (item.slug ?? item.id) === params.topic || item.id === params.topic
	);
	if (!topic) error(404, 'Tag topic not found');
	if (params.topic !== (topic.slug ?? topic.id)) redirect(308, `${topicHref(topic)}${url.search}`);
	return { topic };
};
