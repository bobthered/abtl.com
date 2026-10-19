import { defineEnvVars } from '@sveltejs/kit/env';

// Optional server-only delivery and session configuration.
export const variables = defineEnvVars({
	CONTACT_FROM_EMAIL: { schema: (value) => value?.trim() || undefined },
	RESEND_API_KEY: { schema: (value) => value?.trim() || undefined },
	SHOP_SESSION_SECRET: { schema: (value) => (value && value.length >= 32 ? value : undefined) }
});
