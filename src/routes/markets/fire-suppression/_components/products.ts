export type FireProduct = {
	id: string;
	name: string;
	headline: string;
	description: string;
	fields: string[];
};

export const tags: FireProduct[] = [
	{
		id: 'inspection',
		name: 'Inspection tags',
		headline: 'Keep the inspection with the equipment.',
		description:
			'Give technicians a clear place to record inspection details, equipment identification, and the person who performed the work.',
		fields: ['Equipment ID', 'Inspection date', 'Technician']
	},
	{
		id: 'alarm',
		name: 'Alarm tags',
		headline: 'A clear record at the alarm.',
		description:
			'Bring alarm identification and service information together on a tag designed around your recording process.',
		fields: ['System / location', 'Service date', 'Technician']
	},
	{
		id: 'back-flow',
		name: 'Back flow tags',
		headline: 'Put the details at the device.',
		description:
			'Plan a back flow tag around the device information and service fields your team needs to record.',
		fields: ['Device ID', 'Location', 'Service date']
	},
	{
		id: 'empty-in-use',
		name: 'Empty / in use tags',
		headline: 'Make the status easy to find.',
		description:
			'Use a direct, readable status message where people need it. Explore the two faces of an empty / in use tag.',
		fields: ['Equipment ID', 'Date', 'Recorded by']
	},
	{
		id: 'service',
		name: 'Service tags',
		headline: 'Leave a useful record of the visit.',
		description:
			'Combine your service identity with practical fields for the work performed, the date, and the technician.',
		fields: ['Service date', 'Work performed', 'Technician']
	}
];

export const labels: FireProduct[] = [
	{
		id: 'six-year',
		name: '6 year maintenance labels',
		headline: 'Make maintenance information visible.',
		description:
			'Build the layout around your maintenance record, with space for the date and the information your team supplies.',
		fields: ['Maintenance date', 'Equipment ID', 'Technician']
	},
	{
		id: 'call-service',
		name: 'Call for service labels',
		headline: 'Make the next call an easy one.',
		description:
			'Keep your company name and contact information close to the equipment, with a clear call-for-service message.',
		fields: ['Company name', 'Service phone', 'Equipment ID']
	},
	{
		id: 'dot-1044',
		name: 'DOT 1044 labels',
		headline: 'Start with the artwork you need.',
		description:
			'Bring your DOT 1044 label artwork and required wording. We can work through the print layout and application details with you.',
		fields: ['Your supplied wording', 'Identification', 'Reference']
	},
	{
		id: 'e-light',
		name: 'Emergency light (e-light) labels',
		headline: 'A place for the e-light record.',
		description:
			'Create a readable label for emergency-light identification and the inspection or service information your team records.',
		fields: ['Unit / location', 'Date', 'Technician']
	},
	{
		id: 'hmis',
		name: 'HMIS labels',
		headline: 'Organize your supplied information.',
		description:
			'Share your HMIS artwork, wording, and application. Build the printed label around the information you provide.',
		fields: ['Product identifier', 'Your supplied ratings', 'Additional information']
	},
	{
		id: 'hood-cleaning',
		name: 'Hood cleaning labels',
		headline: 'Leave the service details in sight.',
		description:
			'Give your company identity and hood-cleaning service details a clear, organized place on the finished label.',
		fields: ['Service date', 'Location', 'Serviced by']
	},
	{
		id: 'hydrostatic',
		name: 'Hydrostatic test labels',
		headline: 'Keep the test record close.',
		description:
			'Plan the label around the test information and identifiers your process calls for, using your supplied wording.',
		fields: ['Test date', 'Equipment ID', 'Recorded by']
	},
	{
		id: 'peel-stick',
		name: 'Peel & stick service labels',
		headline: 'Service information, applied directly.',
		description:
			'Combine service details and your company identity on a peel-and-stick label. Tell us about the surface and conditions where it will be applied.',
		fields: ['Service date', 'Company name', 'Service details']
	}
];

/** Owner-supplied collar sizes and their printed type colors; stock remains white. */
export const collars = [
	{ id: 'small', name: 'Small', color: 'Green', className: 'text-green-700' },
	{ id: 'medium', name: 'Medium', color: 'Gray', className: 'text-gray-600' },
	{ id: 'large', name: 'Large', color: 'Blue', className: 'text-blue-700' },
	{ id: 'xl', name: 'XL', color: 'Purple', className: 'text-purple-700' }
];
