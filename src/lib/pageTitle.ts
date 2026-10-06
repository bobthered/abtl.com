const companyName = 'Allen-Bailey Tag & Label';

export const createPageTitle = (pathname: string): string => {
	const segments = pathname
		.split('/')
		.filter(Boolean)
		.map((segment) => {
			let label = segment;
			try {
				label = decodeURIComponent(segment);
			} catch {
				// Keep malformed URL encodings readable without interrupting rendering.
			}
			return label
				.split(/[-_\s]+/)
				.filter(Boolean)
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
		})
		.filter(Boolean)
		.reverse();

	return [...segments, companyName].join(' | ');
};
