import { S as SvelteComponent, i as init, s as safe_not_equal, k as element, q as text, a as space, e as empty, l as claim_element, m as children, r as claim_text, h as detach, c as claim_space, b as insert_hydration, I as append_hydration, u as set_data, A as noop, J as component_subscribe } from "../chunks/index-57064c30.js";
import { s as stores } from "../chunks/singletons-76d8098f.js";
const getStores = () => {
  const stores$1 = stores;
  const readonly_stores = {
    page: {
      subscribe: stores$1.page.subscribe
    },
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    updated: stores$1.updated
  };
  Object.defineProperties(readonly_stores, {
    preloading: {
      get() {
        console.error("stores.preloading is deprecated; use stores.navigating instead");
        return {
          subscribe: stores$1.navigating.subscribe
        };
      },
      enumerable: false
    },
    session: {
      get() {
        removed_session();
        return {};
      },
      enumerable: false
    }
  });
  return readonly_stores;
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function removed_session() {
  throw new Error(
    "stores.session is no longer available. See https://github.com/sveltejs/kit/discussions/5883"
  );
}
function create_if_block_1(ctx) {
  let pre;
  let t_value = ctx[0].error.frame + "";
  let t;
  return {
    c() {
      pre = element("pre");
      t = text(t_value);
    },
    l(nodes) {
      pre = claim_element(nodes, "PRE", {});
      var pre_nodes = children(pre);
      t = claim_text(pre_nodes, t_value);
      pre_nodes.forEach(detach);
    },
    m(target, anchor) {
      insert_hydration(target, pre, anchor);
      append_hydration(pre, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = ctx2[0].error.frame + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(pre);
    }
  };
}
function create_if_block(ctx) {
  let pre;
  let t_value = ctx[0].error.stack + "";
  let t;
  return {
    c() {
      pre = element("pre");
      t = text(t_value);
    },
    l(nodes) {
      pre = claim_element(nodes, "PRE", {});
      var pre_nodes = children(pre);
      t = claim_text(pre_nodes, t_value);
      pre_nodes.forEach(detach);
    },
    m(target, anchor) {
      insert_hydration(target, pre, anchor);
      append_hydration(pre, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = ctx2[0].error.stack + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(pre);
    }
  };
}
function create_fragment(ctx) {
  let h1;
  let t0_value = ctx[0].status + "";
  let t0;
  let t1;
  let pre;
  let t2_value = ctx[0].error.message + "";
  let t2;
  let t3;
  let t4;
  let if_block1_anchor;
  let if_block0 = ctx[0].error.frame && create_if_block_1(ctx);
  let if_block1 = ctx[0].error.stack && create_if_block(ctx);
  return {
    c() {
      h1 = element("h1");
      t0 = text(t0_value);
      t1 = space();
      pre = element("pre");
      t2 = text(t2_value);
      t3 = space();
      if (if_block0)
        if_block0.c();
      t4 = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
    },
    l(nodes) {
      h1 = claim_element(nodes, "H1", {});
      var h1_nodes = children(h1);
      t0 = claim_text(h1_nodes, t0_value);
      h1_nodes.forEach(detach);
      t1 = claim_space(nodes);
      pre = claim_element(nodes, "PRE", {});
      var pre_nodes = children(pre);
      t2 = claim_text(pre_nodes, t2_value);
      pre_nodes.forEach(detach);
      t3 = claim_space(nodes);
      if (if_block0)
        if_block0.l(nodes);
      t4 = claim_space(nodes);
      if (if_block1)
        if_block1.l(nodes);
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      insert_hydration(target, h1, anchor);
      append_hydration(h1, t0);
      insert_hydration(target, t1, anchor);
      insert_hydration(target, pre, anchor);
      append_hydration(pre, t2);
      insert_hydration(target, t3, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert_hydration(target, t4, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert_hydration(target, if_block1_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1 && t0_value !== (t0_value = ctx2[0].status + ""))
        set_data(t0, t0_value);
      if (dirty & 1 && t2_value !== (t2_value = ctx2[0].error.message + ""))
        set_data(t2, t2_value);
      if (ctx2[0].error.frame) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_1(ctx2);
          if_block0.c();
          if_block0.m(t4.parentNode, t4);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (ctx2[0].error.stack) {
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
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(h1);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(pre);
      if (detaching)
        detach(t3);
      if (if_block0)
        if_block0.d(detaching);
      if (detaching)
        detach(t4);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $page;
  component_subscribe($$self, page, ($$value) => $$invalidate(0, $page = $$value));
  return [$page];
}
class Error$1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export {
  Error$1 as default
};
