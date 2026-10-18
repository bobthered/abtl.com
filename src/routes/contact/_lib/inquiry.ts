export type InquiryValues = {
	company: string;
	email: string;
	message: string;
	name: string;
	phone: string;
	reference: string;
};
export type InquiryErrors = Partial<Record<keyof InquiryValues, string>>;
export const validateInquiry = (data: FormData) => {
	const values: InquiryValues = {
		company: '',
		email: '',
		message: '',
		name: '',
		phone: '',
		reference: ''
	};
	const errors: InquiryErrors = {};
	const limits: Record<keyof InquiryValues, number> = {
		company: 160,
		email: 254,
		message: 5000,
		name: 120,
		phone: 40,
		reference: 100
	};
	for (const key of Object.keys(values) as (keyof InquiryValues)[]) {
		const value = data.get(key);
		values[key] = typeof value === 'string' ? value.trim() : '';
		if (values[key].length > limits[key]) {
			errors[key] = `Please use ${limits[key]} characters or fewer.`;
			values[key] = values[key].slice(0, limits[key]);
		}
	}
	if (!values.name) errors.name = 'Please enter your name.';
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
		errors.email = 'Please enter a valid email address.';
	if (!values.message) errors.message = 'Tell us a little about your inquiry.';
	return { errors, isValid: Object.keys(errors).length === 0, values };
};
