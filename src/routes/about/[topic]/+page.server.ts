import { error, redirect } from '@sveltejs/kit';
import { findTopic, topicHref } from '#lib/data/topics.js';
import type { PageServerLoad } from './$types';

// Preserve the original About aliases, including printing -> variable-data.
export const load: PageServerLoad = ({ params, url }) => {
	const topic = findTopic(params.topic);
	if (!topic) error(404, 'Capability not found');
	redirect(308, `${topicHref(topic)}${url.search}`);
};
