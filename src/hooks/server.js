import {sequence} from "@sveltejs/kit/hooks";
import {setLocale} from "./lang.js";
/** @type {import('@sveltejs/kit').Handle} */
async function loadUserLocale({event,resolve}) {
    //simulate loading the locale from db, user profile, whereever
    //event.locals.user = {locale: 'de'}
    return resolve(event);
}
/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(loadUserLocale,setLocale)

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
    console.error('server error',{error,event})
    return {
        message: 'Whoops!',
        code: error.code ?? 'UNKNOWN'
    };
}