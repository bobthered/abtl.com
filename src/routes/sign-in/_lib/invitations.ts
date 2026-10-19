import { navigation } from '#lib/data/navigation.js';

export const betaMarkets = navigation
	.find((section) => section.href === '/markets')!
	.children.map((market) => ({ label: market.label, value: market.href.split('/').at(-1)! }));
export type InvitationRequest = {
	company?: string;
	email?: string;
	market?: string;
	name?: string;
	website?: string;
};

export const validateInvitationRequest = (values: InvitationRequest) => {
	if (
		typeof values.name !== 'string' ||
		!values.name.trim() ||
		values.name.length > 120 ||
		typeof values.company !== 'string' ||
		!values.company.trim() ||
		values.company.length > 160 ||
		typeof values.email !== 'string' ||
		values.email.length > 254 ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ||
		typeof values.market !== 'string' ||
		!betaMarkets.some((market) => market.value === values.market) ||
		(values.website !== undefined && values.website !== '')
	)
		return null;
	return {
		name: values.name.trim(),
		company: values.company.trim(),
		email: values.email.trim(),
		market: betaMarkets.find((market) => market.value === values.market)!.label
	};
};
