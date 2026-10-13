import { error, redirect } from '@sveltejs/kit';
import { findTopic, topicHref } from '#lib/data/topics.js';
import type { PageServerLoad } from './$types';

// Keep existing bookmarks and shared links while publishing the new canonical routes.
export const load: PageServerLoad = ({ params, url }) => {
	const topic = findTopic(params.topic);
	if (!topic) error(404, 'About topic not found');
	redirect(308, `${topicHref(topic)}${url.search}`);
};
