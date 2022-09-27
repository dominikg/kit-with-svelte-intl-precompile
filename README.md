# demo project for svelte-intl-precompile 

This project is used to analyze loading behavior of svelte-intl-precompile with top-level-await in a sveltekit client hook

# uses multiple adapters
```shell
pnpm build # build all
pnpm preview # start previews 
```

## adapter-auto

* kit.outDir: `.svelte-kit-auto`
* adapter-output: `build`
* preview url: http://localhost:4173 (vite preview)

## adapter-node

* kit.outDir: `.svelte-kit-node`
* adapter-output: `build-node`
* preview url: http://localhost:3000 (node build-node)

## adapter-cloudflare-workers

* kit.outDir: `.svelte-kit-cf`
* adapter-output: `.cloudflare` 
* preview url: http://localhost:8787 (miniflare .cloudflare/worker.js)

# svelte-intl-precompile

* setup in `src/hooks/lang.js`
* during SSR loaded in `src/hooks/server.js` handle sequence
* on client loaded in `src/hooks/client.js` with top level await 