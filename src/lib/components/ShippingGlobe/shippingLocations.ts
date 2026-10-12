import featured from '#lib/data/shipments/featured.json';

export type ShippingLocation = {
	country: string;
	id: string;
	latitude: number;
	longitude: number;
	name: string;
};

// The existing approximate origin is illustrative; endpoints come from the supplied report.
export const shippingOrigin = { latitude: 43, longitude: -78 };
export const internationalLocations = featured.international;
export const shippingLocations: ShippingLocation[] = [
	...featured.domestic,
	...internationalLocations
];

// A familiar tile map; Alaska and Hawaii are inset, rather than geographically projected.
export const stateRows = [
	['', '', '', '', '', '', '', '', '', '', '', 'ME'],
	['', '', '', '', '', '', 'WI', '', '', '', 'VT', 'NH'],
	['', 'WA', 'ID', 'MT', 'ND', 'MN', 'IL', 'MI', '', 'NY', 'MA', ''],
	['', 'OR', 'NV', 'WY', 'SD', 'IA', 'IN', 'OH', 'PA', 'NJ', 'CT', 'RI'],
	['', 'CA', 'UT', 'CO', 'NE', 'MO', 'KY', 'WV', 'VA', 'MD', 'DE', ''],
	['', '', 'AZ', 'NM', 'KS', 'AR', 'TN', 'NC', 'SC', 'DC', '', ''],
	['', 'AK', 'HI', '', 'OK', 'LA', 'MS', 'AL', 'GA', '', '', ''],
	['', '', '', '', 'TX', '', '', '', '', 'FL', '', '']
].map((row) => row.map((state) => (state === 'DC' ? '' : state)));

export const shippedStateCount = stateRows.flat().filter(Boolean).length;
