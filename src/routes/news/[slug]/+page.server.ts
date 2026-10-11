import { error } from '@sveltejs/kit';
import { visibleNewsPosts } from '#lib/data/news.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const post = visibleNewsPosts.find((entry) => entry.id === params.slug);
	if (!post) error(404, 'Article not found');
	return { post };
};
