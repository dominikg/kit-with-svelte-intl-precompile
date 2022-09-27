import { S as SvelteComponent, i as init$1, s as safe_not_equal, a as space, e as empty, c as claim_space, b as insert_hydration, g as group_outros, t as transition_out, d as check_outros, f as transition_in, h as detach, j as afterUpdate, o as onMount, k as element, l as claim_element, m as children, n as attr, p as set_style, q as text, r as claim_text, u as set_data, v as create_component, w as claim_component, x as mount_component, y as destroy_component, z as tick } from "./chunks/index-57064c30.js";
import { g as get_base_uri, f as find_anchor, s as stores, a as scroll_state, b as set_paths, i as init$2 } from "./chunks/singletons-76d8098f.js";
import { $ as $locale, g as getOptions, f as flush, a as getCurrentLocale, r as registerLocaleLoader } from "./chunks/locale-e96090dc.js";
const scriptRel = function detectScriptRel() {
  const relList = document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
}();
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep, importerUrl);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
function decode_params(params) {
  for (const key in params) {
    params[key] = params[key].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
  }
  return params;
}
const tracked_url_properties = ["href", "pathname", "search", "searchParams", "toString", "toJSON"];
function make_trackable(url, callback) {
  const tracked = new URL(url);
  for (const property of tracked_url_properties) {
    let value = tracked[property];
    Object.defineProperty(tracked, property, {
      get() {
        callback();
        return value;
      },
      enumerable: true,
      configurable: true
    });
  }
  tracked[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
    return inspect(url, opts);
  };
  disable_hash(tracked);
  return tracked;
}
function disable_hash(url) {
  Object.defineProperty(url, "hash", {
    get() {
      throw new Error(
        "Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead"
      );
    }
  });
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
const native_fetch = window.fetch;
{
  window.fetch = (input, init2) => {
    const method = input instanceof Request ? input.method : init2?.method || "GET";
    if (method !== "GET") {
      const url = new URL(input instanceof Request ? input.url : input.toString(), document.baseURI).href;
      cache.delete(url);
    }
    return native_fetch(input, init2);
  };
}
const cache = /* @__PURE__ */ new Map();
function initial_fetch(resource, resolved, opts) {
  const url = JSON.stringify(resource instanceof Request ? resource.url : resource);
  let selector = `script[data-sveltekit-fetched][data-url=${url}]`;
  if (opts && typeof opts.body === "string") {
    selector += `[data-hash="${hash(opts.body)}"]`;
  }
  const script = document.querySelector(selector);
  if (script?.textContent) {
    const { body, ...init2 } = JSON.parse(script.textContent);
    const ttl = script.getAttribute("data-ttl");
    if (ttl)
      cache.set(resolved, { body, init: init2, ttl: 1e3 * Number(ttl) });
    return Promise.resolve(new Response(body, init2));
  }
  return native_fetch(resource, opts);
}
function subsequent_fetch(resolved, opts) {
  const cached = cache.get(resolved);
  if (cached) {
    if (performance.now() < cached.ttl) {
      return new Response(cached.body, cached.init);
    }
    cache.delete(resolved);
  }
  return native_fetch(resolved, opts);
}
const param_pattern = /^(\.\.\.)?(\w+)(?:=(\w+))?$/;
function parse_route_id(id) {
  const names = [];
  const types = [];
  let add_trailing_slash = true;
  const pattern = id === "" ? /^\/$/ : new RegExp(
    `^${id.split(/(?:\/|$)/).filter(affects_path).map((segment, i, segments) => {
      const decoded_segment = decodeURIComponent(segment);
      const match = /^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(decoded_segment);
      if (match) {
        names.push(match[1]);
        types.push(match[2]);
        return "(?:/(.*))?";
      }
      const is_last = i === segments.length - 1;
      return decoded_segment && "/" + decoded_segment.split(/\[(.+?)\]/).map((content, i2) => {
        if (i2 % 2) {
          const match2 = param_pattern.exec(content);
          if (!match2) {
            throw new Error(
              `Invalid param: ${content}. Params and matcher names can only have underscores and alphanumeric characters.`
            );
          }
          const [, rest, name, type] = match2;
          names.push(name);
          types.push(type);
          return rest ? "(.*?)" : "([^/]+?)";
        }
        if (is_last && content.includes("."))
          add_trailing_slash = false;
        return content.normalize().replace(/%5[Bb]/g, "[").replace(/%5[Dd]/g, "]").replace(/#/g, "%23").replace(/\?/g, "%3F").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }).join("");
    }).join("")}${add_trailing_slash ? "/?" : ""}$`
  );
  return { pattern, names, types };
}
function affects_path(segment) {
  return !/^\([^)]+\)$/.test(segment);
}
function exec(match, names, types, matchers2) {
  const params = {};
  for (let i = 0; i < names.length; i += 1) {
    const name = names[i];
    const type = types[i];
    const value = match[i + 1] || "";
    if (type) {
      const matcher = matchers2[type];
      if (!matcher)
        throw new Error(`Missing "${type}" param matcher`);
      if (!matcher(value))
        return;
    }
    params[name] = value;
  }
  return params;
}
function parse(nodes2, server_loads2, dictionary2, matchers2) {
  const layouts_with_server_load = new Set(server_loads2);
  return Object.entries(dictionary2).map(([id, [leaf, layouts, errors]]) => {
    const { pattern, names, types } = parse_route_id(id);
    const route = {
      id,
      exec: (path) => {
        const match = pattern.exec(path);
        if (match)
          return exec(match, names, types, matchers2);
      },
      errors: [1, ...errors || []].map((n) => nodes2[n]),
      layouts: [0, ...layouts || []].map(create_layout_loader),
      leaf: create_leaf_loader(leaf)
    };
    route.errors.length = route.layouts.length = Math.max(
      route.errors.length,
      route.layouts.length
    );
    return route;
  });
  function create_leaf_loader(id) {
    const uses_server_data = id < 0;
    if (uses_server_data)
      id = ~id;
    return [uses_server_data, nodes2[id]];
  }
  function create_layout_loader(id) {
    return id === void 0 ? id : [layouts_with_server_load.has(id), nodes2[id]];
  }
}
function create_else_block(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  var switch_value = ctx[0][0];
  function switch_props(ctx2) {
    return {
      props: {
        data: ctx2[2],
        form: ctx2[1]
      }
    };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l(nodes2) {
      if (switch_instance)
        claim_component(switch_instance.$$.fragment, nodes2);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }
      insert_hydration(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = {};
      if (dirty & 4)
        switch_instance_changes.data = ctx2[2];
      if (dirty & 2)
        switch_instance_changes.form = ctx2[1];
      if (switch_value !== (switch_value = ctx2[0][0])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = new switch_value(switch_props(ctx2));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  var switch_value = ctx[0][0];
  function switch_props(ctx2) {
    return {
      props: {
        data: ctx2[2],
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx: ctx2 }
      }
    };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l(nodes2) {
      if (switch_instance)
        claim_component(switch_instance.$$.fragment, nodes2);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }
      insert_hydration(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = {};
      if (dirty & 4)
        switch_instance_changes.data = ctx2[2];
      if (dirty & 523) {
        switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (switch_value !== (switch_value = ctx2[0][0])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = new switch_value(switch_props(ctx2));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  var switch_value = ctx[0][1];
  function switch_props(ctx2) {
    return {
      props: {
        data: ctx2[3],
        form: ctx2[1]
      }
    };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l(nodes2) {
      if (switch_instance)
        claim_component(switch_instance.$$.fragment, nodes2);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }
      insert_hydration(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = {};
      if (dirty & 8)
        switch_instance_changes.data = ctx2[3];
      if (dirty & 2)
        switch_instance_changes.form = ctx2[1];
      if (switch_value !== (switch_value = ctx2[0][1])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = new switch_value(switch_props(ctx2));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block(ctx) {
  let div;
  let if_block = ctx[5] && create_if_block_1(ctx);
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      this.h();
    },
    l(nodes2) {
      div = claim_element(nodes2, "DIV", {
        id: true,
        "aria-live": true,
        "aria-atomic": true,
        style: true
      });
      var div_nodes = children(div);
      if (if_block)
        if_block.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "id", "svelte-announcer");
      attr(div, "aria-live", "assertive");
      attr(div, "aria-atomic", "true");
      set_style(div, "position", "absolute");
      set_style(div, "left", "0");
      set_style(div, "top", "0");
      set_style(div, "clip", "rect(0 0 0 0)");
      set_style(div, "clip-path", "inset(50%)");
      set_style(div, "overflow", "hidden");
      set_style(div, "white-space", "nowrap");
      set_style(div, "width", "1px");
      set_style(div, "height", "1px");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (if_block)
        if_block.m(div, null);
    },
    p(ctx2, dirty) {
      if (ctx2[5]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_1(ctx2);
          if_block.c();
          if_block.m(div, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
    }
  };
}
function create_if_block_1(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[6]);
    },
    l(nodes2) {
      t = claim_text(nodes2, ctx[6]);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 64)
        set_data(t, ctx2[6]);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_fragment(ctx) {
  let current_block_type_index;
  let if_block0;
  let t;
  let if_block1_anchor;
  let current;
  const if_block_creators = [create_if_block_2, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[0][1])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let if_block1 = ctx[4] && create_if_block(ctx);
  return {
    c() {
      if_block0.c();
      t = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
    },
    l(nodes2) {
      if_block0.l(nodes2);
      t = claim_space(nodes2);
      if (if_block1)
        if_block1.l(nodes2);
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_hydration(target, t, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert_hydration(target, if_block1_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block0 = if_blocks[current_block_type_index];
        if (!if_block0) {
          if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block0.c();
        } else {
          if_block0.p(ctx2, dirty);
        }
        transition_in(if_block0, 1);
        if_block0.m(t.parentNode, t);
      }
      if (ctx2[4]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block(ctx2);
          if_block1.c();
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(t);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { stores: stores2 } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { form } = $$props;
  let { data_0 = null } = $$props;
  let { data_1 = null } = $$props;
  afterUpdate(stores2.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores2.page.subscribe(() => {
      if (mounted) {
        $$invalidate(5, navigated = true);
        $$invalidate(6, title = document.title || "untitled page");
      }
    });
    $$invalidate(4, mounted = true);
    return unsubscribe;
  });
  $$self.$$set = ($$props2) => {
    if ("stores" in $$props2)
      $$invalidate(7, stores2 = $$props2.stores);
    if ("page" in $$props2)
      $$invalidate(8, page = $$props2.page);
    if ("components" in $$props2)
      $$invalidate(0, components = $$props2.components);
    if ("form" in $$props2)
      $$invalidate(1, form = $$props2.form);
    if ("data_0" in $$props2)
      $$invalidate(2, data_0 = $$props2.data_0);
    if ("data_1" in $$props2)
      $$invalidate(3, data_1 = $$props2.data_1);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 384) {
      stores2.page.set(page);
    }
  };
  return [components, form, data_0, data_1, mounted, navigated, title, stores2, page];
}
class Root extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance, create_fragment, safe_not_equal, {
      stores: 7,
      page: 8,
      components: 0,
      form: 1,
      data_0: 2,
      data_1: 3
    });
  }
}
const getLocaleFromNavigator = (ssrDefault) => {
  if (typeof window === "undefined") {
    return ssrDefault || null;
  }
  return window.navigator.language || window.navigator.languages[0];
};
const getLocaleFromAcceptLanguageHeader = (header, availableLocales2) => {
  if (!header)
    return void 0;
  const locales = header.split(",").map((locale) => locale.trim()).map((locale) => {
    const directives = locale.split(";q=");
    return {
      locale: directives[0],
      quality: parseFloat(directives[1]) || 1
    };
  }).sort((a, b) => b.quality - a.quality);
  if (!availableLocales2 || availableLocales2.length === 0)
    return locales[0].locale;
  locales.forEach((l) => l.locale = l.locale.toLowerCase());
  let firstAvailableBaseMatch;
  for (const locale of locales) {
    if (firstAvailableBaseMatch && !locale.locale.toLowerCase().startsWith(`${firstAvailableBaseMatch.base}-`)) {
      continue;
    }
    const fullMatch = getArrayElementCaseInsensitive(availableLocales2, locale.locale);
    if (fullMatch) {
      return fullMatch;
    }
    if (firstAvailableBaseMatch) {
      continue;
    }
    const baseMatch = getArrayElementCaseInsensitive(availableLocales2, locale.locale.split("-")[0]);
    if (baseMatch) {
      return baseMatch;
    }
    for (const availableLocale of availableLocales2) {
      const availableBase = availableLocale.split("-")[0];
      if (availableBase.toLowerCase() === locale.locale) {
        firstAvailableBaseMatch = {
          match: availableLocale,
          base: locale.locale
        };
        break;
      }
    }
  }
  if (firstAvailableBaseMatch !== void 0) {
    return firstAvailableBaseMatch.match;
  }
  return void 0;
};
function getArrayElementCaseInsensitive(array, searchElement) {
  searchElement = searchElement.toLowerCase();
  for (const element2 of array) {
    if (element2.toLowerCase() === searchElement) {
      return element2;
    }
  }
  return void 0;
}
function init(opts) {
  const { formats, ...rest } = opts;
  const initialLocale = opts.initialLocale || opts.fallbackLocale;
  const options = getOptions();
  Object.assign(options, rest, { initialLocale });
  if (formats) {
    if ("number" in formats) {
      Object.assign(options.formats.number, formats.number);
    }
    if ("date" in formats) {
      Object.assign(options.formats.date, formats.date);
    }
    if ("time" in formats) {
      Object.assign(options.formats.time, formats.time);
    }
  }
  return $locale.set(initialLocale);
}
function waitLocale(locale) {
  return flush(locale || getCurrentLocale() || getOptions().initialLocale);
}
function registerAll() {
  registerLocaleLoader("de", () => __vitePreload(() => import("./chunks/de-2852f317.js"), true ? [] : void 0, import.meta.url));
  registerLocaleLoader("en", () => __vitePreload(() => import("./chunks/en-e493dd31.js"), true ? [] : void 0, import.meta.url));
}
const availableLocales = ["de", "en"];
const DEFAULT_LOCALE = "de";
registerAll();
console.log("available locales", availableLocales);
async function loadLocale(event) {
  const locale = stripSuffix(event ? getSSRLocale(event) : getClientLocale());
  init({ initialLocale: locale, fallbackLocale: DEFAULT_LOCALE });
  await waitLocale(locale);
  return locale;
}
function getSSRLocale(event) {
  return event.locals.user?.locale || getLocaleFromAcceptLanguageHeader(
    event.request.headers.get("Accept-Language"),
    availableLocales
  ) || DEFAULT_LOCALE;
}
function getClientLocale() {
  return document?.documentElement.lang || stripSuffix(getLocaleFromNavigator()) || DEFAULT_LOCALE;
}
function stripSuffix(locale) {
  return locale?.split("-", 2)[0];
}
console.log("hooks.client");
await loadLocale();
console.log("hooks.client.done");
function handleError({ error, event }) {
  console.error("client error", { error, event });
  return {
    message: "Whoops!",
    code: error.code ?? "UNKNOWN"
  };
}
const matchers = {};
const nodes = [
  () => __vitePreload(() => import("./chunks/0-3dc86383.js"), true ? ["chunks/0-3dc86383.js","components/layout.svelte-1e7a3299.js","chunks/index-57064c30.js"] : void 0, import.meta.url),
  () => __vitePreload(() => import("./chunks/1-b3dc1538.js"), true ? ["chunks/1-b3dc1538.js","components/error.svelte-f0f0bb82.js","chunks/index-57064c30.js","chunks/singletons-76d8098f.js","chunks/index-f4aaf2df.js"] : void 0, import.meta.url),
  () => __vitePreload(() => import("./chunks/2-059196b0.js"), true ? ["chunks/2-059196b0.js","components/pages/_page.svelte-700d4b90.js","assets/_page-ccca384a.css","chunks/index-57064c30.js","chunks/locale-e96090dc.js","chunks/index-f4aaf2df.js"] : void 0, import.meta.url)
];
const server_loads = [];
const dictionary = {
  "": [2]
};
const hooks = {
  handleError: handleError || (({ error }) => {
    console.error(error);
  })
};
class HttpError {
  constructor(status, body) {
    this.status = status;
    if (typeof body === "string") {
      this.body = { message: body };
    } else if (body) {
      this.body = body;
    } else {
      this.body = { message: `Error: ${status}` };
    }
  }
  toString() {
    return JSON.stringify(this.body);
  }
}
class Redirect {
  constructor(status, location2) {
    this.status = status;
    this.location = location2;
  }
}
const DATA_SUFFIX = "/__data.js";
async function unwrap_promises(object) {
  for (const key in object) {
    if (typeof object[key]?.then === "function") {
      return Object.fromEntries(
        await Promise.all(Object.entries(object).map(async ([key2, value]) => [key2, await value]))
      );
    }
  }
  return object;
}
const SCROLL_KEY = "sveltekit:scroll";
const INDEX_KEY = "sveltekit:index";
const routes = parse(nodes, server_loads, dictionary, matchers);
const default_layout_loader = nodes[0];
const default_error_loader = nodes[1];
default_layout_loader();
default_error_loader();
let scroll_positions = {};
try {
  scroll_positions = JSON.parse(sessionStorage[SCROLL_KEY]);
} catch {
}
function update_scroll_positions(index) {
  scroll_positions[index] = scroll_state();
}
function create_client({ target, base, trailing_slash }) {
  const invalidated = [];
  let load_cache = null;
  const callbacks = {
    before_navigate: [],
    after_navigate: []
  };
  let current = {
    branch: [],
    error: null,
    url: null
  };
  let hydrated = false;
  let started = false;
  let autoscroll = true;
  let updating = false;
  let force_invalidation = false;
  let root;
  let current_history_index = history.state?.[INDEX_KEY];
  if (!current_history_index) {
    current_history_index = Date.now();
    history.replaceState(
      { ...history.state, [INDEX_KEY]: current_history_index },
      "",
      location.href
    );
  }
  const scroll = scroll_positions[current_history_index];
  if (scroll) {
    history.scrollRestoration = "manual";
    scrollTo(scroll.x, scroll.y);
  }
  let hash_navigating = false;
  let page;
  let token;
  let pending_invalidate;
  async function invalidate() {
    pending_invalidate = pending_invalidate || Promise.resolve();
    await pending_invalidate;
    pending_invalidate = null;
    const url = new URL(location.href);
    const intent = get_navigation_intent(url, true);
    load_cache = null;
    await update(intent, url, []);
  }
  async function goto(url, { noscroll = false, replaceState = false, keepfocus = false, state = {} }, redirect_chain, nav_token) {
    if (typeof url === "string") {
      url = new URL(url, get_base_uri(document));
    }
    return navigate({
      url,
      scroll: noscroll ? scroll_state() : null,
      keepfocus,
      redirect_chain,
      details: {
        state,
        replaceState
      },
      nav_token,
      accepted: () => {
      },
      blocked: () => {
      },
      type: "goto"
    });
  }
  async function prefetch(url) {
    const intent = get_navigation_intent(url, false);
    if (!intent) {
      throw new Error("Attempted to prefetch a URL that does not belong to this app");
    }
    load_cache = { id: intent.id, promise: load_route(intent) };
    return load_cache.promise;
  }
  async function update(intent, url, redirect_chain, opts, nav_token = {}, callback) {
    token = nav_token;
    let navigation_result = intent && await load_route(intent);
    if (!navigation_result) {
      navigation_result = await server_fallback(
        url,
        null,
        handle_error(new Error(`Not found: ${url.pathname}`), { url, params: {}, routeId: null }),
        404
      );
    }
    url = intent?.url || url;
    if (token !== nav_token)
      return false;
    if (navigation_result.type === "redirect") {
      if (redirect_chain.length > 10 || redirect_chain.includes(url.pathname)) {
        navigation_result = await load_root_error_page({
          status: 500,
          error: handle_error(new Error("Redirect loop"), { url, params: {}, routeId: null }),
          url,
          routeId: null
        });
      } else {
        goto(
          new URL(navigation_result.location, url).href,
          {},
          [...redirect_chain, url.pathname],
          nav_token
        );
        return false;
      }
    } else if (navigation_result.props?.page?.status >= 400) {
      const updated = await stores.updated.check();
      if (updated) {
        await native_navigation(url);
      }
    }
    invalidated.length = 0;
    force_invalidation = false;
    updating = true;
    if (opts && opts.details) {
      const { details } = opts;
      const change = details.replaceState ? 0 : 1;
      details.state[INDEX_KEY] = current_history_index += change;
      history[details.replaceState ? "replaceState" : "pushState"](details.state, "", url);
    }
    load_cache = null;
    if (started) {
      current = navigation_result.state;
      if (navigation_result.props.page) {
        navigation_result.props.page.url = url;
      }
      const post_update = pre_update();
      root.$set(navigation_result.props);
      post_update();
    } else {
      initialize(navigation_result);
    }
    if (opts) {
      const { scroll: scroll2, keepfocus } = opts;
      if (!keepfocus) {
        const root2 = document.body;
        const tabindex = root2.getAttribute("tabindex");
        root2.tabIndex = -1;
        root2.focus({ preventScroll: true });
        setTimeout(() => {
          getSelection()?.removeAllRanges();
        });
        if (tabindex !== null) {
          root2.setAttribute("tabindex", tabindex);
        } else {
          root2.removeAttribute("tabindex");
        }
      }
      await tick();
      if (autoscroll) {
        const deep_linked = url.hash && document.getElementById(url.hash.slice(1));
        if (scroll2) {
          scrollTo(scroll2.x, scroll2.y);
        } else if (deep_linked) {
          deep_linked.scrollIntoView();
        } else {
          scrollTo(0, 0);
        }
      }
    } else {
      await tick();
    }
    autoscroll = true;
    if (navigation_result.props.page) {
      page = navigation_result.props.page;
    }
    if (callback)
      callback();
    updating = false;
  }
  function initialize(result) {
    current = result.state;
    const style = document.querySelector("style[data-sveltekit]");
    if (style)
      style.remove();
    page = result.props.page;
    const post_update = pre_update();
    root = new Root({
      target,
      props: { ...result.props, stores },
      hydrate: true
    });
    post_update();
    const navigation = {
      from: null,
      to: add_url_properties("to", {
        params: current.params,
        routeId: current.route?.id ?? null,
        url: new URL(location.href)
      }),
      type: "load"
    };
    callbacks.after_navigate.forEach((fn) => fn(navigation));
    started = true;
  }
  async function get_navigation_result_from_branch({
    url,
    params,
    branch,
    status,
    error,
    route,
    form
  }) {
    const filtered = branch.filter(Boolean);
    const result = {
      type: "loaded",
      state: {
        url,
        params,
        branch,
        error,
        route
      },
      props: {
        components: filtered.map((branch_node) => branch_node.node.component)
      }
    };
    if (form !== void 0) {
      result.props.form = form;
    }
    let data = {};
    let data_changed = !page;
    for (let i = 0; i < filtered.length; i += 1) {
      const node = filtered[i];
      data = { ...data, ...node.data };
      if (data_changed || !current.branch.some((previous) => previous === node)) {
        result.props[`data_${i}`] = data;
        data_changed = data_changed || Object.keys(node.data ?? {}).length > 0;
      }
    }
    if (!data_changed) {
      data_changed = Object.keys(page.data).length !== Object.keys(data).length;
    }
    const page_changed = !current.url || url.href !== current.url.href || current.error !== error || form !== void 0 || data_changed;
    if (page_changed) {
      result.props.page = {
        error,
        params,
        routeId: route && route.id,
        status,
        url,
        form,
        data: data_changed ? data : page.data
      };
      const print_error = (property, replacement) => {
        Object.defineProperty(result.props.page, property, {
          get: () => {
            throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
          }
        });
      };
      print_error("origin", "origin");
      print_error("path", "pathname");
      print_error("query", "searchParams");
    }
    return result;
  }
  async function load_node({ loader, parent, url, params, routeId, server_data_node }) {
    let data = null;
    const uses = {
      dependencies: /* @__PURE__ */ new Set(),
      params: /* @__PURE__ */ new Set(),
      parent: false,
      url: false
    };
    const node = await loader();
    if (node.shared?.load) {
      let depends = function(...deps) {
        for (const dep of deps) {
          const { href } = new URL(dep, url);
          uses.dependencies.add(href);
        }
      };
      const load_input = {
        routeId,
        params: new Proxy(params, {
          get: (target2, key) => {
            uses.params.add(key);
            return target2[key];
          }
        }),
        data: server_data_node?.data ?? null,
        url: make_trackable(url, () => {
          uses.url = true;
        }),
        async fetch(resource, init2) {
          let requested;
          if (resource instanceof Request) {
            requested = resource.url;
            init2 = {
              body: resource.method === "GET" || resource.method === "HEAD" ? void 0 : await resource.blob(),
              cache: resource.cache,
              credentials: resource.credentials,
              headers: resource.headers,
              integrity: resource.integrity,
              keepalive: resource.keepalive,
              method: resource.method,
              mode: resource.mode,
              redirect: resource.redirect,
              referrer: resource.referrer,
              referrerPolicy: resource.referrerPolicy,
              signal: resource.signal,
              ...init2
            };
          } else {
            requested = resource;
          }
          const resolved = new URL(requested, url).href;
          depends(resolved);
          return started ? subsequent_fetch(resolved, init2) : initial_fetch(requested, resolved, init2);
        },
        setHeaders: () => {
        },
        depends,
        parent() {
          uses.parent = true;
          return parent();
        }
      };
      Object.defineProperties(load_input, {
        props: {
          get() {
            throw new Error(
              "@migration task: Replace `props` with `data` stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693"
            );
          },
          enumerable: false
        },
        session: {
          get() {
            throw new Error(
              "session is no longer available. See https://github.com/sveltejs/kit/discussions/5883"
            );
          },
          enumerable: false
        },
        stuff: {
          get() {
            throw new Error(
              "@migration task: Remove stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693"
            );
          },
          enumerable: false
        }
      });
      {
        data = await node.shared.load.call(null, load_input) ?? null;
      }
      data = data ? await unwrap_promises(data) : null;
    }
    return {
      node,
      loader,
      server: server_data_node,
      shared: node.shared?.load ? { type: "data", data, uses } : null,
      data: data ?? server_data_node?.data ?? null
    };
  }
  function has_changed(url_changed, parent_changed, uses, params) {
    if (force_invalidation)
      return true;
    if (!uses)
      return false;
    if (uses.parent && parent_changed)
      return true;
    if (uses.url && url_changed)
      return true;
    for (const param of uses.params) {
      if (params[param] !== current.params[param])
        return true;
    }
    for (const href of uses.dependencies) {
      if (invalidated.some((fn) => fn(new URL(href))))
        return true;
    }
    return false;
  }
  function create_data_node(node, previous) {
    if (node?.type === "data") {
      return {
        type: "data",
        data: node.data,
        uses: {
          dependencies: new Set(node.uses.dependencies ?? []),
          params: new Set(node.uses.params ?? []),
          parent: !!node.uses.parent,
          url: !!node.uses.url
        }
      };
    } else if (node?.type === "skip") {
      return previous ?? null;
    }
    return null;
  }
  async function load_route({ id, invalidating, url, params, route }) {
    if (load_cache?.id === id) {
      return load_cache.promise;
    }
    const { errors, layouts, leaf } = route;
    const loaders = [...layouts, leaf];
    errors.forEach((loader) => loader?.().catch(() => {
    }));
    loaders.forEach((loader) => loader?.[1]().catch(() => {
    }));
    let server_data = null;
    const url_changed = current.url ? id !== current.url.pathname + current.url.search : false;
    const invalid_server_nodes = loaders.reduce((acc, loader, i) => {
      const previous = current.branch[i];
      const invalid = !!loader?.[0] && (previous?.loader !== loader[1] || has_changed(url_changed, acc.some(Boolean), previous.server?.uses, params));
      acc.push(invalid);
      return acc;
    }, []);
    if (invalid_server_nodes.some(Boolean)) {
      try {
        server_data = await load_data(url, invalid_server_nodes);
      } catch (error) {
        return load_root_error_page({
          status: 500,
          error: handle_error(error, { url, params, routeId: route.id }),
          url,
          routeId: route.id
        });
      }
      if (server_data.type === "redirect") {
        return server_data;
      }
    }
    const server_data_nodes = server_data?.nodes;
    let parent_changed = false;
    const branch_promises = loaders.map(async (loader, i) => {
      if (!loader)
        return;
      const previous = current.branch[i];
      const server_data_node = server_data_nodes?.[i];
      const valid = (!server_data_node || server_data_node.type === "skip") && loader[1] === previous?.loader && !has_changed(url_changed, parent_changed, previous.shared?.uses, params);
      if (valid)
        return previous;
      parent_changed = true;
      if (server_data_node?.type === "error") {
        throw server_data_node;
      }
      return load_node({
        loader: loader[1],
        url,
        params,
        routeId: route.id,
        parent: async () => {
          const data = {};
          for (let j = 0; j < i; j += 1) {
            Object.assign(data, (await branch_promises[j])?.data);
          }
          return data;
        },
        server_data_node: create_data_node(
          server_data_node === void 0 && loader[0] ? { type: "skip" } : server_data_node ?? null,
          previous?.server
        )
      });
    });
    for (const p of branch_promises)
      p.catch(() => {
      });
    const branch = [];
    for (let i = 0; i < loaders.length; i += 1) {
      if (loaders[i]) {
        try {
          branch.push(await branch_promises[i]);
        } catch (err) {
          if (err instanceof Redirect) {
            return {
              type: "redirect",
              location: err.location
            };
          }
          let status = 500;
          let error;
          if (server_data_nodes?.includes(err)) {
            status = err.status ?? status;
            error = err.error;
          } else if (err instanceof HttpError) {
            status = err.status;
            error = err.body;
          } else {
            error = handle_error(err, { params, url, routeId: route.id });
          }
          const error_load = await load_nearest_error_page(i, branch, errors);
          if (error_load) {
            return await get_navigation_result_from_branch({
              url,
              params,
              branch: branch.slice(0, error_load.idx).concat(error_load.node),
              status,
              error,
              route
            });
          } else {
            return await server_fallback(url, route.id, error, status);
          }
        }
      } else {
        branch.push(void 0);
      }
    }
    return await get_navigation_result_from_branch({
      url,
      params,
      branch,
      status: 200,
      error: null,
      route,
      form: invalidating ? void 0 : null
    });
  }
  async function load_nearest_error_page(i, branch, errors) {
    while (i--) {
      if (errors[i]) {
        let j = i;
        while (!branch[j])
          j -= 1;
        try {
          return {
            idx: j + 1,
            node: {
              node: await errors[i](),
              loader: errors[i],
              data: {},
              server: null,
              shared: null
            }
          };
        } catch (e) {
          continue;
        }
      }
    }
  }
  async function load_root_error_page({ status, error, url, routeId }) {
    const params = {};
    const node = await default_layout_loader();
    let server_data_node = null;
    if (node.server) {
      try {
        const server_data = await load_data(url, [true]);
        if (server_data.type !== "data" || server_data.nodes[0] && server_data.nodes[0].type !== "data") {
          throw 0;
        }
        server_data_node = server_data.nodes[0] ?? null;
      } catch {
        if (url.origin !== location.origin || url.pathname !== location.pathname || hydrated) {
          await native_navigation(url);
        }
      }
    }
    const root_layout = await load_node({
      loader: default_layout_loader,
      url,
      params,
      routeId,
      parent: () => Promise.resolve({}),
      server_data_node: create_data_node(server_data_node)
    });
    const root_error = {
      node: await default_error_loader(),
      loader: default_error_loader,
      shared: null,
      server: null,
      data: null
    };
    return await get_navigation_result_from_branch({
      url,
      params,
      branch: [root_layout, root_error],
      status,
      error,
      route: null
    });
  }
  function get_navigation_intent(url, invalidating) {
    if (is_external_url(url))
      return;
    const path = decodeURI(url.pathname.slice(base.length) || "/");
    for (const route of routes) {
      const params = route.exec(path);
      if (params) {
        const normalized = new URL(
          url.origin + normalize_path(url.pathname, trailing_slash) + url.search + url.hash
        );
        const id = normalized.pathname + normalized.search;
        const intent = { id, invalidating, route, params: decode_params(params), url: normalized };
        return intent;
      }
    }
  }
  function is_external_url(url) {
    return url.origin !== location.origin || !url.pathname.startsWith(base);
  }
  async function navigate({
    url,
    scroll: scroll2,
    keepfocus,
    redirect_chain,
    details,
    type,
    delta,
    nav_token,
    accepted,
    blocked
  }) {
    let should_block = false;
    const intent = get_navigation_intent(url, false);
    const navigation = {
      from: add_url_properties("from", {
        params: current.params,
        routeId: current.route?.id ?? null,
        url: current.url
      }),
      to: add_url_properties("to", {
        params: intent?.params ?? null,
        routeId: intent?.route.id ?? null,
        url
      }),
      type
    };
    if (delta !== void 0) {
      navigation.delta = delta;
    }
    const cancellable = {
      ...navigation,
      cancel: () => {
        should_block = true;
      }
    };
    callbacks.before_navigate.forEach((fn) => fn(cancellable));
    if (should_block) {
      blocked();
      return;
    }
    update_scroll_positions(current_history_index);
    accepted();
    if (started) {
      stores.navigating.set(navigation);
    }
    await update(
      intent,
      url,
      redirect_chain,
      {
        scroll: scroll2,
        keepfocus,
        details
      },
      nav_token,
      () => {
        callbacks.after_navigate.forEach((fn) => fn(navigation));
        stores.navigating.set(null);
      }
    );
  }
  async function server_fallback(url, routeId, error, status) {
    if (url.origin === location.origin && url.pathname === location.pathname && !hydrated) {
      return await load_root_error_page({
        status,
        error,
        url,
        routeId
      });
    }
    return await native_navigation(url);
  }
  function native_navigation(url) {
    location.href = url.href;
    return new Promise(() => {
    });
  }
  return {
    after_navigate: (fn) => {
      onMount(() => {
        callbacks.after_navigate.push(fn);
        return () => {
          const i = callbacks.after_navigate.indexOf(fn);
          callbacks.after_navigate.splice(i, 1);
        };
      });
    },
    before_navigate: (fn) => {
      onMount(() => {
        callbacks.before_navigate.push(fn);
        return () => {
          const i = callbacks.before_navigate.indexOf(fn);
          callbacks.before_navigate.splice(i, 1);
        };
      });
    },
    disable_scroll_handling: () => {
      if (updating || !started) {
        autoscroll = false;
      }
    },
    goto: (href, opts = {}) => goto(href, opts, []),
    invalidate: (resource) => {
      if (resource === void 0) {
        throw new Error(
          "`invalidate()` (with no arguments) has been replaced by `invalidateAll()`"
        );
      }
      if (typeof resource === "function") {
        invalidated.push(resource);
      } else {
        const { href } = new URL(resource, location.href);
        invalidated.push((url) => url.href === href);
      }
      return invalidate();
    },
    invalidateAll: () => {
      force_invalidation = true;
      return invalidate();
    },
    prefetch: async (href) => {
      const url = new URL(href, get_base_uri(document));
      await prefetch(url);
    },
    prefetch_routes: async (pathnames) => {
      const matching = pathnames ? routes.filter((route) => pathnames.some((pathname) => route.exec(pathname))) : routes;
      const promises = matching.map((r) => {
        return Promise.all([...r.layouts, r.leaf].map((load) => load?.[1]()));
      });
      await Promise.all(promises);
    },
    apply_action: async (result) => {
      if (result.type === "error") {
        const url = new URL(location.href);
        const { branch, route } = current;
        if (!route)
          return;
        const error_load = await load_nearest_error_page(
          current.branch.length,
          branch,
          route.errors
        );
        if (error_load) {
          const navigation_result = await get_navigation_result_from_branch({
            url,
            params: current.params,
            branch: branch.slice(0, error_load.idx).concat(error_load.node),
            status: 500,
            error: result.error,
            route
          });
          current = navigation_result.state;
          const post_update = pre_update();
          root.$set(navigation_result.props);
          post_update();
        }
      } else if (result.type === "redirect") {
        goto(result.location, {}, []);
      } else {
        const props = {
          form: result.data,
          page: { ...page, form: result.data, status: result.status }
        };
        const post_update = pre_update();
        root.$set(props);
        post_update();
      }
    },
    _start_router: () => {
      history.scrollRestoration = "manual";
      addEventListener("beforeunload", (e) => {
        let should_block = false;
        const navigation = {
          from: add_url_properties("from", {
            params: current.params,
            routeId: current.route?.id ?? null,
            url: current.url
          }),
          to: null,
          type: "unload",
          cancel: () => should_block = true
        };
        callbacks.before_navigate.forEach((fn) => fn(navigation));
        if (should_block) {
          e.preventDefault();
          e.returnValue = "";
        } else {
          history.scrollRestoration = "auto";
        }
      });
      addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          update_scroll_positions(current_history_index);
          try {
            sessionStorage[SCROLL_KEY] = JSON.stringify(scroll_positions);
          } catch {
          }
        }
      });
      const trigger_prefetch = (event) => {
        const { url, options } = find_anchor(event);
        if (url && options.prefetch) {
          if (is_external_url(url))
            return;
          prefetch(url);
        }
      };
      let mousemove_timeout;
      const handle_mousemove = (event) => {
        clearTimeout(mousemove_timeout);
        mousemove_timeout = setTimeout(() => {
          event.target?.dispatchEvent(
            new CustomEvent("sveltekit:trigger_prefetch", { bubbles: true })
          );
        }, 20);
      };
      addEventListener("touchstart", trigger_prefetch);
      addEventListener("mousemove", handle_mousemove);
      addEventListener("sveltekit:trigger_prefetch", trigger_prefetch);
      addEventListener("click", (event) => {
        if (event.button || event.which !== 1)
          return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        if (event.defaultPrevented)
          return;
        const { a, url, options } = find_anchor(event);
        if (!a || !url)
          return;
        const is_svg_a_element = a instanceof SVGAElement;
        if (!is_svg_a_element && !(url.protocol === "https:" || url.protocol === "http:"))
          return;
        const rel = (a.getAttribute("rel") || "").split(/\s+/);
        if (a.hasAttribute("download") || rel.includes("external") || options.reload) {
          return;
        }
        if (is_svg_a_element ? a.target.baseVal : a.target)
          return;
        const [base2, hash2] = url.href.split("#");
        if (hash2 !== void 0 && base2 === location.href.split("#")[0]) {
          hash_navigating = true;
          update_scroll_positions(current_history_index);
          current.url = url;
          stores.page.set({ ...page, url });
          stores.page.notify();
          return;
        }
        navigate({
          url,
          scroll: options.noscroll ? scroll_state() : null,
          keepfocus: false,
          redirect_chain: [],
          details: {
            state: {},
            replaceState: url.href === location.href
          },
          accepted: () => event.preventDefault(),
          blocked: () => event.preventDefault(),
          type: "link"
        });
      });
      addEventListener("popstate", (event) => {
        if (event.state) {
          if (event.state[INDEX_KEY] === current_history_index)
            return;
          const delta = event.state[INDEX_KEY] - current_history_index;
          navigate({
            url: new URL(location.href),
            scroll: scroll_positions[event.state[INDEX_KEY]],
            keepfocus: false,
            redirect_chain: [],
            details: null,
            accepted: () => {
              current_history_index = event.state[INDEX_KEY];
            },
            blocked: () => {
              history.go(-delta);
            },
            type: "popstate",
            delta
          });
        }
      });
      addEventListener("hashchange", () => {
        if (hash_navigating) {
          hash_navigating = false;
          history.replaceState(
            { ...history.state, [INDEX_KEY]: ++current_history_index },
            "",
            location.href
          );
        }
      });
      for (const link of document.querySelectorAll("link")) {
        if (link.rel === "icon")
          link.href = link.href;
      }
      addEventListener("pageshow", (event) => {
        if (event.persisted) {
          stores.navigating.set(null);
        }
      });
    },
    _hydrate: async ({
      status,
      error,
      node_ids,
      params,
      routeId,
      data: server_data_nodes,
      form
    }) => {
      hydrated = true;
      const url = new URL(location.href);
      let result;
      try {
        const branch_promises = node_ids.map(async (n, i) => {
          const server_data_node = server_data_nodes[i];
          return load_node({
            loader: nodes[n],
            url,
            params,
            routeId,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                Object.assign(data, (await branch_promises[j]).data);
              }
              return data;
            },
            server_data_node: create_data_node(server_data_node)
          });
        });
        result = await get_navigation_result_from_branch({
          url,
          params,
          branch: await Promise.all(branch_promises),
          status,
          error,
          form,
          route: routes.find((route) => route.id === routeId) ?? null
        });
      } catch (error2) {
        if (error2 instanceof Redirect) {
          await native_navigation(new URL(error2.location, location.href));
          return;
        }
        result = await load_root_error_page({
          status: error2 instanceof HttpError ? error2.status : 500,
          error: handle_error(error2, { url, params, routeId }),
          url,
          routeId
        });
      }
      initialize(result);
    }
  };
}
let data_id = 1;
async function load_data(url, invalid) {
  const data_url = new URL(url);
  data_url.pathname = url.pathname.replace(/\/$/, "") + DATA_SUFFIX;
  data_url.searchParams.set("__invalid", invalid.map((x) => x ? "y" : "n").join(""));
  data_url.searchParams.set("__id", String(data_id++));
  await __vitePreload(() => import(
    /* @vite-ignore */
    data_url.href
  ), true ? [] : void 0, import.meta.url);
  const server_data = window.__sveltekit_data;
  delete window.__sveltekit_data;
  return server_data;
}
function handle_error(error, event) {
  if (error instanceof HttpError) {
    return error.body;
  }
  return hooks.handleError({ error, event }) ?? { message: event.routeId != null ? "Internal Error" : "Not Found" };
}
const properties = [
  "hash",
  "href",
  "host",
  "hostname",
  "origin",
  "pathname",
  "port",
  "protocol",
  "search",
  "searchParams",
  "toString",
  "toJSON"
];
function add_url_properties(type, target) {
  for (const prop of properties) {
    Object.defineProperty(target, prop, {
      get() {
        throw new Error(
          `The navigation shape changed - ${type}.${prop} should now be ${type}.url.${prop}`
        );
      },
      enumerable: false
    });
  }
  return target;
}
function pre_update() {
  return () => {
  };
}
async function start({ env, hydrate, paths, target, trailing_slash }) {
  set_paths(paths);
  const client = create_client({
    target,
    base: paths.base,
    trailing_slash
  });
  init$2({ client });
  if (hydrate) {
    await client._hydrate(hydrate);
  } else {
    client.goto(location.href, { replaceState: true });
  }
  client._start_router();
}
export {
  start
};
