import { expect, it } from 'vitest';
import { getNewsPosts, newsPosts } from './news';

it('shows only dated published articles newest first once publishing starts', () => {
	const base = newsPosts[0];
	const posts = [
		{ ...base, id: 'old', isPreview: false, isPublished: true, publishedAt: '2026-01-01' },
		{ ...base, id: 'new', isPreview: false, isPublished: true, publishedAt: '2026-10-11' },
		{ ...base, id: 'draft', isPreview: false },
		{ ...base, id: 'preview' },
		{ ...base, id: 'invalid', isPublished: true, publishedAt: 'invalid' }
	];
	expect(getNewsPosts(posts).map((post) => post.id)).toEqual(['new', 'old']);
	expect(posts[0].id).toBe('old');
});

it('keeps explicit design previews separate from unpublished drafts', () => {
	const preview = newsPosts[0];
	expect(getNewsPosts([preview, { ...preview, id: 'draft', isPreview: false }])).toEqual([preview]);
	expect(getNewsPosts([])).toEqual([]);
});
