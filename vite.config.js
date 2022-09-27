import { sveltekit } from '@sveltejs/kit/vite';
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin';
import { visualizer } from 'rollup-plugin-visualizer'

function manualChunks(id) {
	if(id.includes('/svelte-intl-precompile/')) {
		return 'intl' // force svelte-intl-precompile out of start.js bundle
	}
}
/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		visualizer({
			emitFile: true,
			file: `stats.html`,
		}),
		sveltekit(),
		precompileIntl('locales')
	],
	build: {
		minify: false,
		target: "es2022", //['chrome102', 'edge102', 'firefox101', 'safari15', 'ios15', 'opera85']
		rollupOptions: {
			manualChunks
		}
	}
};

export default config;
