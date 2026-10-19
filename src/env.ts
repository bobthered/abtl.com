import { defineEnvVars } from '@sveltejs/kit/env';

// Optional runtime configuration; only the referrer-restricted Maps browser key is exposed by the contact loader.
export const variables = defineEnvVars({
	CONTACT_FROM_EMAIL: { schema: (value) => value?.trim() || undefined },
	GOOGLE_MAPS_API_KEY: { schema: (value) => value?.trim() || undefined },
	RESEND_API_KEY: { schema: (value) => value?.trim() || undefined },
	SHOP_SESSION_SECRET: { schema: (value) => (value && value.length >= 32 ? value : undefined) }
});
