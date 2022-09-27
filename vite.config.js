import { sveltekit } from '@sveltejs/kit/vite';
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), precompileIntl('locales')],
	build: {
		minify: false,
		target: "es2022" //['chrome102', 'edge102', 'firefox101', 'safari15', 'ios15', 'opera85']
	}
};

export default config;
