/** Application ideas for custom projects, not a stock-SKU or availability list. */
export const applications = [
	{
		id: 'valet',
		name: 'Valet tags',
		title: 'Keep the vehicle and claim connected.',
		description:
			'Plan matching identifiers and useful fields for the vehicle, key, and guest claim. Build the layout around the way your valet team receives and returns vehicles.',
		fields: ['Vehicle / plate', 'Date / time', 'Attendant'],
		printTitle: 'VALET CLAIM'
	},
	{
		id: 'coat',
		name: 'Coat check tags',
		title: 'A small check. A personal belonging.',
		description:
			'A coat-room tag and guest claim can carry the same identifier. Plan the opening, item fields, and claim area around your coat-check process.',
		fields: ['Item description', 'Date / location', 'Checked by'],
		printTitle: 'COAT CHECK'
	},
	{
		id: 'property',
		name: 'Lost & found tags',
		title: 'Leave a record with what was left behind.',
		description:
			'Give your team a place for the item description, where it was found, and return notes. Keep the information with the stored property.',
		fields: ['Item description', 'Found at / date', 'Return notes'],
		printTitle: 'LOST & FOUND'
	},
	{
		id: 'laundry',
		name: 'Laundry & dry-cleaning tags',
		title: 'Keep the service details together.',
		description:
			'Organize guest-service items with room or reference information, item details, and the requested service. Share the handling and exposure your tag needs to suit.',
		fields: ['Room / reference', 'Items / service', 'Collection date'],
		printTitle: 'LAUNDRY SERVICE'
	},
	{
		id: 'amenity',
		name: 'Bathrobe & amenity tags',
		title: 'Carry the property identity into the room.',
		description:
			'Add a considered printed detail to robes and guest amenities. Plan your property name, presentation, and supplied guest message together.',
		fields: ['Your guest message', 'Property information', 'Your supplied details'],
		printTitle: 'FOR YOUR STAY'
	}
];
