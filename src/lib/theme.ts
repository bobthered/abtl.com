import { theme } from 'sveltewind/theme';
import { minimal } from 'sveltewind/themes';

/** Initialize shared styles only; keep customer-specific data out of the global theme. */
export function initializeTheme() {
	theme.set.theme(structuredClone(minimal));
}
