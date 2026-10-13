import { error, redirect } from '@sveltejs/kit';
import { findTopic, topicHref } from '#lib/data/topics.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) => {
	const topic = findTopic(params.topic);
	if (!topic) error(404, 'About topic not found');
	if (params.topic !== (topic.slug ?? topic.id)) redirect(308, `${topicHref(topic)}${url.search}`);
	return { topic };
};
