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

# Problem
dev works fine, you can change the name, locale or click cool alert, js is loaded.

But running preview, none of these work on the page. JS never loads everything, evident by the missing `hooks.client.done` console log from `src/hooks/client.js` and network tab

Following the imports in the client output, you can see that `de-xxxxx.js` and `en-xxxxx.js` contain an import that points back to start
```js
import { _ as __interpolate } from "./start-6d6c2311.js";
const de = {
  "foo": (name) => `Hallo ${__interpolate(name)}!`
};
export {
  de as default
};

```
but the order in`start-xxxxx.js` is
```js
//...
function registerAll() {
  registerLocaleLoader("de", () => __vitePreload(() => import("./de-5fcb79c1.js"), true ? [] : void 0, import.meta.url));
  registerLocaleLoader("en", () => __vitePreload(() => import("./en-ae3f9fd3.js"), true ? [] : void 0, import.meta.url));
}
const availableLocales = ["de", "en"];
const DEFAULT_LOCALE = "de";
registerAll();
//...
console.log("hooks.client");
await loadLocale();
console.log("hooks.client.done");
//...
```

Which would only work if de.xxxx.js would not import start again, which causes a dead-lock on `await loadLocale()`

# Possible Solution
use `manualChunks` to resolve the dead-lock. See [vite.config.js](./vite.config.js)
Enable/disable manualChunks, run `pnpm build` and compare [./.svelte-kit-auto/output/client/stats.html](./.svelte-kit-auto/output/client/stats.html)
