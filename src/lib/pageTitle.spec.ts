import { createPageTitle } from './pageTitle';
import { expect, it } from 'vitest';

it.each([
	['/', 'Allen-Bailey Tag & Label'],
	['/about-us', 'About Us | Allen-Bailey Tag & Label'],
	['/products/fire-suppression', 'Fire Suppression | Products | Allen-Bailey Tag & Label'],
	['/products/fire-suppression/', 'Fire Suppression | Products | Allen-Bailey Tag & Label'],
	['/resources/artwork%20guidelines', 'Artwork Guidelines | Resources | Allen-Bailey Tag & Label'],
	['/bad%encoding', 'Bad%encoding | Allen-Bailey Tag & Label']
])('formats the title for %s', (pathname, expected) => {
	expect(createPageTitle(pathname)).toBe(expected);
});
