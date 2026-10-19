import { CONTACT_FROM_EMAIL, RESEND_API_KEY } from '$app/env/private';
import { fail } from '@sveltejs/kit';
import { deliverInquiry, isDeliveryConfigured } from './_lib/delivery.server';
import { validateInquiry } from './_lib/inquiry';
import type { Actions, PageServerLoad } from './$types';

const settings = () => ({ apiKey: RESEND_API_KEY, from: CONTACT_FROM_EMAIL });
export const load: PageServerLoad = () => ({
	isDeliveryConfigured: isDeliveryConfigured(settings())
});
export const actions: Actions = {
	default: async ({ request }) => {
		if (Number(request.headers.get('content-length')) > 32768)
			return fail(413, {
				isSent: false,
				message: 'Please keep your inquiry short and email any supporting files separately.'
			});
		let data: FormData;
		try {
			data = await request.formData();
		} catch {
			return fail(400, { isSent: false, message: 'We could not read the form. Please try again.' });
		}
		if (data.get('website'))
			return fail(400, {
				isSent: false,
				message: 'We could not submit this inquiry. Please email sales@abtl.com.'
			});
		const { errors, isValid, values } = validateInquiry(data);
		if (!isValid)
			return fail(400, {
				errors,
				isSent: false,
				message: 'Please check the highlighted fields.',
				values
			});
		const isSent = await deliverInquiry(values, settings());
		if (!isSent)
			return fail(503, {
				isSent: false,
				message:
					'Your inquiry could not be sent. Your details are still here. Please try again, or email sales@abtl.com directly.',
				values
			});
		return {
			isSent: true,
			message: 'Your inquiry is on its way to our team. Thank you for giving us a place to start.'
		};
	}
};
