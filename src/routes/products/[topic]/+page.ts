import { error } from '@sveltejs/kit';
import { navigationPages } from '#lib/data/navigationPages.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const content = navigationPages['products/' + params.topic];
	if (!content) error(404, 'Page not found');
	return { content };
};
