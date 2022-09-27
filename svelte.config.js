import node from '@sveltejs/adapter-node';
import cf from '@sveltejs/adapter-cloudflare-workers';
import auto from '@sveltejs/adapter-auto';
const env_adapter = process.env.ADAPTER;

function adapter_config() {
	switch (env_adapter) {
		case "cf": return {
			adapter: cf(),
			outDir: '.svelte-kit-cf'
		}
		case "node": return {
			adapter: node({out: 'build-node'}),
			outDir: '.svelte-kit-node'
		}
		default: return {
			outDir: '.svelte-kit-auto',
			adapter: auto()
		}
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		files: {
			hooks:{
				server: "src/hooks/server.js",
				client: "src/hooks/client.js"
			}
		},
		prerender: {
			enabled: false
		},
		...adapter_config()
	}
};

export default config;
