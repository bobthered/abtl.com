import { theme } from 'sveltewind/theme';
import { classic } from 'sveltewind/themes';

/** Initialize shared styles only; keep customer-specific data out of the global theme. */
export function initializeTheme() {
	theme.set.theme(structuredClone(classic));
	theme.set.base('container', 'mx-auto max-w-7xl px-6 sm:px-8 lg:px-16');
	theme.update.base(
		'button',
		'inline-flex items-center justify-center gap-3 font-medium motion-reduce:transition-none'
	);
	theme.update.base('p', 'dark:text-gray-50');
	theme.set.variant(
		'a',
		'accent',
		'font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200'
	);
	theme.set.variant(
		'a',
		'brand',
		'flex shrink-0 flex-col items-center gap-1 text-gray-950 hover:text-gray-950 dark:text-gray-50 dark:hover:text-gray-50'
	);
	theme.set.variant(
		'a',
		'navigation',
		'py-3 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-300'
	);
	theme.set.variant(
		'a',
		'skip',
		'fixed top-3 left-3 z-30 -translate-y-24 rounded-md bg-gray-50 px-5 py-3 text-primary-600 focus:translate-y-0 dark:bg-gray-950 dark:text-primary-300'
	);
	theme.set.variant('article', 'industry', 'border-t border-gray-200 pt-6 dark:border-gray-800');
	theme.set.variant('article', 'product', 'space-y-5 rounded-2xl bg-white dark:bg-gray-950');
	theme.set.variant(
		'button',
		'cta',
		'max-w-full gap-6 rounded-full px-8 py-4 whitespace-normal text-gray-50 hover:text-gray-50 focus:text-gray-50 dark:text-gray-50 dark:hover:text-gray-50 dark:focus:text-gray-50'
	);
	theme.set.variant(
		'button',
		'link',
		'group justify-start px-0 py-0 text-primary-600 hover:text-primary-700 focus:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200 dark:focus:text-primary-200'
	);
	theme.set.variant('container', 'section', 'space-y-4 py-12 lg:py-16');
	theme.set.variant(
		'h1',
		'hero',
		'text-4xl leading-tight tracking-tighter text-gray-950 sm:text-5xl xl:text-6xl 2xl:text-7xl dark:text-gray-50'
	);
	theme.set.variant(
		'h2',
		'section',
		'text-3xl leading-tight tracking-tight text-gray-950 lg:text-5xl dark:text-gray-50'
	);
	theme.set.variant(
		'h3',
		'item',
		'mt-6 mb-3 text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50'
	);
	theme.set.variant(
		'header',
		'site',
		'static border-0 bg-transparent backdrop-blur-none dark:bg-transparent'
	);
	theme.set.variant(
		'img',
		'hero',
		'block h-auto w-full rounded-3xl mix-blend-multiply dark:mix-blend-normal'
	);
	theme.set.variant('p', 'body', 'text-base leading-relaxed');
	theme.set.variant('p', 'description', 'my-6 max-w-xl text-lg leading-relaxed');
	theme.set.variant('p', 'eyebrow', 'mb-4 text-xs font-bold tracking-widest uppercase');
	theme.set.variant('p', 'lead', 'mt-8 max-w-xl text-xl leading-relaxed lg:text-2xl');
	theme.set.variant('popover', 'navigation', 'w-80 rounded-2xl px-6 py-4 lg:hidden');
	theme.set.variant(
		'section',
		'contrast',
		'bg-gray-900 dark:bg-gray-950 [&_h2]:text-gray-50 [&_p]:text-gray-50'
	);
	theme.set.variant('section', 'surface', 'rounded-t-3xl bg-white dark:bg-gray-950');
	theme.set.variant('span', 'brandDetail', 'text-xs font-bold tracking-widest uppercase');
	theme.set.variant(
		'span',
		'brandName',
		'text-2xl leading-none font-bold tracking-tighter xl:text-3xl'
	);
	theme.set.variant(
		'span',
		'index',
		'text-xs tracking-wide text-primary-600 dark:text-primary-300'
	);
	theme.set.variant(
		'svg',
		'arrow',
		'size-6 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none'
	);
}
