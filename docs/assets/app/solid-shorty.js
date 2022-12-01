// node_modules/solid-js/dist/solid.js
var sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return {
    ...sharedConfig.context,
    id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
    count: 0
  };
}
var equalFn = (a, b) => a === b;
var $PROXY = Symbol("solid-proxy");
var $TRACK = Symbol("solid-track");
var $DEVCOMP = Symbol("solid-dev-component");
var signalOptions = {
  equals: equalFn
};
var ERROR = null;
var runEffects = runQueue;
var STALE = 1;
var PENDING = 2;
var UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner = null;
var Transition = null;
var Scheduler = null;
var ExternalSourceFactory = null;
var Listener = null;
var Updates = null;
var Effects = null;
var ExecCount = 0;
var [transPending, setTransPending] = /* @__PURE__ */ createSignal(false);
function createSignal(value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || void 0
  };
  const setter = (value2) => {
    if (typeof value2 === "function") {
      if (Transition && Transition.running && Transition.sources.has(s))
        value2 = value2(s.tValue);
      else
        value2 = value2(s.value);
    }
    return writeSignal(s, value2);
  };
  return [readSignal.bind(s), setter];
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  if (Scheduler && Transition && Transition.running)
    Updates.push(c);
  else
    updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || void 0;
  if (Scheduler && Transition && Transition.running) {
    c.tState = STALE;
    Updates.push(c);
  } else
    updateComputation(c);
  return readSignal.bind(c);
}
function untrack(fn) {
  const listener = Listener;
  Listener = null;
  try {
    return fn();
  } finally {
    Listener = listener;
  }
}
function onCleanup(fn) {
  if (Owner === null)
    ;
  else if (Owner.cleanups === null)
    Owner.cleanups = [fn];
  else
    Owner.cleanups.push(fn);
  return fn;
}
function startTransition(fn) {
  if (Transition && Transition.running) {
    fn();
    return Transition.done;
  }
  const l = Listener;
  const o = Owner;
  return Promise.resolve().then(() => {
    Listener = l;
    Owner = o;
    let t;
    if (Scheduler || SuspenseContext) {
      t = Transition || (Transition = {
        sources: /* @__PURE__ */ new Set(),
        effects: [],
        promises: /* @__PURE__ */ new Set(),
        disposed: /* @__PURE__ */ new Set(),
        queue: /* @__PURE__ */ new Set(),
        running: true
      });
      t.done || (t.done = new Promise((res) => t.resolve = res));
      t.running = true;
    }
    runUpdates(fn, false);
    Listener = Owner = null;
    return t ? t.done : void 0;
  });
}
function createContext(defaultValue, options) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function children(fn) {
  const children2 = createMemo(fn);
  const memo = createMemo(() => resolveChildren(children2()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
var SuspenseContext;
function readSignal() {
  const runningTransition = Transition && Transition.running;
  if (this.sources && (!runningTransition && this.state || runningTransition && this.tState)) {
    if (!runningTransition && this.state === STALE || runningTransition && this.tState === STALE)
      updateComputation(this);
    else {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(this), false);
      Updates = updates;
    }
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  if (runningTransition && Transition.sources.has(this))
    return this.tValue;
  return this.value;
}
function writeSignal(node, value, isComp) {
  let current = Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    if (Transition) {
      const TransitionRunning = Transition.running;
      if (TransitionRunning || !isComp && Transition.sources.has(node)) {
        Transition.sources.add(node);
        node.tValue = value;
      }
      if (!TransitionRunning)
        node.value = value;
    } else
      node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o))
            continue;
          if (TransitionRunning && !o.tState || !TransitionRunning && !o.state) {
            if (o.pure)
              Updates.push(o);
            else
              Effects.push(o);
            if (o.observers)
              markDownstream(o);
          }
          if (TransitionRunning)
            o.tState = STALE;
          else
            o.state = STALE;
        }
        if (Updates.length > 1e6) {
          Updates = [];
          if (false)
            ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn)
    return;
  cleanNode(node);
  const owner = Owner, listener = Listener, time = ExecCount;
  Listener = Owner = node;
  runComputation(node, Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value, time);
  if (Transition && !Transition.running && Transition.sources.has(node)) {
    queueMicrotask(() => {
      runUpdates(() => {
        Transition && (Transition.running = true);
        Listener = Owner = node;
        runComputation(node, node.tValue, time);
        Listener = Owner = null;
      }, false);
    });
  }
  Listener = listener;
  Owner = owner;
}
function runComputation(node, value, time) {
  let nextValue;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure)
      Transition && Transition.running ? node.tState = STALE : node.state = STALE;
    handleError(err);
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue, true);
    } else if (Transition && Transition.running && node.pure) {
      Transition.sources.add(node);
      node.tValue = nextValue;
    } else
      node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: null,
    pure
  };
  if (Transition && Transition.running) {
    c.state = 0;
    c.tState = state;
  }
  if (Owner === null)
    ;
  else if (Owner !== UNOWNED) {
    if (Transition && Transition.running && Owner.pure) {
      if (!Owner.tOwned)
        Owner.tOwned = [c];
      else
        Owner.tOwned.push(c);
    } else {
      if (!Owner.owned)
        Owner.owned = [c];
      else
        Owner.owned.push(c);
    }
  }
  if (ExternalSourceFactory) {
    const [track, trigger] = createSignal(void 0, {
      equals: false
    });
    const ordinary = ExternalSourceFactory(c.fn, trigger);
    onCleanup(() => ordinary.dispose());
    const triggerInTransition = () => startTransition(trigger).then(() => inTransition.dispose());
    const inTransition = ExternalSourceFactory(c.fn, triggerInTransition);
    c.fn = (x) => {
      track();
      return Transition && Transition.running ? inTransition.track(x) : ordinary.track(x);
    };
  }
  return c;
}
function runTop(node) {
  const runningTransition = Transition && Transition.running;
  if (!runningTransition && node.state === 0 || runningTransition && node.tState === 0)
    return;
  if (!runningTransition && node.state === PENDING || runningTransition && node.tState === PENDING)
    return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback))
    return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (runningTransition && Transition.disposed.has(node))
      return;
    if (!runningTransition && node.state || runningTransition && node.tState)
      ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if (runningTransition) {
      let top = node, prev = ancestors[i + 1];
      while ((top = top.owner) && top !== prev) {
        if (Transition.disposed.has(top))
          return;
      }
    }
    if (!runningTransition && node.state === STALE || runningTransition && node.tState === STALE) {
      updateComputation(node);
    } else if (!runningTransition && node.state === PENDING || runningTransition && node.tState === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates)
    return fn();
  let wait = false;
  if (!init)
    Updates = [];
  if (Effects)
    wait = true;
  else
    Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!Updates)
      Effects = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    if (Scheduler && Transition && Transition.running)
      scheduleQueue(Updates);
    else
      runQueue(Updates);
    Updates = null;
  }
  if (wait)
    return;
  let res;
  if (Transition) {
    if (!Transition.promises.size && !Transition.queue.size) {
      const sources = Transition.sources;
      const disposed = Transition.disposed;
      Effects.push.apply(Effects, Transition.effects);
      res = Transition.resolve;
      for (const e2 of Effects) {
        "tState" in e2 && (e2.state = e2.tState);
        delete e2.tState;
      }
      Transition = null;
      runUpdates(() => {
        for (const d2 of disposed)
          cleanNode(d2);
        for (const v of sources) {
          v.value = v.tValue;
          if (v.owned) {
            for (let i = 0, len = v.owned.length; i < len; i++)
              cleanNode(v.owned[i]);
          }
          if (v.tOwned)
            v.owned = v.tOwned;
          delete v.tValue;
          delete v.tOwned;
          v.tState = 0;
        }
        setTransPending(false);
      }, false);
    } else if (Transition.running) {
      Transition.running = false;
      Transition.effects.push.apply(Transition.effects, Effects);
      Effects = null;
      setTransPending(true);
      return;
    }
  }
  const e = Effects;
  Effects = null;
  if (e.length)
    runUpdates(() => runEffects(e), false);
  if (res)
    res();
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++)
    runTop(queue[i]);
}
function scheduleQueue(queue) {
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const tasks = Transition.queue;
    if (!tasks.has(item)) {
      tasks.add(item);
      Scheduler(() => {
        tasks.delete(item);
        runUpdates(() => {
          Transition.running = true;
          runTop(item);
        }, false);
        Transition && (Transition.running = false);
      });
    }
  }
}
function lookUpstream(node, ignore) {
  const runningTransition = Transition && Transition.running;
  if (runningTransition)
    node.tState = 0;
  else
    node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      if (!runningTransition && source.state === STALE || runningTransition && source.tState === STALE) {
        if (source !== ignore)
          runTop(source);
      } else if (!runningTransition && source.state === PENDING || runningTransition && source.tState === PENDING)
        lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  const runningTransition = Transition && Transition.running;
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!runningTransition && !o.state || runningTransition && !o.tState) {
      if (runningTransition)
        o.tState = PENDING;
      else
        o.state = PENDING;
      if (o.pure)
        Updates.push(o);
      else
        Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(), s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (Transition && Transition.running && node.pure) {
    if (node.tOwned) {
      for (i = 0; i < node.tOwned.length; i++)
        cleanNode(node.tOwned[i]);
      delete node.tOwned;
    }
    reset(node, true);
  } else if (node.owned) {
    for (i = 0; i < node.owned.length; i++)
      cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = 0; i < node.cleanups.length; i++)
      node.cleanups[i]();
    node.cleanups = null;
  }
  if (Transition && Transition.running)
    node.tState = 0;
  else
    node.state = 0;
  node.context = null;
}
function reset(node, top) {
  if (!top) {
    node.tState = 0;
    Transition.disposed.add(node);
  }
  if (node.owned) {
    for (let i = 0; i < node.owned.length; i++)
      reset(node.owned[i]);
  }
}
function castError(err) {
  if (err instanceof Error || typeof err === "string")
    return err;
  return new Error("Unknown error");
}
function handleError(err) {
  err = castError(err);
  const fns = ERROR && lookup(Owner, ERROR);
  if (!fns)
    throw err;
  for (const f of fns)
    f(err);
}
function lookup(owner, key) {
  return owner ? owner.context && owner.context[key] !== void 0 ? owner.context[key] : lookup(owner.owner, key) : void 0;
}
function resolveChildren(children2) {
  if (typeof children2 === "function" && !children2.length)
    return resolveChildren(children2());
  if (Array.isArray(children2)) {
    const results = [];
    for (let i = 0; i < children2.length; i++) {
      const result = resolveChildren(children2[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children2;
}
function createProvider(id, options) {
  return function provider(props) {
    let res;
    createRenderEffect(() => res = untrack(() => {
      Owner.context = {
        [id]: props.value
      };
      return children(() => props.children);
    }), void 0);
    return res;
  };
}
var FALLBACK = Symbol("fallback");
var hydrationEnabled = false;
function createComponent(Comp, props) {
  if (hydrationEnabled) {
    if (sharedConfig.context) {
      const c = sharedConfig.context;
      setHydrateContext(nextHydrateContext());
      const r = untrack(() => Comp(props || {}));
      setHydrateContext(c);
      return r;
    }
  }
  return untrack(() => Comp(props || {}));
}
var SuspenseListContext = createContext();

// node_modules/solid-js/web/dist/web.js
var booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
var Properties = /* @__PURE__ */ new Set(["className", "value", "readOnly", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);
function template(html, check, isSVG) {
  const t = document.createElement("template");
  t.innerHTML = html;
  let node = t.content.firstChild;
  if (isSVG)
    node = node.firstChild;
  return node;
}

// http-url:https://esm.sh/v99/solid-js@1.6.2/es2022/solid-js.js
var g = {};
var Ee = (e, t) => e === t;
var we = Symbol("solid-proxy");
var Oe = Symbol("solid-track");
var gt = Symbol("solid-dev-component");
var ne = { equals: Ee };
var W = null;
var Te = Le;
var A = 1;
var H = 2;
var Ae = { owned: null, cleanups: null, context: null, owner: null };
var d = null;
var u = null;
var K = null;
var z = null;
var h = null;
var y = null;
var O = null;
var me = 0;
var [et, ke] = V(false);
function B(e, t) {
  let r = h, n = d, s = e.length === 0, i = s ? Ae : { owned: null, cleanups: null, context: null, owner: t || n }, l = s ? e : () => e(() => P(() => X(i)));
  d = i, h = null;
  try {
    return M(l, true);
  } finally {
    h = r, d = n;
  }
}
function V(e, t) {
  t = t ? Object.assign({}, ne, t) : ne;
  let r = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 }, n = (s) => (typeof s == "function" && (u && u.running && u.sources.has(r) ? s = s(r.tValue) : s = s(r.value)), $e(r, s));
  return [je.bind(r), n];
}
function tt(e, t, r) {
  let n = Y(e, t, false, A);
  K && u && u.running ? y.push(n) : N(n);
}
function T(e, t, r) {
  r = r ? Object.assign({}, ne, r) : ne;
  let n = Y(e, t, true, 0);
  return n.observers = null, n.observerSlots = null, n.comparator = r.equals || void 0, K && u && u.running ? (n.tState = A, y.push(n)) : N(n), je.bind(n);
}
function P(e) {
  let t = h;
  h = null;
  try {
    return e();
  } finally {
    h = t;
  }
}
function D(e) {
  return d === null || (d.cleanups === null ? d.cleanups = [e] : d.cleanups.push(e)), e;
}
function Ie(e) {
  if (u && u.running)
    return e(), u.done;
  let t = h, r = d;
  return Promise.resolve().then(() => {
    h = t, d = r;
    let n;
    return (K || U) && (n = u || (u = { sources: /* @__PURE__ */ new Set(), effects: [], promises: /* @__PURE__ */ new Set(), disposed: /* @__PURE__ */ new Set(), queue: /* @__PURE__ */ new Set(), running: true }), n.done || (n.done = new Promise((s) => n.resolve = s)), n.running = true), M(e, false), h = d = null, n ? n.done : void 0;
  });
}
function qe(e, t) {
  let r = Symbol("context");
  return { id: r, Provider: ot(r), defaultValue: e };
}
function Me(e) {
  let t = T(e), r = T(() => ge(t()));
  return r.toArray = () => {
    let n = r();
    return Array.isArray(n) ? n : n != null ? [n] : [];
  }, r;
}
var U;
function je() {
  let e = u && u.running;
  if (this.sources && (!e && this.state || e && this.tState))
    if (!e && this.state === A || e && this.tState === A)
      N(this);
    else {
      let t = y;
      y = null, M(() => re(this), false), y = t;
    }
  if (h) {
    let t = this.observers ? this.observers.length : 0;
    h.sources ? (h.sources.push(this), h.sourceSlots.push(t)) : (h.sources = [this], h.sourceSlots = [t]), this.observers ? (this.observers.push(h), this.observerSlots.push(h.sources.length - 1)) : (this.observers = [h], this.observerSlots = [h.sources.length - 1]);
  }
  return e && u.sources.has(this) ? this.tValue : this.value;
}
function $e(e, t, r) {
  let n = u && u.running && u.sources.has(e) ? e.tValue : e.value;
  if (!e.comparator || !e.comparator(n, t)) {
    if (u) {
      let s = u.running;
      (s || !r && u.sources.has(e)) && (u.sources.add(e), e.tValue = t), s || (e.value = t);
    } else
      e.value = t;
    e.observers && e.observers.length && M(() => {
      for (let s = 0; s < e.observers.length; s += 1) {
        let i = e.observers[s], l = u && u.running;
        l && u.disposed.has(i) || ((l && !i.tState || !l && !i.state) && (i.pure ? y.push(i) : O.push(i), i.observers && Re(i)), l ? i.tState = A : i.state = A);
      }
      if (y.length > 1e6)
        throw y = [], new Error();
    }, false);
  }
  return t;
}
function N(e) {
  if (!e.fn)
    return;
  X(e);
  let t = d, r = h, n = me;
  h = d = e, ve(e, u && u.running && u.sources.has(e) ? e.tValue : e.value, n), u && !u.running && u.sources.has(e) && queueMicrotask(() => {
    M(() => {
      u && (u.running = true), h = d = e, ve(e, e.tValue, n), h = d = null;
    }, false);
  }), h = r, d = t;
}
function ve(e, t, r) {
  let n;
  try {
    n = e.fn(t);
  } catch (s) {
    e.pure && (u && u.running ? e.tState = A : e.state = A), Ne(s);
  }
  (!e.updatedAt || e.updatedAt <= r) && (e.updatedAt != null && "observers" in e ? $e(e, n, true) : u && u.running && e.pure ? (u.sources.add(e), e.tValue = n) : e.value = n, e.updatedAt = r);
}
function Y(e, t, r, n = A, s) {
  let i = { fn: e, state: n, updatedAt: null, owned: null, sources: null, sourceSlots: null, cleanups: null, value: t, owner: d, context: null, pure: r };
  if (u && u.running && (i.state = 0, i.tState = n), d === null || d !== Ae && (u && u.running && d.pure ? d.tOwned ? d.tOwned.push(i) : d.tOwned = [i] : d.owned ? d.owned.push(i) : d.owned = [i]), z) {
    let [l, o] = V(void 0, { equals: false }), f = z(i.fn, o);
    D(() => f.dispose());
    let a = () => Ie(o).then(() => c.dispose()), c = z(i.fn, a);
    i.fn = (x) => (l(), u && u.running ? c.track(x) : f.track(x));
  }
  return i;
}
function Z(e) {
  let t = u && u.running;
  if (!t && e.state === 0 || t && e.tState === 0)
    return;
  if (!t && e.state === H || t && e.tState === H)
    return re(e);
  if (e.suspense && P(e.suspense.inFallback))
    return e.suspense.effects.push(e);
  let r = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < me); ) {
    if (t && u.disposed.has(e))
      return;
    (!t && e.state || t && e.tState) && r.push(e);
  }
  for (let n = r.length - 1; n >= 0; n--) {
    if (e = r[n], t) {
      let s = e, i = r[n + 1];
      for (; (s = s.owner) && s !== i; )
        if (u.disposed.has(s))
          return;
    }
    if (!t && e.state === A || t && e.tState === A)
      N(e);
    else if (!t && e.state === H || t && e.tState === H) {
      let s = y;
      y = null, M(() => re(e, r[0]), false), y = s;
    }
  }
}
function M(e, t) {
  if (y)
    return e();
  let r = false;
  t || (y = []), O ? r = true : O = [], me++;
  try {
    let n = e();
    return it(r), n;
  } catch (n) {
    y || (O = null), Ne(n);
  }
}
function it(e) {
  if (y && (K && u && u.running ? lt(y) : Le(y), y = null), e)
    return;
  let t;
  if (u) {
    if (!u.promises.size && !u.queue.size) {
      let n = u.sources, s = u.disposed;
      O.push.apply(O, u.effects), t = u.resolve;
      for (let i of O)
        "tState" in i && (i.state = i.tState), delete i.tState;
      u = null, M(() => {
        for (let i of s)
          X(i);
        for (let i of n) {
          if (i.value = i.tValue, i.owned)
            for (let l = 0, o = i.owned.length; l < o; l++)
              X(i.owned[l]);
          i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, i.tState = 0;
        }
        ke(false);
      }, false);
    } else if (u.running) {
      u.running = false, u.effects.push.apply(u.effects, O), O = null, ke(true);
      return;
    }
  }
  let r = O;
  O = null, r.length && M(() => Te(r), false), t && t();
}
function Le(e) {
  for (let t = 0; t < e.length; t++)
    Z(e[t]);
}
function lt(e) {
  for (let t = 0; t < e.length; t++) {
    let r = e[t], n = u.queue;
    n.has(r) || (n.add(r), K(() => {
      n.delete(r), M(() => {
        u.running = true, Z(r);
      }, false), u && (u.running = false);
    }));
  }
}
function re(e, t) {
  let r = u && u.running;
  r ? e.tState = 0 : e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    let s = e.sources[n];
    s.sources && (!r && s.state === A || r && s.tState === A ? s !== t && Z(s) : (!r && s.state === H || r && s.tState === H) && re(s, t));
  }
}
function Re(e) {
  let t = u && u.running;
  for (let r = 0; r < e.observers.length; r += 1) {
    let n = e.observers[r];
    (!t && !n.state || t && !n.tState) && (t ? n.tState = H : n.state = H, n.pure ? y.push(n) : O.push(n), n.observers && Re(n));
  }
}
function X(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      let r = e.sources.pop(), n = e.sourceSlots.pop(), s = r.observers;
      if (s && s.length) {
        let i = s.pop(), l = r.observerSlots.pop();
        n < s.length && (i.sourceSlots[l] = n, s[n] = i, r.observerSlots[n] = l);
      }
    }
  if (u && u.running && e.pure) {
    if (e.tOwned) {
      for (t = 0; t < e.tOwned.length; t++)
        X(e.tOwned[t]);
      delete e.tOwned;
    }
    De(e, true);
  } else if (e.owned) {
    for (t = 0; t < e.owned.length; t++)
      X(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = 0; t < e.cleanups.length; t++)
      e.cleanups[t]();
    e.cleanups = null;
  }
  u && u.running ? e.tState = 0 : e.state = 0, e.context = null;
}
function De(e, t) {
  if (t || (e.tState = 0, u.disposed.add(e)), e.owned)
    for (let r = 0; r < e.owned.length; r++)
      De(e.owned[r]);
}
function Ue(e) {
  return e instanceof Error || typeof e == "string" ? e : new Error("Unknown error");
}
function Ne(e) {
  e = Ue(e);
  let t = W && _(d, W);
  if (!t)
    throw e;
  for (let r of t)
    r(e);
}
function _(e, t) {
  return e ? e.context && e.context[t] !== void 0 ? e.context[t] : _(e.owner, t) : void 0;
}
function ge(e) {
  if (typeof e == "function" && !e.length)
    return ge(e());
  if (Array.isArray(e)) {
    let t = [];
    for (let r = 0; r < e.length; r++) {
      let n = ge(e[r]);
      Array.isArray(n) ? t.push.apply(t, n) : t.push(n);
    }
    return t;
  }
  return e;
}
function ot(e, t) {
  return function(n) {
    let s;
    return tt(() => s = P(() => (d.context = { [e]: n.value }, Me(() => n.children))), void 0), s;
  };
}
var pe = Symbol("fallback");
var be = qe();

// http-url:https://esm.sh/v99/solid-js@1.6.2/es2022/web.js
var G = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
var I = /* @__PURE__ */ new Set(["className", "value", "readOnly", "formNoValidate", "isMap", "noModule", "playsInline", ...G]);
var V2 = Object.assign(/* @__PURE__ */ Object.create(null), { className: "class", htmlFor: "for" });
var k = Object.assign(/* @__PURE__ */ Object.create(null), { class: "className", formnovalidate: "formNoValidate", ismap: "isMap", nomodule: "noModule", playsinline: "playsInline", readonly: "readOnly" });
function Y2(n, t, e) {
  let i = e.length, o = t.length, r = i, l = 0, s = 0, a = t[o - 1].nextSibling, c = null;
  for (; l < o || s < r; ) {
    if (t[l] === e[s]) {
      l++, s++;
      continue;
    }
    for (; t[o - 1] === e[r - 1]; )
      o--, r--;
    if (o === l) {
      let d2 = r < i ? s ? e[s - 1].nextSibling : e[r - s] : a;
      for (; s < r; )
        n.insertBefore(e[s++], d2);
    } else if (r === s)
      for (; l < o; )
        (!c || !c.has(t[l])) && t[l].remove(), l++;
    else if (t[l] === e[r - 1] && e[s] === t[o - 1]) {
      let d2 = t[--o].nextSibling;
      n.insertBefore(e[s++], t[l++].nextSibling), n.insertBefore(e[--r], d2), t[o] = e[r];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let u2 = s;
        for (; u2 < r; )
          c.set(e[u2], u2++);
      }
      let d2 = c.get(t[l]);
      if (d2 != null)
        if (s < d2 && d2 < r) {
          let u2 = l, b = 1, A2;
          for (; ++u2 < o && u2 < r && !((A2 = c.get(t[u2])) == null || A2 !== d2 + b); )
            b++;
          if (b > d2 - s) {
            let j = t[l];
            for (; s < d2; )
              n.insertBefore(e[s++], j);
          } else
            n.replaceChild(e[s++], t[l++]);
        } else
          l++;
      else
        t[l++].remove();
    }
  }
}
function X2(n, t, e, i = {}) {
  let o;
  return B((r) => {
    o = r, t === document ? n() : p(t, n(), t.firstChild ? null : void 0, e);
  }, i.owner), () => {
    o(), t.textContent = "";
  };
}
function p(n, t, e, i) {
  if (e !== void 0 && !i && (i = []), typeof t != "function")
    return g2(n, t, i, e);
  tt((o) => g2(n, t(), o, e), i);
}
function g2(n, t, e, i, o) {
  for (g.context && !e && (e = [...n.childNodes]); typeof e == "function"; )
    e = e();
  if (t === e)
    return e;
  let r = typeof t, l = i !== void 0;
  if (n = l && e[0] && e[0].parentNode || n, r === "string" || r === "number") {
    if (g.context)
      return e;
    if (r === "number" && (t = t.toString()), l) {
      let s = e[0];
      s && s.nodeType === 3 ? s.data = t : s = document.createTextNode(t), e = m(n, e, i, s);
    } else
      e !== "" && typeof e == "string" ? e = n.firstChild.data = t : e = n.textContent = t;
  } else if (t == null || r === "boolean") {
    if (g.context)
      return e;
    e = m(n, e, i);
  } else {
    if (r === "function")
      return tt(() => {
        let s = t();
        for (; typeof s == "function"; )
          s = s();
        e = g2(n, s, e, i);
      }), () => e;
    if (Array.isArray(t)) {
      let s = [], a = e && Array.isArray(e);
      if (w(s, t, e, o))
        return tt(() => e = g2(n, s, e, i, true)), () => e;
      if (g.context) {
        if (!s.length)
          return e;
        for (let c = 0; c < s.length; c++)
          if (s[c].parentNode)
            return e = s;
      }
      if (s.length === 0) {
        if (e = m(n, e, i), l)
          return e;
      } else
        a ? e.length === 0 ? T2(n, s, i) : Y2(n, e, s) : (e && m(n), T2(n, s));
      e = s;
    } else if (t instanceof Node) {
      if (g.context && t.parentNode)
        return e = l ? [t] : t;
      if (Array.isArray(e)) {
        if (l)
          return e = m(n, e, i, t);
        m(n, e, null, t);
      } else
        e == null || e === "" || !n.firstChild ? n.appendChild(t) : n.replaceChild(t, n.firstChild);
      e = t;
    }
  }
  return e;
}
function w(n, t, e, i) {
  let o = false;
  for (let r = 0, l = t.length; r < l; r++) {
    let s = t[r], a = e && e[r];
    if (s instanceof Node)
      n.push(s);
    else if (!(s == null || s === true || s === false))
      if (Array.isArray(s))
        o = w(n, s, a) || o;
      else if (typeof s == "function")
        if (i) {
          for (; typeof s == "function"; )
            s = s();
          o = w(n, Array.isArray(s) ? s : [s], Array.isArray(a) ? a : [a]) || o;
        } else
          n.push(s), o = true;
      else {
        let c = String(s);
        a && a.nodeType === 3 && a.data === c ? n.push(a) : n.push(document.createTextNode(c));
      }
  }
  return o;
}
function T2(n, t, e = null) {
  for (let i = 0, o = t.length; i < o; i++)
    n.insertBefore(t[i], e);
}
function m(n, t, e, i) {
  if (e === void 0)
    return n.textContent = "";
  let o = i || document.createTextNode("");
  if (t.length) {
    let r = false;
    for (let l = t.length - 1; l >= 0; l--) {
      let s = t[l];
      if (o !== s) {
        let a = s.parentNode === n;
        !r && !l ? a ? n.replaceChild(o, s) : n.insertBefore(o, e) : a && s.remove();
      } else
        r = true;
    }
  } else
    n.insertBefore(o, e);
  return [o];
}

// solid-shorty.jsx
var _tmpl$ = /* @__PURE__ */ template(`<div>The solidify shortcode is active!</div>`, 2);
function Solidify() {
  return _tmpl$.cloneNode(true);
}
X2(() => createComponent(Solidify, {}), document.getElementById("shorty"));
