import { twMerge } from 'tailwind-merge';
import { type Theme } from '../types';

const input = {
	background: 'bg-white dark:bg-gray-950',
	borderRadius: 'rounded-xl',
	padding: 'px-6 py-3',
	ring: 'ring ring-black/10 dark:ring-white/10'
};

export const defaultTheme: Theme = {
	A: {
		default: ''
	},
	Button: {
		default: ''
	},
	Card: {
		default: twMerge(input.background, input.borderRadius, input.ring, 'p-6')
	},
	Container: {
		default: 'px-4 max-w-7xl mx-auto flex w-full'
	},
	Div: {
		default: ''
	},
	Header: {
		default: ''
	},
	Logo: {
		default: 'w-6'
	},
	Main: {
		default: ''
	},
	Nav: {
	Path: {
		default: ''
	},
	Sheet: {
		default: 'fixed'
	},
	Span: {
		default: ''
	},
	SVG: {
		default: ''
	}
};
