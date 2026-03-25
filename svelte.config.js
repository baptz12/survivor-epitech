import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			base: process.argv.includes('dev') ? '' : '/survivor-epitech'
		},
		adapter: adapter({
			// Fallback est indispensable pour que GitHub Pages gère le routage interne de ton app
			fallback: '404.html'
		})
	}
};

export default config;
