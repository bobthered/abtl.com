import { error, redirect } from '@sveltejs/kit';
import { findTopic, topicHref } from '#lib/data/topics.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) => {
	// These former capability guides now open their complete topic pages.
	const slug =
		params.topic === 'printing'
			? 'full-color-printing'
			: params.topic === 'fulfillment'
				? 'warehousing'
				: params.topic;
	const topic = findTopic(slug);
	if (!topic) error(404, 'Capability not found');
	if (params.topic !== (topic.slug ?? topic.id)) redirect(308, `${topicHref(topic)}${url.search}`);
	return { topic };
};
