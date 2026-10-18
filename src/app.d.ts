// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			shopMember?: import('./lib/server/shop/access').ShopMember;
		}
		// interface PageData {}
		interface PageState {
			bentoTopic?: string;
			newsPost?: string;
		}
		// interface Platform {}
	}
}

export {};
