import { S as SvelteComponent, i as init, s as safe_not_equal, k as element, a as space, q as text, l as claim_element, m as children, h as detach, c as claim_space, r as claim_text, n as attr, b as insert_hydration, I as append_hydration, u as set_data, A as noop, K as destroy_each, J as component_subscribe, L as toggle_class, M as listen, N as set_store_value } from "../../chunks/index-57064c30.js";
import { b as getPossibleLocales, c as getMessageFromDictionary, $ as $locale, d as $dictionary, g as getOptions, h as hasLocaleQueue, a as getCurrentLocale, e as $locales } from "../../chunks/locale-e96090dc.js";
import { d as derived } from "../../chunks/index-f4aaf2df.js";
const lookupCache = {};
const addToCache = (path, locale, message) => {
  if (!message)
    return message;
  if (!(locale in lookupCache))
    lookupCache[locale] = {};
  if (!(path in lookupCache[locale]))
    lookupCache[locale][path] = message;
  return message;
};
const lookup = (path, refLocale) => {
  if (refLocale == null)
    return void 0;
  if (refLocale in lookupCache && path in lookupCache[refLocale]) {
    return lookupCache[refLocale][path];
  }
  const locales = getPossibleLocales(refLocale);
  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];
    const message = getMessageFromDictionary(locale, path);
    if (message) {
      return addToCache(path, refLocale, message);
    }
  }
  return void 0;
};
const formatMessage = (currentLocale, optionsOrId, maybeOptions = {}) => {
  const id = typeof optionsOrId === "string" ? optionsOrId : optionsOrId.id;
  const options = typeof optionsOrId === "string" ? maybeOptions : optionsOrId;
  const { values, locale = currentLocale || getCurrentLocale(), default: defaultValue } = options;
  if (locale == null) {
    throw new Error("[svelte-intl-precompile] Cannot format a message without first setting the initial locale.");
  }
  let message = lookup(id, locale);
  if (typeof message === "string") {
    return message;
  }
  if (typeof message === "function") {
    return message(...Object.keys(options.values || {}).sort().map((k) => (options.values || {})[k]));
  }
  if (getOptions().warnOnMissingMessages) {
    console.warn(`[svelte-intl-precompile] The message "${id}" was not found in "${getPossibleLocales(locale).join('", "')}".${hasLocaleQueue(getCurrentLocale()) ? `

Note: there are at least one loader still registered to this locale that wasn't executed.` : ""}`);
  }
  return defaultValue || id;
};
const $format = /* @__PURE__ */ derived([$locale, $dictionary], ([currentLocale]) => formatMessage.bind(null, currentLocale));
const _page_svelte_svelte_type_style_lang = "";
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[4] = list[i];
  return child_ctx;
}
function create_each_block(ctx) {
  let button;
  let t0_value = ctx[4] + "";
  let t0;
  let t1;
  let button_aria_label_value;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[3](ctx[4]);
  }
  return {
    c() {
      button = element("button");
      t0 = text(t0_value);
      t1 = space();
      this.h();
    },
    l(nodes) {
      button = claim_element(nodes, "BUTTON", {
        type: true,
        class: true,
        "aria-label": true
      });
      var button_nodes = children(button);
      t0 = claim_text(button_nodes, t0_value);
      t1 = claim_space(button_nodes);
      button_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(button, "type", "button");
      attr(button, "class", "locale-btn svelte-18otwsg");
      attr(button, "aria-label", button_aria_label_value = ctx[4]);
      toggle_class(button, "active", ctx[4] === ctx[1]);
    },
    m(target, anchor) {
      insert_hydration(target, button, anchor);
      append_hydration(button, t0);
      append_hydration(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && t0_value !== (t0_value = ctx[4] + ""))
        set_data(t0, t0_value);
      if (dirty & 1 && button_aria_label_value !== (button_aria_label_value = ctx[4])) {
        attr(button, "aria-label", button_aria_label_value);
      }
      if (dirty & 3) {
        toggle_class(button, "active", ctx[4] === ctx[1]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment(ctx) {
  let div;
  let t0;
  let h1;
  let t1;
  let t2_value = ctx[2]("foo") + "";
  let t2;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t0 = space();
      h1 = element("h1");
      t1 = text("translated foo:");
      t2 = text(t2_value);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div_nodes);
      }
      div_nodes.forEach(detach);
      t0 = claim_space(nodes);
      h1 = claim_element(nodes, "H1", {});
      var h1_nodes = children(h1);
      t1 = claim_text(h1_nodes, "translated foo:");
      t2 = claim_text(h1_nodes, t2_value);
      h1_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "locale-switcher svelte-18otwsg");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
      insert_hydration(target, t0, anchor);
      insert_hydration(target, h1, anchor);
      append_hydration(h1, t1);
      append_hydration(h1, t2);
    },
    p(ctx2, [dirty]) {
      if (dirty & 3) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & 4 && t2_value !== (t2_value = ctx2[2]("foo") + ""))
        set_data(t2, t2_value);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(h1);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $locales$1;
  let $locale$1;
  let $t;
  component_subscribe($$self, $locales, ($$value) => $$invalidate(0, $locales$1 = $$value));
  component_subscribe($$self, $locale, ($$value) => $$invalidate(1, $locale$1 = $$value));
  component_subscribe($$self, $format, ($$value) => $$invalidate(2, $t = $$value));
  const click_handler = (loc) => set_store_value($locale, $locale$1 = loc, $locale$1);
  return [$locales$1, $locale$1, $t, click_handler];
}
class Page extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export {
  Page as default
};
