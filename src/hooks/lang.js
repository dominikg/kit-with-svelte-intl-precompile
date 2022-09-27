import {
    init,
    waitLocale,
    getLocaleFromAcceptLanguageHeader,
    getLocaleFromNavigator
} from 'svelte-intl-precompile';
import { registerAll, availableLocales } from '$locales';
const DEFAULT_LOCALE = 'de';
registerAll();

/** @type {import('@sveltejs/kit').Handle} */
export async function setLocale({ event, resolve }) {
    const lang = await loadLocale(event);
    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', lang)
    });
};

export async function loadLocale(event) {
    const locale = stripSuffix(event ? getSSRLocale(event) : getClientLocale());
    init({ initialLocale: locale, fallbackLocale: DEFAULT_LOCALE });
    await waitLocale(locale);
    return locale;
}

function getSSRLocale(event) {
    return (
        event.locals.user?.locale ||
        getLocaleFromAcceptLanguageHeader(
            event.request.headers.get('Accept-Language'),
            availableLocales
        ) ||
        DEFAULT_LOCALE
    );
}

function getClientLocale() {
    // html lang attr is set by SSR hook, so we just reuse that
    return document?.documentElement.lang || stripSuffix(getLocaleFromNavigator()) || DEFAULT_LOCALE;
}

function stripSuffix(locale) {
    return locale?.split('-', 2)[0];
}
