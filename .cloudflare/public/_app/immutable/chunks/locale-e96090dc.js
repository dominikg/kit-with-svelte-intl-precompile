import { w as writable, d as derived } from "./index-f4aaf2df.js";
const defaultFormats = {
  number: {
    scientific: { notation: "scientific" },
    engineering: { notation: "engineering" },
    compactLong: { notation: "compact", compactDisplay: "long" },
    compactShort: { notation: "compact", compactDisplay: "short" }
  },
  date: {
    short: { month: "numeric", day: "numeric", year: "2-digit" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { month: "long", day: "numeric", year: "numeric" },
    full: { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  },
  time: {
    short: { hour: "numeric", minute: "numeric" },
    medium: { hour: "numeric", minute: "numeric", second: "numeric" },
    long: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    },
    full: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    }
  }
};
const defaultOptions = {
  fallbackLocale: "",
  initialLocale: "",
  loadingDelay: 200,
  formats: defaultFormats,
  warnOnMissingMessages: true
};
const options = defaultOptions;
let currentLocale;
function getCurrentLocale() {
  return currentLocale;
}
function setCurrentLocale(val) {
  return currentLocale = val;
}
function getOptions() {
  return options;
}
function getSubLocales(refLocale) {
  return refLocale.split("-").map((_, i, arr) => arr.slice(0, i + 1).join("-")).reverse();
}
function getPossibleLocales(refLocale, fallbackLocale = getOptions().fallbackLocale) {
  const locales = getSubLocales(refLocale);
  if (fallbackLocale) {
    return [.../* @__PURE__ */ new Set([...locales, ...getSubLocales(fallbackLocale)])];
  }
  return locales;
}
let dictionary;
const $dictionary = writable({});
function getLocaleDictionary(locale) {
  return dictionary[locale] || null;
}
function hasLocaleDictionary(locale) {
  return locale in dictionary;
}
function getMessageFromDictionary(locale, id) {
  if (hasLocaleDictionary(locale)) {
    const localeDictionary = getLocaleDictionary(locale);
    if (id in localeDictionary) {
      return localeDictionary[id];
    }
    const ids = id.split(".");
    let tmpDict = localeDictionary;
    for (let i = 0; i < ids.length; i++) {
      if (typeof tmpDict[ids[i]] !== "object") {
        return tmpDict[ids[i]] || null;
      }
      tmpDict = tmpDict[ids[i]];
    }
  }
  return null;
}
function getClosestAvailableLocale(refLocale) {
  if (refLocale == null)
    return null;
  const relatedLocales = getPossibleLocales(refLocale);
  for (let i = 0; i < relatedLocales.length; i++) {
    const locale = relatedLocales[i];
    if (hasLocaleDictionary(locale)) {
      return locale;
    }
  }
  return null;
}
function addMessages(locale, ...partials) {
  $dictionary.update((d) => {
    d[locale] = Object.assign(d[locale] || {}, ...partials);
    return d;
  });
}
const $locales = /* @__PURE__ */ derived([$dictionary], ([$dictionary2]) => Object.keys($dictionary2));
$dictionary.subscribe((newDictionary) => dictionary = newDictionary);
const $isLoading = writable(false);
const loaderQueue = {};
function createLocaleQueue(locale) {
  loaderQueue[locale] = /* @__PURE__ */ new Set();
}
function removeLocaleFromQueue(locale) {
  delete loaderQueue[locale];
}
function getLocaleQueue(locale) {
  return loaderQueue[locale];
}
function getLocalesQueues(locale) {
  return getPossibleLocales(locale).reverse().map((localeItem) => {
    const queue = getLocaleQueue(localeItem);
    return [localeItem, queue ? [...queue] : []];
  }).filter(([, queue]) => queue.length > 0);
}
function hasLocaleQueue(locale) {
  return getPossibleLocales(locale).reverse().some(getLocaleQueue);
}
const activeLocaleFlushes = {};
function flush(locale) {
  if (!hasLocaleQueue(locale))
    return Promise.resolve();
  if (locale in activeLocaleFlushes)
    return activeLocaleFlushes[locale];
  const queues = getLocalesQueues(locale);
  if (queues.length === 0)
    return Promise.resolve();
  const loadingDelay = setTimeout(() => $isLoading.set(true), getOptions().loadingDelay);
  activeLocaleFlushes[locale] = Promise.all(queues.map(([locale2, queue]) => {
    return Promise.all(queue.map((loader) => loader())).then((partials) => {
      removeLocaleFromQueue(locale2);
      partials = partials.map((partial) => partial.default || partial);
      addMessages(locale2, ...partials);
    });
  })).then(() => {
    clearTimeout(loadingDelay);
    $isLoading.set(false);
    delete activeLocaleFlushes[locale];
  });
  return activeLocaleFlushes[locale];
}
function registerLocaleLoader(locale, loader) {
  if (!getLocaleQueue(locale))
    createLocaleQueue(locale);
  const queue = getLocaleQueue(locale);
  if (getLocaleQueue(locale).has(loader))
    return;
  if (!hasLocaleDictionary(locale)) {
    $dictionary.update((d) => {
      d[locale] = {};
      return d;
    });
  }
  queue.add(loader);
}
const $locale = writable("");
$locale.subscribe((newLocale) => {
  setCurrentLocale(newLocale);
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("lang", newLocale);
  }
});
const localeSet = $locale.set;
$locale.set = (newLocale) => {
  if (getClosestAvailableLocale(newLocale) && hasLocaleQueue(newLocale)) {
    return flush(newLocale).then(() => localeSet(newLocale));
  }
  return localeSet(newLocale);
};
$locale.update = (fn) => {
  let currentLocale2 = getCurrentLocale();
  fn(currentLocale2);
  localeSet(currentLocale2);
};
export {
  $locale as $,
  getCurrentLocale as a,
  getPossibleLocales as b,
  getMessageFromDictionary as c,
  $dictionary as d,
  $locales as e,
  flush as f,
  getOptions as g,
  hasLocaleQueue as h,
  registerLocaleLoader as r
};
