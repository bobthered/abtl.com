import { getFireOrders } from './fireSuppression';
import type { ShopMember } from './access';

const pageSize = 10;
const isDate = (value: string) =>
	/^\d{4}-\d{2}-\d{2}$/.test(value) &&
	Number.isFinite(Date.parse(value)) &&
	new Date(value).toISOString().slice(0, 10) === value;

export const searchFireOrders = (member: ShopMember, params: URLSearchParams) => {
	const read = (name: string) => (params.get(name) ?? '').trim().slice(0, 120);
	const filters = {
		from: read('from'),
		q: read('q'),
		sort: read('sort') || 'newest',
		to: read('to'),
		type: read('type')
	};
	if (!['newest', 'oldest', 'sku'].includes(filters.sort)) filters.sort = 'newest';
	const filterError =
		(filters.from && !isDate(filters.from)) || (filters.to && !isDate(filters.to))
			? 'Enter valid order dates.'
			: filters.from && filters.to && filters.from > filters.to
				? 'The start date must be on or before the end date.'
				: '';
	const terms = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
	const matches = filterError
		? []
		: getFireOrders(member)
				.filter((order) => {
					const text = [
						order.orderNumber,
						order.poNumber,
						order.sku,
						order.description,
						order.reference,
						order.artwork,
						order.product.name,
						order.date
					]
						.join(' ')
						.toLowerCase();
					return (
						terms.every((term) => text.includes(term)) &&
						(!filters.type || order.productId === filters.type) &&
						(!filters.from || order.date >= filters.from) &&
						(!filters.to || order.date <= filters.to)
					);
				})
				.sort((first, second) =>
					filters.sort === 'sku'
						? first.sku.localeCompare(second.sku)
						: (filters.sort === 'oldest'
								? first.date.localeCompare(second.date)
								: second.date.localeCompare(first.date)) || first.id.localeCompare(second.id)
				);
	const total = matches.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const requestedPage = Number(params.get('page') ?? 1);
	const page = Math.min(
		pageCount,
		Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1)
	);
	const link = (target: number) => {
		const search = new URLSearchParams();
		for (const [key, value] of Object.entries(filters)) if (value) search.set(key, value);
		search.set('page', String(target));
		return `/shop?${search}#previous-orders`;
	};
	return {
		filterError,
		filters,
		nextHref: page < pageCount ? link(page + 1) : null,
		orders: matches.slice((page - 1) * pageSize, page * pageSize),
		pagination: {
			first: total ? (page - 1) * pageSize + 1 : 0,
			last: Math.min(page * pageSize, total),
			page,
			pageCount,
			total
		},
		previousHref: page > 1 ? link(page - 1) : null,
		query: filters.q
	};
};
