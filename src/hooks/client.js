import {loadLocale} from "./lang.js";
console.log('hooks.client')
/*
The following top-level-await can lead to blocking
if it is bundled in a way that prevents start from doing it's job
*/
await loadLocale();
console.log('hooks.client.done')

// handleError needs to be present, otherwise build logs that it's missing
/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError({ error, event }) {
    console.error('client error',{error,event})
    return {
        message: 'Whoops!',
        code: error.code ?? 'UNKNOWN'
    };
}