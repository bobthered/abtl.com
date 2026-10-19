export const isAuthenticatedRoute = (routeId: string | null) =>
	Boolean(routeId?.split('/').includes('(authenticated)'));
