import { canAccessMarket } from '#lib/server/shop/access.js';
import { error, fail, redirect } from '@sveltejs/kit';
import {
	fireProducts,
	getFireOrders,
	parseDraftQuantity
} from '#lib/server/shop/fireSuppression.js';
import type { Actions, PageServerLoad } from './$types';
import { searchFireOrders } from '#lib/server/shop/orderSearch.js';
import type { ShopMember } from '#lib/server/shop/access.js';

const requireMember = (member: ShopMember | undefined) => {
	if (!member) redirect(303, '/account/sign-in');
	if (!canAccessMarket(member, 'fire-suppression'))
		error(403, 'Your company does not have access to this market.');
	return member;
};

export const load: PageServerLoad = ({ locals, setHeaders, url }) => {
	setHeaders({ 'cache-control': 'private, no-store' });
	const member = requireMember(locals.shopMember);
	return {
		companyName: member.companyName,
		isDemo: member.companyId === 'demo-fire-company',
		products: fireProducts,
		...searchFireOrders(member, url.searchParams)
	};
};

export const actions: Actions = {
	reorder: async ({ locals, request }) => {
		const member = requireMember(locals.shopMember);
		if (Number(request.headers.get('content-length')) > 16384)
			return fail(413, { message: 'Please keep your request under 16 KB.' });
		const values = await request.formData();
		const order = getFireOrders(member).find((entry) => entry.id === values.get('orderId'));
		if (!order) return fail(404, { message: 'That order is not available for your company.' });
		const quantity = parseDraftQuantity(values.get('quantity'));
		if (!quantity)
			return fail(400, { message: 'Enter a whole-number quantity between 1 and 9,999,999.' });
		return {
			message: 'Demo reorder review only. Nothing has been saved, submitted, or charged.',
			draft: {
				type: 'Reorder',
				product: order.product.name,
				quantity,
				reference: `${order.orderNumber} / ${order.artwork}`,
				details: `${order.sku} / PO ${order.poNumber} / ${order.description}`
			}
		};
	},
	newProduct: async ({ locals, request }) => {
		requireMember(locals.shopMember);
		if (Number(request.headers.get('content-length')) > 16384)
			return fail(413, { message: 'Please keep your request under 16 KB.' });
		const values = await request.formData();
		const product = fireProducts.find((entry) => entry.id === values.get('productId'));
		const quantity = parseDraftQuantity(values.get('quantity'));
		const details = values.get('details');
		if (
			!product ||
			!quantity ||
			typeof details !== 'string' ||
			!details.trim() ||
			details.length > 2000
		)
			return fail(400, {
				message:
					'Choose a product, enter a whole-number quantity between 1 and 9,999,999, and describe your requirements (up to 2,000 characters).'
			});
		return {
			message: 'Demo new-product review only. Nothing has been saved, submitted, or charged.',
			draft: {
				type: 'New product',
				product: product.name,
				quantity,
				reference: 'New artwork and pricing require review',
				details: details.trim()
			}
		};
	}
};
