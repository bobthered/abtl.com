export type ShippingLocation = {
	id: string;
	latitude: number;
	longitude: number;
	name: string;
	region: 'United States' | 'International';
};

// Illustrative coordinates only. Replace this dataset when shipment information is supplied.
export const shippingOrigin = { latitude: 43, longitude: -78 };
export const shippingLocations: ShippingLocation[] = [
	{ id: 'seattle', latitude: 47.61, longitude: -122.33, name: 'Seattle', region: 'United States' },
	{
		id: 'los-angeles',
		latitude: 34.05,
		longitude: -118.24,
		name: 'Los Angeles',
		region: 'United States'
	},
	{ id: 'chicago', latitude: 41.88, longitude: -87.63, name: 'Chicago', region: 'United States' },
	{ id: 'dallas', latitude: 32.78, longitude: -96.8, name: 'Dallas', region: 'United States' },
	{ id: 'miami', latitude: 25.76, longitude: -80.19, name: 'Miami', region: 'United States' },
	{ id: 'toronto', latitude: 43.65, longitude: -79.38, name: 'Toronto', region: 'International' },
	{
		id: 'mexico-city',
		latitude: 19.43,
		longitude: -99.13,
		name: 'Mexico City',
		region: 'International'
	},
	{ id: 'london', latitude: 51.51, longitude: -0.13, name: 'London', region: 'International' },
	{ id: 'berlin', latitude: 52.52, longitude: 13.4, name: 'Berlin', region: 'International' },
	{
		id: 'singapore',
		latitude: 1.35,
		longitude: 103.82,
		name: 'Singapore',
		region: 'International'
	},
	{ id: 'sydney', latitude: -33.87, longitude: 151.21, name: 'Sydney', region: 'International' }
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
