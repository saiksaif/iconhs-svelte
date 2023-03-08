
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash$2(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash$2(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$1;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM

    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers

    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }

    function getWindow(node) {
      if (node == null) {
        return window;
      }

      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }

      return node;
    }

    function isElement$1(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }

    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }

    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }

      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }

    // and applies them to the HTMLElements such as popper and arrow

    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]


        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];

          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }

    function effect$2(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }

      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements

          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }

          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules


    var applyStyles$1 = {
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect$2,
      requires: ['computeStyles']
    };

    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }

    var max = Math.max;
    var min = Math.min;
    var round = Math.round;

    function getUAString() {
      var uaData = navigator.userAgentData;

      if (uaData != null && uaData.brands) {
        return uaData.brands.map(function (item) {
          return item.brand + "/" + item.version;
        }).join(' ');
      }

      return navigator.userAgent;
    }

    function isLayoutViewport() {
      return !/^((?!chrome|android).)*safari/i.test(getUAString());
    }

    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
      if (includeScale === void 0) {
        includeScale = false;
      }

      if (isFixedStrategy === void 0) {
        isFixedStrategy = false;
      }

      var clientRect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;

      if (includeScale && isHTMLElement(element)) {
        scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
        scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
      }

      var _ref = isElement$1(element) ? getWindow(element) : window,
          visualViewport = _ref.visualViewport;

      var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
      var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
      var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
      var width = clientRect.width / scaleX;
      var height = clientRect.height / scaleY;
      return {
        width: width,
        height: height,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x,
        x: x,
        y: y
      };
    }

    // means it doesn't take into account transforms.

    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223

      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }

      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }

      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }

    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;

          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...


            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false


      return false;
    }

    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }

    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return ((isElement$1(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }

    function getParentNode(element) {
      if (getNodeName(element) === 'html') {
        return element;
      }

      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        getDocumentElement(element) // fallback

      );
    }

    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle$1(element).position === 'fixed') {
        return null;
      }

      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block


    function getContainingBlock(element) {
      var isFirefox = /firefox/i.test(getUAString());
      var isIE = /Trident/i.test(getUAString());

      if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = getComputedStyle$1(element);

        if (elementCss.position === 'fixed') {
          return null;
        }
      }

      var currentNode = getParentNode(element);

      if (isShadowRoot(currentNode)) {
        currentNode = currentNode.host;
      }

      while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }

      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.


    function getOffsetParent(element) {
      var window = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);

      while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }

      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
        return window;
      }

      return offsetParent || getContainingBlock(element) || window;
    }

    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }
    function withinMaxClamp(min, value, max) {
      var v = within(min, value, max);
      return v > max ? max : v;
    }

    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }

    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }

    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }

    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    };

    function arrow(_ref) {
      var _state$modifiersData$;

      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';

      if (!arrowElement || !popperOffsets) {
        return;
      }

      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === 'y' ? top : left;
      var maxProp = axis === 'y' ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds

      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = within(min, center, max); // Prevents breaking syntax highlighting...

      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }

    function effect$1(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

      if (arrowElement == null) {
        return;
      } // CSS selector


      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);

        if (!arrowElement) {
          return;
        }
      }

      if (process.env.NODE_ENV !== "production") {
        if (!isHTMLElement(arrowElement)) {
          console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
        }
      }

      if (!contains(state.elements.popper, arrowElement)) {
        if (process.env.NODE_ENV !== "production") {
          console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
        }

        return;
      }

      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules


    var arrow$1 = {
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect$1,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    };

    function getVariation(placement) {
      return placement.split('-')[1];
    }

    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.

    function roundOffsetsByDPR(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(x * dpr) / dpr || 0,
        y: round(y * dpr) / dpr || 0
      };
    }

    function mapToStyles(_ref2) {
      var _Object$assign2;

      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          variation = _ref2.variation,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets,
          isFixed = _ref2.isFixed;
      var _offsets$x = offsets.x,
          x = _offsets$x === void 0 ? 0 : _offsets$x,
          _offsets$y = offsets.y,
          y = _offsets$y === void 0 ? 0 : _offsets$y;

      var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref3.x;
      y = _ref3.y;
      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = left;
      var sideY = top;
      var win = window;

      if (adaptive) {
        var offsetParent = getOffsetParent(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';

        if (offsetParent === getWindow(popper)) {
          offsetParent = getDocumentElement(popper);

          if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


        offsetParent = offsetParent;

        if (placement === top || (placement === left || placement === right) && variation === end) {
          sideY = bottom;
          var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
          offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }

        if (placement === left || (placement === top || placement === bottom) && variation === end) {
          sideX = right;
          var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
          offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }

      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);

      var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref4.x;
      y = _ref4.y;

      if (gpuAcceleration) {
        var _Object$assign;

        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }

      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }

    function computeStyles(_ref5) {
      var state = _ref5.state,
          options = _ref5.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

      if (process.env.NODE_ENV !== "production") {
        var transitionProperty = getComputedStyle$1(state.elements.popper).transitionProperty || '';

        if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
          return transitionProperty.indexOf(property) >= 0;
        })) {
          console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
        }
      }

      var commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
      };

      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }

      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }

      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var computeStyles$1 = {
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    };

    var passive = {
      passive: true
    };

    function effect(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }

      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }

        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules


    var eventListeners = {
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect,
      data: {}
    };

    var hash$1 = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash$1[matched];
      });
    }

    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }

    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    function getViewportRect(element, strategy) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0;

      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        var layoutViewport = isLayoutViewport();

        if (layoutViewport || !layoutViewport && strategy === 'fixed') {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }

      return {
        width: width,
        height: height,
        x: x + getWindowScrollBarX(element),
        y: y
      };
    }

    // of the `<html>` and `<body>` rect bounds if horizontally scrollable

    function getDocumentRect(element) {
      var _element$ownerDocumen;

      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;

      if (getComputedStyle$1(body || html).direction === 'rtl') {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }

      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }

    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle$1(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }

      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }

      return getScrollParent(getParentNode(node));
    }

    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */

    function listScrollParents(element, list) {
      var _element$ownerDocumen;

      if (list === void 0) {
        list = [];
      }

      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
    }

    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }

    function getInnerBoundingClientRect(element, strategy) {
      var rect = getBoundingClientRect(element, false, strategy === 'fixed');
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }

    function getClientRectFromMixedType(element, clippingParent, strategy) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`


    function getClippingParents(element) {
      var clippingParents = listScrollParents(getParentNode(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

      if (!isElement$1(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


      return clippingParents.filter(function (clippingParent) {
        return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents


    function getClippingRect(element, boundary, rootBoundary, strategy) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent, strategy);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent, strategy));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }

    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;

      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;

        case bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;

        case right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;

        case left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;

        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }

      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';

        switch (variation) {
          case start:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;

          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
        }
      }

      return offsets;
    }

    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$strategy = _options.strategy,
          strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
      var referenceClientRect = getBoundingClientRect(state.elements.reference);
      var popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect

      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

      if (elementContext === popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }

      return overflowOffsets;
    }

    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
        return getVariation(placement) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });

      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;

        if (process.env.NODE_ENV !== "production") {
          console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
        }
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[getBasePlacement(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }

    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }

      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }

    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;

      if (state.modifiersData[name]._skip) {
        return;
      }

      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var _basePlacement = getBasePlacement(placement);

        var isStartVariation = getVariation(placement) === start;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }

        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];

        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }

        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }

        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }

        checksMap.set(placement, checks);
      }

      if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;

        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);

            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });

          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };

        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);

          if (_ret === "break") break;
        }
      }

      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules


    var flip$1 = {
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    };

    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }

      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }

    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function (side) {
        return overflow[side] >= 0;
      });
    }

    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules


    var hide$1 = {
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    };

    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];

      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }

    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;

      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var offset$1 = {
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    };

    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var popperOffsets$1 = {
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    };

    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }

    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };

      if (!popperOffsets) {
        return;
      }

      if (checkMainAxis) {
        var _offsetModifierState$;

        var mainSide = mainAxis === 'y' ? top : left;
        var altSide = mainAxis === 'y' ? bottom : right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min$1 = offset + overflow[mainSide];
        var max$1 = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds

        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)

        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _offsetModifierState$2;

        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _len = altAxis === 'y' ? 'height' : 'width';

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

        var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var preventOverflow$1 = {
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    };

    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }

    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = round(rect.width) / element.offsetWidth || 1;
      var scaleY = round(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    } // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.


    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }

      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };

      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }

        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }

      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively

      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);

            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }

      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }

    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase

      return modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }

    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }

        return pending;
      };
    }

    function format(str) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return [].concat(args).reduce(function (p, c) {
        return p.replace(/%s/, c);
      }, str);
    }

    var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
    var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
    var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
    function validateModifiers(modifiers) {
      modifiers.forEach(function (modifier) {
        [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        }).forEach(function (key) {
          switch (key) {
            case 'name':
              if (typeof modifier.name !== 'string') {
                console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
              }

              break;

            case 'enabled':
              if (typeof modifier.enabled !== 'boolean') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
              }

              break;

            case 'phase':
              if (modifierPhases.indexOf(modifier.phase) < 0) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
              }

              break;

            case 'fn':
              if (typeof modifier.fn !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
              }

              break;

            case 'effect':
              if (modifier.effect != null && typeof modifier.effect !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
              }

              break;

            case 'requires':
              if (modifier.requires != null && !Array.isArray(modifier.requires)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
              }

              break;

            case 'requiresIfExists':
              if (!Array.isArray(modifier.requiresIfExists)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
              }

              break;

            case 'options':
            case 'data':
              break;

            default:
              console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
                return "\"" + s + "\"";
              }).join(', ') + "; but \"" + key + "\" was provided.");
          }

          modifier.requires && modifier.requires.forEach(function (requirement) {
            if (modifiers.find(function (mod) {
              return mod.name === requirement;
            }) == null) {
              console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
            }
          });
        });
      });
    }

    function uniqueBy(arr, fn) {
      var identifiers = new Set();
      return arr.filter(function (item) {
        var identifier = fn(item);

        if (!identifiers.has(identifier)) {
          identifiers.add(identifier);
          return true;
        }
      });
    }

    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values

      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }

    var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
    var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };

    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }

    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }

      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }

        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: isElement$1(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties

            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            }); // Validate the provided modifiers so that the consumer will get warned
            // if one of the modifiers is invalid for any reason

            if (process.env.NODE_ENV !== "production") {
              var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
                var name = _ref.name;
                return name;
              });
              validateModifiers(modifiers);

              if (getBasePlacement(state.options.placement) === auto) {
                var flipModifier = state.orderedModifiers.find(function (_ref2) {
                  var name = _ref2.name;
                  return name === 'flip';
                });

                if (!flipModifier) {
                  console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
                }
              }

              var _getComputedStyle = getComputedStyle$1(popper),
                  marginTop = _getComputedStyle.marginTop,
                  marginRight = _getComputedStyle.marginRight,
                  marginBottom = _getComputedStyle.marginBottom,
                  marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
              // cause bugs with positioning, so we'll warn the consumer


              if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
                return parseFloat(margin);
              })) {
                console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
              }
            }

            runModifierEffects();
            return instance.update();
          },
          // Sync update – it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }

            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore

            if (!areValidElements(reference, popper)) {
              if (process.env.NODE_ENV !== "production") {
                console.error(INVALID_ELEMENT_ERROR);
              }

              return;
            } // Store the reference and popper rects to be read by modifiers


            state.rects = {
              reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
              popper: getLayoutRect(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect

            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`

            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });
            var __debug_loops__ = 0;

            for (var index = 0; index < state.orderedModifiers.length; index++) {
              if (process.env.NODE_ENV !== "production") {
                __debug_loops__ += 1;

                if (__debug_loops__ > 100) {
                  console.error(INFINITE_LOOP_ERROR);
                  break;
                }
              }

              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }

              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;

              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update – it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: debounce(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return instance;
        }

        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.

        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref3) {
            var name = _ref3.name,
                _ref3$options = _ref3.options,
                options = _ref3$options === void 0 ? {} : _ref3$options,
                effect = _ref3.effect;

            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });

              var noopFn = function noopFn() {};

              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }

        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }

        return instance;
      };
    }
    var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

    var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
    var createPopper$1 = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers$1
    }); // eslint-disable-next-line import/no-unused-modules

    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules

    var Popper = /*#__PURE__*/Object.freeze({
        __proto__: null,
        popperGenerator: popperGenerator,
        detectOverflow: detectOverflow,
        createPopperBase: createPopper$2,
        createPopper: createPopper,
        createPopperLite: createPopper$1,
        top: top,
        bottom: bottom,
        right: right,
        left: left,
        auto: auto,
        basePlacements: basePlacements,
        start: start,
        end: end,
        clippingParents: clippingParents,
        viewport: viewport,
        popper: popper,
        reference: reference,
        variationPlacements: variationPlacements,
        placements: placements,
        beforeRead: beforeRead,
        read: read,
        afterRead: afterRead,
        beforeMain: beforeMain,
        main: main,
        afterMain: afterMain,
        beforeWrite: beforeWrite,
        write: write,
        afterWrite: afterWrite,
        modifierPhases: modifierPhases,
        applyStyles: applyStyles$1,
        arrow: arrow$1,
        computeStyles: computeStyles$1,
        eventListeners: eventListeners,
        flip: flip$1,
        hide: hide$1,
        offset: offset$1,
        popperOffsets: popperOffsets$1,
        preventOverflow: preventOverflow$1
    });

    /*!
      * Bootstrap v5.2.3 (https://getbootstrap.com/)
      * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): util/index.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const MAX_UID = 1000000;
    const MILLISECONDS_MULTIPLIER = 1000;
    const TRANSITION_END = 'transitionend'; // Shout-out Angus Croll (https://goo.gl/pxwQGp)

    const toType = object => {
      if (object === null || object === undefined) {
        return `${object}`;
      }

      return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
    };
    /**
     * Public Util API
     */


    const getUID = prefix => {
      do {
        prefix += Math.floor(Math.random() * MAX_UID);
      } while (document.getElementById(prefix));

      return prefix;
    };

    const getSelector = element => {
      let selector = element.getAttribute('data-bs-target');

      if (!selector || selector === '#') {
        let hrefAttribute = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
        // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
        // `document.querySelector` will rightfully complain it is invalid.
        // See https://github.com/twbs/bootstrap/issues/32273

        if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
          return null;
        } // Just in case some CMS puts out a full URL with the anchor appended


        if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
          hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
        }

        selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
      }

      return selector;
    };

    const getSelectorFromElement = element => {
      const selector = getSelector(element);

      if (selector) {
        return document.querySelector(selector) ? selector : null;
      }

      return null;
    };

    const getElementFromSelector = element => {
      const selector = getSelector(element);
      return selector ? document.querySelector(selector) : null;
    };

    const getTransitionDurationFromElement = element => {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      let {
        transitionDuration,
        transitionDelay
      } = window.getComputedStyle(element);
      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    };

    const triggerTransitionEnd = element => {
      element.dispatchEvent(new Event(TRANSITION_END));
    };

    const isElement = object => {
      if (!object || typeof object !== 'object') {
        return false;
      }

      if (typeof object.jquery !== 'undefined') {
        object = object[0];
      }

      return typeof object.nodeType !== 'undefined';
    };

    const getElement = object => {
      // it's a jQuery object or a node element
      if (isElement(object)) {
        return object.jquery ? object[0] : object;
      }

      if (typeof object === 'string' && object.length > 0) {
        return document.querySelector(object);
      }

      return null;
    };

    const isVisible = element => {
      if (!isElement(element) || element.getClientRects().length === 0) {
        return false;
      }

      const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible'; // Handle `details` element as its content may falsie appear visible when it is closed

      const closedDetails = element.closest('details:not([open])');

      if (!closedDetails) {
        return elementIsVisible;
      }

      if (closedDetails !== element) {
        const summary = element.closest('summary');

        if (summary && summary.parentNode !== closedDetails) {
          return false;
        }

        if (summary === null) {
          return false;
        }
      }

      return elementIsVisible;
    };

    const isDisabled = element => {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
      }

      if (element.classList.contains('disabled')) {
        return true;
      }

      if (typeof element.disabled !== 'undefined') {
        return element.disabled;
      }

      return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    };

    const findShadowRoot = element => {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document


      if (typeof element.getRootNode === 'function') {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root


      if (!element.parentNode) {
        return null;
      }

      return findShadowRoot(element.parentNode);
    };

    const noop = () => {};
    /**
     * Trick to restart an element's animation
     *
     * @param {HTMLElement} element
     * @return void
     *
     * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
     */


    const reflow = element => {
      element.offsetHeight; // eslint-disable-line no-unused-expressions
    };

    const getjQuery = () => {
      if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
        return window.jQuery;
      }

      return null;
    };

    const DOMContentLoadedCallbacks = [];

    const onDOMContentLoaded = callback => {
      if (document.readyState === 'loading') {
        // add listener on the first call when the document is in loading state
        if (!DOMContentLoadedCallbacks.length) {
          document.addEventListener('DOMContentLoaded', () => {
            for (const callback of DOMContentLoadedCallbacks) {
              callback();
            }
          });
        }

        DOMContentLoadedCallbacks.push(callback);
      } else {
        callback();
      }
    };

    const isRTL = () => document.documentElement.dir === 'rtl';

    const defineJQueryPlugin = plugin => {
      onDOMContentLoaded(() => {
        const $ = getjQuery();
        /* istanbul ignore if */

        if ($) {
          const name = plugin.NAME;
          const JQUERY_NO_CONFLICT = $.fn[name];
          $.fn[name] = plugin.jQueryInterface;
          $.fn[name].Constructor = plugin;

          $.fn[name].noConflict = () => {
            $.fn[name] = JQUERY_NO_CONFLICT;
            return plugin.jQueryInterface;
          };
        }
      });
    };

    const execute = callback => {
      if (typeof callback === 'function') {
        callback();
      }
    };

    const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
      if (!waitForTransition) {
        execute(callback);
        return;
      }

      const durationPadding = 5;
      const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
      let called = false;

      const handler = ({
        target
      }) => {
        if (target !== transitionElement) {
          return;
        }

        called = true;
        transitionElement.removeEventListener(TRANSITION_END, handler);
        execute(callback);
      };

      transitionElement.addEventListener(TRANSITION_END, handler);
      setTimeout(() => {
        if (!called) {
          triggerTransitionEnd(transitionElement);
        }
      }, emulatedDuration);
    };
    /**
     * Return the previous/next element of a list.
     *
     * @param {array} list    The list of elements
     * @param activeElement   The active element
     * @param shouldGetNext   Choose to get next or previous element
     * @param isCycleAllowed
     * @return {Element|elem} The proper element
     */


    const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
      const listLength = list.length;
      let index = list.indexOf(activeElement); // if the element does not exist in the list return an element
      // depending on the direction and if cycle is allowed

      if (index === -1) {
        return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
      }

      index += shouldGetNext ? 1 : -1;

      if (isCycleAllowed) {
        index = (index + listLength) % listLength;
      }

      return list[Math.max(0, Math.min(index, listLength - 1))];
    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): dom/event-handler.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
    const stripNameRegex = /\..*/;
    const stripUidRegex = /::\d+$/;
    const eventRegistry = {}; // Events storage

    let uidEvent = 1;
    const customEvents = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    };
    const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
    /**
     * Private methods
     */

    function makeEventUid(element, uid) {
      return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
    }

    function getElementEvents(element) {
      const uid = makeEventUid(element);
      element.uidEvent = uid;
      eventRegistry[uid] = eventRegistry[uid] || {};
      return eventRegistry[uid];
    }

    function bootstrapHandler(element, fn) {
      return function handler(event) {
        hydrateObj(event, {
          delegateTarget: element
        });

        if (handler.oneOff) {
          EventHandler.off(element, event.type, fn);
        }

        return fn.apply(element, [event]);
      };
    }

    function bootstrapDelegationHandler(element, selector, fn) {
      return function handler(event) {
        const domElements = element.querySelectorAll(selector);

        for (let {
          target
        } = event; target && target !== this; target = target.parentNode) {
          for (const domElement of domElements) {
            if (domElement !== target) {
              continue;
            }

            hydrateObj(event, {
              delegateTarget: target
            });

            if (handler.oneOff) {
              EventHandler.off(element, event.type, selector, fn);
            }

            return fn.apply(target, [event]);
          }
        }
      };
    }

    function findHandler(events, callable, delegationSelector = null) {
      return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
    }

    function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
      const isDelegated = typeof handler === 'string'; // todo: tooltip passes `false` instead of selector, so we need to check

      const callable = isDelegated ? delegationFunction : handler || delegationFunction;
      let typeEvent = getTypeEvent(originalTypeEvent);

      if (!nativeEvents.has(typeEvent)) {
        typeEvent = originalTypeEvent;
      }

      return [isDelegated, callable, typeEvent];
    }

    function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }

      let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction); // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
      // this prevents the handler from being dispatched the same way as mouseover or mouseout does

      if (originalTypeEvent in customEvents) {
        const wrapFunction = fn => {
          return function (event) {
            if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
              return fn.call(this, event);
            }
          };
        };

        callable = wrapFunction(callable);
      }

      const events = getElementEvents(element);
      const handlers = events[typeEvent] || (events[typeEvent] = {});
      const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);

      if (previousFunction) {
        previousFunction.oneOff = previousFunction.oneOff && oneOff;
        return;
      }

      const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
      const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
      fn.delegationSelector = isDelegated ? handler : null;
      fn.callable = callable;
      fn.oneOff = oneOff;
      fn.uidEvent = uid;
      handlers[uid] = fn;
      element.addEventListener(typeEvent, fn, isDelegated);
    }

    function removeHandler(element, events, typeEvent, handler, delegationSelector) {
      const fn = findHandler(events[typeEvent], handler, delegationSelector);

      if (!fn) {
        return;
      }

      element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
      delete events[typeEvent][fn.uidEvent];
    }

    function removeNamespacedHandlers(element, events, typeEvent, namespace) {
      const storeElementEvent = events[typeEvent] || {};

      for (const handlerKey of Object.keys(storeElementEvent)) {
        if (handlerKey.includes(namespace)) {
          const event = storeElementEvent[handlerKey];
          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
        }
      }
    }

    function getTypeEvent(event) {
      // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
      event = event.replace(stripNameRegex, '');
      return customEvents[event] || event;
    }

    const EventHandler = {
      on(element, event, handler, delegationFunction) {
        addHandler(element, event, handler, delegationFunction, false);
      },

      one(element, event, handler, delegationFunction) {
        addHandler(element, event, handler, delegationFunction, true);
      },

      off(element, originalTypeEvent, handler, delegationFunction) {
        if (typeof originalTypeEvent !== 'string' || !element) {
          return;
        }

        const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
        const inNamespace = typeEvent !== originalTypeEvent;
        const events = getElementEvents(element);
        const storeElementEvent = events[typeEvent] || {};
        const isNamespace = originalTypeEvent.startsWith('.');

        if (typeof callable !== 'undefined') {
          // Simplest case: handler is passed, remove that listener ONLY.
          if (!Object.keys(storeElementEvent).length) {
            return;
          }

          removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
          return;
        }

        if (isNamespace) {
          for (const elementEvent of Object.keys(events)) {
            removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
          }
        }

        for (const keyHandlers of Object.keys(storeElementEvent)) {
          const handlerKey = keyHandlers.replace(stripUidRegex, '');

          if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
            const event = storeElementEvent[keyHandlers];
            removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
          }
        }
      },

      trigger(element, event, args) {
        if (typeof event !== 'string' || !element) {
          return null;
        }

        const $ = getjQuery();
        const typeEvent = getTypeEvent(event);
        const inNamespace = event !== typeEvent;
        let jQueryEvent = null;
        let bubbles = true;
        let nativeDispatch = true;
        let defaultPrevented = false;

        if (inNamespace && $) {
          jQueryEvent = $.Event(event, args);
          $(element).trigger(jQueryEvent);
          bubbles = !jQueryEvent.isPropagationStopped();
          nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
          defaultPrevented = jQueryEvent.isDefaultPrevented();
        }

        let evt = new Event(event, {
          bubbles,
          cancelable: true
        });
        evt = hydrateObj(evt, args);

        if (defaultPrevented) {
          evt.preventDefault();
        }

        if (nativeDispatch) {
          element.dispatchEvent(evt);
        }

        if (evt.defaultPrevented && jQueryEvent) {
          jQueryEvent.preventDefault();
        }

        return evt;
      }

    };

    function hydrateObj(obj, meta) {
      for (const [key, value] of Object.entries(meta || {})) {
        try {
          obj[key] = value;
        } catch (_unused) {
          Object.defineProperty(obj, key, {
            configurable: true,

            get() {
              return value;
            }

          });
        }
      }

      return obj;
    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): dom/data.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    /**
     * Constants
     */
    const elementMap = new Map();
    const Data = {
      set(element, key, instance) {
        if (!elementMap.has(element)) {
          elementMap.set(element, new Map());
        }

        const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
        // can be removed later when multiple key/instances are fine to be used

        if (!instanceMap.has(key) && instanceMap.size !== 0) {
          // eslint-disable-next-line no-console
          console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
          return;
        }

        instanceMap.set(key, instance);
      },

      get(element, key) {
        if (elementMap.has(element)) {
          return elementMap.get(element).get(key) || null;
        }

        return null;
      },

      remove(element, key) {
        if (!elementMap.has(element)) {
          return;
        }

        const instanceMap = elementMap.get(element);
        instanceMap.delete(key); // free up element references if there are no instances left for an element

        if (instanceMap.size === 0) {
          elementMap.delete(element);
        }
      }

    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): dom/manipulator.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    function normalizeData(value) {
      if (value === 'true') {
        return true;
      }

      if (value === 'false') {
        return false;
      }

      if (value === Number(value).toString()) {
        return Number(value);
      }

      if (value === '' || value === 'null') {
        return null;
      }

      if (typeof value !== 'string') {
        return value;
      }

      try {
        return JSON.parse(decodeURIComponent(value));
      } catch (_unused) {
        return value;
      }
    }

    function normalizeDataKey(key) {
      return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
    }

    const Manipulator = {
      setDataAttribute(element, key, value) {
        element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
      },

      removeDataAttribute(element, key) {
        element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
      },

      getDataAttributes(element) {
        if (!element) {
          return {};
        }

        const attributes = {};
        const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));

        for (const key of bsKeys) {
          let pureKey = key.replace(/^bs/, '');
          pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
          attributes[pureKey] = normalizeData(element.dataset[key]);
        }

        return attributes;
      },

      getDataAttribute(element, key) {
        return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
      }

    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): util/config.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Class definition
     */

    class Config {
      // Getters
      static get Default() {
        return {};
      }

      static get DefaultType() {
        return {};
      }

      static get NAME() {
        throw new Error('You have to implement the static method "NAME", for each component!');
      }

      _getConfig(config) {
        config = this._mergeConfigObj(config);
        config = this._configAfterMerge(config);

        this._typeCheckConfig(config);

        return config;
      }

      _configAfterMerge(config) {
        return config;
      }

      _mergeConfigObj(config, element) {
        const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

        return { ...this.constructor.Default,
          ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
          ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
          ...(typeof config === 'object' ? config : {})
        };
      }

      _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
        for (const property of Object.keys(configTypes)) {
          const expectedTypes = configTypes[property];
          const value = config[property];
          const valueType = isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
          }
        }
      }

    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): base-component.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const VERSION = '5.2.3';
    /**
     * Class definition
     */

    class BaseComponent extends Config {
      constructor(element, config) {
        super();
        element = getElement(element);

        if (!element) {
          return;
        }

        this._element = element;
        this._config = this._getConfig(config);
        Data.set(this._element, this.constructor.DATA_KEY, this);
      } // Public


      dispose() {
        Data.remove(this._element, this.constructor.DATA_KEY);
        EventHandler.off(this._element, this.constructor.EVENT_KEY);

        for (const propertyName of Object.getOwnPropertyNames(this)) {
          this[propertyName] = null;
        }
      }

      _queueCallback(callback, element, isAnimated = true) {
        executeAfterTransition(callback, element, isAnimated);
      }

      _getConfig(config) {
        config = this._mergeConfigObj(config, this._element);
        config = this._configAfterMerge(config);

        this._typeCheckConfig(config);

        return config;
      } // Static


      static getInstance(element) {
        return Data.get(getElement(element), this.DATA_KEY);
      }

      static getOrCreateInstance(element, config = {}) {
        return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
      }

      static get VERSION() {
        return VERSION;
      }

      static get DATA_KEY() {
        return `bs.${this.NAME}`;
      }

      static get EVENT_KEY() {
        return `.${this.DATA_KEY}`;
      }

      static eventName(name) {
        return `${name}${this.EVENT_KEY}`;
      }

    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): util/component-functions.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */

    const enableDismissTrigger = (component, method = 'hide') => {
      const clickEvent = `click.dismiss${component.EVENT_KEY}`;
      const name = component.NAME;
      EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
        if (['A', 'AREA'].includes(this.tagName)) {
          event.preventDefault();
        }

        if (isDisabled(this)) {
          return;
        }

        const target = getElementFromSelector(this) || this.closest(`.${name}`);
        const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

        instance[method]();
      });
    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): alert.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$f = 'alert';
    const DATA_KEY$a = 'bs.alert';
    const EVENT_KEY$b = `.${DATA_KEY$a}`;
    const EVENT_CLOSE = `close${EVENT_KEY$b}`;
    const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
    const CLASS_NAME_FADE$5 = 'fade';
    const CLASS_NAME_SHOW$8 = 'show';
    /**
     * Class definition
     */

    class Alert extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$f;
      } // Public


      close() {
        const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

        if (closeEvent.defaultPrevented) {
          return;
        }

        this._element.classList.remove(CLASS_NAME_SHOW$8);

        const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);

        this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
      } // Private


      _destroyElement() {
        this._element.remove();

        EventHandler.trigger(this._element, EVENT_CLOSED);
        this.dispose();
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = Alert.getOrCreateInstance(this);

          if (typeof config !== 'string') {
            return;
          }

          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config](this);
        });
      }

    }
    /**
     * Data API implementation
     */


    enableDismissTrigger(Alert, 'close');
    /**
     * jQuery
     */

    defineJQueryPlugin(Alert);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): button.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$e = 'button';
    const DATA_KEY$9 = 'bs.button';
    const EVENT_KEY$a = `.${DATA_KEY$9}`;
    const DATA_API_KEY$6 = '.data-api';
    const CLASS_NAME_ACTIVE$3 = 'active';
    const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
    const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
    /**
     * Class definition
     */

    class Button extends BaseComponent {
      // Getters
      static get NAME() {
        return NAME$e;
      } // Public


      toggle() {
        // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
        this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = Button.getOrCreateInstance(this);

          if (config === 'toggle') {
            data[config]();
          }
        });
      }

    }
    /**
     * Data API implementation
     */


    EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
      event.preventDefault();
      const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
      const data = Button.getOrCreateInstance(button);
      data.toggle();
    });
    /**
     * jQuery
     */

    defineJQueryPlugin(Button);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): dom/selector-engine.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const SelectorEngine = {
      find(selector, element = document.documentElement) {
        return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
      },

      findOne(selector, element = document.documentElement) {
        return Element.prototype.querySelector.call(element, selector);
      },

      children(element, selector) {
        return [].concat(...element.children).filter(child => child.matches(selector));
      },

      parents(element, selector) {
        const parents = [];
        let ancestor = element.parentNode.closest(selector);

        while (ancestor) {
          parents.push(ancestor);
          ancestor = ancestor.parentNode.closest(selector);
        }

        return parents;
      },

      prev(element, selector) {
        let previous = element.previousElementSibling;

        while (previous) {
          if (previous.matches(selector)) {
            return [previous];
          }

          previous = previous.previousElementSibling;
        }

        return [];
      },

      // TODO: this is now unused; remove later along with prev()
      next(element, selector) {
        let next = element.nextElementSibling;

        while (next) {
          if (next.matches(selector)) {
            return [next];
          }

          next = next.nextElementSibling;
        }

        return [];
      },

      focusableChildren(element) {
        const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
        return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
      }

    };

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): util/swipe.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$d = 'swipe';
    const EVENT_KEY$9 = '.bs.swipe';
    const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
    const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
    const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
    const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
    const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
    const POINTER_TYPE_TOUCH = 'touch';
    const POINTER_TYPE_PEN = 'pen';
    const CLASS_NAME_POINTER_EVENT = 'pointer-event';
    const SWIPE_THRESHOLD = 40;
    const Default$c = {
      endCallback: null,
      leftCallback: null,
      rightCallback: null
    };
    const DefaultType$c = {
      endCallback: '(function|null)',
      leftCallback: '(function|null)',
      rightCallback: '(function|null)'
    };
    /**
     * Class definition
     */

    class Swipe extends Config {
      constructor(element, config) {
        super();
        this._element = element;

        if (!element || !Swipe.isSupported()) {
          return;
        }

        this._config = this._getConfig(config);
        this._deltaX = 0;
        this._supportPointerEvents = Boolean(window.PointerEvent);

        this._initEvents();
      } // Getters


      static get Default() {
        return Default$c;
      }

      static get DefaultType() {
        return DefaultType$c;
      }

      static get NAME() {
        return NAME$d;
      } // Public


      dispose() {
        EventHandler.off(this._element, EVENT_KEY$9);
      } // Private


      _start(event) {
        if (!this._supportPointerEvents) {
          this._deltaX = event.touches[0].clientX;
          return;
        }

        if (this._eventIsPointerPenTouch(event)) {
          this._deltaX = event.clientX;
        }
      }

      _end(event) {
        if (this._eventIsPointerPenTouch(event)) {
          this._deltaX = event.clientX - this._deltaX;
        }

        this._handleSwipe();

        execute(this._config.endCallback);
      }

      _move(event) {
        this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
      }

      _handleSwipe() {
        const absDeltaX = Math.abs(this._deltaX);

        if (absDeltaX <= SWIPE_THRESHOLD) {
          return;
        }

        const direction = absDeltaX / this._deltaX;
        this._deltaX = 0;

        if (!direction) {
          return;
        }

        execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
      }

      _initEvents() {
        if (this._supportPointerEvents) {
          EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
          EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));

          this._element.classList.add(CLASS_NAME_POINTER_EVENT);
        } else {
          EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
          EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
          EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
        }
      }

      _eventIsPointerPenTouch(event) {
        return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
      } // Static


      static isSupported() {
        return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      }

    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): carousel.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$c = 'carousel';
    const DATA_KEY$8 = 'bs.carousel';
    const EVENT_KEY$8 = `.${DATA_KEY$8}`;
    const DATA_API_KEY$5 = '.data-api';
    const ARROW_LEFT_KEY$1 = 'ArrowLeft';
    const ARROW_RIGHT_KEY$1 = 'ArrowRight';
    const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

    const ORDER_NEXT = 'next';
    const ORDER_PREV = 'prev';
    const DIRECTION_LEFT = 'left';
    const DIRECTION_RIGHT = 'right';
    const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
    const EVENT_SLID = `slid${EVENT_KEY$8}`;
    const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
    const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
    const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
    const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
    const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
    const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
    const CLASS_NAME_CAROUSEL = 'carousel';
    const CLASS_NAME_ACTIVE$2 = 'active';
    const CLASS_NAME_SLIDE = 'slide';
    const CLASS_NAME_END = 'carousel-item-end';
    const CLASS_NAME_START = 'carousel-item-start';
    const CLASS_NAME_NEXT = 'carousel-item-next';
    const CLASS_NAME_PREV = 'carousel-item-prev';
    const SELECTOR_ACTIVE = '.active';
    const SELECTOR_ITEM = '.carousel-item';
    const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
    const SELECTOR_ITEM_IMG = '.carousel-item img';
    const SELECTOR_INDICATORS = '.carousel-indicators';
    const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
    const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
    const KEY_TO_DIRECTION = {
      [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
      [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
    };
    const Default$b = {
      interval: 5000,
      keyboard: true,
      pause: 'hover',
      ride: false,
      touch: true,
      wrap: true
    };
    const DefaultType$b = {
      interval: '(number|boolean)',
      // TODO:v6 remove boolean support
      keyboard: 'boolean',
      pause: '(string|boolean)',
      ride: '(boolean|string)',
      touch: 'boolean',
      wrap: 'boolean'
    };
    /**
     * Class definition
     */

    class Carousel extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._interval = null;
        this._activeElement = null;
        this._isSliding = false;
        this.touchTimeout = null;
        this._swipeHelper = null;
        this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);

        this._addEventListeners();

        if (this._config.ride === CLASS_NAME_CAROUSEL) {
          this.cycle();
        }
      } // Getters


      static get Default() {
        return Default$b;
      }

      static get DefaultType() {
        return DefaultType$b;
      }

      static get NAME() {
        return NAME$c;
      } // Public


      next() {
        this._slide(ORDER_NEXT);
      }

      nextWhenVisible() {
        // FIXME TODO use `document.visibilityState`
        // Don't call next when the page isn't visible
        // or the carousel or its parent isn't visible
        if (!document.hidden && isVisible(this._element)) {
          this.next();
        }
      }

      prev() {
        this._slide(ORDER_PREV);
      }

      pause() {
        if (this._isSliding) {
          triggerTransitionEnd(this._element);
        }

        this._clearInterval();
      }

      cycle() {
        this._clearInterval();

        this._updateInterval();

        this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
      }

      _maybeEnableCycle() {
        if (!this._config.ride) {
          return;
        }

        if (this._isSliding) {
          EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
          return;
        }

        this.cycle();
      }

      to(index) {
        const items = this._getItems();

        if (index > items.length - 1 || index < 0) {
          return;
        }

        if (this._isSliding) {
          EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
          return;
        }

        const activeIndex = this._getItemIndex(this._getActive());

        if (activeIndex === index) {
          return;
        }

        const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

        this._slide(order, items[index]);
      }

      dispose() {
        if (this._swipeHelper) {
          this._swipeHelper.dispose();
        }

        super.dispose();
      } // Private


      _configAfterMerge(config) {
        config.defaultInterval = config.interval;
        return config;
      }

      _addEventListeners() {
        if (this._config.keyboard) {
          EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
        }

        if (this._config.pause === 'hover') {
          EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
          EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
        }

        if (this._config.touch && Swipe.isSupported()) {
          this._addTouchEventListeners();
        }
      }

      _addTouchEventListeners() {
        for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
          EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
        }

        const endCallBack = () => {
          if (this._config.pause !== 'hover') {
            return;
          } // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling


          this.pause();

          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }

          this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
        };

        const swipeConfig = {
          leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
          rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
          endCallback: endCallBack
        };
        this._swipeHelper = new Swipe(this._element, swipeConfig);
      }

      _keydown(event) {
        if (/input|textarea/i.test(event.target.tagName)) {
          return;
        }

        const direction = KEY_TO_DIRECTION[event.key];

        if (direction) {
          event.preventDefault();

          this._slide(this._directionToOrder(direction));
        }
      }

      _getItemIndex(element) {
        return this._getItems().indexOf(element);
      }

      _setActiveIndicatorElement(index) {
        if (!this._indicatorsElement) {
          return;
        }

        const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
        activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
        activeIndicator.removeAttribute('aria-current');
        const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);

        if (newActiveIndicator) {
          newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
          newActiveIndicator.setAttribute('aria-current', 'true');
        }
      }

      _updateInterval() {
        const element = this._activeElement || this._getActive();

        if (!element) {
          return;
        }

        const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
        this._config.interval = elementInterval || this._config.defaultInterval;
      }

      _slide(order, element = null) {
        if (this._isSliding) {
          return;
        }

        const activeElement = this._getActive();

        const isNext = order === ORDER_NEXT;
        const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);

        if (nextElement === activeElement) {
          return;
        }

        const nextElementIndex = this._getItemIndex(nextElement);

        const triggerEvent = eventName => {
          return EventHandler.trigger(this._element, eventName, {
            relatedTarget: nextElement,
            direction: this._orderToDirection(order),
            from: this._getItemIndex(activeElement),
            to: nextElementIndex
          });
        };

        const slideEvent = triggerEvent(EVENT_SLIDE);

        if (slideEvent.defaultPrevented) {
          return;
        }

        if (!activeElement || !nextElement) {
          // Some weirdness is happening, so we bail
          // todo: change tests that use empty divs to avoid this check
          return;
        }

        const isCycling = Boolean(this._interval);
        this.pause();
        this._isSliding = true;

        this._setActiveIndicatorElement(nextElementIndex);

        this._activeElement = nextElement;
        const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
        const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
        nextElement.classList.add(orderClassName);
        reflow(nextElement);
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);

        const completeCallBack = () => {
          nextElement.classList.remove(directionalClassName, orderClassName);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
          this._isSliding = false;
          triggerEvent(EVENT_SLID);
        };

        this._queueCallback(completeCallBack, activeElement, this._isAnimated());

        if (isCycling) {
          this.cycle();
        }
      }

      _isAnimated() {
        return this._element.classList.contains(CLASS_NAME_SLIDE);
      }

      _getActive() {
        return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
      }

      _getItems() {
        return SelectorEngine.find(SELECTOR_ITEM, this._element);
      }

      _clearInterval() {
        if (this._interval) {
          clearInterval(this._interval);
          this._interval = null;
        }
      }

      _directionToOrder(direction) {
        if (isRTL()) {
          return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
        }

        return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
      }

      _orderToDirection(order) {
        if (isRTL()) {
          return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }

        return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = Carousel.getOrCreateInstance(this, config);

          if (typeof config === 'number') {
            data.to(config);
            return;
          }

          if (typeof config === 'string') {
            if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
              throw new TypeError(`No method named "${config}"`);
            }

            data[config]();
          }
        });
      }

    }
    /**
     * Data API implementation
     */


    EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
      const target = getElementFromSelector(this);

      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
        return;
      }

      event.preventDefault();
      const carousel = Carousel.getOrCreateInstance(target);
      const slideIndex = this.getAttribute('data-bs-slide-to');

      if (slideIndex) {
        carousel.to(slideIndex);

        carousel._maybeEnableCycle();

        return;
      }

      if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
        carousel.next();

        carousel._maybeEnableCycle();

        return;
      }

      carousel.prev();

      carousel._maybeEnableCycle();
    });
    EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
      const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

      for (const carousel of carousels) {
        Carousel.getOrCreateInstance(carousel);
      }
    });
    /**
     * jQuery
     */

    defineJQueryPlugin(Carousel);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): collapse.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$b = 'collapse';
    const DATA_KEY$7 = 'bs.collapse';
    const EVENT_KEY$7 = `.${DATA_KEY$7}`;
    const DATA_API_KEY$4 = '.data-api';
    const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
    const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
    const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
    const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
    const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
    const CLASS_NAME_SHOW$7 = 'show';
    const CLASS_NAME_COLLAPSE = 'collapse';
    const CLASS_NAME_COLLAPSING = 'collapsing';
    const CLASS_NAME_COLLAPSED = 'collapsed';
    const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
    const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
    const WIDTH = 'width';
    const HEIGHT = 'height';
    const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
    const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
    const Default$a = {
      parent: null,
      toggle: true
    };
    const DefaultType$a = {
      parent: '(null|element)',
      toggle: 'boolean'
    };
    /**
     * Class definition
     */

    class Collapse extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._isTransitioning = false;
        this._triggerArray = [];
        const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

        for (const elem of toggleList) {
          const selector = getSelectorFromElement(elem);
          const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);

          if (selector !== null && filterElement.length) {
            this._triggerArray.push(elem);
          }
        }

        this._initializeChildren();

        if (!this._config.parent) {
          this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
        }

        if (this._config.toggle) {
          this.toggle();
        }
      } // Getters


      static get Default() {
        return Default$a;
      }

      static get DefaultType() {
        return DefaultType$a;
      }

      static get NAME() {
        return NAME$b;
      } // Public


      toggle() {
        if (this._isShown()) {
          this.hide();
        } else {
          this.show();
        }
      }

      show() {
        if (this._isTransitioning || this._isShown()) {
          return;
        }

        let activeChildren = []; // find active children

        if (this._config.parent) {
          activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
            toggle: false
          }));
        }

        if (activeChildren.length && activeChildren[0]._isTransitioning) {
          return;
        }

        const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);

        if (startEvent.defaultPrevented) {
          return;
        }

        for (const activeInstance of activeChildren) {
          activeInstance.hide();
        }

        const dimension = this._getDimension();

        this._element.classList.remove(CLASS_NAME_COLLAPSE);

        this._element.classList.add(CLASS_NAME_COLLAPSING);

        this._element.style[dimension] = 0;

        this._addAriaAndCollapsedClass(this._triggerArray, true);

        this._isTransitioning = true;

        const complete = () => {
          this._isTransitioning = false;

          this._element.classList.remove(CLASS_NAME_COLLAPSING);

          this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

          this._element.style[dimension] = '';
          EventHandler.trigger(this._element, EVENT_SHOWN$6);
        };

        const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
        const scrollSize = `scroll${capitalizedDimension}`;

        this._queueCallback(complete, this._element, true);

        this._element.style[dimension] = `${this._element[scrollSize]}px`;
      }

      hide() {
        if (this._isTransitioning || !this._isShown()) {
          return;
        }

        const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);

        if (startEvent.defaultPrevented) {
          return;
        }

        const dimension = this._getDimension();

        this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
        reflow(this._element);

        this._element.classList.add(CLASS_NAME_COLLAPSING);

        this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

        for (const trigger of this._triggerArray) {
          const element = getElementFromSelector(trigger);

          if (element && !this._isShown(element)) {
            this._addAriaAndCollapsedClass([trigger], false);
          }
        }

        this._isTransitioning = true;

        const complete = () => {
          this._isTransitioning = false;

          this._element.classList.remove(CLASS_NAME_COLLAPSING);

          this._element.classList.add(CLASS_NAME_COLLAPSE);

          EventHandler.trigger(this._element, EVENT_HIDDEN$6);
        };

        this._element.style[dimension] = '';

        this._queueCallback(complete, this._element, true);
      }

      _isShown(element = this._element) {
        return element.classList.contains(CLASS_NAME_SHOW$7);
      } // Private


      _configAfterMerge(config) {
        config.toggle = Boolean(config.toggle); // Coerce string values

        config.parent = getElement(config.parent);
        return config;
      }

      _getDimension() {
        return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
      }

      _initializeChildren() {
        if (!this._config.parent) {
          return;
        }

        const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);

        for (const element of children) {
          const selected = getElementFromSelector(element);

          if (selected) {
            this._addAriaAndCollapsedClass([element], this._isShown(selected));
          }
        }
      }

      _getFirstLevelChildren(selector) {
        const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent); // remove children if greater depth

        return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
      }

      _addAriaAndCollapsedClass(triggerArray, isOpen) {
        if (!triggerArray.length) {
          return;
        }

        for (const element of triggerArray) {
          element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
          element.setAttribute('aria-expanded', isOpen);
        }
      } // Static


      static jQueryInterface(config) {
        const _config = {};

        if (typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        return this.each(function () {
          const data = Collapse.getOrCreateInstance(this, _config);

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }

            data[config]();
          }
        });
      }

    }
    /**
     * Data API implementation
     */


    EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
      // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
      if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
        event.preventDefault();
      }

      const selector = getSelectorFromElement(this);
      const selectorElements = SelectorEngine.find(selector);

      for (const element of selectorElements) {
        Collapse.getOrCreateInstance(element, {
          toggle: false
        }).toggle();
      }
    });
    /**
     * jQuery
     */

    defineJQueryPlugin(Collapse);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): dropdown.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$a = 'dropdown';
    const DATA_KEY$6 = 'bs.dropdown';
    const EVENT_KEY$6 = `.${DATA_KEY$6}`;
    const DATA_API_KEY$3 = '.data-api';
    const ESCAPE_KEY$2 = 'Escape';
    const TAB_KEY$1 = 'Tab';
    const ARROW_UP_KEY$1 = 'ArrowUp';
    const ARROW_DOWN_KEY$1 = 'ArrowDown';
    const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

    const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
    const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
    const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
    const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
    const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
    const CLASS_NAME_SHOW$6 = 'show';
    const CLASS_NAME_DROPUP = 'dropup';
    const CLASS_NAME_DROPEND = 'dropend';
    const CLASS_NAME_DROPSTART = 'dropstart';
    const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
    const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
    const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
    const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
    const SELECTOR_MENU = '.dropdown-menu';
    const SELECTOR_NAVBAR = '.navbar';
    const SELECTOR_NAVBAR_NAV = '.navbar-nav';
    const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
    const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
    const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
    const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
    const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
    const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
    const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
    const PLACEMENT_TOPCENTER = 'top';
    const PLACEMENT_BOTTOMCENTER = 'bottom';
    const Default$9 = {
      autoClose: true,
      boundary: 'clippingParents',
      display: 'dynamic',
      offset: [0, 2],
      popperConfig: null,
      reference: 'toggle'
    };
    const DefaultType$9 = {
      autoClose: '(boolean|string)',
      boundary: '(string|element)',
      display: 'string',
      offset: '(array|string|function)',
      popperConfig: '(null|object|function)',
      reference: '(string|element|object)'
    };
    /**
     * Class definition
     */

    class Dropdown extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._popper = null;
        this._parent = this._element.parentNode; // dropdown wrapper
        // todo: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.2/forms/input-group/

        this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
        this._inNavbar = this._detectNavbar();
      } // Getters


      static get Default() {
        return Default$9;
      }

      static get DefaultType() {
        return DefaultType$9;
      }

      static get NAME() {
        return NAME$a;
      } // Public


      toggle() {
        return this._isShown() ? this.hide() : this.show();
      }

      show() {
        if (isDisabled(this._element) || this._isShown()) {
          return;
        }

        const relatedTarget = {
          relatedTarget: this._element
        };
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);

        if (showEvent.defaultPrevented) {
          return;
        }

        this._createPopper(); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


        if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
          for (const element of [].concat(...document.body.children)) {
            EventHandler.on(element, 'mouseover', noop);
          }
        }

        this._element.focus();

        this._element.setAttribute('aria-expanded', true);

        this._menu.classList.add(CLASS_NAME_SHOW$6);

        this._element.classList.add(CLASS_NAME_SHOW$6);

        EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
      }

      hide() {
        if (isDisabled(this._element) || !this._isShown()) {
          return;
        }

        const relatedTarget = {
          relatedTarget: this._element
        };

        this._completeHide(relatedTarget);
      }

      dispose() {
        if (this._popper) {
          this._popper.destroy();
        }

        super.dispose();
      }

      update() {
        this._inNavbar = this._detectNavbar();

        if (this._popper) {
          this._popper.update();
        }
      } // Private


      _completeHide(relatedTarget) {
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);

        if (hideEvent.defaultPrevented) {
          return;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          for (const element of [].concat(...document.body.children)) {
            EventHandler.off(element, 'mouseover', noop);
          }
        }

        if (this._popper) {
          this._popper.destroy();
        }

        this._menu.classList.remove(CLASS_NAME_SHOW$6);

        this._element.classList.remove(CLASS_NAME_SHOW$6);

        this._element.setAttribute('aria-expanded', 'false');

        Manipulator.removeDataAttribute(this._menu, 'popper');
        EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
      }

      _getConfig(config) {
        config = super._getConfig(config);

        if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
          // Popper virtual elements require a getBoundingClientRect method
          throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
        }

        return config;
      }

      _createPopper() {
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
        }

        let referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = this._parent;
        } else if (isElement(this._config.reference)) {
          referenceElement = getElement(this._config.reference);
        } else if (typeof this._config.reference === 'object') {
          referenceElement = this._config.reference;
        }

        const popperConfig = this._getPopperConfig();

        this._popper = createPopper(referenceElement, this._menu, popperConfig);
      }

      _isShown() {
        return this._menu.classList.contains(CLASS_NAME_SHOW$6);
      }

      _getPlacement() {
        const parentDropdown = this._parent;

        if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
          return PLACEMENT_RIGHT;
        }

        if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
          return PLACEMENT_LEFT;
        }

        if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
          return PLACEMENT_TOPCENTER;
        }

        if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
          return PLACEMENT_BOTTOMCENTER;
        } // We need to trim the value because custom properties can also include spaces


        const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

        if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
          return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
        }

        return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
      }

      _detectNavbar() {
        return this._element.closest(SELECTOR_NAVBAR) !== null;
      }

      _getOffset() {
        const {
          offset
        } = this._config;

        if (typeof offset === 'string') {
          return offset.split(',').map(value => Number.parseInt(value, 10));
        }

        if (typeof offset === 'function') {
          return popperData => offset(popperData, this._element);
        }

        return offset;
      }

      _getPopperConfig() {
        const defaultBsPopperConfig = {
          placement: this._getPlacement(),
          modifiers: [{
            name: 'preventOverflow',
            options: {
              boundary: this._config.boundary
            }
          }, {
            name: 'offset',
            options: {
              offset: this._getOffset()
            }
          }]
        }; // Disable Popper if we have a static display or Dropdown is in Navbar

        if (this._inNavbar || this._config.display === 'static') {
          Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // todo:v6 remove

          defaultBsPopperConfig.modifiers = [{
            name: 'applyStyles',
            enabled: false
          }];
        }

        return { ...defaultBsPopperConfig,
          ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
        };
      }

      _selectMenuItem({
        key,
        target
      }) {
        const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));

        if (!items.length) {
          return;
        } // if target isn't included in items (e.g. when expanding the dropdown)
        // allow cycling to get the last item in case key equals ARROW_UP_KEY


        getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = Dropdown.getOrCreateInstance(this, config);

          if (typeof config !== 'string') {
            return;
          }

          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        });
      }

      static clearMenus(event) {
        if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
          return;
        }

        const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);

        for (const toggle of openToggles) {
          const context = Dropdown.getInstance(toggle);

          if (!context || context._config.autoClose === false) {
            continue;
          }

          const composedPath = event.composedPath();
          const isMenuTarget = composedPath.includes(context._menu);

          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
            continue;
          } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
            continue;
          }

          const relatedTarget = {
            relatedTarget: context._element
          };

          if (event.type === 'click') {
            relatedTarget.clickEvent = event;
          }

          context._completeHide(relatedTarget);
        }
      }

      static dataApiKeydownHandler(event) {
        // If not an UP | DOWN | ESCAPE key => not a dropdown command
        // If input/textarea && if key is other than ESCAPE => not a dropdown command
        const isInput = /input|textarea/i.test(event.target.tagName);
        const isEscapeEvent = event.key === ESCAPE_KEY$2;
        const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);

        if (!isUpOrDownEvent && !isEscapeEvent) {
          return;
        }

        if (isInput && !isEscapeEvent) {
          return;
        }

        event.preventDefault(); // todo: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.2/forms/input-group/

        const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
        const instance = Dropdown.getOrCreateInstance(getToggleButton);

        if (isUpOrDownEvent) {
          event.stopPropagation();
          instance.show();

          instance._selectMenuItem(event);

          return;
        }

        if (instance._isShown()) {
          // else is escape and we check if it is shown
          event.stopPropagation();
          instance.hide();
          getToggleButton.focus();
        }
      }

    }
    /**
     * Data API implementation
     */


    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
      event.preventDefault();
      Dropdown.getOrCreateInstance(this).toggle();
    });
    /**
     * jQuery
     */

    defineJQueryPlugin(Dropdown);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): util/scrollBar.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
    const SELECTOR_STICKY_CONTENT = '.sticky-top';
    const PROPERTY_PADDING = 'padding-right';
    const PROPERTY_MARGIN = 'margin-right';
    /**
     * Class definition
     */

    class ScrollBarHelper {
      constructor() {
        this._element = document.body;
      } // Public


      getWidth() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
        const documentWidth = document.documentElement.clientWidth;
        return Math.abs(window.innerWidth - documentWidth);
      }

      hide() {
        const width = this.getWidth();

        this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


        this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


        this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);

        this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
      }

      reset() {
        this._resetElementAttributes(this._element, 'overflow');

        this._resetElementAttributes(this._element, PROPERTY_PADDING);

        this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);

        this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
      }

      isOverflowing() {
        return this.getWidth() > 0;
      } // Private


      _disableOverFlow() {
        this._saveInitialAttribute(this._element, 'overflow');

        this._element.style.overflow = 'hidden';
      }

      _setElementAttributes(selector, styleProperty, callback) {
        const scrollbarWidth = this.getWidth();

        const manipulationCallBack = element => {
          if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
            return;
          }

          this._saveInitialAttribute(element, styleProperty);

          const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
          element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
        };

        this._applyManipulationCallback(selector, manipulationCallBack);
      }

      _saveInitialAttribute(element, styleProperty) {
        const actualValue = element.style.getPropertyValue(styleProperty);

        if (actualValue) {
          Manipulator.setDataAttribute(element, styleProperty, actualValue);
        }
      }

      _resetElementAttributes(selector, styleProperty) {
        const manipulationCallBack = element => {
          const value = Manipulator.getDataAttribute(element, styleProperty); // We only want to remove the property if the value is `null`; the value can also be zero

          if (value === null) {
            element.style.removeProperty(styleProperty);
            return;
          }

          Manipulator.removeDataAttribute(element, styleProperty);
          element.style.setProperty(styleProperty, value);
        };

        this._applyManipulationCallback(selector, manipulationCallBack);
      }

      _applyManipulationCallback(selector, callBack) {
        if (isElement(selector)) {
          callBack(selector);
          return;
        }

        for (const sel of SelectorEngine.find(selector, this._element)) {
          callBack(sel);
        }
      }

    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): util/backdrop.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$9 = 'backdrop';
    const CLASS_NAME_FADE$4 = 'fade';
    const CLASS_NAME_SHOW$5 = 'show';
    const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
    const Default$8 = {
      className: 'modal-backdrop',
      clickCallback: null,
      isAnimated: false,
      isVisible: true,
      // if false, we use the backdrop helper without adding any element to the dom
      rootElement: 'body' // give the choice to place backdrop under different elements

    };
    const DefaultType$8 = {
      className: 'string',
      clickCallback: '(function|null)',
      isAnimated: 'boolean',
      isVisible: 'boolean',
      rootElement: '(element|string)'
    };
    /**
     * Class definition
     */

    class Backdrop extends Config {
      constructor(config) {
        super();
        this._config = this._getConfig(config);
        this._isAppended = false;
        this._element = null;
      } // Getters


      static get Default() {
        return Default$8;
      }

      static get DefaultType() {
        return DefaultType$8;
      }

      static get NAME() {
        return NAME$9;
      } // Public


      show(callback) {
        if (!this._config.isVisible) {
          execute(callback);
          return;
        }

        this._append();

        const element = this._getElement();

        if (this._config.isAnimated) {
          reflow(element);
        }

        element.classList.add(CLASS_NAME_SHOW$5);

        this._emulateAnimation(() => {
          execute(callback);
        });
      }

      hide(callback) {
        if (!this._config.isVisible) {
          execute(callback);
          return;
        }

        this._getElement().classList.remove(CLASS_NAME_SHOW$5);

        this._emulateAnimation(() => {
          this.dispose();
          execute(callback);
        });
      }

      dispose() {
        if (!this._isAppended) {
          return;
        }

        EventHandler.off(this._element, EVENT_MOUSEDOWN);

        this._element.remove();

        this._isAppended = false;
      } // Private


      _getElement() {
        if (!this._element) {
          const backdrop = document.createElement('div');
          backdrop.className = this._config.className;

          if (this._config.isAnimated) {
            backdrop.classList.add(CLASS_NAME_FADE$4);
          }

          this._element = backdrop;
        }

        return this._element;
      }

      _configAfterMerge(config) {
        // use getElement() with the default "body" to get a fresh Element on each instantiation
        config.rootElement = getElement(config.rootElement);
        return config;
      }

      _append() {
        if (this._isAppended) {
          return;
        }

        const element = this._getElement();

        this._config.rootElement.append(element);

        EventHandler.on(element, EVENT_MOUSEDOWN, () => {
          execute(this._config.clickCallback);
        });
        this._isAppended = true;
      }

      _emulateAnimation(callback) {
        executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
      }

    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): util/focustrap.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$8 = 'focustrap';
    const DATA_KEY$5 = 'bs.focustrap';
    const EVENT_KEY$5 = `.${DATA_KEY$5}`;
    const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
    const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
    const TAB_KEY = 'Tab';
    const TAB_NAV_FORWARD = 'forward';
    const TAB_NAV_BACKWARD = 'backward';
    const Default$7 = {
      autofocus: true,
      trapElement: null // The element to trap focus inside of

    };
    const DefaultType$7 = {
      autofocus: 'boolean',
      trapElement: 'element'
    };
    /**
     * Class definition
     */

    class FocusTrap extends Config {
      constructor(config) {
        super();
        this._config = this._getConfig(config);
        this._isActive = false;
        this._lastTabNavDirection = null;
      } // Getters


      static get Default() {
        return Default$7;
      }

      static get DefaultType() {
        return DefaultType$7;
      }

      static get NAME() {
        return NAME$8;
      } // Public


      activate() {
        if (this._isActive) {
          return;
        }

        if (this._config.autofocus) {
          this._config.trapElement.focus();
        }

        EventHandler.off(document, EVENT_KEY$5); // guard against infinite focus loop

        EventHandler.on(document, EVENT_FOCUSIN$2, event => this._handleFocusin(event));
        EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
        this._isActive = true;
      }

      deactivate() {
        if (!this._isActive) {
          return;
        }

        this._isActive = false;
        EventHandler.off(document, EVENT_KEY$5);
      } // Private


      _handleFocusin(event) {
        const {
          trapElement
        } = this._config;

        if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
          return;
        }

        const elements = SelectorEngine.focusableChildren(trapElement);

        if (elements.length === 0) {
          trapElement.focus();
        } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
          elements[elements.length - 1].focus();
        } else {
          elements[0].focus();
        }
      }

      _handleKeydown(event) {
        if (event.key !== TAB_KEY) {
          return;
        }

        this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
      }

    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): modal.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$7 = 'modal';
    const DATA_KEY$4 = 'bs.modal';
    const EVENT_KEY$4 = `.${DATA_KEY$4}`;
    const DATA_API_KEY$2 = '.data-api';
    const ESCAPE_KEY$1 = 'Escape';
    const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
    const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
    const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
    const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
    const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
    const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
    const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
    const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
    const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
    const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
    const CLASS_NAME_OPEN = 'modal-open';
    const CLASS_NAME_FADE$3 = 'fade';
    const CLASS_NAME_SHOW$4 = 'show';
    const CLASS_NAME_STATIC = 'modal-static';
    const OPEN_SELECTOR$1 = '.modal.show';
    const SELECTOR_DIALOG = '.modal-dialog';
    const SELECTOR_MODAL_BODY = '.modal-body';
    const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
    const Default$6 = {
      backdrop: true,
      focus: true,
      keyboard: true
    };
    const DefaultType$6 = {
      backdrop: '(boolean|string)',
      focus: 'boolean',
      keyboard: 'boolean'
    };
    /**
     * Class definition
     */

    class Modal extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
        this._isShown = false;
        this._isTransitioning = false;
        this._scrollBar = new ScrollBarHelper();

        this._addEventListeners();
      } // Getters


      static get Default() {
        return Default$6;
      }

      static get DefaultType() {
        return DefaultType$6;
      }

      static get NAME() {
        return NAME$7;
      } // Public


      toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      }

      show(relatedTarget) {
        if (this._isShown || this._isTransitioning) {
          return;
        }

        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
          relatedTarget
        });

        if (showEvent.defaultPrevented) {
          return;
        }

        this._isShown = true;
        this._isTransitioning = true;

        this._scrollBar.hide();

        document.body.classList.add(CLASS_NAME_OPEN);

        this._adjustDialog();

        this._backdrop.show(() => this._showElement(relatedTarget));
      }

      hide() {
        if (!this._isShown || this._isTransitioning) {
          return;
        }

        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);

        if (hideEvent.defaultPrevented) {
          return;
        }

        this._isShown = false;
        this._isTransitioning = true;

        this._focustrap.deactivate();

        this._element.classList.remove(CLASS_NAME_SHOW$4);

        this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
      }

      dispose() {
        for (const htmlElement of [window, this._dialog]) {
          EventHandler.off(htmlElement, EVENT_KEY$4);
        }

        this._backdrop.dispose();

        this._focustrap.deactivate();

        super.dispose();
      }

      handleUpdate() {
        this._adjustDialog();
      } // Private


      _initializeBackDrop() {
        return new Backdrop({
          isVisible: Boolean(this._config.backdrop),
          // 'static' option will be translated to true, and booleans will keep their value,
          isAnimated: this._isAnimated()
        });
      }

      _initializeFocusTrap() {
        return new FocusTrap({
          trapElement: this._element
        });
      }

      _showElement(relatedTarget) {
        // try to append dynamic modal
        if (!document.body.contains(this._element)) {
          document.body.append(this._element);
        }

        this._element.style.display = 'block';

        this._element.removeAttribute('aria-hidden');

        this._element.setAttribute('aria-modal', true);

        this._element.setAttribute('role', 'dialog');

        this._element.scrollTop = 0;
        const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

        if (modalBody) {
          modalBody.scrollTop = 0;
        }

        reflow(this._element);

        this._element.classList.add(CLASS_NAME_SHOW$4);

        const transitionComplete = () => {
          if (this._config.focus) {
            this._focustrap.activate();
          }

          this._isTransitioning = false;
          EventHandler.trigger(this._element, EVENT_SHOWN$4, {
            relatedTarget
          });
        };

        this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
      }

      _addEventListeners() {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
          if (event.key !== ESCAPE_KEY$1) {
            return;
          }

          if (this._config.keyboard) {
            event.preventDefault();
            this.hide();
            return;
          }

          this._triggerBackdropTransition();
        });
        EventHandler.on(window, EVENT_RESIZE$1, () => {
          if (this._isShown && !this._isTransitioning) {
            this._adjustDialog();
          }
        });
        EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
          // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
          EventHandler.one(this._element, EVENT_CLICK_DISMISS, event2 => {
            if (this._element !== event.target || this._element !== event2.target) {
              return;
            }

            if (this._config.backdrop === 'static') {
              this._triggerBackdropTransition();

              return;
            }

            if (this._config.backdrop) {
              this.hide();
            }
          });
        });
      }

      _hideModal() {
        this._element.style.display = 'none';

        this._element.setAttribute('aria-hidden', true);

        this._element.removeAttribute('aria-modal');

        this._element.removeAttribute('role');

        this._isTransitioning = false;

        this._backdrop.hide(() => {
          document.body.classList.remove(CLASS_NAME_OPEN);

          this._resetAdjustments();

          this._scrollBar.reset();

          EventHandler.trigger(this._element, EVENT_HIDDEN$4);
        });
      }

      _isAnimated() {
        return this._element.classList.contains(CLASS_NAME_FADE$3);
      }

      _triggerBackdropTransition() {
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);

        if (hideEvent.defaultPrevented) {
          return;
        }

        const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
        const initialOverflowY = this._element.style.overflowY; // return if the following background transition hasn't yet completed

        if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
          return;
        }

        if (!isModalOverflowing) {
          this._element.style.overflowY = 'hidden';
        }

        this._element.classList.add(CLASS_NAME_STATIC);

        this._queueCallback(() => {
          this._element.classList.remove(CLASS_NAME_STATIC);

          this._queueCallback(() => {
            this._element.style.overflowY = initialOverflowY;
          }, this._dialog);
        }, this._dialog);

        this._element.focus();
      }
      /**
       * The following methods are used to handle overflowing modals
       */


      _adjustDialog() {
        const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

        const scrollbarWidth = this._scrollBar.getWidth();

        const isBodyOverflowing = scrollbarWidth > 0;

        if (isBodyOverflowing && !isModalOverflowing) {
          const property = isRTL() ? 'paddingLeft' : 'paddingRight';
          this._element.style[property] = `${scrollbarWidth}px`;
        }

        if (!isBodyOverflowing && isModalOverflowing) {
          const property = isRTL() ? 'paddingRight' : 'paddingLeft';
          this._element.style[property] = `${scrollbarWidth}px`;
        }
      }

      _resetAdjustments() {
        this._element.style.paddingLeft = '';
        this._element.style.paddingRight = '';
      } // Static


      static jQueryInterface(config, relatedTarget) {
        return this.each(function () {
          const data = Modal.getOrCreateInstance(this, config);

          if (typeof config !== 'string') {
            return;
          }

          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config](relatedTarget);
        });
      }

    }
    /**
     * Data API implementation
     */


    EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
      const target = getElementFromSelector(this);

      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }

      EventHandler.one(target, EVENT_SHOW$4, showEvent => {
        if (showEvent.defaultPrevented) {
          // only register focus restorer if modal will actually get shown
          return;
        }

        EventHandler.one(target, EVENT_HIDDEN$4, () => {
          if (isVisible(this)) {
            this.focus();
          }
        });
      }); // avoid conflict when clicking modal toggler while another one is open

      const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);

      if (alreadyOpen) {
        Modal.getInstance(alreadyOpen).hide();
      }

      const data = Modal.getOrCreateInstance(target);
      data.toggle(this);
    });
    enableDismissTrigger(Modal);
    /**
     * jQuery
     */

    defineJQueryPlugin(Modal);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): offcanvas.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$6 = 'offcanvas';
    const DATA_KEY$3 = 'bs.offcanvas';
    const EVENT_KEY$3 = `.${DATA_KEY$3}`;
    const DATA_API_KEY$1 = '.data-api';
    const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
    const ESCAPE_KEY = 'Escape';
    const CLASS_NAME_SHOW$3 = 'show';
    const CLASS_NAME_SHOWING$1 = 'showing';
    const CLASS_NAME_HIDING = 'hiding';
    const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
    const OPEN_SELECTOR = '.offcanvas.show';
    const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
    const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
    const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
    const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
    const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
    const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
    const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
    const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
    const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
    const Default$5 = {
      backdrop: true,
      keyboard: true,
      scroll: false
    };
    const DefaultType$5 = {
      backdrop: '(boolean|string)',
      keyboard: 'boolean',
      scroll: 'boolean'
    };
    /**
     * Class definition
     */

    class Offcanvas extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._isShown = false;
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();

        this._addEventListeners();
      } // Getters


      static get Default() {
        return Default$5;
      }

      static get DefaultType() {
        return DefaultType$5;
      }

      static get NAME() {
        return NAME$6;
      } // Public


      toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
      }

      show(relatedTarget) {
        if (this._isShown) {
          return;
        }

        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
          relatedTarget
        });

        if (showEvent.defaultPrevented) {
          return;
        }

        this._isShown = true;

        this._backdrop.show();

        if (!this._config.scroll) {
          new ScrollBarHelper().hide();
        }

        this._element.setAttribute('aria-modal', true);

        this._element.setAttribute('role', 'dialog');

        this._element.classList.add(CLASS_NAME_SHOWING$1);

        const completeCallBack = () => {
          if (!this._config.scroll || this._config.backdrop) {
            this._focustrap.activate();
          }

          this._element.classList.add(CLASS_NAME_SHOW$3);

          this._element.classList.remove(CLASS_NAME_SHOWING$1);

          EventHandler.trigger(this._element, EVENT_SHOWN$3, {
            relatedTarget
          });
        };

        this._queueCallback(completeCallBack, this._element, true);
      }

      hide() {
        if (!this._isShown) {
          return;
        }

        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

        if (hideEvent.defaultPrevented) {
          return;
        }

        this._focustrap.deactivate();

        this._element.blur();

        this._isShown = false;

        this._element.classList.add(CLASS_NAME_HIDING);

        this._backdrop.hide();

        const completeCallback = () => {
          this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);

          this._element.removeAttribute('aria-modal');

          this._element.removeAttribute('role');

          if (!this._config.scroll) {
            new ScrollBarHelper().reset();
          }

          EventHandler.trigger(this._element, EVENT_HIDDEN$3);
        };

        this._queueCallback(completeCallback, this._element, true);
      }

      dispose() {
        this._backdrop.dispose();

        this._focustrap.deactivate();

        super.dispose();
      } // Private


      _initializeBackDrop() {
        const clickCallback = () => {
          if (this._config.backdrop === 'static') {
            EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
            return;
          }

          this.hide();
        }; // 'static' option will be translated to true, and booleans will keep their value


        const isVisible = Boolean(this._config.backdrop);
        return new Backdrop({
          className: CLASS_NAME_BACKDROP,
          isVisible,
          isAnimated: true,
          rootElement: this._element.parentNode,
          clickCallback: isVisible ? clickCallback : null
        });
      }

      _initializeFocusTrap() {
        return new FocusTrap({
          trapElement: this._element
        });
      }

      _addEventListeners() {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
          if (event.key !== ESCAPE_KEY) {
            return;
          }

          if (!this._config.keyboard) {
            EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
            return;
          }

          this.hide();
        });
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = Offcanvas.getOrCreateInstance(this, config);

          if (typeof config !== 'string') {
            return;
          }

          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config](this);
        });
      }

    }
    /**
     * Data API implementation
     */


    EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
      const target = getElementFromSelector(this);

      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }

      if (isDisabled(this)) {
        return;
      }

      EventHandler.one(target, EVENT_HIDDEN$3, () => {
        // focus on trigger when it is closed
        if (isVisible(this)) {
          this.focus();
        }
      }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

      const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

      if (alreadyOpen && alreadyOpen !== target) {
        Offcanvas.getInstance(alreadyOpen).hide();
      }

      const data = Offcanvas.getOrCreateInstance(target);
      data.toggle(this);
    });
    EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
      for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
        Offcanvas.getOrCreateInstance(selector).show();
      }
    });
    EventHandler.on(window, EVENT_RESIZE, () => {
      for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
        if (getComputedStyle(element).position !== 'fixed') {
          Offcanvas.getOrCreateInstance(element).hide();
        }
      }
    });
    enableDismissTrigger(Offcanvas);
    /**
     * jQuery
     */

    defineJQueryPlugin(Offcanvas);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): util/sanitizer.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
    const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shout-out to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
     */

    const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
    /**
     * A pattern that matches safe data URLs. Only matches image, video and audio types.
     *
     * Shout-out to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
     */

    const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

    const allowedAttribute = (attribute, allowedAttributeList) => {
      const attributeName = attribute.nodeName.toLowerCase();

      if (allowedAttributeList.includes(attributeName)) {
        if (uriAttributes.has(attributeName)) {
          return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
        }

        return true;
      } // Check if a regular expression validates the attribute.


      return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
    };

    const DefaultAllowlist = {
      // Global attributes allowed on any supplied element below.
      '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
      a: ['target', 'href', 'title', 'rel'],
      area: [],
      b: [],
      br: [],
      col: [],
      code: [],
      div: [],
      em: [],
      hr: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      i: [],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
      li: [],
      ol: [],
      p: [],
      pre: [],
      s: [],
      small: [],
      span: [],
      sub: [],
      sup: [],
      strong: [],
      u: [],
      ul: []
    };
    function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
      if (!unsafeHtml.length) {
        return unsafeHtml;
      }

      if (sanitizeFunction && typeof sanitizeFunction === 'function') {
        return sanitizeFunction(unsafeHtml);
      }

      const domParser = new window.DOMParser();
      const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
      const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

      for (const element of elements) {
        const elementName = element.nodeName.toLowerCase();

        if (!Object.keys(allowList).includes(elementName)) {
          element.remove();
          continue;
        }

        const attributeList = [].concat(...element.attributes);
        const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);

        for (const attribute of attributeList) {
          if (!allowedAttribute(attribute, allowedAttributes)) {
            element.removeAttribute(attribute.nodeName);
          }
        }
      }

      return createdDocument.body.innerHTML;
    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): util/template-factory.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$5 = 'TemplateFactory';
    const Default$4 = {
      allowList: DefaultAllowlist,
      content: {},
      // { selector : text ,  selector2 : text2 , }
      extraClass: '',
      html: false,
      sanitize: true,
      sanitizeFn: null,
      template: '<div></div>'
    };
    const DefaultType$4 = {
      allowList: 'object',
      content: 'object',
      extraClass: '(string|function)',
      html: 'boolean',
      sanitize: 'boolean',
      sanitizeFn: '(null|function)',
      template: 'string'
    };
    const DefaultContentType = {
      entry: '(string|element|function|null)',
      selector: '(string|element)'
    };
    /**
     * Class definition
     */

    class TemplateFactory extends Config {
      constructor(config) {
        super();
        this._config = this._getConfig(config);
      } // Getters


      static get Default() {
        return Default$4;
      }

      static get DefaultType() {
        return DefaultType$4;
      }

      static get NAME() {
        return NAME$5;
      } // Public


      getContent() {
        return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
      }

      hasContent() {
        return this.getContent().length > 0;
      }

      changeContent(content) {
        this._checkContent(content);

        this._config.content = { ...this._config.content,
          ...content
        };
        return this;
      }

      toHtml() {
        const templateWrapper = document.createElement('div');
        templateWrapper.innerHTML = this._maybeSanitize(this._config.template);

        for (const [selector, text] of Object.entries(this._config.content)) {
          this._setContent(templateWrapper, text, selector);
        }

        const template = templateWrapper.children[0];

        const extraClass = this._resolvePossibleFunction(this._config.extraClass);

        if (extraClass) {
          template.classList.add(...extraClass.split(' '));
        }

        return template;
      } // Private


      _typeCheckConfig(config) {
        super._typeCheckConfig(config);

        this._checkContent(config.content);
      }

      _checkContent(arg) {
        for (const [selector, content] of Object.entries(arg)) {
          super._typeCheckConfig({
            selector,
            entry: content
          }, DefaultContentType);
        }
      }

      _setContent(template, content, selector) {
        const templateElement = SelectorEngine.findOne(selector, template);

        if (!templateElement) {
          return;
        }

        content = this._resolvePossibleFunction(content);

        if (!content) {
          templateElement.remove();
          return;
        }

        if (isElement(content)) {
          this._putElementInTemplate(getElement(content), templateElement);

          return;
        }

        if (this._config.html) {
          templateElement.innerHTML = this._maybeSanitize(content);
          return;
        }

        templateElement.textContent = content;
      }

      _maybeSanitize(arg) {
        return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
      }

      _resolvePossibleFunction(arg) {
        return typeof arg === 'function' ? arg(this) : arg;
      }

      _putElementInTemplate(element, templateElement) {
        if (this._config.html) {
          templateElement.innerHTML = '';
          templateElement.append(element);
          return;
        }

        templateElement.textContent = element.textContent;
      }

    }

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): tooltip.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$4 = 'tooltip';
    const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
    const CLASS_NAME_FADE$2 = 'fade';
    const CLASS_NAME_MODAL = 'modal';
    const CLASS_NAME_SHOW$2 = 'show';
    const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
    const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
    const EVENT_MODAL_HIDE = 'hide.bs.modal';
    const TRIGGER_HOVER = 'hover';
    const TRIGGER_FOCUS = 'focus';
    const TRIGGER_CLICK = 'click';
    const TRIGGER_MANUAL = 'manual';
    const EVENT_HIDE$2 = 'hide';
    const EVENT_HIDDEN$2 = 'hidden';
    const EVENT_SHOW$2 = 'show';
    const EVENT_SHOWN$2 = 'shown';
    const EVENT_INSERTED = 'inserted';
    const EVENT_CLICK$1 = 'click';
    const EVENT_FOCUSIN$1 = 'focusin';
    const EVENT_FOCUSOUT$1 = 'focusout';
    const EVENT_MOUSEENTER = 'mouseenter';
    const EVENT_MOUSELEAVE = 'mouseleave';
    const AttachmentMap = {
      AUTO: 'auto',
      TOP: 'top',
      RIGHT: isRTL() ? 'left' : 'right',
      BOTTOM: 'bottom',
      LEFT: isRTL() ? 'right' : 'left'
    };
    const Default$3 = {
      allowList: DefaultAllowlist,
      animation: true,
      boundary: 'clippingParents',
      container: false,
      customClass: '',
      delay: 0,
      fallbackPlacements: ['top', 'right', 'bottom', 'left'],
      html: false,
      offset: [0, 0],
      placement: 'top',
      popperConfig: null,
      sanitize: true,
      sanitizeFn: null,
      selector: false,
      template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
      title: '',
      trigger: 'hover focus'
    };
    const DefaultType$3 = {
      allowList: 'object',
      animation: 'boolean',
      boundary: '(string|element)',
      container: '(string|element|boolean)',
      customClass: '(string|function)',
      delay: '(number|object)',
      fallbackPlacements: 'array',
      html: 'boolean',
      offset: '(array|string|function)',
      placement: '(string|function)',
      popperConfig: '(null|object|function)',
      sanitize: 'boolean',
      sanitizeFn: '(null|function)',
      selector: '(string|boolean)',
      template: 'string',
      title: '(string|element|function)',
      trigger: 'string'
    };
    /**
     * Class definition
     */

    class Tooltip extends BaseComponent {
      constructor(element, config) {
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
        }

        super(element, config); // Private

        this._isEnabled = true;
        this._timeout = 0;
        this._isHovered = null;
        this._activeTrigger = {};
        this._popper = null;
        this._templateFactory = null;
        this._newContent = null; // Protected

        this.tip = null;

        this._setListeners();

        if (!this._config.selector) {
          this._fixTitle();
        }
      } // Getters


      static get Default() {
        return Default$3;
      }

      static get DefaultType() {
        return DefaultType$3;
      }

      static get NAME() {
        return NAME$4;
      } // Public


      enable() {
        this._isEnabled = true;
      }

      disable() {
        this._isEnabled = false;
      }

      toggleEnabled() {
        this._isEnabled = !this._isEnabled;
      }

      toggle() {
        if (!this._isEnabled) {
          return;
        }

        this._activeTrigger.click = !this._activeTrigger.click;

        if (this._isShown()) {
          this._leave();

          return;
        }

        this._enter();
      }

      dispose() {
        clearTimeout(this._timeout);
        EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

        if (this._element.getAttribute('data-bs-original-title')) {
          this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
        }

        this._disposePopper();

        super.dispose();
      }

      show() {
        if (this._element.style.display === 'none') {
          throw new Error('Please use show on visible elements');
        }

        if (!(this._isWithContent() && this._isEnabled)) {
          return;
        }

        const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
        const shadowRoot = findShadowRoot(this._element);

        const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);

        if (showEvent.defaultPrevented || !isInTheDom) {
          return;
        } // todo v6 remove this OR make it optional


        this._disposePopper();

        const tip = this._getTipElement();

        this._element.setAttribute('aria-describedby', tip.getAttribute('id'));

        const {
          container
        } = this._config;

        if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
          container.append(tip);
          EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
        }

        this._popper = this._createPopper(tip);
        tip.classList.add(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

        if ('ontouchstart' in document.documentElement) {
          for (const element of [].concat(...document.body.children)) {
            EventHandler.on(element, 'mouseover', noop);
          }
        }

        const complete = () => {
          EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));

          if (this._isHovered === false) {
            this._leave();
          }

          this._isHovered = false;
        };

        this._queueCallback(complete, this.tip, this._isAnimated());
      }

      hide() {
        if (!this._isShown()) {
          return;
        }

        const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));

        if (hideEvent.defaultPrevented) {
          return;
        }

        const tip = this._getTipElement();

        tip.classList.remove(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support

        if ('ontouchstart' in document.documentElement) {
          for (const element of [].concat(...document.body.children)) {
            EventHandler.off(element, 'mouseover', noop);
          }
        }

        this._activeTrigger[TRIGGER_CLICK] = false;
        this._activeTrigger[TRIGGER_FOCUS] = false;
        this._activeTrigger[TRIGGER_HOVER] = false;
        this._isHovered = null; // it is a trick to support manual triggering

        const complete = () => {
          if (this._isWithActiveTrigger()) {
            return;
          }

          if (!this._isHovered) {
            this._disposePopper();
          }

          this._element.removeAttribute('aria-describedby');

          EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
        };

        this._queueCallback(complete, this.tip, this._isAnimated());
      }

      update() {
        if (this._popper) {
          this._popper.update();
        }
      } // Protected


      _isWithContent() {
        return Boolean(this._getTitle());
      }

      _getTipElement() {
        if (!this.tip) {
          this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
        }

        return this.tip;
      }

      _createTipElement(content) {
        const tip = this._getTemplateFactory(content).toHtml(); // todo: remove this check on v6


        if (!tip) {
          return null;
        }

        tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2); // todo: on v6 the following can be achieved with CSS only

        tip.classList.add(`bs-${this.constructor.NAME}-auto`);
        const tipId = getUID(this.constructor.NAME).toString();
        tip.setAttribute('id', tipId);

        if (this._isAnimated()) {
          tip.classList.add(CLASS_NAME_FADE$2);
        }

        return tip;
      }

      setContent(content) {
        this._newContent = content;

        if (this._isShown()) {
          this._disposePopper();

          this.show();
        }
      }

      _getTemplateFactory(content) {
        if (this._templateFactory) {
          this._templateFactory.changeContent(content);
        } else {
          this._templateFactory = new TemplateFactory({ ...this._config,
            // the `content` var has to be after `this._config`
            // to override config.content in case of popover
            content,
            extraClass: this._resolvePossibleFunction(this._config.customClass)
          });
        }

        return this._templateFactory;
      }

      _getContentForTemplate() {
        return {
          [SELECTOR_TOOLTIP_INNER]: this._getTitle()
        };
      }

      _getTitle() {
        return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
      } // Private


      _initializeOnDelegatedTarget(event) {
        return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
      }

      _isAnimated() {
        return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
      }

      _isShown() {
        return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
      }

      _createPopper(tip) {
        const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;
        const attachment = AttachmentMap[placement.toUpperCase()];
        return createPopper(this._element, tip, this._getPopperConfig(attachment));
      }

      _getOffset() {
        const {
          offset
        } = this._config;

        if (typeof offset === 'string') {
          return offset.split(',').map(value => Number.parseInt(value, 10));
        }

        if (typeof offset === 'function') {
          return popperData => offset(popperData, this._element);
        }

        return offset;
      }

      _resolvePossibleFunction(arg) {
        return typeof arg === 'function' ? arg.call(this._element) : arg;
      }

      _getPopperConfig(attachment) {
        const defaultBsPopperConfig = {
          placement: attachment,
          modifiers: [{
            name: 'flip',
            options: {
              fallbackPlacements: this._config.fallbackPlacements
            }
          }, {
            name: 'offset',
            options: {
              offset: this._getOffset()
            }
          }, {
            name: 'preventOverflow',
            options: {
              boundary: this._config.boundary
            }
          }, {
            name: 'arrow',
            options: {
              element: `.${this.constructor.NAME}-arrow`
            }
          }, {
            name: 'preSetPlacement',
            enabled: true,
            phase: 'beforeMain',
            fn: data => {
              // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
              // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
              this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
            }
          }]
        };
        return { ...defaultBsPopperConfig,
          ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
        };
      }

      _setListeners() {
        const triggers = this._config.trigger.split(' ');

        for (const trigger of triggers) {
          if (trigger === 'click') {
            EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, event => {
              const context = this._initializeOnDelegatedTarget(event);

              context.toggle();
            });
          } else if (trigger !== TRIGGER_MANUAL) {
            const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
            const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
            EventHandler.on(this._element, eventIn, this._config.selector, event => {
              const context = this._initializeOnDelegatedTarget(event);

              context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;

              context._enter();
            });
            EventHandler.on(this._element, eventOut, this._config.selector, event => {
              const context = this._initializeOnDelegatedTarget(event);

              context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);

              context._leave();
            });
          }
        }

        this._hideModalHandler = () => {
          if (this._element) {
            this.hide();
          }
        };

        EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
      }

      _fixTitle() {
        const title = this._element.getAttribute('title');

        if (!title) {
          return;
        }

        if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
          this._element.setAttribute('aria-label', title);
        }

        this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility


        this._element.removeAttribute('title');
      }

      _enter() {
        if (this._isShown() || this._isHovered) {
          this._isHovered = true;
          return;
        }

        this._isHovered = true;

        this._setTimeout(() => {
          if (this._isHovered) {
            this.show();
          }
        }, this._config.delay.show);
      }

      _leave() {
        if (this._isWithActiveTrigger()) {
          return;
        }

        this._isHovered = false;

        this._setTimeout(() => {
          if (!this._isHovered) {
            this.hide();
          }
        }, this._config.delay.hide);
      }

      _setTimeout(handler, timeout) {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(handler, timeout);
      }

      _isWithActiveTrigger() {
        return Object.values(this._activeTrigger).includes(true);
      }

      _getConfig(config) {
        const dataAttributes = Manipulator.getDataAttributes(this._element);

        for (const dataAttribute of Object.keys(dataAttributes)) {
          if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
            delete dataAttributes[dataAttribute];
          }
        }

        config = { ...dataAttributes,
          ...(typeof config === 'object' && config ? config : {})
        };
        config = this._mergeConfigObj(config);
        config = this._configAfterMerge(config);

        this._typeCheckConfig(config);

        return config;
      }

      _configAfterMerge(config) {
        config.container = config.container === false ? document.body : getElement(config.container);

        if (typeof config.delay === 'number') {
          config.delay = {
            show: config.delay,
            hide: config.delay
          };
        }

        if (typeof config.title === 'number') {
          config.title = config.title.toString();
        }

        if (typeof config.content === 'number') {
          config.content = config.content.toString();
        }

        return config;
      }

      _getDelegateConfig() {
        const config = {};

        for (const key in this._config) {
          if (this.constructor.Default[key] !== this._config[key]) {
            config[key] = this._config[key];
          }
        }

        config.selector = false;
        config.trigger = 'manual'; // In the future can be replaced with:
        // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
        // `Object.fromEntries(keysWithDifferentValues)`

        return config;
      }

      _disposePopper() {
        if (this._popper) {
          this._popper.destroy();

          this._popper = null;
        }

        if (this.tip) {
          this.tip.remove();
          this.tip = null;
        }
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = Tooltip.getOrCreateInstance(this, config);

          if (typeof config !== 'string') {
            return;
          }

          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        });
      }

    }
    /**
     * jQuery
     */


    defineJQueryPlugin(Tooltip);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): popover.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$3 = 'popover';
    const SELECTOR_TITLE = '.popover-header';
    const SELECTOR_CONTENT = '.popover-body';
    const Default$2 = { ...Tooltip.Default,
      content: '',
      offset: [0, 8],
      placement: 'right',
      template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
      trigger: 'click'
    };
    const DefaultType$2 = { ...Tooltip.DefaultType,
      content: '(null|string|element|function)'
    };
    /**
     * Class definition
     */

    class Popover extends Tooltip {
      // Getters
      static get Default() {
        return Default$2;
      }

      static get DefaultType() {
        return DefaultType$2;
      }

      static get NAME() {
        return NAME$3;
      } // Overrides


      _isWithContent() {
        return this._getTitle() || this._getContent();
      } // Private


      _getContentForTemplate() {
        return {
          [SELECTOR_TITLE]: this._getTitle(),
          [SELECTOR_CONTENT]: this._getContent()
        };
      }

      _getContent() {
        return this._resolvePossibleFunction(this._config.content);
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = Popover.getOrCreateInstance(this, config);

          if (typeof config !== 'string') {
            return;
          }

          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        });
      }

    }
    /**
     * jQuery
     */


    defineJQueryPlugin(Popover);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): scrollspy.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$2 = 'scrollspy';
    const DATA_KEY$2 = 'bs.scrollspy';
    const EVENT_KEY$2 = `.${DATA_KEY$2}`;
    const DATA_API_KEY = '.data-api';
    const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
    const EVENT_CLICK = `click${EVENT_KEY$2}`;
    const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
    const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
    const CLASS_NAME_ACTIVE$1 = 'active';
    const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
    const SELECTOR_TARGET_LINKS = '[href]';
    const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
    const SELECTOR_NAV_LINKS = '.nav-link';
    const SELECTOR_NAV_ITEMS = '.nav-item';
    const SELECTOR_LIST_ITEMS = '.list-group-item';
    const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
    const SELECTOR_DROPDOWN = '.dropdown';
    const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
    const Default$1 = {
      offset: null,
      // TODO: v6 @deprecated, keep it for backwards compatibility reasons
      rootMargin: '0px 0px -25%',
      smoothScroll: false,
      target: null,
      threshold: [0.1, 0.5, 1]
    };
    const DefaultType$1 = {
      offset: '(number|null)',
      // TODO v6 @deprecated, keep it for backwards compatibility reasons
      rootMargin: 'string',
      smoothScroll: 'boolean',
      target: 'element',
      threshold: 'array'
    };
    /**
     * Class definition
     */

    class ScrollSpy extends BaseComponent {
      constructor(element, config) {
        super(element, config); // this._element is the observablesContainer and config.target the menu links wrapper

        this._targetLinks = new Map();
        this._observableSections = new Map();
        this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
        this._activeTarget = null;
        this._observer = null;
        this._previousScrollData = {
          visibleEntryTop: 0,
          parentScrollTop: 0
        };
        this.refresh(); // initialize
      } // Getters


      static get Default() {
        return Default$1;
      }

      static get DefaultType() {
        return DefaultType$1;
      }

      static get NAME() {
        return NAME$2;
      } // Public


      refresh() {
        this._initializeTargetsAndObservables();

        this._maybeEnableSmoothScroll();

        if (this._observer) {
          this._observer.disconnect();
        } else {
          this._observer = this._getNewObserver();
        }

        for (const section of this._observableSections.values()) {
          this._observer.observe(section);
        }
      }

      dispose() {
        this._observer.disconnect();

        super.dispose();
      } // Private


      _configAfterMerge(config) {
        // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
        config.target = getElement(config.target) || document.body; // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only

        config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;

        if (typeof config.threshold === 'string') {
          config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
        }

        return config;
      }

      _maybeEnableSmoothScroll() {
        if (!this._config.smoothScroll) {
          return;
        } // unregister any previous listeners


        EventHandler.off(this._config.target, EVENT_CLICK);
        EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
          const observableSection = this._observableSections.get(event.target.hash);

          if (observableSection) {
            event.preventDefault();
            const root = this._rootElement || window;
            const height = observableSection.offsetTop - this._element.offsetTop;

            if (root.scrollTo) {
              root.scrollTo({
                top: height,
                behavior: 'smooth'
              });
              return;
            } // Chrome 60 doesn't support `scrollTo`


            root.scrollTop = height;
          }
        });
      }

      _getNewObserver() {
        const options = {
          root: this._rootElement,
          threshold: this._config.threshold,
          rootMargin: this._config.rootMargin
        };
        return new IntersectionObserver(entries => this._observerCallback(entries), options);
      } // The logic of selection


      _observerCallback(entries) {
        const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);

        const activate = entry => {
          this._previousScrollData.visibleEntryTop = entry.target.offsetTop;

          this._process(targetElement(entry));
        };

        const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
        const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
        this._previousScrollData.parentScrollTop = parentScrollTop;

        for (const entry of entries) {
          if (!entry.isIntersecting) {
            this._activeTarget = null;

            this._clearActiveClass(targetElement(entry));

            continue;
          }

          const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop; // if we are scrolling down, pick the bigger offsetTop

          if (userScrollsDown && entryIsLowerThanPrevious) {
            activate(entry); // if parent isn't scrolled, let's keep the first visible item, breaking the iteration

            if (!parentScrollTop) {
              return;
            }

            continue;
          } // if we are scrolling up, pick the smallest offsetTop


          if (!userScrollsDown && !entryIsLowerThanPrevious) {
            activate(entry);
          }
        }
      }

      _initializeTargetsAndObservables() {
        this._targetLinks = new Map();
        this._observableSections = new Map();
        const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);

        for (const anchor of targetLinks) {
          // ensure that the anchor has an id and is not disabled
          if (!anchor.hash || isDisabled(anchor)) {
            continue;
          }

          const observableSection = SelectorEngine.findOne(anchor.hash, this._element); // ensure that the observableSection exists & is visible

          if (isVisible(observableSection)) {
            this._targetLinks.set(anchor.hash, anchor);

            this._observableSections.set(anchor.hash, observableSection);
          }
        }
      }

      _process(target) {
        if (this._activeTarget === target) {
          return;
        }

        this._clearActiveClass(this._config.target);

        this._activeTarget = target;
        target.classList.add(CLASS_NAME_ACTIVE$1);

        this._activateParents(target);

        EventHandler.trigger(this._element, EVENT_ACTIVATE, {
          relatedTarget: target
        });
      }

      _activateParents(target) {
        // Activate dropdown parents
        if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
          SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
          return;
        }

        for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
            item.classList.add(CLASS_NAME_ACTIVE$1);
          }
        }
      }

      _clearActiveClass(parent) {
        parent.classList.remove(CLASS_NAME_ACTIVE$1);
        const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);

        for (const node of activeNodes) {
          node.classList.remove(CLASS_NAME_ACTIVE$1);
        }
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = ScrollSpy.getOrCreateInstance(this, config);

          if (typeof config !== 'string') {
            return;
          }

          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        });
      }

    }
    /**
     * Data API implementation
     */


    EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
      for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
        ScrollSpy.getOrCreateInstance(spy);
      }
    });
    /**
     * jQuery
     */

    defineJQueryPlugin(ScrollSpy);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): tab.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME$1 = 'tab';
    const DATA_KEY$1 = 'bs.tab';
    const EVENT_KEY$1 = `.${DATA_KEY$1}`;
    const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
    const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
    const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
    const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
    const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
    const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
    const ARROW_LEFT_KEY = 'ArrowLeft';
    const ARROW_RIGHT_KEY = 'ArrowRight';
    const ARROW_UP_KEY = 'ArrowUp';
    const ARROW_DOWN_KEY = 'ArrowDown';
    const CLASS_NAME_ACTIVE = 'active';
    const CLASS_NAME_FADE$1 = 'fade';
    const CLASS_NAME_SHOW$1 = 'show';
    const CLASS_DROPDOWN = 'dropdown';
    const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
    const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
    const NOT_SELECTOR_DROPDOWN_TOGGLE = ':not(.dropdown-toggle)';
    const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
    const SELECTOR_OUTER = '.nav-item, .list-group-item';
    const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
    const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // todo:v6: could be only `tab`

    const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
    const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
    /**
     * Class definition
     */

    class Tab extends BaseComponent {
      constructor(element) {
        super(element);
        this._parent = this._element.closest(SELECTOR_TAB_PANEL);

        if (!this._parent) {
          return; // todo: should Throw exception on v6
          // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
        } // Set up initial aria attributes


        this._setInitialAttributes(this._parent, this._getChildren());

        EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
      } // Getters


      static get NAME() {
        return NAME$1;
      } // Public


      show() {
        // Shows this elem and deactivate the active sibling if exists
        const innerElem = this._element;

        if (this._elemIsActive(innerElem)) {
          return;
        } // Search for active tab on same parent to deactivate it


        const active = this._getActiveElem();

        const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
          relatedTarget: innerElem
        }) : null;
        const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
          relatedTarget: active
        });

        if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
          return;
        }

        this._deactivate(active, innerElem);

        this._activate(innerElem, active);
      } // Private


      _activate(element, relatedElem) {
        if (!element) {
          return;
        }

        element.classList.add(CLASS_NAME_ACTIVE);

        this._activate(getElementFromSelector(element)); // Search and activate/show the proper section


        const complete = () => {
          if (element.getAttribute('role') !== 'tab') {
            element.classList.add(CLASS_NAME_SHOW$1);
            return;
          }

          element.removeAttribute('tabindex');
          element.setAttribute('aria-selected', true);

          this._toggleDropDown(element, true);

          EventHandler.trigger(element, EVENT_SHOWN$1, {
            relatedTarget: relatedElem
          });
        };

        this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
      }

      _deactivate(element, relatedElem) {
        if (!element) {
          return;
        }

        element.classList.remove(CLASS_NAME_ACTIVE);
        element.blur();

        this._deactivate(getElementFromSelector(element)); // Search and deactivate the shown section too


        const complete = () => {
          if (element.getAttribute('role') !== 'tab') {
            element.classList.remove(CLASS_NAME_SHOW$1);
            return;
          }

          element.setAttribute('aria-selected', false);
          element.setAttribute('tabindex', '-1');

          this._toggleDropDown(element, false);

          EventHandler.trigger(element, EVENT_HIDDEN$1, {
            relatedTarget: relatedElem
          });
        };

        this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
      }

      _keydown(event) {
        if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key)) {
          return;
        }

        event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page

        event.preventDefault();
        const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
        const nextActiveElement = getNextActiveElement(this._getChildren().filter(element => !isDisabled(element)), event.target, isNext, true);

        if (nextActiveElement) {
          nextActiveElement.focus({
            preventScroll: true
          });
          Tab.getOrCreateInstance(nextActiveElement).show();
        }
      }

      _getChildren() {
        // collection of inner elements
        return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
      }

      _getActiveElem() {
        return this._getChildren().find(child => this._elemIsActive(child)) || null;
      }

      _setInitialAttributes(parent, children) {
        this._setAttributeIfNotExists(parent, 'role', 'tablist');

        for (const child of children) {
          this._setInitialAttributesOnChild(child);
        }
      }

      _setInitialAttributesOnChild(child) {
        child = this._getInnerElement(child);

        const isActive = this._elemIsActive(child);

        const outerElem = this._getOuterElement(child);

        child.setAttribute('aria-selected', isActive);

        if (outerElem !== child) {
          this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
        }

        if (!isActive) {
          child.setAttribute('tabindex', '-1');
        }

        this._setAttributeIfNotExists(child, 'role', 'tab'); // set attributes to the related panel too


        this._setInitialAttributesOnTargetPanel(child);
      }

      _setInitialAttributesOnTargetPanel(child) {
        const target = getElementFromSelector(child);

        if (!target) {
          return;
        }

        this._setAttributeIfNotExists(target, 'role', 'tabpanel');

        if (child.id) {
          this._setAttributeIfNotExists(target, 'aria-labelledby', `#${child.id}`);
        }
      }

      _toggleDropDown(element, open) {
        const outerElem = this._getOuterElement(element);

        if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
          return;
        }

        const toggle = (selector, className) => {
          const element = SelectorEngine.findOne(selector, outerElem);

          if (element) {
            element.classList.toggle(className, open);
          }
        };

        toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
        toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
        outerElem.setAttribute('aria-expanded', open);
      }

      _setAttributeIfNotExists(element, attribute, value) {
        if (!element.hasAttribute(attribute)) {
          element.setAttribute(attribute, value);
        }
      }

      _elemIsActive(elem) {
        return elem.classList.contains(CLASS_NAME_ACTIVE);
      } // Try to get the inner element (usually the .nav-link)


      _getInnerElement(elem) {
        return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
      } // Try to get the outer element (usually the .nav-item)


      _getOuterElement(elem) {
        return elem.closest(SELECTOR_OUTER) || elem;
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = Tab.getOrCreateInstance(this);

          if (typeof config !== 'string') {
            return;
          }

          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        });
      }

    }
    /**
     * Data API implementation
     */


    EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }

      if (isDisabled(this)) {
        return;
      }

      Tab.getOrCreateInstance(this).show();
    });
    /**
     * Initialize on focus
     */

    EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
      for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
        Tab.getOrCreateInstance(element);
      }
    });
    /**
     * jQuery
     */

    defineJQueryPlugin(Tab);

    /**
     * --------------------------------------------------------------------------
     * Bootstrap (v5.2.3): toast.js
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
     * --------------------------------------------------------------------------
     */
    /**
     * Constants
     */

    const NAME = 'toast';
    const DATA_KEY = 'bs.toast';
    const EVENT_KEY = `.${DATA_KEY}`;
    const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
    const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
    const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
    const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
    const EVENT_HIDE = `hide${EVENT_KEY}`;
    const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
    const EVENT_SHOW = `show${EVENT_KEY}`;
    const EVENT_SHOWN = `shown${EVENT_KEY}`;
    const CLASS_NAME_FADE = 'fade';
    const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

    const CLASS_NAME_SHOW = 'show';
    const CLASS_NAME_SHOWING = 'showing';
    const DefaultType = {
      animation: 'boolean',
      autohide: 'boolean',
      delay: 'number'
    };
    const Default = {
      animation: true,
      autohide: true,
      delay: 5000
    };
    /**
     * Class definition
     */

    class Toast extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._timeout = null;
        this._hasMouseInteraction = false;
        this._hasKeyboardInteraction = false;

        this._setListeners();
      } // Getters


      static get Default() {
        return Default;
      }

      static get DefaultType() {
        return DefaultType;
      }

      static get NAME() {
        return NAME;
      } // Public


      show() {
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

        if (showEvent.defaultPrevented) {
          return;
        }

        this._clearTimeout();

        if (this._config.animation) {
          this._element.classList.add(CLASS_NAME_FADE);
        }

        const complete = () => {
          this._element.classList.remove(CLASS_NAME_SHOWING);

          EventHandler.trigger(this._element, EVENT_SHOWN);

          this._maybeScheduleHide();
        };

        this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated


        reflow(this._element);

        this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);

        this._queueCallback(complete, this._element, this._config.animation);
      }

      hide() {
        if (!this.isShown()) {
          return;
        }

        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

        if (hideEvent.defaultPrevented) {
          return;
        }

        const complete = () => {
          this._element.classList.add(CLASS_NAME_HIDE); // @deprecated


          this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);

          EventHandler.trigger(this._element, EVENT_HIDDEN);
        };

        this._element.classList.add(CLASS_NAME_SHOWING);

        this._queueCallback(complete, this._element, this._config.animation);
      }

      dispose() {
        this._clearTimeout();

        if (this.isShown()) {
          this._element.classList.remove(CLASS_NAME_SHOW);
        }

        super.dispose();
      }

      isShown() {
        return this._element.classList.contains(CLASS_NAME_SHOW);
      } // Private


      _maybeScheduleHide() {
        if (!this._config.autohide) {
          return;
        }

        if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
          return;
        }

        this._timeout = setTimeout(() => {
          this.hide();
        }, this._config.delay);
      }

      _onInteraction(event, isInteracting) {
        switch (event.type) {
          case 'mouseover':
          case 'mouseout':
            {
              this._hasMouseInteraction = isInteracting;
              break;
            }

          case 'focusin':
          case 'focusout':
            {
              this._hasKeyboardInteraction = isInteracting;
              break;
            }
        }

        if (isInteracting) {
          this._clearTimeout();

          return;
        }

        const nextElement = event.relatedTarget;

        if (this._element === nextElement || this._element.contains(nextElement)) {
          return;
        }

        this._maybeScheduleHide();
      }

      _setListeners() {
        EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
        EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
        EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
        EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
      }

      _clearTimeout() {
        clearTimeout(this._timeout);
        this._timeout = null;
      } // Static


      static jQueryInterface(config) {
        return this.each(function () {
          const data = Toast.getOrCreateInstance(this, config);

          if (typeof config === 'string') {
            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }

            data[config](this);
          }
        });
      }

    }
    /**
     * Data API implementation
     */


    enableDismissTrigger(Toast);
    /**
     * jQuery
     */

    defineJQueryPlugin(Toast);

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let aBtn = writable(
        localStorage.getItem('aBtn') || "1"
    );
    aBtn.subscribe(value => {
        localStorage.setItem('aBtn', value);
    }); 

    let currentPage = writable(
        localStorage.getItem('currentPage') || "Home"
    );
    currentPage.subscribe(value => {
        localStorage.setItem('currentPage', value);
    });

    function syncPageBtn(aBtn, currentPage) {
        if (localStorage.getItem('aBtn') == 1)
            currentPage.set('Home');
        else if (localStorage.getItem('aBtn') == 2)
            currentPage.set('About');
        else if (localStorage.getItem('aBtn') == 3)
            currentPage.set('Admissions');
        else if (localStorage.getItem('aBtn') == 4)
            currentPage.set('Contact');
        else if (localStorage.getItem('aBtn') == 5)
            currentPage.set('Academics');
        else if (localStorage.getItem('aBtn') == 6)
            currentPage.set('Student');
        else if (localStorage.getItem('aBtn') == 7)
            currentPage.set('Careers');
        else if (localStorage.getItem('aBtn') == 8)
            currentPage.set('News');
        else if (localStorage.getItem('aBtn') == 9) ////
            currentPage.set('Apply');
        else if (localStorage.getItem('aBtn') == 10)
            currentPage.set('Campus');
        else if (localStorage.getItem('aBtn') == 11)
            currentPage.set('Faculty');
        else if (localStorage.getItem('aBtn') == 12)
            currentPage.set('Library');
        else if (localStorage.getItem('aBtn') == 13)
            currentPage.set('Map');
        else if (localStorage.getItem('aBtn') == 14)
            currentPage.set('StudentP');
        else if (localStorage.getItem('aBtn') == 15)
            currentPage.set('PrivacyP');
        else if (localStorage.getItem('aBtn') == 16) ////
            currentPage.set('Login');
        else if (localStorage.getItem('aBtn') == 17)
            currentPage.set('LoggedIn');
    }

    /* src\lib\components\layout\popupNav.svelte generated by Svelte v3.55.1 */
    const file$o = "src\\lib\\components\\layout\\popupNav.svelte";

    // (115:39) 
    function create_if_block_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("hi");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(115:39) ",
    		ctx
    	});

    	return block;
    }

    // (59:16) {#if width >= 1200}
    function create_if_block$3(ctx) {
    	let div1;
    	let a0;
    	let t1;
    	let div0;
    	let a1;
    	let t3;
    	let a2;
    	let t5;
    	let a3;
    	let t7;
    	let a4;
    	let t9;
    	let a5;
    	let t11;
    	let a6;
    	let t13;
    	let div3;
    	let a7;
    	let t15;
    	let div2;
    	let a8;
    	let t17;
    	let a9;
    	let t19;
    	let a10;
    	let t21;
    	let a11;
    	let t23;
    	let a12;
    	let t25;
    	let a13;
    	let t27;
    	let div5;
    	let a14;
    	let t29;
    	let div4;
    	let a15;
    	let t31;
    	let a16;
    	let t33;
    	let a17;
    	let t35;
    	let a18;
    	let t37;
    	let a19;
    	let t39;
    	let a20;
    	let t41;
    	let div7;
    	let a21;
    	let t43;
    	let div6;
    	let a22;
    	let t45;
    	let a23;
    	let t47;
    	let a24;
    	let t49;
    	let a25;
    	let t51;
    	let a26;
    	let t53;
    	let a27;
    	let t55;
    	let div9;
    	let a28;
    	let t57;
    	let div8;
    	let a29;
    	let t59;
    	let a30;
    	let t61;
    	let a31;
    	let t63;
    	let a32;
    	let t65;
    	let a33;
    	let t67;
    	let a34;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t1 = space();
    			div0 = element("div");
    			a1 = element("a");
    			a1.textContent = "Lorem";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "Lorem";
    			t5 = space();
    			a3 = element("a");
    			a3.textContent = "Lorem";
    			t7 = space();
    			a4 = element("a");
    			a4.textContent = "Lorem";
    			t9 = space();
    			a5 = element("a");
    			a5.textContent = "Lorem";
    			t11 = space();
    			a6 = element("a");
    			a6.textContent = "Lorem";
    			t13 = space();
    			div3 = element("div");
    			a7 = element("a");
    			a7.textContent = "About Us";
    			t15 = space();
    			div2 = element("div");
    			a8 = element("a");
    			a8.textContent = "Lorem";
    			t17 = space();
    			a9 = element("a");
    			a9.textContent = "Lorem";
    			t19 = space();
    			a10 = element("a");
    			a10.textContent = "Lorem";
    			t21 = space();
    			a11 = element("a");
    			a11.textContent = "Lorem";
    			t23 = space();
    			a12 = element("a");
    			a12.textContent = "Lorem";
    			t25 = space();
    			a13 = element("a");
    			a13.textContent = "Lorem";
    			t27 = space();
    			div5 = element("div");
    			a14 = element("a");
    			a14.textContent = "Admissions";
    			t29 = space();
    			div4 = element("div");
    			a15 = element("a");
    			a15.textContent = "Lorem";
    			t31 = space();
    			a16 = element("a");
    			a16.textContent = "Lorem";
    			t33 = space();
    			a17 = element("a");
    			a17.textContent = "Lorem";
    			t35 = space();
    			a18 = element("a");
    			a18.textContent = "Lorem";
    			t37 = space();
    			a19 = element("a");
    			a19.textContent = "Lorem";
    			t39 = space();
    			a20 = element("a");
    			a20.textContent = "Lorem";
    			t41 = space();
    			div7 = element("div");
    			a21 = element("a");
    			a21.textContent = "Academics";
    			t43 = space();
    			div6 = element("div");
    			a22 = element("a");
    			a22.textContent = "Lorem";
    			t45 = space();
    			a23 = element("a");
    			a23.textContent = "Lorem";
    			t47 = space();
    			a24 = element("a");
    			a24.textContent = "Lorem";
    			t49 = space();
    			a25 = element("a");
    			a25.textContent = "Lorem";
    			t51 = space();
    			a26 = element("a");
    			a26.textContent = "Lorem";
    			t53 = space();
    			a27 = element("a");
    			a27.textContent = "Lorem";
    			t55 = space();
    			div9 = element("div");
    			a28 = element("a");
    			a28.textContent = "Campus";
    			t57 = space();
    			div8 = element("div");
    			a29 = element("a");
    			a29.textContent = "Lorem";
    			t59 = space();
    			a30 = element("a");
    			a30.textContent = "Lorem";
    			t61 = space();
    			a31 = element("a");
    			a31.textContent = "Lorem";
    			t63 = space();
    			a32 = element("a");
    			a32.textContent = "Lorem";
    			t65 = space();
    			a33 = element("a");
    			a33.textContent = "Lorem";
    			t67 = space();
    			a34 = element("a");
    			a34.textContent = "Lorem";
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "h2 svelte-8suegs");
    			add_location(a0, file$o, 60, 24, 3160);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "svelte-8suegs");
    			add_location(a1, file$o, 62, 28, 3269);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "svelte-8suegs");
    			add_location(a2, file$o, 63, 28, 3320);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "svelte-8suegs");
    			add_location(a3, file$o, 64, 28, 3371);
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "class", "svelte-8suegs");
    			add_location(a4, file$o, 65, 28, 3422);
    			attr_dev(a5, "href", "/");
    			attr_dev(a5, "class", "svelte-8suegs");
    			add_location(a5, file$o, 66, 28, 3473);
    			attr_dev(a6, "href", "/");
    			attr_dev(a6, "class", "svelte-8suegs");
    			add_location(a6, file$o, 67, 28, 3524);
    			attr_dev(div0, "class", "linkList svelte-8suegs");
    			add_location(div0, file$o, 61, 24, 3217);
    			attr_dev(div1, "class", "section1 section svelte-8suegs");
    			add_location(div1, file$o, 59, 20, 3104);
    			attr_dev(a7, "href", "/");
    			attr_dev(a7, "class", "h2 svelte-8suegs");
    			add_location(a7, file$o, 71, 24, 3683);
    			attr_dev(a8, "href", "/");
    			attr_dev(a8, "class", "svelte-8suegs");
    			add_location(a8, file$o, 73, 28, 3796);
    			attr_dev(a9, "href", "/");
    			attr_dev(a9, "class", "svelte-8suegs");
    			add_location(a9, file$o, 74, 28, 3847);
    			attr_dev(a10, "href", "/");
    			attr_dev(a10, "class", "svelte-8suegs");
    			add_location(a10, file$o, 75, 28, 3898);
    			attr_dev(a11, "href", "/");
    			attr_dev(a11, "class", "svelte-8suegs");
    			add_location(a11, file$o, 76, 28, 3949);
    			attr_dev(a12, "href", "/");
    			attr_dev(a12, "class", "svelte-8suegs");
    			add_location(a12, file$o, 77, 28, 4000);
    			attr_dev(a13, "href", "/");
    			attr_dev(a13, "class", "svelte-8suegs");
    			add_location(a13, file$o, 78, 28, 4051);
    			attr_dev(div2, "class", "linkList svelte-8suegs");
    			add_location(div2, file$o, 72, 24, 3744);
    			attr_dev(div3, "class", "section2 section svelte-8suegs");
    			add_location(div3, file$o, 70, 20, 3627);
    			attr_dev(a14, "href", "/");
    			attr_dev(a14, "class", "h2 svelte-8suegs");
    			add_location(a14, file$o, 82, 24, 4210);
    			attr_dev(a15, "href", "/");
    			attr_dev(a15, "class", "svelte-8suegs");
    			add_location(a15, file$o, 84, 28, 4325);
    			attr_dev(a16, "href", "/");
    			attr_dev(a16, "class", "svelte-8suegs");
    			add_location(a16, file$o, 85, 28, 4376);
    			attr_dev(a17, "href", "/");
    			attr_dev(a17, "class", "svelte-8suegs");
    			add_location(a17, file$o, 86, 28, 4427);
    			attr_dev(a18, "href", "/");
    			attr_dev(a18, "class", "svelte-8suegs");
    			add_location(a18, file$o, 87, 28, 4478);
    			attr_dev(a19, "href", "/");
    			attr_dev(a19, "class", "svelte-8suegs");
    			add_location(a19, file$o, 88, 28, 4529);
    			attr_dev(a20, "href", "/");
    			attr_dev(a20, "class", "svelte-8suegs");
    			add_location(a20, file$o, 89, 28, 4580);
    			attr_dev(div4, "class", "linkList svelte-8suegs");
    			add_location(div4, file$o, 83, 24, 4273);
    			attr_dev(div5, "class", "section3 section svelte-8suegs");
    			add_location(div5, file$o, 81, 20, 4154);
    			attr_dev(a21, "href", "/");
    			attr_dev(a21, "class", "h2 svelte-8suegs");
    			add_location(a21, file$o, 93, 24, 4739);
    			attr_dev(a22, "href", "/");
    			attr_dev(a22, "class", "svelte-8suegs");
    			add_location(a22, file$o, 95, 28, 4853);
    			attr_dev(a23, "href", "/");
    			attr_dev(a23, "class", "svelte-8suegs");
    			add_location(a23, file$o, 96, 28, 4904);
    			attr_dev(a24, "href", "/");
    			attr_dev(a24, "class", "svelte-8suegs");
    			add_location(a24, file$o, 97, 28, 4955);
    			attr_dev(a25, "href", "/");
    			attr_dev(a25, "class", "svelte-8suegs");
    			add_location(a25, file$o, 98, 28, 5006);
    			attr_dev(a26, "href", "/");
    			attr_dev(a26, "class", "svelte-8suegs");
    			add_location(a26, file$o, 99, 28, 5057);
    			attr_dev(a27, "href", "/");
    			attr_dev(a27, "class", "svelte-8suegs");
    			add_location(a27, file$o, 100, 28, 5108);
    			attr_dev(div6, "class", "linkList svelte-8suegs");
    			add_location(div6, file$o, 94, 24, 4801);
    			attr_dev(div7, "class", "section4 section svelte-8suegs");
    			add_location(div7, file$o, 92, 20, 4683);
    			attr_dev(a28, "href", "/");
    			attr_dev(a28, "class", "h2 svelte-8suegs");
    			add_location(a28, file$o, 104, 24, 5267);
    			attr_dev(a29, "href", "/");
    			attr_dev(a29, "class", "svelte-8suegs");
    			add_location(a29, file$o, 106, 28, 5378);
    			attr_dev(a30, "href", "/");
    			attr_dev(a30, "class", "svelte-8suegs");
    			add_location(a30, file$o, 107, 28, 5429);
    			attr_dev(a31, "href", "/");
    			attr_dev(a31, "class", "svelte-8suegs");
    			add_location(a31, file$o, 108, 28, 5480);
    			attr_dev(a32, "href", "/");
    			attr_dev(a32, "class", "svelte-8suegs");
    			add_location(a32, file$o, 109, 28, 5531);
    			attr_dev(a33, "href", "/");
    			attr_dev(a33, "class", "svelte-8suegs");
    			add_location(a33, file$o, 110, 28, 5582);
    			attr_dev(a34, "href", "/");
    			attr_dev(a34, "class", "svelte-8suegs");
    			add_location(a34, file$o, 111, 28, 5633);
    			attr_dev(div8, "class", "linkList svelte-8suegs");
    			add_location(div8, file$o, 105, 24, 5326);
    			attr_dev(div9, "class", "section5 section svelte-8suegs");
    			add_location(div9, file$o, 103, 20, 5211);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, a1);
    			append_dev(div0, t3);
    			append_dev(div0, a2);
    			append_dev(div0, t5);
    			append_dev(div0, a3);
    			append_dev(div0, t7);
    			append_dev(div0, a4);
    			append_dev(div0, t9);
    			append_dev(div0, a5);
    			append_dev(div0, t11);
    			append_dev(div0, a6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, a7);
    			append_dev(div3, t15);
    			append_dev(div3, div2);
    			append_dev(div2, a8);
    			append_dev(div2, t17);
    			append_dev(div2, a9);
    			append_dev(div2, t19);
    			append_dev(div2, a10);
    			append_dev(div2, t21);
    			append_dev(div2, a11);
    			append_dev(div2, t23);
    			append_dev(div2, a12);
    			append_dev(div2, t25);
    			append_dev(div2, a13);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, a14);
    			append_dev(div5, t29);
    			append_dev(div5, div4);
    			append_dev(div4, a15);
    			append_dev(div4, t31);
    			append_dev(div4, a16);
    			append_dev(div4, t33);
    			append_dev(div4, a17);
    			append_dev(div4, t35);
    			append_dev(div4, a18);
    			append_dev(div4, t37);
    			append_dev(div4, a19);
    			append_dev(div4, t39);
    			append_dev(div4, a20);
    			insert_dev(target, t41, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, a21);
    			append_dev(div7, t43);
    			append_dev(div7, div6);
    			append_dev(div6, a22);
    			append_dev(div6, t45);
    			append_dev(div6, a23);
    			append_dev(div6, t47);
    			append_dev(div6, a24);
    			append_dev(div6, t49);
    			append_dev(div6, a25);
    			append_dev(div6, t51);
    			append_dev(div6, a26);
    			append_dev(div6, t53);
    			append_dev(div6, a27);
    			insert_dev(target, t55, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, a28);
    			append_dev(div9, t57);
    			append_dev(div9, div8);
    			append_dev(div8, a29);
    			append_dev(div8, t59);
    			append_dev(div8, a30);
    			append_dev(div8, t61);
    			append_dev(div8, a31);
    			append_dev(div8, t63);
    			append_dev(div8, a32);
    			append_dev(div8, t65);
    			append_dev(div8, a33);
    			append_dev(div8, t67);
    			append_dev(div8, a34);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t55);
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(59:16) {#if width >= 1200}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div13;
    	let div7;
    	let div0;
    	let a0;
    	let t1;
    	let a1;
    	let t3;
    	let a2;
    	let t5;
    	let a3;
    	let t7;
    	let div5;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let div4;
    	let div2;
    	let a4;
    	let t10;
    	let a5;
    	let t12;
    	let a6;
    	let t14;
    	let a7;
    	let t16;
    	let div3;
    	let button;
    	let i0;
    	let t17;
    	let div6;
    	let a8;
    	let img1;
    	let img1_src_value;
    	let t18;
    	let div12;
    	let div11;
    	let hr;
    	let t19;
    	let div9;
    	let div8;
    	let input;
    	let t20;
    	let i1;
    	let t21;
    	let div10;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[2]);

    	function select_block_type(ctx, dirty) {
    		if (/*width*/ ctx[1] >= 1200) return create_if_block$3;
    		if (/*width*/ ctx[1] < 1200) return create_if_block_1$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			div7 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Academics";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "Student Life";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "Career Services";
    			t5 = space();
    			a3 = element("a");
    			a3.textContent = "News & Events";
    			t7 = space();
    			div5 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t8 = space();
    			div4 = element("div");
    			div2 = element("div");
    			a4 = element("a");
    			a4.textContent = "Home";
    			t10 = space();
    			a5 = element("a");
    			a5.textContent = "About Us";
    			t12 = space();
    			a6 = element("a");
    			a6.textContent = "Admissions";
    			t14 = space();
    			a7 = element("a");
    			a7.textContent = "Contact Us";
    			t16 = space();
    			div3 = element("div");
    			button = element("button");
    			i0 = element("i");
    			t17 = space();
    			div6 = element("div");
    			a8 = element("a");
    			img1 = element("img");
    			t18 = space();
    			div12 = element("div");
    			div11 = element("div");
    			hr = element("hr");
    			t19 = space();
    			div9 = element("div");
    			div8 = element("div");
    			input = element("input");
    			t20 = space();
    			i1 = element("i");
    			t21 = space();
    			div10 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-8suegs");
    			toggle_class(a0, "activeU", localStorage.getItem('aBtn') == 5);
    			add_location(a0, file$o, 13, 12, 322);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "svelte-8suegs");
    			toggle_class(a1, "activeU", localStorage.getItem('aBtn') == 6);
    			add_location(a1, file$o, 14, 12, 488);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "svelte-8suegs");
    			toggle_class(a2, "activeU", localStorage.getItem('aBtn') == 7);
    			add_location(a2, file$o, 15, 12, 655);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "svelte-8suegs");
    			toggle_class(a3, "activeU", localStorage.getItem('aBtn') == 8);
    			add_location(a3, file$o, 16, 12, 825);
    			attr_dev(div0, "class", "upper svelte-8suegs");
    			attr_dev(div0, "style", "");
    			add_location(div0, file$o, 12, 8, 280);
    			attr_dev(img0, "class", "title1 svelte-8suegs");
    			if (!src_url_equal(img0.src, img0_src_value = "assets/title/titleWhite1.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$o, 20, 16, 1080);
    			attr_dev(div1, "class", "navTitleLower svelte-8suegs");
    			add_location(div1, file$o, 19, 12, 1035);
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "class", "svelte-8suegs");
    			toggle_class(a4, "activeU", localStorage.getItem('aBtn') == 1);
    			add_location(a4, file$o, 25, 20, 1273);
    			attr_dev(a5, "href", "/");
    			attr_dev(a5, "class", "svelte-8suegs");
    			toggle_class(a5, "activeU", localStorage.getItem('aBtn') == 2);
    			add_location(a5, file$o, 26, 20, 1437);
    			attr_dev(a6, "href", "/");
    			attr_dev(a6, "class", "svelte-8suegs");
    			toggle_class(a6, "activeU", localStorage.getItem('aBtn') == 3);
    			add_location(a6, file$o, 27, 20, 1606);
    			attr_dev(a7, "href", "/");
    			attr_dev(a7, "class", "svelte-8suegs");
    			toggle_class(a7, "activeU", localStorage.getItem('aBtn') == 4);
    			add_location(a7, file$o, 28, 20, 1782);
    			attr_dev(div2, "class", "navLinksLower svelte-8suegs");
    			add_location(div2, file$o, 24, 16, 1224);
    			attr_dev(i0, "class", "fa fa-times");
    			set_style(i0, "font-size", "x-large");
    			add_location(i0, file$o, 34, 24, 2201);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "searchModalBtn svelte-8suegs");
    			attr_dev(button, "data-bs-dismiss", "modal");
    			attr_dev(button, "aria-label", "Close");
    			add_location(button, file$o, 33, 20, 2087);
    			attr_dev(div3, "class", "searchModal");
    			add_location(div3, file$o, 31, 16, 1989);
    			set_style(div4, "display", "flex");
    			add_location(div4, file$o, 23, 12, 1178);
    			attr_dev(div5, "class", "lower svelte-8suegs");
    			add_location(div5, file$o, 18, 8, 1002);
    			if (!src_url_equal(img1.src, img1_src_value = "assets/logo/Logo_m.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "ICONHS Logo");
    			attr_dev(img1, "class", "svelte-8suegs");
    			add_location(img1, file$o, 41, 16, 2464);
    			attr_dev(a8, "href", "/");
    			add_location(a8, file$o, 40, 12, 2393);
    			attr_dev(div6, "class", "logoBox svelte-8suegs");
    			add_location(div6, file$o, 39, 8, 2358);
    			attr_dev(div7, "class", "upperLower svelte-8suegs");
    			set_style(div7, "position", "fixed");
    			set_style(div7, "z-index", "1");
    			set_style(div7, "width", "100%");
    			add_location(div7, file$o, 11, 4, 199);
    			attr_dev(hr, "class", "svelte-8suegs");
    			add_location(hr, file$o, 48, 12, 2639);
    			attr_dev(input, "class", "form-control me-2");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "placeholder", "Search...");
    			set_style(input, "border-radius", "0");
    			set_style(input, "font-size", "medium");
    			add_location(input, file$o, 52, 20, 2756);
    			attr_dev(i1, "class", "fa fa-search svelte-8suegs");
    			set_style(i1, "color", "#132d76");
    			set_style(i1, "font-size", "x-large");
    			add_location(i1, file$o, 53, 20, 2894);
    			attr_dev(div8, "class", "inputArea d-flex svelte-8suegs");
    			add_location(div8, file$o, 51, 16, 2704);
    			attr_dev(div9, "class", "searchBarArea svelte-8suegs");
    			add_location(div9, file$o, 50, 12, 2659);
    			attr_dev(div10, "class", "goTos svelte-8suegs");
    			add_location(div10, file$o, 57, 12, 3026);
    			attr_dev(div11, "class", "innerMain svelte-8suegs");
    			add_location(div11, file$o, 47, 8, 2602);
    			attr_dev(div12, "class", "main svelte-8suegs");
    			add_location(div12, file$o, 46, 4, 2574);
    			attr_dev(div13, "class", "thisMain svelte-8suegs");
    			add_location(div13, file$o, 10, 0, 171);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div7);
    			append_dev(div7, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t1);
    			append_dev(div0, a1);
    			append_dev(div0, t3);
    			append_dev(div0, a2);
    			append_dev(div0, t5);
    			append_dev(div0, a3);
    			append_dev(div7, t7);
    			append_dev(div7, div5);
    			append_dev(div5, div1);
    			append_dev(div1, img0);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, a4);
    			append_dev(div2, t10);
    			append_dev(div2, a5);
    			append_dev(div2, t12);
    			append_dev(div2, a6);
    			append_dev(div2, t14);
    			append_dev(div2, a7);
    			append_dev(div4, t16);
    			append_dev(div4, div3);
    			append_dev(div3, button);
    			append_dev(button, i0);
    			append_dev(div7, t17);
    			append_dev(div7, div6);
    			append_dev(div6, a8);
    			append_dev(a8, img1);
    			append_dev(div13, t18);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, hr);
    			append_dev(div11, t19);
    			append_dev(div11, div9);
    			append_dev(div9, div8);
    			append_dev(div8, input);
    			append_dev(div8, t20);
    			append_dev(div8, i1);
    			append_dev(div11, t21);
    			append_dev(div11, div10);
    			if (if_block) if_block.m(div10, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[2]),
    					listen_dev(a0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(a0, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(a1, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(a1, "click", /*click_handler_3*/ ctx[6], false, false, false),
    					listen_dev(a2, "click", /*click_handler_4*/ ctx[7], false, false, false),
    					listen_dev(a2, "click", /*click_handler_5*/ ctx[8], false, false, false),
    					listen_dev(a3, "click", /*click_handler_6*/ ctx[9], false, false, false),
    					listen_dev(a3, "click", /*click_handler_7*/ ctx[10], false, false, false),
    					listen_dev(a4, "click", /*click_handler_8*/ ctx[11], false, false, false),
    					listen_dev(a4, "click", /*click_handler_9*/ ctx[12], false, false, false),
    					listen_dev(a5, "click", /*click_handler_10*/ ctx[13], false, false, false),
    					listen_dev(a5, "click", /*click_handler_11*/ ctx[14], false, false, false),
    					listen_dev(a6, "click", /*click_handler_12*/ ctx[15], false, false, false),
    					listen_dev(a6, "click", /*click_handler_13*/ ctx[16], false, false, false),
    					listen_dev(a7, "click", /*click_handler_14*/ ctx[17], false, false, false),
    					listen_dev(a7, "click", /*click_handler_15*/ ctx[18], false, false, false),
    					listen_dev(a8, "click", /*click_handler_16*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*localStorage*/ 0) {
    				toggle_class(a0, "activeU", localStorage.getItem('aBtn') == 5);
    			}

    			if (dirty & /*localStorage*/ 0) {
    				toggle_class(a1, "activeU", localStorage.getItem('aBtn') == 6);
    			}

    			if (dirty & /*localStorage*/ 0) {
    				toggle_class(a2, "activeU", localStorage.getItem('aBtn') == 7);
    			}

    			if (dirty & /*localStorage*/ 0) {
    				toggle_class(a3, "activeU", localStorage.getItem('aBtn') == 8);
    			}

    			if (dirty & /*localStorage*/ 0) {
    				toggle_class(a4, "activeU", localStorage.getItem('aBtn') == 1);
    			}

    			if (dirty & /*localStorage*/ 0) {
    				toggle_class(a5, "activeU", localStorage.getItem('aBtn') == 2);
    			}

    			if (dirty & /*localStorage*/ 0) {
    				toggle_class(a6, "activeU", localStorage.getItem('aBtn') == 3);
    			}

    			if (dirty & /*localStorage*/ 0) {
    				toggle_class(a7, "activeU", localStorage.getItem('aBtn') == 4);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div10, null);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PopupNav', slots, []);
    	let { currentPage } = $$props;
    	let width;

    	$$self.$$.on_mount.push(function () {
    		if (currentPage === undefined && !('currentPage' in $$props || $$self.$$.bound[$$self.$$.props['currentPage']])) {
    			console.warn("<PopupNav> was created without expected prop 'currentPage'");
    		}
    	});

    	const writable_props = ['currentPage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PopupNav> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, width = window.innerWidth);
    	}

    	const click_handler = () => aBtn.set("5");
    	const click_handler_1 = () => currentPage.set("Academics");
    	const click_handler_2 = () => aBtn.set("6");
    	const click_handler_3 = () => currentPage.set("Student");
    	const click_handler_4 = () => aBtn.set("7");
    	const click_handler_5 = () => currentPage.set("Careers");
    	const click_handler_6 = () => aBtn.set("8");
    	const click_handler_7 = () => currentPage.set("News");
    	const click_handler_8 = () => aBtn.set("1");
    	const click_handler_9 = () => currentPage.set("Home");
    	const click_handler_10 = () => aBtn.set("2");
    	const click_handler_11 = () => currentPage.set("About");
    	const click_handler_12 = () => aBtn.set("3");
    	const click_handler_13 = () => currentPage.set("Admissions");
    	const click_handler_14 = () => aBtn.set("4");
    	const click_handler_15 = () => currentPage.set("Contact");
    	const click_handler_16 = () => currentPage.set("Home");

    	$$self.$$set = $$props => {
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    	};

    	$$self.$capture_state = () => ({ currentPage, width, aBtn });

    	$$self.$inject_state = $$props => {
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentPage,
    		width,
    		onwindowresize,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16
    	];
    }

    class PopupNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { currentPage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PopupNav",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get currentPage() {
    		throw new Error("<PopupNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<PopupNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\lib\components\layout\navbar.svelte generated by Svelte v3.55.1 */
    const file$n = "src\\lib\\components\\layout\\navbar.svelte";

    // (69:4) {#if ApplyBtn}
    function create_if_block$2(ctx) {
    	let a;
    	let t;
    	let i;
    	let a_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text("APPLY\r\n            ");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-caret-right");
    			add_location(i, file$n, 71, 12, 3611);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "applyBtn h3 svelte-15d0hxa");
    			add_location(a, file$n, 69, 8, 3428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    			append_dev(a, i);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler_18*/ ctx[22], false, false, false),
    					listen_dev(a, "click", /*click_handler_19*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!a_transition) a_transition = create_bidirectional_transition(a, fly, { y: -50, duration: 500 }, true);
    				a_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!a_transition) a_transition = create_bidirectional_transition(a, fly, { y: -50, duration: 500 }, false);
    			a_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching && a_transition) a_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(69:4) {#if ApplyBtn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let div12;
    	let div7;
    	let div0;
    	let a0;
    	let t1;
    	let a1;
    	let t3;
    	let a2;
    	let t5;
    	let a3;
    	let t7;
    	let div5;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let div4;
    	let div2;
    	let a4;
    	let t10;
    	let a5;
    	let t12;
    	let a6;
    	let t14;
    	let a7;
    	let t16;
    	let div3;
    	let button;
    	let i0;
    	let t17;
    	let i1;
    	let t18;
    	let div6;
    	let a8;
    	let img1;
    	let img1_src_value;
    	let t19;
    	let div11;
    	let div10;
    	let div9;
    	let div8;
    	let popupnav;
    	let t20;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[3]);
    	popupnav = new PopupNav({ $$inline: true });
    	let if_block = /*ApplyBtn*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div7 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Academics";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "Student Life";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "Career Services";
    			t5 = space();
    			a3 = element("a");
    			a3.textContent = "News & Events";
    			t7 = space();
    			div5 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t8 = space();
    			div4 = element("div");
    			div2 = element("div");
    			a4 = element("a");
    			a4.textContent = "Home";
    			t10 = space();
    			a5 = element("a");
    			a5.textContent = "About Us";
    			t12 = space();
    			a6 = element("a");
    			a6.textContent = "Admissions";
    			t14 = space();
    			a7 = element("a");
    			a7.textContent = "Contact Us";
    			t16 = space();
    			div3 = element("div");
    			button = element("button");
    			i0 = element("i");
    			t17 = space();
    			i1 = element("i");
    			t18 = space();
    			div6 = element("div");
    			a8 = element("a");
    			img1 = element("img");
    			t19 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			create_component(popupnav.$$.fragment);
    			t20 = space();
    			if (if_block) if_block.c();
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-15d0hxa");
    			toggle_class(a0, "activeU", localStorage.getItem('aBtn') == 5);
    			add_location(a0, file$n, 23, 12, 572);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "svelte-15d0hxa");
    			toggle_class(a1, "activeU", localStorage.getItem('aBtn') == 6);
    			add_location(a1, file$n, 24, 12, 738);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "svelte-15d0hxa");
    			toggle_class(a2, "activeU", localStorage.getItem('aBtn') == 7);
    			add_location(a2, file$n, 25, 12, 905);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "svelte-15d0hxa");
    			toggle_class(a3, "activeU", localStorage.getItem('aBtn') == 8);
    			add_location(a3, file$n, 26, 12, 1075);
    			attr_dev(div0, "class", "upper svelte-15d0hxa");
    			add_location(div0, file$n, 22, 8, 539);
    			attr_dev(img0, "class", "title1 svelte-15d0hxa");
    			if (!src_url_equal(img0.src, img0_src_value = "assets/title/titlePurple2.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Inspire College of Nursing and Health Sciences");
    			add_location(img0, file$n, 30, 16, 1330);
    			attr_dev(div1, "class", "navTitleLower svelte-15d0hxa");
    			add_location(div1, file$n, 29, 12, 1285);
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "class", "svelte-15d0hxa");
    			toggle_class(a4, "activeU", localStorage.getItem('aBtn') == 1);
    			add_location(a4, file$n, 35, 20, 1570);
    			attr_dev(a5, "href", "/");
    			attr_dev(a5, "class", "svelte-15d0hxa");
    			toggle_class(a5, "activeU", localStorage.getItem('aBtn') == 2);
    			add_location(a5, file$n, 36, 20, 1734);
    			attr_dev(a6, "href", "/");
    			attr_dev(a6, "class", "svelte-15d0hxa");
    			toggle_class(a6, "activeU", localStorage.getItem('aBtn') == 3);
    			add_location(a6, file$n, 37, 20, 1903);
    			attr_dev(a7, "href", "/");
    			attr_dev(a7, "class", "svelte-15d0hxa");
    			toggle_class(a7, "activeU", localStorage.getItem('aBtn') == 4);
    			add_location(a7, file$n, 38, 20, 2079);
    			attr_dev(div2, "class", "navLinksLower svelte-15d0hxa");
    			add_location(div2, file$n, 34, 16, 1521);
    			attr_dev(i0, "class", "fa fa-bars");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$n, 44, 24, 2509);
    			attr_dev(i1, "class", "fa fa-search");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$n, 45, 24, 2580);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "searchModalBtn svelte-15d0hxa");
    			attr_dev(button, "data-bs-toggle", "modal");
    			attr_dev(button, "data-bs-target", "#exampleModal");
    			add_location(button, file$n, 43, 20, 2384);
    			attr_dev(div3, "class", "searchModal");
    			add_location(div3, file$n, 41, 16, 2286);
    			set_style(div4, "display", "flex");
    			add_location(div4, file$n, 33, 12, 1475);
    			attr_dev(div5, "class", "lower svelte-15d0hxa");
    			add_location(div5, file$n, 28, 8, 1252);
    			if (!src_url_equal(img1.src, img1_src_value = "assets/logo/Logo_m.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "ICONHS Logo");
    			attr_dev(img1, "class", "svelte-15d0hxa");
    			add_location(img1, file$n, 52, 16, 2916);
    			attr_dev(a8, "href", "/");
    			attr_dev(a8, "class", "svelte-15d0hxa");
    			toggle_class(a8, "activeU", localStorage.getItem('aBtn') == 1);
    			add_location(a8, file$n, 51, 12, 2764);
    			attr_dev(div6, "class", "logoBox svelte-15d0hxa");
    			add_location(div6, file$n, 50, 8, 2729);
    			attr_dev(div7, "class", "upperLower svelte-15d0hxa");
    			set_style(div7, "position", "fixed");
    			set_style(div7, "z-index", "1");
    			set_style(div7, "width", "100%");
    			add_location(div7, file$n, 21, 4, 459);
    			attr_dev(div8, "class", "modal-content");
    			add_location(div8, file$n, 61, 16, 3263);
    			attr_dev(div9, "class", "modal-dialog modal-fullscreen");
    			add_location(div9, file$n, 60, 12, 3202);
    			attr_dev(div10, "class", "modal ");
    			attr_dev(div10, "id", "exampleModal");
    			attr_dev(div10, "tabindex", "-1");
    			attr_dev(div10, "aria-labelledby", "exampleModalLabel");
    			attr_dev(div10, "aria-hidden", "true");
    			add_location(div10, file$n, 59, 8, 3081);
    			attr_dev(div11, "class", "searchModal");
    			add_location(div11, file$n, 57, 4, 3022);
    			attr_dev(div12, "class", "thisMain svelte-15d0hxa");
    			add_location(div12, file$n, 20, 0, 431);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div7);
    			append_dev(div7, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t1);
    			append_dev(div0, a1);
    			append_dev(div0, t3);
    			append_dev(div0, a2);
    			append_dev(div0, t5);
    			append_dev(div0, a3);
    			append_dev(div7, t7);
    			append_dev(div7, div5);
    			append_dev(div5, div1);
    			append_dev(div1, img0);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, a4);
    			append_dev(div2, t10);
    			append_dev(div2, a5);
    			append_dev(div2, t12);
    			append_dev(div2, a6);
    			append_dev(div2, t14);
    			append_dev(div2, a7);
    			append_dev(div4, t16);
    			append_dev(div4, div3);
    			append_dev(div3, button);
    			append_dev(button, i0);
    			append_dev(button, t17);
    			append_dev(button, i1);
    			append_dev(div7, t18);
    			append_dev(div7, div6);
    			append_dev(div6, a8);
    			append_dev(a8, img1);
    			append_dev(div12, t19);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			mount_component(popupnav, div8, null);
    			append_dev(div12, t20);
    			if (if_block) if_block.m(div12, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[3]();
    					}),
    					listen_dev(a0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(a0, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(a1, "click", /*click_handler_2*/ ctx[6], false, false, false),
    					listen_dev(a1, "click", /*click_handler_3*/ ctx[7], false, false, false),
    					listen_dev(a2, "click", /*click_handler_4*/ ctx[8], false, false, false),
    					listen_dev(a2, "click", /*click_handler_5*/ ctx[9], false, false, false),
    					listen_dev(a3, "click", /*click_handler_6*/ ctx[10], false, false, false),
    					listen_dev(a3, "click", /*click_handler_7*/ ctx[11], false, false, false),
    					listen_dev(a4, "click", /*click_handler_8*/ ctx[12], false, false, false),
    					listen_dev(a4, "click", /*click_handler_9*/ ctx[13], false, false, false),
    					listen_dev(a5, "click", /*click_handler_10*/ ctx[14], false, false, false),
    					listen_dev(a5, "click", /*click_handler_11*/ ctx[15], false, false, false),
    					listen_dev(a6, "click", /*click_handler_12*/ ctx[16], false, false, false),
    					listen_dev(a6, "click", /*click_handler_13*/ ctx[17], false, false, false),
    					listen_dev(a7, "click", /*click_handler_14*/ ctx[18], false, false, false),
    					listen_dev(a7, "click", /*click_handler_15*/ ctx[19], false, false, false),
    					listen_dev(a8, "click", /*click_handler_16*/ ctx[20], false, false, false),
    					listen_dev(a8, "click", /*click_handler_17*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*y*/ 2 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window.pageXOffset, /*y*/ ctx[1]);
    				scrolling_timeout = setTimeout(clear_scrolling, 100);
    			}

    			if (!current || dirty & /*localStorage*/ 0) {
    				toggle_class(a0, "activeU", localStorage.getItem('aBtn') == 5);
    			}

    			if (!current || dirty & /*localStorage*/ 0) {
    				toggle_class(a1, "activeU", localStorage.getItem('aBtn') == 6);
    			}

    			if (!current || dirty & /*localStorage*/ 0) {
    				toggle_class(a2, "activeU", localStorage.getItem('aBtn') == 7);
    			}

    			if (!current || dirty & /*localStorage*/ 0) {
    				toggle_class(a3, "activeU", localStorage.getItem('aBtn') == 8);
    			}

    			if (!current || dirty & /*localStorage*/ 0) {
    				toggle_class(a4, "activeU", localStorage.getItem('aBtn') == 1);
    			}

    			if (!current || dirty & /*localStorage*/ 0) {
    				toggle_class(a5, "activeU", localStorage.getItem('aBtn') == 2);
    			}

    			if (!current || dirty & /*localStorage*/ 0) {
    				toggle_class(a6, "activeU", localStorage.getItem('aBtn') == 3);
    			}

    			if (!current || dirty & /*localStorage*/ 0) {
    				toggle_class(a7, "activeU", localStorage.getItem('aBtn') == 4);
    			}

    			if (!current || dirty & /*localStorage*/ 0) {
    				toggle_class(a8, "activeU", localStorage.getItem('aBtn') == 1);
    			}

    			if (/*ApplyBtn*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*ApplyBtn*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div12, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popupnav.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popupnav.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			destroy_component(popupnav);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let { currentPage } = $$props;
    	let y;
    	syncPageBtn(aBtn, currentPage);
    	let ApplyBtn = false;

    	$$self.$$.on_mount.push(function () {
    		if (currentPage === undefined && !('currentPage' in $$props || $$self.$$.bound[$$self.$$.props['currentPage']])) {
    			console.warn("<Navbar> was created without expected prop 'currentPage'");
    		}
    	});

    	const writable_props = ['currentPage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(1, y = window.pageYOffset);
    	}

    	const click_handler = () => aBtn.set("5");
    	const click_handler_1 = () => currentPage.set("Academics");
    	const click_handler_2 = () => aBtn.set("6");
    	const click_handler_3 = () => currentPage.set("Student");
    	const click_handler_4 = () => aBtn.set("7");
    	const click_handler_5 = () => currentPage.set("Careers");
    	const click_handler_6 = () => aBtn.set("8");
    	const click_handler_7 = () => currentPage.set("News");
    	const click_handler_8 = () => aBtn.set("1");
    	const click_handler_9 = () => currentPage.set("Home");
    	const click_handler_10 = () => aBtn.set("2");
    	const click_handler_11 = () => currentPage.set("About");
    	const click_handler_12 = () => aBtn.set("3");
    	const click_handler_13 = () => currentPage.set("Admissions");
    	const click_handler_14 = () => aBtn.set("4");
    	const click_handler_15 = () => currentPage.set("Contact");
    	const click_handler_16 = () => aBtn.set("1");
    	const click_handler_17 = () => currentPage.set("Home");
    	const click_handler_18 = () => aBtn.set("9");
    	const click_handler_19 = () => currentPage.set("Apply");

    	$$self.$$set = $$props => {
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    	};

    	$$self.$capture_state = () => ({
    		currentPage,
    		PopupNav,
    		aBtn,
    		syncPageBtn,
    		fade,
    		fly,
    		y,
    		ApplyBtn
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('y' in $$props) $$invalidate(1, y = $$props.y);
    		if ('ApplyBtn' in $$props) $$invalidate(2, ApplyBtn = $$props.ApplyBtn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*y*/ 2) {
    			if (y > 200) {
    				$$invalidate(2, ApplyBtn = true);
    			} else {
    				$$invalidate(2, ApplyBtn = false);
    			}
    		}
    	};

    	return [
    		currentPage,
    		y,
    		ApplyBtn,
    		onwindowscroll,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16,
    		click_handler_17,
    		click_handler_18,
    		click_handler_19
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { currentPage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get currentPage() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\components\layout\footer.svelte generated by Svelte v3.55.1 */
    const file$m = "src\\lib\\components\\layout\\footer.svelte";

    function create_fragment$o(ctx) {
    	let div7;
    	let br0;
    	let br1;
    	let t0;
    	let div3;
    	let a0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div2;
    	let div0;
    	let a1;
    	let t3;
    	let i0;
    	let t4;
    	let br2;
    	let t5;
    	let a2;
    	let t7;
    	let a3;
    	let t9;
    	let i1;
    	let t10;
    	let div1;
    	let a4;
    	let i2;
    	let t11;
    	let a5;
    	let i3;
    	let t12;
    	let a6;
    	let i4;
    	let t13;
    	let a7;
    	let i5;
    	let t14;
    	let a8;
    	let i6;
    	let t15;
    	let br3;
    	let br4;
    	let t16;
    	let div6;
    	let div4;
    	let a9;
    	let t18;
    	let a10;
    	let t20;
    	let a11;
    	let t22;
    	let a12;
    	let t24;
    	let a13;
    	let t26;
    	let a14;
    	let t28;
    	let a15;
    	let t30;
    	let br5;
    	let t31;
    	let div5;
    	let t32;
    	let a16;
    	let t34;
    	let a17;
    	let t36;
    	let a18;
    	let t38;
    	let br6;
    	let br7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			br0 = element("br");
    			br1 = element("br");
    			t0 = space();
    			div3 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			a1 = element("a");
    			a1.textContent = "14-E2 Gulberg III, Lahore";
    			t3 = space();
    			i0 = element("i");
    			t4 = space();
    			br2 = element("br");
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "+92-42-37881521";
    			t7 = text("\r\n                , \r\n                ");
    			a3 = element("a");
    			a3.textContent = "042-37881522";
    			t9 = space();
    			i1 = element("i");
    			t10 = space();
    			div1 = element("div");
    			a4 = element("a");
    			i2 = element("i");
    			t11 = space();
    			a5 = element("a");
    			i3 = element("i");
    			t12 = space();
    			a6 = element("a");
    			i4 = element("i");
    			t13 = space();
    			a7 = element("a");
    			i5 = element("i");
    			t14 = space();
    			a8 = element("a");
    			i6 = element("i");
    			t15 = space();
    			br3 = element("br");
    			br4 = element("br");
    			t16 = space();
    			div6 = element("div");
    			div4 = element("div");
    			a9 = element("a");
    			a9.textContent = "CONTACT US";
    			t18 = space();
    			a10 = element("a");
    			a10.textContent = "MAP";
    			t20 = space();
    			a11 = element("a");
    			a11.textContent = "FACULTY";
    			t22 = space();
    			a12 = element("a");
    			a12.textContent = "CAREER SERVICES";
    			t24 = space();
    			a13 = element("a");
    			a13.textContent = "LIBRARY";
    			t26 = space();
    			a14 = element("a");
    			a14.textContent = "CAMPUS";
    			t28 = space();
    			a15 = element("a");
    			a15.textContent = "APPLY NOW";
    			t30 = space();
    			br5 = element("br");
    			t31 = space();
    			div5 = element("div");
    			t32 = text("©2023 ICONHS\r\n\r\n                \r\n\r\n            ");
    			a16 = element("a");
    			a16.textContent = "Privacy Policy";
    			t34 = text("  \r\n            ");
    			a17 = element("a");
    			a17.textContent = "Student Policy";
    			t36 = text("  \r\n            ");
    			a18 = element("a");
    			a18.textContent = "Management";
    			t38 = space();
    			br6 = element("br");
    			br7 = element("br");
    			add_location(br0, file$m, 6, 4, 165);
    			add_location(br1, file$m, 6, 8, 169);
    			if (!src_url_equal(img.src, img_src_value = "assets/title/titleWhite1.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-a46ox2");
    			add_location(img, file$m, 9, 12, 316);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "upperLeft svelte-a46ox2");
    			add_location(a0, file$m, 8, 8, 208);
    			attr_dev(a1, "class", "mapAddressLink lead svelte-a46ox2");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noreferrer");
    			attr_dev(a1, "href", "https://goo.gl/maps/JQzAiXsyXa5Yx4g3A");
    			add_location(a1, file$m, 14, 16, 466);
    			attr_dev(i0, "class", "fas fa-map-marker-alt");
    			add_location(i0, file$m, 17, 16, 662);
    			add_location(br2, file$m, 18, 16, 717);
    			attr_dev(a2, "class", "phoneAddressLink svelte-a46ox2");
    			attr_dev(a2, "href", "/");
    			add_location(a2, file$m, 20, 16, 741);
    			attr_dev(a3, "class", "phoneAddressLink svelte-a46ox2");
    			attr_dev(a3, "href", "/");
    			add_location(a3, file$m, 24, 16, 875);
    			attr_dev(i1, "class", "fas fa-phone-alt");
    			add_location(i1, file$m, 27, 16, 986);
    			attr_dev(div0, "class", "address svelte-a46ox2");
    			add_location(div0, file$m, 13, 12, 427);
    			attr_dev(i2, "class", "fab fa-facebook-square");
    			attr_dev(i2, "aria-hidden", "true");
    			add_location(i2, file$m, 31, 84, 1179);
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noreferrer");
    			attr_dev(a4, "href", "https://www.facebook.com");
    			attr_dev(a4, "class", "svelte-a46ox2");
    			add_location(a4, file$m, 31, 16, 1111);
    			attr_dev(i3, "class", "fab fa-twitter");
    			attr_dev(i3, "aria-hidden", "true");
    			add_location(i3, file$m, 32, 79, 1321);
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "rel", "noreferrer");
    			attr_dev(a5, "href", "https://twitter.com");
    			attr_dev(a5, "class", "svelte-a46ox2");
    			add_location(a5, file$m, 32, 16, 1258);
    			attr_dev(i4, "class", "fab fa-youtube");
    			attr_dev(i4, "aria-hidden", "true");
    			add_location(i4, file$m, 33, 83, 1459);
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "rel", "noreferrer");
    			attr_dev(a6, "href", "https://www.youtube.com");
    			attr_dev(a6, "class", "svelte-a46ox2");
    			add_location(a6, file$m, 33, 16, 1392);
    			attr_dev(i5, "class", "fab fa-linkedin");
    			attr_dev(i5, "aria-hidden", "true");
    			add_location(i5, file$m, 34, 84, 1598);
    			attr_dev(a7, "target", "_blank");
    			attr_dev(a7, "rel", "noreferrer");
    			attr_dev(a7, "href", "https://www.linkedin.com");
    			attr_dev(a7, "class", "svelte-a46ox2");
    			add_location(a7, file$m, 34, 16, 1530);
    			attr_dev(i6, "class", "fab fa-instagram");
    			attr_dev(i6, "aria-hidden", "true");
    			add_location(i6, file$m, 35, 85, 1739);
    			attr_dev(a8, "target", "_blank");
    			attr_dev(a8, "rel", "noreferrer");
    			attr_dev(a8, "href", "https://www.instagram.com");
    			attr_dev(a8, "class", "svelte-a46ox2");
    			add_location(a8, file$m, 35, 16, 1670);
    			attr_dev(div1, "class", "externalLinks svelte-a46ox2");
    			add_location(div1, file$m, 30, 12, 1066);
    			attr_dev(div2, "class", "upperRight svelte-a46ox2");
    			add_location(div2, file$m, 12, 8, 389);
    			attr_dev(div3, "class", "upper svelte-a46ox2");
    			add_location(div3, file$m, 7, 4, 179);
    			add_location(br3, file$m, 41, 4, 1852);
    			add_location(br4, file$m, 41, 8, 1856);
    			attr_dev(a9, "href", "/");
    			attr_dev(a9, "class", "svelte-a46ox2");
    			add_location(a9, file$m, 45, 12, 1936);
    			attr_dev(a10, "href", "/");
    			attr_dev(a10, "class", "svelte-a46ox2");
    			add_location(a10, file$m, 46, 12, 2043);
    			attr_dev(a11, "href", "/");
    			attr_dev(a11, "class", "svelte-a46ox2");
    			add_location(a11, file$m, 47, 12, 2140);
    			attr_dev(a12, "href", "/");
    			attr_dev(a12, "class", "svelte-a46ox2");
    			add_location(a12, file$m, 48, 12, 2245);
    			attr_dev(a13, "href", "/");
    			attr_dev(a13, "class", "svelte-a46ox2");
    			add_location(a13, file$m, 49, 12, 2357);
    			attr_dev(a14, "href", "/");
    			attr_dev(a14, "class", "svelte-a46ox2");
    			add_location(a14, file$m, 50, 12, 2462);
    			attr_dev(a15, "href", "/");
    			attr_dev(a15, "class", "svelte-a46ox2");
    			add_location(a15, file$m, 51, 12, 2565);
    			attr_dev(div4, "class", "newBtnGroup svelte-a46ox2");
    			add_location(div4, file$m, 44, 8, 1897);
    			add_location(br5, file$m, 53, 8, 2681);
    			attr_dev(a16, "class", "text-light");
    			attr_dev(a16, "href", "/");
    			add_location(a16, file$m, 60, 12, 2825);
    			attr_dev(a17, "class", "text-light");
    			attr_dev(a17, "href", "/");
    			add_location(a17, file$m, 61, 12, 2965);
    			attr_dev(a18, "class", "text-light");
    			attr_dev(a18, "href", "/");
    			add_location(a18, file$m, 62, 12, 3104);
    			attr_dev(div5, "class", "lower2 svelte-a46ox2");
    			set_style(div5, "font-size", "small");
    			add_location(div5, file$m, 55, 8, 2697);
    			attr_dev(div6, "class", "lower svelte-a46ox2");
    			add_location(div6, file$m, 43, 4, 1868);
    			add_location(br6, file$m, 65, 4, 3249);
    			add_location(br7, file$m, 65, 8, 3253);
    			attr_dev(div7, "class", "thisMain svelte-a46ox2");
    			add_location(div7, file$m, 5, 0, 137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, br0);
    			append_dev(div7, br1);
    			append_dev(div7, t0);
    			append_dev(div7, div3);
    			append_dev(div3, a0);
    			append_dev(a0, img);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a1);
    			append_dev(div0, t3);
    			append_dev(div0, i0);
    			append_dev(div0, t4);
    			append_dev(div0, br2);
    			append_dev(div0, t5);
    			append_dev(div0, a2);
    			append_dev(div0, t7);
    			append_dev(div0, a3);
    			append_dev(div0, t9);
    			append_dev(div0, i1);
    			append_dev(div2, t10);
    			append_dev(div2, div1);
    			append_dev(div1, a4);
    			append_dev(a4, i2);
    			append_dev(div1, t11);
    			append_dev(div1, a5);
    			append_dev(a5, i3);
    			append_dev(div1, t12);
    			append_dev(div1, a6);
    			append_dev(a6, i4);
    			append_dev(div1, t13);
    			append_dev(div1, a7);
    			append_dev(a7, i5);
    			append_dev(div1, t14);
    			append_dev(div1, a8);
    			append_dev(a8, i6);
    			append_dev(div7, t15);
    			append_dev(div7, br3);
    			append_dev(div7, br4);
    			append_dev(div7, t16);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, a9);
    			append_dev(div4, t18);
    			append_dev(div4, a10);
    			append_dev(div4, t20);
    			append_dev(div4, a11);
    			append_dev(div4, t22);
    			append_dev(div4, a12);
    			append_dev(div4, t24);
    			append_dev(div4, a13);
    			append_dev(div4, t26);
    			append_dev(div4, a14);
    			append_dev(div4, t28);
    			append_dev(div4, a15);
    			append_dev(div6, t30);
    			append_dev(div6, br5);
    			append_dev(div6, t31);
    			append_dev(div6, div5);
    			append_dev(div5, t32);
    			append_dev(div5, a16);
    			append_dev(div5, t34);
    			append_dev(div5, a17);
    			append_dev(div5, t36);
    			append_dev(div5, a18);
    			append_dev(div7, t38);
    			append_dev(div7, br6);
    			append_dev(div7, br7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(a0, "click", /*click_handler_1*/ ctx[3], false, false, false),
    					listen_dev(a9, "click", /*click_handler_2*/ ctx[4], false, false, false),
    					listen_dev(a9, "click", /*click_handler_3*/ ctx[5], false, false, false),
    					listen_dev(a10, "click", /*click_handler_4*/ ctx[6], false, false, false),
    					listen_dev(a10, "click", /*click_handler_5*/ ctx[7], false, false, false),
    					listen_dev(a11, "click", /*click_handler_6*/ ctx[8], false, false, false),
    					listen_dev(a11, "click", /*click_handler_7*/ ctx[9], false, false, false),
    					listen_dev(a12, "click", /*click_handler_8*/ ctx[10], false, false, false),
    					listen_dev(a12, "click", /*click_handler_9*/ ctx[11], false, false, false),
    					listen_dev(a13, "click", /*click_handler_10*/ ctx[12], false, false, false),
    					listen_dev(a13, "click", /*click_handler_11*/ ctx[13], false, false, false),
    					listen_dev(a14, "click", /*click_handler_12*/ ctx[14], false, false, false),
    					listen_dev(a14, "click", /*click_handler_13*/ ctx[15], false, false, false),
    					listen_dev(a15, "click", /*click_handler_14*/ ctx[16], false, false, false),
    					listen_dev(a15, "click", /*click_handler_15*/ ctx[17], false, false, false),
    					listen_dev(a16, "click", /*click_handler_16*/ ctx[18], false, false, false),
    					listen_dev(a16, "click", /*click_handler_17*/ ctx[19], false, false, false),
    					listen_dev(a17, "click", /*click_handler_18*/ ctx[20], false, false, false),
    					listen_dev(a17, "click", /*click_handler_19*/ ctx[21], false, false, false),
    					listen_dev(a18, "click", /*click_handler_20*/ ctx[22], false, false, false),
    					listen_dev(a18, "click", /*click_handler_21*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let $aBtn;
    	let $currentPage;
    	validate_store(aBtn, 'aBtn');
    	component_subscribe($$self, aBtn, $$value => $$invalidate(0, $aBtn = $$value));
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(1, $currentPage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	syncPageBtn(aBtn, currentPage);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => set_store_value(aBtn, $aBtn = "1", $aBtn);
    	const click_handler_1 = () => set_store_value(currentPage, $currentPage = "Home", $currentPage);
    	const click_handler_2 = () => set_store_value(aBtn, $aBtn = "4", $aBtn);
    	const click_handler_3 = () => set_store_value(currentPage, $currentPage = "Contact", $currentPage);
    	const click_handler_4 = () => set_store_value(aBtn, $aBtn = "13", $aBtn);
    	const click_handler_5 = () => set_store_value(currentPage, $currentPage = "Map", $currentPage);
    	const click_handler_6 = () => set_store_value(aBtn, $aBtn = "11", $aBtn);
    	const click_handler_7 = () => set_store_value(currentPage, $currentPage = "Faculty", $currentPage);
    	const click_handler_8 = () => set_store_value(aBtn, $aBtn = "7", $aBtn);
    	const click_handler_9 = () => set_store_value(currentPage, $currentPage = "Careers", $currentPage);
    	const click_handler_10 = () => set_store_value(aBtn, $aBtn = "12", $aBtn);
    	const click_handler_11 = () => set_store_value(currentPage, $currentPage = "Library", $currentPage);
    	const click_handler_12 = () => set_store_value(aBtn, $aBtn = "10", $aBtn);
    	const click_handler_13 = () => set_store_value(currentPage, $currentPage = "Campus", $currentPage);
    	const click_handler_14 = () => set_store_value(aBtn, $aBtn = "9", $aBtn);
    	const click_handler_15 = () => set_store_value(currentPage, $currentPage = "Apply", $currentPage);
    	const click_handler_16 = () => set_store_value(aBtn, $aBtn = "15", $aBtn);
    	const click_handler_17 = () => set_store_value(currentPage, $currentPage = "PrivacyP", $currentPage);
    	const click_handler_18 = () => set_store_value(aBtn, $aBtn = "14", $aBtn);
    	const click_handler_19 = () => set_store_value(currentPage, $currentPage = "StudentP", $currentPage);
    	const click_handler_20 = () => set_store_value(aBtn, $aBtn = "16", $aBtn);
    	const click_handler_21 = () => set_store_value(currentPage, $currentPage = "Login", $currentPage);

    	$$self.$capture_state = () => ({
    		aBtn,
    		currentPage,
    		syncPageBtn,
    		$aBtn,
    		$currentPage
    	});

    	return [
    		$aBtn,
    		$currentPage,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16,
    		click_handler_17,
    		click_handler_18,
    		click_handler_19,
    		click_handler_20,
    		click_handler_21
    	];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\lib\components\content\horizontalStyledCard.svelte generated by Svelte v3.55.1 */

    const file$l = "src\\lib\\components\\content\\horizontalStyledCard.svelte";

    function create_fragment$n(ctx) {
    	let article;
    	let figure;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let header;
    	let h3;
    	let a;
    	let t1;
    	let t2;
    	let div0;
    	let p0;
    	let p1;
    	let t3;
    	let p2;

    	const block = {
    		c: function create() {
    			article = element("article");
    			figure = element("figure");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			header = element("header");
    			h3 = element("h3");
    			a = element("a");
    			t1 = text(/*title*/ ctx[1]);
    			t2 = space();
    			div0 = element("div");
    			p0 = element("p");
    			p1 = element("p");
    			t3 = text(/*body*/ ctx[2]);
    			p2 = element("p");
    			attr_dev(img, "class", "topic_image");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			set_style(img, "line-height", "1.15");
    			set_style(img, "-webkit-text-size-adjust", "100%");
    			set_style(img, "--swiper-theme-color", "#007aff");
    			set_style(img, "--swiper-navigation-size", "44px");
    			set_style(img, "-webkit-box-direction", "normal");
    			set_style(img, "box-sizing", "inherit");
    			set_style(img, "border-style", "none");
    			set_style(img, "vertical-align", "middle");
    			set_style(img, "width", "100%");
    			set_style(img, "display", "block");
    			add_location(img, file$l, 22, 12, 749);
    			attr_dev(figure, "class", "topic_figure");
    			set_style(figure, "line-height", "1.15");
    			set_style(figure, "-webkit-text-size-adjust", "100%");
    			set_style(figure, "--swiper-theme-color", "#007aff");
    			set_style(figure, "--swiper-navigation-size", "44px");
    			set_style(figure, "-webkit-box-direction", "normal");
    			set_style(figure, "box-sizing", "inherit");
    			set_style(figure, "margin", "0");
    			set_style(figure, "width", "290px");
    			set_style(figure, "transition", "opacity .5s .15s");
    			set_style(figure, "opacity", "1");
    			add_location(figure, file$l, 12, 8, 380);
    			set_style(a, "-webkit-text-size-adjust", "100%");
    			set_style(a, "--swiper-theme-color", "#007aff");
    			set_style(a, "--swiper-navigation-size", "44px");
    			set_style(a, "-webkit-box-direction", "normal");
    			set_style(a, "font-weight", "500");
    			set_style(a, "font-size", "2rem");
    			set_style(a, "line-height", "1.40625");
    			set_style(a, "box-sizing", "inherit");
    			set_style(a, "background-color", "transparent");
    			set_style(a, "text-decoration", "none");
    			set_style(a, "color", "inherit");
    			set_style(a, "transition", "color .25s");
    			attr_dev(a, "class", "topic_title_link");
    			attr_dev(a, "href", "/");
    			add_location(a, file$l, 63, 20, 2449);
    			attr_dev(h3, "class", "topic_title");
    			set_style(h3, "-webkit-text-size-adjust", "100%");
    			set_style(h3, "--swiper-theme-color", "#007aff");
    			set_style(h3, "--swiper-navigation-size", "44px");
    			set_style(h3, "-webkit-box-direction", "normal");
    			set_style(h3, "box-sizing", "inherit");
    			set_style(h3, "font-weight", "500");
    			set_style(h3, "color", "#132d76");
    			set_style(h3, "margin", "0 0 3px");
    			set_style(h3, "font-size", "2rem");
    			set_style(h3, "line-height", "1.40625");
    			set_style(h3, "margin-bottom", "5px");
    			add_location(h3, file$l, 52, 16, 1964);
    			attr_dev(header, "class", "topic_header");
    			set_style(header, "line-height", "1.15");
    			set_style(header, "-webkit-text-size-adjust", "100%");
    			set_style(header, "--swiper-theme-color", "#007aff");
    			set_style(header, "--swiper-navigation-size", "44px");
    			set_style(header, "-webkit-box-direction", "normal");
    			set_style(header, "box-sizing", "inherit");
    			add_location(header, file$l, 46, 12, 1674);
    			add_location(p0, file$l, 85, 16, 3456);
    			set_style(p1, "-webkit-text-size-adjust", "100%");
    			set_style(p1, "--swiper-theme-color", "#007aff");
    			set_style(p1, "--swiper-navigation-size", "44px");
    			set_style(p1, "-webkit-box-direction", "normal");
    			set_style(p1, "font-weight", "400");
    			set_style(p1, "color", "#37424A");
    			set_style(p1, "font-size", "1.0625rem");
    			set_style(p1, "line-height", "1.94118");
    			set_style(p1, "box-sizing", "inherit");
    			set_style(p1, "margin", "0");
    			add_location(p1, file$l, 85, 23, 3463);
    			add_location(p2, file$l, 94, 38, 3877);
    			attr_dev(div0, "class", "topic_caption");
    			set_style(div0, "line-height", "1.15");
    			set_style(div0, "-webkit-text-size-adjust", "100%");
    			set_style(div0, "--swiper-theme-color", "#007aff");
    			set_style(div0, "--swiper-navigation-size", "44px");
    			set_style(div0, "-webkit-box-direction", "normal");
    			set_style(div0, "box-sizing", "inherit");
    			set_style(div0, "margin-top", "5px");
    			add_location(div0, file$l, 78, 12, 3138);
    			attr_dev(div1, "class", "topic_body");
    			set_style(div1, "line-height", "1.15");
    			set_style(div1, "-webkit-text-size-adjust", "100%");
    			set_style(div1, "--swiper-theme-color", "#007aff");
    			set_style(div1, "--swiper-navigation-size", "44px");
    			set_style(div1, "-webkit-box-direction", "normal");
    			set_style(div1, "box-sizing", "inherit");
    			set_style(div1, "position", "relative");
    			set_style(div1, "background", "#fff");
    			set_style(div1, "margin", "40px 0 0 -40px");
    			set_style(div1, "width", "calc(100% - 290px + 40px)");
    			set_style(div1, "padding", "20px 25px 0");
    			set_style(div1, "transition", "opacity .5s .25s");
    			set_style(div1, "opacity", "1");
    			add_location(div1, file$l, 33, 8, 1190);
    			attr_dev(article, "class", "js-watch topic_row set-animation animate");
    			set_style(article, "line-height", "1.15");
    			set_style(article, "-webkit-text-size-adjust", "100%");
    			set_style(article, "--swiper-theme-color", "#007aff");
    			set_style(article, "--swiper-navigation-size", "44px");
    			set_style(article, "-webkit-box-direction", "normal");
    			set_style(article, "box-sizing", "inherit");
    			set_style(article, "display", "flex");
    			set_style(article, "margin-bottom", "80px");
    			add_location(article, file$l, 4, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, figure);
    			append_dev(figure, img);
    			append_dev(article, t0);
    			append_dev(article, div1);
    			append_dev(div1, header);
    			append_dev(header, h3);
    			append_dev(h3, a);
    			append_dev(a, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(div0, p1);
    			append_dev(p1, t3);
    			append_dev(div0, p2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*image*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);
    			if (dirty & /*body*/ 4) set_data_dev(t3, /*body*/ ctx[2]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HorizontalStyledCard', slots, []);
    	let { image, title, body, linkTo } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (image === undefined && !('image' in $$props || $$self.$$.bound[$$self.$$.props['image']])) {
    			console.warn("<HorizontalStyledCard> was created without expected prop 'image'");
    		}

    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console.warn("<HorizontalStyledCard> was created without expected prop 'title'");
    		}

    		if (body === undefined && !('body' in $$props || $$self.$$.bound[$$self.$$.props['body']])) {
    			console.warn("<HorizontalStyledCard> was created without expected prop 'body'");
    		}

    		if (linkTo === undefined && !('linkTo' in $$props || $$self.$$.bound[$$self.$$.props['linkTo']])) {
    			console.warn("<HorizontalStyledCard> was created without expected prop 'linkTo'");
    		}
    	});

    	const writable_props = ['image', 'title', 'body', 'linkTo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HorizontalStyledCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('image' in $$props) $$invalidate(0, image = $$props.image);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('body' in $$props) $$invalidate(2, body = $$props.body);
    		if ('linkTo' in $$props) $$invalidate(3, linkTo = $$props.linkTo);
    	};

    	$$self.$capture_state = () => ({ image, title, body, linkTo });

    	$$self.$inject_state = $$props => {
    		if ('image' in $$props) $$invalidate(0, image = $$props.image);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('body' in $$props) $$invalidate(2, body = $$props.body);
    		if ('linkTo' in $$props) $$invalidate(3, linkTo = $$props.linkTo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [image, title, body, linkTo];
    }

    class HorizontalStyledCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { image: 0, title: 1, body: 2, linkTo: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HorizontalStyledCard",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get image() {
    		throw new Error("<HorizontalStyledCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<HorizontalStyledCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<HorizontalStyledCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<HorizontalStyledCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<HorizontalStyledCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<HorizontalStyledCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linkTo() {
    		throw new Error("<HorizontalStyledCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkTo(value) {
    		throw new Error("<HorizontalStyledCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\lib\components\pages\home.svelte generated by Svelte v3.55.1 */
    const file$k = "src\\lib\\components\\pages\\home.svelte";

    // (80:41) 
    function create_if_block_11$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("VISION");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(80:41) ",
    		ctx
    	});

    	return block;
    }

    // (78:41) 
    function create_if_block_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("MISSION");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(78:41) ",
    		ctx
    	});

    	return block;
    }

    // (76:20) {#if count == 0}
    function create_if_block_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("APPLY NOW!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(76:20) {#if count == 0}",
    		ctx
    	});

    	return block;
    }

    // (102:33) 
    function create_if_block_8$1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let progress_1;
    	let t2;
    	let p;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "APPLY NOW!";
    			t1 = space();
    			progress_1 = element("progress");
    			t2 = space();
    			p = element("p");
    			p.textContent = "Start your journey at ICONHS!";
    			attr_dev(span, "class", "display-2 svelte-1492yog");
    			add_location(span, file$k, 104, 24, 4830);
    			attr_dev(progress_1, "class", "underBar underBar3 svelte-1492yog");
    			progress_1.value = /*$progress*/ ctx[8];
    			add_location(progress_1, file$k, 105, 24, 4897);
    			attr_dev(div0, "class", "carouselItemTitle d-flex svelte-1492yog");
    			add_location(div0, file$k, 103, 20, 4690);
    			attr_dev(p, "class", "svelte-1492yog");
    			add_location(p, file$k, 107, 20, 5013);
    			attr_dev(div1, "class", "carouselItem svelte-1492yog");
    			add_location(div1, file$k, 102, 16, 4586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, progress_1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "mouseleave", /*mouseleave_handler_3*/ ctx[21], false, false, false),
    					listen_dev(div0, "mouseenter", /*mouseenter_handler_3*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*$progress*/ 256) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);

    				div1_intro = create_in_transition(div1, fly, {
    					x: /*x*/ ctx[1] ? 200 : -200,
    					duration: 2000
    				});

    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(102:33) ",
    		ctx
    	});

    	return block;
    }

    // (94:33) 
    function create_if_block_7$1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let progress_1;
    	let t2;
    	let p;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "VISION";
    			t1 = space();
    			progress_1 = element("progress");
    			t2 = space();
    			p = element("p");
    			p.textContent = "Innovating healthcare education for global impact with compassionate, skilled, socially responsible professionals.";
    			attr_dev(span, "class", "display-2 svelte-1492yog");
    			add_location(span, file$k, 96, 24, 4209);
    			attr_dev(progress_1, "class", "underBar underBar2 svelte-1492yog");
    			progress_1.value = /*$progress*/ ctx[8];
    			add_location(progress_1, file$k, 97, 24, 4272);
    			attr_dev(div0, "class", "carouselItemTitle d-flex svelte-1492yog");
    			add_location(div0, file$k, 95, 20, 4069);
    			attr_dev(p, "class", "svelte-1492yog");
    			add_location(p, file$k, 99, 20, 4388);
    			attr_dev(div1, "class", "carouselItem svelte-1492yog");
    			add_location(div1, file$k, 94, 16, 3965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, progress_1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "mouseleave", /*mouseleave_handler_2*/ ctx[19], false, false, false),
    					listen_dev(div0, "mouseenter", /*mouseenter_handler_2*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*$progress*/ 256) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);

    				div1_intro = create_in_transition(div1, fly, {
    					x: /*x*/ ctx[1] ? 200 : -200,
    					duration: 2000
    				});

    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(94:33) ",
    		ctx
    	});

    	return block;
    }

    // (86:12) {#if count == 0}
    function create_if_block_6$1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let progress_1;
    	let t2;
    	let p;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "MISSION";
    			t1 = space();
    			progress_1 = element("progress");
    			t2 = space();
    			p = element("p");
    			p.textContent = "Inspire College of Nursing educates and empowers students to become global leaders in healthcare through a comprehensive curriculum and a commitment to service.";
    			attr_dev(span, "class", "display-2 svelte-1492yog");
    			add_location(span, file$k, 88, 24, 3540);
    			attr_dev(progress_1, "class", "underBar underBar1 svelte-1492yog");
    			progress_1.value = /*$progress*/ ctx[8];
    			add_location(progress_1, file$k, 89, 24, 3604);
    			attr_dev(div0, "class", "carouselItemTitle d-flex svelte-1492yog");
    			add_location(div0, file$k, 87, 20, 3400);
    			attr_dev(p, "class", "svelte-1492yog");
    			add_location(p, file$k, 91, 20, 3720);
    			attr_dev(div1, "class", "carouselItem svelte-1492yog");
    			add_location(div1, file$k, 86, 16, 3296);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, progress_1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "mouseleave", /*mouseleave_handler_1*/ ctx[17], false, false, false),
    					listen_dev(div0, "mouseenter", /*mouseenter_handler_1*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*$progress*/ 256) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);

    				div1_intro = create_in_transition(div1, fly, {
    					x: /*x*/ ctx[1] ? 200 : -200,
    					duration: 2000
    				});

    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(86:12) {#if count == 0}",
    		ctx
    	});

    	return block;
    }

    // (119:41) 
    function create_if_block_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("MISSION");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(119:41) ",
    		ctx
    	});

    	return block;
    }

    // (117:41) 
    function create_if_block_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("APPLY NOW!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(117:41) ",
    		ctx
    	});

    	return block;
    }

    // (115:20) {#if count == 0}
    function create_if_block_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("VISION");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(115:20) {#if count == 0}",
    		ctx
    	});

    	return block;
    }

    // (188:20) {:else}
    function create_else_block_2(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let hr;
    	let t3;
    	let br2;
    	let t4;
    	let p;
    	let div1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Chairman";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			br2 = element("br");
    			t4 = space();
    			p = element("p");
    			p.textContent = "\"The traditional roles of health professional groups are currently in the process of review and modernization to adapt to challenges imposed by advancement in technology. Secondly, the challenge posed by the global shortage of trained nursing professionals, including teaching faculty has assumed critical proportions.\r\n                                    At the Inspire College of Nursing & Health Sciences, we are committed to take up these challenges and to make a contribution to the modernization of the health and social care agenda. We believe that every crisis can be taken as an opportunity.\"";
    			attr_dev(span, "class", "colourPrimary h1");
    			add_location(span, file$k, 191, 32, 9923);
    			add_location(br0, file$k, 191, 79, 9970);
    			add_location(br1, file$k, 191, 83, 9974);
    			attr_dev(hr, "width", "100px");
    			attr_dev(hr, "class", "svelte-1492yog");
    			add_location(hr, file$k, 192, 32, 10012);
    			add_location(br2, file$k, 192, 51, 10031);
    			attr_dev(p, "class", "lead px-4 svelte-1492yog");
    			add_location(p, file$k, 193, 32, 10069);
    			attr_dev(div0, "class", "insidePt2 svelte-1492yog");
    			add_location(div0, file$k, 190, 28, 9866);
    			attr_dev(div1, "class", "overPt2 svelte-1492yog");
    			add_location(div1, file$k, 189, 24, 9799);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, br1);
    			append_dev(div0, t2);
    			append_dev(div0, hr);
    			append_dev(div0, t3);
    			append_dev(div0, br2);
    			append_dev(div0, t4);
    			append_dev(div0, p);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_transition) div1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(188:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (183:20) {#if !hover1}
    function create_if_block_2$1(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let span;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Person A";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Chairman";
    			add_location(h2, file$k, 184, 28, 9551);
    			attr_dev(span, "class", "h4");
    			add_location(span, file$k, 185, 28, 9598);
    			attr_dev(div, "class", "overPt1 svelte-1492yog");
    			add_location(div, file$k, 183, 24, 9484);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, span);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(183:20) {#if !hover1}",
    		ctx
    	});

    	return block;
    }

    // (212:20) {:else}
    function create_else_block_1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let hr;
    	let t3;
    	let br2;
    	let t4;
    	let p;
    	let div1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Chief Executive";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			br2 = element("br");
    			t4 = space();
    			p = element("p");
    			p.textContent = "\"Inspire College of Nursing & Health Sciences has worked hard to improve nursing education since it opened and is now one of Pakistan's best places to teach nurses. It views nurses as one of the most essential members of the healthcare delivery team, and we place a high priority on their education. The best qualified and driven instructors are employed by our nursing institution, and they are committed to raising the bar for the nursing profession.\"";
    			attr_dev(span, "class", "colourPrimary h1");
    			add_location(span, file$k, 214, 32, 11632);
    			add_location(br0, file$k, 214, 86, 11686);
    			add_location(br1, file$k, 214, 90, 11690);
    			attr_dev(hr, "width", "100px");
    			attr_dev(hr, "class", "svelte-1492yog");
    			add_location(hr, file$k, 215, 32, 11728);
    			add_location(br2, file$k, 215, 51, 11747);
    			attr_dev(p, "class", "lead px-4 svelte-1492yog");
    			add_location(p, file$k, 216, 32, 11785);
    			attr_dev(div0, "class", "insidePt2 svelte-1492yog");
    			add_location(div0, file$k, 213, 28, 11575);
    			attr_dev(div1, "class", "overPt2 svelte-1492yog");
    			add_location(div1, file$k, 212, 24, 11508);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, br1);
    			append_dev(div0, t2);
    			append_dev(div0, hr);
    			append_dev(div0, t3);
    			append_dev(div0, br2);
    			append_dev(div0, t4);
    			append_dev(div0, p);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_transition) div1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(212:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (207:20) {#if !hover2}
    function create_if_block_1$1(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let span;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Person B";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Chief Executive";
    			add_location(h2, file$k, 208, 28, 11335);
    			attr_dev(span, "class", "h4");
    			add_location(span, file$k, 209, 28, 11382);
    			attr_dev(div, "class", "overPt1 svelte-1492yog");
    			add_location(div, file$k, 207, 24, 11268);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, span);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(207:20) {#if !hover2}",
    		ctx
    	});

    	return block;
    }

    // (234:20) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let hr;
    	let t3;
    	let br2;
    	let t4;
    	let p;
    	let div1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Board Member";
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			br2 = element("br");
    			t4 = space();
    			p = element("p");
    			p.textContent = "\"One of Pakistan's largest nursing colleges is Inspire College of Nursing & Health sciences. It has embraced the challenge of educating and producing nurses across all specialties, which is a critical necessity in today's world. The beginning of the graduate programs in Post RN BSN and BSN is not only a source of relief, but it will also restore dignity to this great profession that has been sorely underappreciated. Nurses in Punjab who want to advance their education can now do so at the Inspire College of Nursing & Health sciences.\"";
    			attr_dev(span, "class", "colourPrimary h1");
    			add_location(span, file$k, 236, 32, 13355);
    			add_location(br0, file$k, 236, 83, 13406);
    			add_location(br1, file$k, 236, 87, 13410);
    			attr_dev(hr, "width", "100px");
    			attr_dev(hr, "class", "svelte-1492yog");
    			add_location(hr, file$k, 237, 32, 13448);
    			add_location(br2, file$k, 237, 51, 13467);
    			attr_dev(p, "class", "lead px-4 svelte-1492yog");
    			add_location(p, file$k, 238, 32, 13505);
    			attr_dev(div0, "class", "insidePt2 svelte-1492yog");
    			add_location(div0, file$k, 235, 28, 13298);
    			attr_dev(div1, "class", "overPt2 svelte-1492yog");
    			add_location(div1, file$k, 234, 24, 13231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, br1);
    			append_dev(div0, t2);
    			append_dev(div0, hr);
    			append_dev(div0, t3);
    			append_dev(div0, br2);
    			append_dev(div0, t4);
    			append_dev(div0, p);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_transition) div1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(234:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (229:20) {#if !hover3}
    function create_if_block$1(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Person C";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Board Member";
    			add_location(h2, file$k, 230, 28, 13061);
    			attr_dev(span, "class", "h4");
    			add_location(span, file$k, 231, 28, 13108);
    			attr_dev(div, "class", "overPt1 svelte-1492yog");
    			add_location(div, file$k, 229, 24, 13010);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, span);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(229:20) {#if !hover3}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let t0;
    	let div29;
    	let div3;
    	let div2;
    	let button0;
    	let svg0;
    	let g0;
    	let g1;
    	let g2;
    	let path0;
    	let t1;
    	let div0;
    	let t2;
    	let current_block_type_index;
    	let if_block1;
    	let t3;
    	let button1;
    	let svg1;
    	let g3;
    	let g4;
    	let g5;
    	let path1;
    	let t4;
    	let div1;
    	let t5;
    	let div10;
    	let div9;
    	let div4;
    	let span0;
    	let t7;
    	let br0;
    	let t8;
    	let p0;
    	let t10;
    	let div8;
    	let div5;
    	let a0;
    	let t11;
    	let i0;
    	let t12;
    	let div6;
    	let a1;
    	let t13;
    	let i1;
    	let t14;
    	let div7;
    	let a2;
    	let t15;
    	let i2;
    	let t16;
    	let div12;
    	let div11;
    	let span1;
    	let strong0;
    	let t18;
    	let br1;
    	let br2;
    	let t19;
    	let p1;
    	let strong1;
    	let t21;
    	let br3;
    	let t22;
    	let hr0;
    	let t23;
    	let br4;
    	let t24;
    	let span2;
    	let t26;
    	let br5;
    	let br6;
    	let t27;
    	let p2;
    	let t29;
    	let br7;
    	let t30;
    	let span3;
    	let t32;
    	let br8;
    	let br9;
    	let t33;
    	let p3;
    	let t35;
    	let br10;
    	let t36;
    	let span4;
    	let t38;
    	let br11;
    	let br12;
    	let t39;
    	let p4;
    	let t41;
    	let br13;
    	let t42;
    	let span5;
    	let t44;
    	let br14;
    	let br15;
    	let t45;
    	let p5;
    	let t47;
    	let br16;
    	let t48;
    	let span6;
    	let t50;
    	let br17;
    	let br18;
    	let t51;
    	let p6;
    	let t53;
    	let div22;
    	let div15;
    	let div14;
    	let div13;
    	let current_block_type_index_1;
    	let if_block3;
    	let t54;
    	let div18;
    	let div17;
    	let div16;
    	let current_block_type_index_2;
    	let if_block4;
    	let t55;
    	let div21;
    	let div20;
    	let div19;
    	let current_block_type_index_3;
    	let if_block5;
    	let t56;
    	let div28;
    	let div27;
    	let span7;
    	let strong2;
    	let t58;
    	let br19;
    	let t59;
    	let br20;
    	let t60;
    	let p7;
    	let strong3;
    	let t62;
    	let hr1;
    	let t63;
    	let br21;
    	let t64;
    	let div25;
    	let a4;
    	let div23;
    	let span8;
    	let t66;
    	let br22;
    	let t67;
    	let br23;
    	let t68;
    	let a3;
    	let t69;
    	let i3;
    	let t70;
    	let a6;
    	let div24;
    	let span9;
    	let t72;
    	let br24;
    	let t73;
    	let br25;
    	let t74;
    	let a5;
    	let t75;
    	let i4;
    	let t76;
    	let br26;
    	let t77;
    	let br27;
    	let t78;
    	let p8;
    	let strong4;
    	let t80;
    	let hr2;
    	let t81;
    	let br28;
    	let t82;
    	let br29;
    	let t83;
    	let div26;
    	let horizontalstyledcard0;
    	let t84;
    	let horizontalstyledcard1;
    	let t85;
    	let horizontalstyledcard2;
    	let t86;
    	let br30;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*count*/ ctx[0] == 0) return create_if_block_9$1;
    		if (/*count*/ ctx[0] == 1) return create_if_block_10$1;
    		if (/*count*/ ctx[0] == 2) return create_if_block_11$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);
    	const if_block_creators = [create_if_block_6$1, create_if_block_7$1, create_if_block_8$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*count*/ ctx[0] == 0) return 0;
    		if (/*count*/ ctx[0] == 1) return 1;
    		if (/*count*/ ctx[0] == 2) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	function select_block_type_2(ctx, dirty) {
    		if (/*count*/ ctx[0] == 0) return create_if_block_3$1;
    		if (/*count*/ ctx[0] == 1) return create_if_block_4$1;
    		if (/*count*/ ctx[0] == 2) return create_if_block_5$1;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block2 = current_block_type_1 && current_block_type_1(ctx);
    	const if_block_creators_1 = [create_if_block_2$1, create_else_block_2];
    	const if_blocks_1 = [];

    	function select_block_type_3(ctx, dirty) {
    		if (!/*hover1*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_3(ctx);
    	if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	const if_block_creators_2 = [create_if_block_1$1, create_else_block_1];
    	const if_blocks_2 = [];

    	function select_block_type_4(ctx, dirty) {
    		if (!/*hover2*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index_2 = select_block_type_4(ctx);
    	if_block4 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    	const if_block_creators_3 = [create_if_block$1, create_else_block];
    	const if_blocks_3 = [];

    	function select_block_type_5(ctx, dirty) {
    		if (!/*hover3*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index_3 = select_block_type_5(ctx);
    	if_block5 = if_blocks_3[current_block_type_index_3] = if_block_creators_3[current_block_type_index_3](ctx);

    	horizontalstyledcard0 = new HorizontalStyledCard({
    			props: {
    				image: "https://th.bing.com/th/id/OIP._n3citWOk0MXVY9v5Ul1xgHaE8?pid=ImgDet&rs=1",
    				title: "Faculty",
    				body: "The faculty at Inspire College of Nursing and Health Sciences are experienced professionals dedicated to helping students achieve their goals.",
    				linkTo: "/"
    			},
    			$$inline: true
    		});

    	horizontalstyledcard1 = new HorizontalStyledCard({
    			props: {
    				image: "https://th.bing.com/th/id/R.ad63780285bd79200a8e622bb29de576?rik=lVwIVBOrdTCzJw&riu=http%3a%2f%2fwww.anc.edu%2fcampus-tour%2fimages%2fsmallpic-AH-computer-lab.jpg&ehk=Xn4Qk5tb1jKYms9npdGbqmz5W8bvSU5bs%2f81Bx7eM%2fw%3d&risl=&pid=ImgRaw&r=0",
    				title: "Labs",
    				body: "The labs at Inspire College of Nursing and Health Sciences provide a nurturing environment that fosters student growth, empowers them to excel in their chosen fields, and ignites their passion for learning.",
    				linkTo: "/"
    			},
    			$$inline: true
    		});

    	horizontalstyledcard2 = new HorizontalStyledCard({
    			props: {
    				image: "https://th.bing.com/th/id/OIP.cq-zIsPj9GD5_UqGtln51AHaFj?pid=ImgDet&rs=1",
    				title: "Library",
    				body: "The library at Inspire College of Nursing and Health Sciences is a treasure trove of knowledge, boasting an extensive collection of over 110+ books that cater to the diverse interests and academic pursuits of our students.",
    				linkTo: "/"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div29 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g2 = svg_element("g");
    			path0 = svg_element("path");
    			t1 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			g3 = svg_element("g");
    			g4 = svg_element("g");
    			g5 = svg_element("g");
    			path1 = svg_element("path");
    			t4 = space();
    			div1 = element("div");
    			if (if_block2) if_block2.c();
    			t5 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div4 = element("div");
    			span0 = element("span");
    			span0.textContent = "Know about ICONHS";
    			t7 = space();
    			br0 = element("br");
    			t8 = space();
    			p0 = element("p");
    			p0.textContent = "See what we can offer our students at ICONHS";
    			t10 = space();
    			div8 = element("div");
    			div5 = element("div");
    			a0 = element("a");
    			t11 = text("Academic Programs\r\n                        ");
    			i0 = element("i");
    			t12 = space();
    			div6 = element("div");
    			a1 = element("a");
    			t13 = text("Visit ICONHS\r\n                        ");
    			i1 = element("i");
    			t14 = space();
    			div7 = element("div");
    			a2 = element("a");
    			t15 = text("Campus Library\r\n                        ");
    			i2 = element("i");
    			t16 = space();
    			div12 = element("div");
    			div11 = element("div");
    			span1 = element("span");
    			strong0 = element("strong");
    			strong0.textContent = "What We Strive to Achieve";
    			t18 = space();
    			br1 = element("br");
    			br2 = element("br");
    			t19 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Caring. Excellence. Innovation. Professionalism. Respect.";
    			t21 = space();
    			br3 = element("br");
    			t22 = space();
    			hr0 = element("hr");
    			t23 = space();
    			br4 = element("br");
    			t24 = space();
    			span2 = element("span");
    			span2.textContent = "Caring";
    			t26 = space();
    			br5 = element("br");
    			br6 = element("br");
    			t27 = space();
    			p2 = element("p");
    			p2.textContent = "We are committed to interpersonal relationships that promote the well-being of self and others.";
    			t29 = space();
    			br7 = element("br");
    			t30 = space();
    			span3 = element("span");
    			span3.textContent = "Excellence";
    			t32 = space();
    			br8 = element("br");
    			br9 = element("br");
    			t33 = space();
    			p3 = element("p");
    			p3.textContent = "We seek to achieve the highest possible quality in our educational programs and in our teaching, research, service and public engagement.";
    			t35 = space();
    			br10 = element("br");
    			t36 = space();
    			span4 = element("span");
    			span4.textContent = "Innovation";
    			t38 = space();
    			br11 = element("br");
    			br12 = element("br");
    			t39 = space();
    			p4 = element("p");
    			p4.textContent = "We strive for innovation in teaching, research and public engagement, in order to involve students in learning and to advance knowledge in nursing education, research, and public engagement.";
    			t41 = space();
    			br13 = element("br");
    			t42 = space();
    			span5 = element("span");
    			span5.textContent = "Professionalism";
    			t44 = space();
    			br14 = element("br");
    			br15 = element("br");
    			t45 = space();
    			p5 = element("p");
    			p5.textContent = "We are committed to professional growth, collegiality, and teamwork.";
    			t47 = space();
    			br16 = element("br");
    			t48 = space();
    			span6 = element("span");
    			span6.textContent = "Respect";
    			t50 = space();
    			br17 = element("br");
    			br18 = element("br");
    			t51 = space();
    			p6 = element("p");
    			p6.textContent = "We create a respectful learning and working environment and demonstrate respect with students, faculty, staff, external partners, and ourselves.";
    			t53 = space();
    			div22 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			if_block3.c();
    			t54 = space();
    			div18 = element("div");
    			div17 = element("div");
    			div16 = element("div");
    			if_block4.c();
    			t55 = space();
    			div21 = element("div");
    			div20 = element("div");
    			div19 = element("div");
    			if_block5.c();
    			t56 = space();
    			div28 = element("div");
    			div27 = element("div");
    			span7 = element("span");
    			strong2 = element("strong");
    			strong2.textContent = "What We Have To Offer";
    			t58 = space();
    			br19 = element("br");
    			t59 = space();
    			br20 = element("br");
    			t60 = space();
    			p7 = element("p");
    			strong3 = element("strong");
    			strong3.textContent = "Programs";
    			t62 = space();
    			hr1 = element("hr");
    			t63 = space();
    			br21 = element("br");
    			t64 = space();
    			div25 = element("div");
    			a4 = element("a");
    			div23 = element("div");
    			span8 = element("span");
    			span8.textContent = "B.Sc. Nursing";
    			t66 = space();
    			br22 = element("br");
    			t67 = space();
    			br23 = element("br");
    			t68 = space();
    			a3 = element("a");
    			t69 = text("Learn More ");
    			i3 = element("i");
    			t70 = space();
    			a6 = element("a");
    			div24 = element("div");
    			span9 = element("span");
    			span9.textContent = "Post RN B.Sc. Nursing";
    			t72 = space();
    			br24 = element("br");
    			t73 = space();
    			br25 = element("br");
    			t74 = space();
    			a5 = element("a");
    			t75 = text("Learn More ");
    			i4 = element("i");
    			t76 = space();
    			br26 = element("br");
    			t77 = space();
    			br27 = element("br");
    			t78 = space();
    			p8 = element("p");
    			strong4 = element("strong");
    			strong4.textContent = "Facilities";
    			t80 = space();
    			hr2 = element("hr");
    			t81 = space();
    			br28 = element("br");
    			t82 = space();
    			br29 = element("br");
    			t83 = space();
    			div26 = element("div");
    			create_component(horizontalstyledcard0.$$.fragment);
    			t84 = space();
    			create_component(horizontalstyledcard1.$$.fragment);
    			t85 = space();
    			create_component(horizontalstyledcard2.$$.fragment);
    			t86 = space();
    			br30 = element("br");
    			document.title = "ICONHS - Home";
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$k, 73, 115, 2585);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$k, 73, 162, 2632);
    			attr_dev(path0, "d", "M15 4L7 12L15 20");
    			attr_dev(path0, "stroke", "#FFF");
    			attr_dev(path0, "stroke-width", "0.72");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			add_location(path0, file$k, 73, 272, 2742);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$k, 73, 243, 2713);
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "height", "80px");
    			attr_dev(svg0, "width", "80px");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$k, 73, 16, 2486);
    			attr_dev(div0, "class", "carouselBtnPopover2 svelte-1492yog");
    			toggle_class(div0, "curious2", /*hereKitty2*/ ctx[4]);
    			add_location(div0, file$k, 74, 16, 2886);
    			attr_dev(button0, "class", "carouselBtns1 carouselBtns display-4 svelte-1492yog");
    			add_location(button0, file$k, 72, 12, 2312);
    			attr_dev(g3, "id", "SVGRepo_bgCarrier");
    			attr_dev(g3, "stroke-width", "0");
    			add_location(g3, file$k, 112, 115, 5399);
    			attr_dev(g4, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g4, "stroke-linecap", "round");
    			attr_dev(g4, "stroke-linejoin", "round");
    			add_location(g4, file$k, 112, 162, 5446);
    			attr_dev(path1, "d", "M9 20L17 12L9 4");
    			attr_dev(path1, "stroke", "#FFF");
    			attr_dev(path1, "stroke-width", "0.72");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			add_location(path1, file$k, 112, 272, 5556);
    			attr_dev(g5, "id", "SVGRepo_iconCarrier");
    			add_location(g5, file$k, 112, 243, 5527);
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "height", "80px");
    			attr_dev(svg1, "width", "80px");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$k, 112, 16, 5300);
    			attr_dev(div1, "class", "carouselBtnPopover svelte-1492yog");
    			toggle_class(div1, "curious", /*hereKitty*/ ctx[3]);
    			add_location(div1, file$k, 113, 16, 5699);
    			attr_dev(button1, "class", "carouselBtns2 carouselBtns display-4 svelte-1492yog");
    			add_location(button1, file$k, 111, 12, 5128);
    			attr_dev(div2, "class", "overImg d-flex svelte-1492yog");
    			add_location(div2, file$k, 71, 8, 2270);
    			attr_dev(div3, "class", "welcomeMsg svelte-1492yog");
    			set_style(div3, "background-image", "url(" + /*currentImg*/ ctx[2] + ")");
    			add_location(div3, file$k, 69, 4, 2159);
    			set_style(span0, "font-size", "xx-large");
    			attr_dev(span0, "class", "lead");
    			add_location(span0, file$k, 129, 16, 6214);
    			add_location(br0, file$k, 129, 89, 6287);
    			set_style(p0, "text-align", "right");
    			add_location(p0, file$k, 130, 16, 6309);
    			attr_dev(div4, "class", "guideInter svelte-1492yog");
    			add_location(div4, file$k, 128, 12, 6172);
    			attr_dev(i0, "class", "fa fa-external-link svelte-1492yog");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$k, 137, 24, 6674);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-1492yog");
    			add_location(a0, file$k, 135, 20, 6524);
    			attr_dev(div5, "class", "interCard academicInter svelte-1492yog");
    			add_location(div5, file$k, 134, 16, 6465);
    			attr_dev(i1, "class", "fa fa-external-link svelte-1492yog");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$k, 144, 24, 6947);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "svelte-1492yog");
    			add_location(a1, file$k, 142, 20, 6871);
    			attr_dev(div6, "class", "interCard campusInter svelte-1492yog");
    			add_location(div6, file$k, 141, 16, 6814);
    			attr_dev(i2, "class", "fa fa-external-link svelte-1492yog");
    			attr_dev(i2, "aria-hidden", "true");
    			add_location(i2, file$k, 151, 24, 7223);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "svelte-1492yog");
    			add_location(a2, file$k, 149, 20, 7145);
    			attr_dev(div7, "class", "interCard libraryInter svelte-1492yog");
    			add_location(div7, file$k, 148, 16, 7087);
    			attr_dev(div8, "class", "interCards svelte-1492yog");
    			add_location(div8, file$k, 133, 12, 6423);
    			attr_dev(div9, "class", "inIntersector svelte-1492yog");
    			add_location(div9, file$k, 127, 8, 6131);
    			attr_dev(div10, "class", "homeIntersector svelte-1492yog");
    			add_location(div10, file$k, 126, 4, 6092);
    			add_location(strong0, file$k, 160, 37, 7475);
    			attr_dev(span1, "class", "display-6 ");
    			add_location(span1, file$k, 160, 12, 7450);
    			add_location(br1, file$k, 160, 87, 7525);
    			add_location(br2, file$k, 160, 91, 7529);
    			add_location(strong1, file$k, 161, 59, 7594);
    			attr_dev(p1, "class", "lead colourPrimary text-center px-4");
    			add_location(p1, file$k, 161, 12, 7547);
    			add_location(br3, file$k, 162, 12, 7687);
    			attr_dev(hr0, "width", "250px");
    			set_style(hr0, "margin", "0 auto");
    			add_location(hr0, file$k, 162, 17, 7692);
    			add_location(br4, file$k, 162, 60, 7735);
    			attr_dev(span2, "class", "h3 colourPrimary");
    			set_style(span2, "font-weight", "400");
    			add_location(span2, file$k, 164, 12, 7755);
    			add_location(br5, file$k, 164, 83, 7826);
    			add_location(br6, file$k, 164, 87, 7830);
    			attr_dev(p2, "class", "lead");
    			add_location(p2, file$k, 165, 12, 7848);
    			add_location(br7, file$k, 165, 128, 7964);
    			attr_dev(span3, "class", "h3 colourPrimary");
    			set_style(span3, "font-weight", "400");
    			add_location(span3, file$k, 166, 12, 7982);
    			add_location(br8, file$k, 166, 88, 8058);
    			add_location(br9, file$k, 166, 92, 8062);
    			attr_dev(p3, "class", "lead");
    			add_location(p3, file$k, 167, 12, 8080);
    			add_location(br10, file$k, 167, 170, 8238);
    			attr_dev(span4, "class", "h3 colourPrimary");
    			set_style(span4, "font-weight", "400");
    			add_location(span4, file$k, 168, 12, 8256);
    			add_location(br11, file$k, 168, 88, 8332);
    			add_location(br12, file$k, 168, 92, 8336);
    			attr_dev(p4, "class", "lead");
    			add_location(p4, file$k, 169, 12, 8354);
    			add_location(br13, file$k, 169, 223, 8565);
    			attr_dev(span5, "class", "h3 colourPrimary");
    			set_style(span5, "font-weight", "400");
    			add_location(span5, file$k, 170, 12, 8583);
    			add_location(br14, file$k, 170, 93, 8664);
    			add_location(br15, file$k, 170, 97, 8668);
    			attr_dev(p5, "class", "lead");
    			add_location(p5, file$k, 171, 12, 8686);
    			add_location(br16, file$k, 171, 101, 8775);
    			attr_dev(span6, "class", "h3 colourPrimary");
    			set_style(span6, "font-weight", "400");
    			add_location(span6, file$k, 172, 12, 8793);
    			add_location(br17, file$k, 172, 85, 8866);
    			add_location(br18, file$k, 172, 89, 8870);
    			attr_dev(p6, "class", "lead");
    			add_location(p6, file$k, 173, 12, 8888);
    			attr_dev(div11, "class", "values svelte-1492yog");
    			add_location(div11, file$k, 159, 8, 7416);
    			attr_dev(div12, "class", "this_Main");
    			add_location(div12, file$k, 158, 4, 7383);
    			attr_dev(div13, "class", "over svelte-1492yog");
    			add_location(div13, file$k, 181, 16, 9405);
    			attr_dev(div14, "class", "overPortrait svelte-1492yog");
    			set_style(div14, "background-image", "url('https://th.bing.com/th/id/R.064f5cc8e4c2e5f615285b96151cb707?rik=ZKo%2bv7KmQxAokQ&pid=ImgRaw&r=0')");
    			add_location(div14, file$k, 180, 12, 9230);
    			attr_dev(div15, "class", "msgs svelte-1492yog");
    			add_location(div15, file$k, 179, 8, 9124);
    			attr_dev(div16, "class", "over svelte-1492yog");
    			add_location(div16, file$k, 205, 16, 11189);
    			attr_dev(div17, "class", "overPortrait svelte-1492yog");
    			set_style(div17, "background-image", "url('https://th.bing.com/th/id/OIP.f5Kri_Mbf5C2C75jArJ4twHaLD?pid=ImgDet&rs=1')");
    			add_location(div17, file$k, 204, 12, 11038);
    			attr_dev(div18, "class", "msgs svelte-1492yog");
    			add_location(div18, file$k, 203, 8, 10932);
    			attr_dev(div19, "class", "over svelte-1492yog");
    			add_location(div19, file$k, 227, 16, 12931);
    			attr_dev(div20, "class", "overPortrait svelte-1492yog");
    			set_style(div20, "background-image", "url('https://th.bing.com/th/id/R.ff8a6bf7756d461760b1ac436b70312e?rik=KfytdeCThAVwnw&riu=http%3a%2f%2fmedia.cleveland.com%2favon-lake%2fphoto%2ff246645-232jpg-351f78fd51882f0e.jpg&ehk=Q6e2pII4SwNbrBjeRvQP0gSmd5Os231LhcDE7zrQ3XE%3d&risl=&pid=ImgRaw&r=0')");
    			add_location(div20, file$k, 226, 12, 12606);
    			attr_dev(div21, "class", "msgs svelte-1492yog");
    			add_location(div21, file$k, 225, 8, 12500);
    			attr_dev(div22, "class", "messages1 svelte-1492yog");
    			add_location(div22, file$k, 178, 4, 9091);
    			add_location(strong2, file$k, 252, 37, 14429);
    			attr_dev(span7, "class", "display-6 ");
    			add_location(span7, file$k, 252, 12, 14404);
    			add_location(br19, file$k, 252, 83, 14475);
    			add_location(br20, file$k, 252, 88, 14480);
    			add_location(strong3, file$k, 253, 59, 14545);
    			attr_dev(p7, "class", "lead colourPrimary text-center px-4");
    			add_location(p7, file$k, 253, 12, 14498);
    			attr_dev(hr1, "width", "250px");
    			set_style(hr1, "margin", "0 auto");
    			add_location(hr1, file$k, 254, 12, 14589);
    			add_location(br21, file$k, 254, 55, 14632);
    			attr_dev(span8, "class", "colourPrimary lead");
    			set_style(span8, "font-size", "xx-large");
    			add_location(span8, file$k, 259, 24, 14990);
    			add_location(br22, file$k, 259, 105, 15071);
    			add_location(br23, file$k, 259, 110, 15076);
    			attr_dev(i3, "class", "fa fa-external-link");
    			attr_dev(i3, "aria-hidden", "true");
    			add_location(i3, file$k, 260, 68, 15150);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "btnLearnMore svelte-1492yog");
    			add_location(a3, file$k, 260, 24, 15106);
    			attr_dev(div23, "class", "inProg svelte-1492yog");
    			add_location(div23, file$k, 258, 20, 14944);
    			attr_dev(a4, "href", "/");
    			attr_dev(a4, "class", "progs deAnc svelte-1492yog");
    			set_style(a4, "background-image", "url('https://th.bing.com/th/id/R.e6fe35bc4de47978af8b989c02489e46?rik=lTfvBxvdbZJOPw&pid=ImgRaw&r=0')");
    			add_location(a4, file$k, 257, 16, 14692);
    			attr_dev(span9, "class", "colourPrimary lead");
    			set_style(span9, "font-size", "xx-large");
    			add_location(span9, file$k, 265, 24, 15574);
    			add_location(br24, file$k, 265, 113, 15663);
    			add_location(br25, file$k, 265, 118, 15668);
    			attr_dev(i4, "class", "fa fa-external-link");
    			attr_dev(i4, "aria-hidden", "true");
    			add_location(i4, file$k, 266, 69, 15743);
    			attr_dev(a5, "href", "/");
    			attr_dev(a5, "class", "btnLearnMore svelte-1492yog");
    			add_location(a5, file$k, 266, 24, 15698);
    			attr_dev(div24, "class", "inProg svelte-1492yog");
    			add_location(div24, file$k, 264, 20, 15528);
    			attr_dev(a6, "href", "/");
    			attr_dev(a6, "class", "progs deAnc svelte-1492yog");
    			set_style(a6, "background-image", "url('https://th.bing.com/th/id/R.a924cc167c78ac7e62d5327eb2a624e4?rik=wFSOvBDqXhBQ2A&pid=ImgRaw&r=0')");
    			add_location(a6, file$k, 263, 16, 15276);
    			attr_dev(div25, "class", "progCont svelte-1492yog");
    			add_location(div25, file$k, 256, 12, 14652);
    			add_location(br26, file$k, 271, 12, 15887);
    			add_location(br27, file$k, 271, 17, 15892);
    			add_location(strong4, file$k, 272, 59, 15957);
    			attr_dev(p8, "class", "lead colourPrimary text-center px-4");
    			add_location(p8, file$k, 272, 12, 15910);
    			attr_dev(hr2, "width", "250px");
    			set_style(hr2, "margin", "0 auto");
    			add_location(hr2, file$k, 273, 12, 16003);
    			add_location(br28, file$k, 273, 55, 16046);
    			add_location(br29, file$k, 273, 60, 16051);
    			attr_dev(div26, "class", "styledCard");
    			add_location(div26, file$k, 275, 12, 16071);
    			attr_dev(div27, "class", "programs");
    			add_location(div27, file$k, 251, 8, 14368);
    			attr_dev(div28, "class", "this_Main");
    			add_location(div28, file$k, 250, 4, 14335);
    			add_location(br30, file$k, 300, 4, 17636);
    			attr_dev(div29, "class", "thisHome svelte-1492yog");
    			add_location(div29, file$k, 67, 0, 2125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div29, anchor);
    			append_dev(div29, div3);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, g0);
    			append_dev(svg0, g1);
    			append_dev(svg0, g2);
    			append_dev(g2, path0);
    			append_dev(button0, t1);
    			append_dev(button0, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div2, t2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div2, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, g3);
    			append_dev(svg1, g4);
    			append_dev(svg1, g5);
    			append_dev(g5, path1);
    			append_dev(button1, t4);
    			append_dev(button1, div1);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div29, t5);
    			append_dev(div29, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div4);
    			append_dev(div4, span0);
    			append_dev(div4, t7);
    			append_dev(div4, br0);
    			append_dev(div4, t8);
    			append_dev(div4, p0);
    			append_dev(div9, t10);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div5, a0);
    			append_dev(a0, t11);
    			append_dev(a0, i0);
    			append_dev(div8, t12);
    			append_dev(div8, div6);
    			append_dev(div6, a1);
    			append_dev(a1, t13);
    			append_dev(a1, i1);
    			append_dev(div8, t14);
    			append_dev(div8, div7);
    			append_dev(div7, a2);
    			append_dev(a2, t15);
    			append_dev(a2, i2);
    			append_dev(div29, t16);
    			append_dev(div29, div12);
    			append_dev(div12, div11);
    			append_dev(div11, span1);
    			append_dev(span1, strong0);
    			append_dev(div11, t18);
    			append_dev(div11, br1);
    			append_dev(div11, br2);
    			append_dev(div11, t19);
    			append_dev(div11, p1);
    			append_dev(p1, strong1);
    			append_dev(div11, t21);
    			append_dev(div11, br3);
    			append_dev(div11, t22);
    			append_dev(div11, hr0);
    			append_dev(div11, t23);
    			append_dev(div11, br4);
    			append_dev(div11, t24);
    			append_dev(div11, span2);
    			append_dev(div11, t26);
    			append_dev(div11, br5);
    			append_dev(div11, br6);
    			append_dev(div11, t27);
    			append_dev(div11, p2);
    			append_dev(div11, t29);
    			append_dev(div11, br7);
    			append_dev(div11, t30);
    			append_dev(div11, span3);
    			append_dev(div11, t32);
    			append_dev(div11, br8);
    			append_dev(div11, br9);
    			append_dev(div11, t33);
    			append_dev(div11, p3);
    			append_dev(div11, t35);
    			append_dev(div11, br10);
    			append_dev(div11, t36);
    			append_dev(div11, span4);
    			append_dev(div11, t38);
    			append_dev(div11, br11);
    			append_dev(div11, br12);
    			append_dev(div11, t39);
    			append_dev(div11, p4);
    			append_dev(div11, t41);
    			append_dev(div11, br13);
    			append_dev(div11, t42);
    			append_dev(div11, span5);
    			append_dev(div11, t44);
    			append_dev(div11, br14);
    			append_dev(div11, br15);
    			append_dev(div11, t45);
    			append_dev(div11, p5);
    			append_dev(div11, t47);
    			append_dev(div11, br16);
    			append_dev(div11, t48);
    			append_dev(div11, span6);
    			append_dev(div11, t50);
    			append_dev(div11, br17);
    			append_dev(div11, br18);
    			append_dev(div11, t51);
    			append_dev(div11, p6);
    			append_dev(div29, t53);
    			append_dev(div29, div22);
    			append_dev(div22, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			if_blocks_1[current_block_type_index_1].m(div13, null);
    			append_dev(div22, t54);
    			append_dev(div22, div18);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			if_blocks_2[current_block_type_index_2].m(div16, null);
    			append_dev(div22, t55);
    			append_dev(div22, div21);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			if_blocks_3[current_block_type_index_3].m(div19, null);
    			append_dev(div29, t56);
    			append_dev(div29, div28);
    			append_dev(div28, div27);
    			append_dev(div27, span7);
    			append_dev(span7, strong2);
    			append_dev(div27, t58);
    			append_dev(div27, br19);
    			append_dev(div27, t59);
    			append_dev(div27, br20);
    			append_dev(div27, t60);
    			append_dev(div27, p7);
    			append_dev(p7, strong3);
    			append_dev(div27, t62);
    			append_dev(div27, hr1);
    			append_dev(div27, t63);
    			append_dev(div27, br21);
    			append_dev(div27, t64);
    			append_dev(div27, div25);
    			append_dev(div25, a4);
    			append_dev(a4, div23);
    			append_dev(div23, span8);
    			append_dev(div23, t66);
    			append_dev(div23, br22);
    			append_dev(div23, t67);
    			append_dev(div23, br23);
    			append_dev(div23, t68);
    			append_dev(div23, a3);
    			append_dev(a3, t69);
    			append_dev(a3, i3);
    			append_dev(div25, t70);
    			append_dev(div25, a6);
    			append_dev(a6, div24);
    			append_dev(div24, span9);
    			append_dev(div24, t72);
    			append_dev(div24, br24);
    			append_dev(div24, t73);
    			append_dev(div24, br25);
    			append_dev(div24, t74);
    			append_dev(div24, a5);
    			append_dev(a5, t75);
    			append_dev(a5, i4);
    			append_dev(div27, t76);
    			append_dev(div27, br26);
    			append_dev(div27, t77);
    			append_dev(div27, br27);
    			append_dev(div27, t78);
    			append_dev(div27, p8);
    			append_dev(p8, strong4);
    			append_dev(div27, t80);
    			append_dev(div27, hr2);
    			append_dev(div27, t81);
    			append_dev(div27, br28);
    			append_dev(div27, t82);
    			append_dev(div27, br29);
    			append_dev(div27, t83);
    			append_dev(div27, div26);
    			mount_component(horizontalstyledcard0, div26, null);
    			append_dev(div26, t84);
    			mount_component(horizontalstyledcard1, div26, null);
    			append_dev(div26, t85);
    			mount_component(horizontalstyledcard2, div26, null);
    			append_dev(div29, t86);
    			append_dev(div29, br30);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handlePrev*/ ctx[11], false, false, false),
    					listen_dev(button0, "mouseenter", /*mouseenter_handler*/ ctx[15], false, false, false),
    					listen_dev(button0, "mouseleave", /*mouseleave_handler*/ ctx[16], false, false, false),
    					listen_dev(button1, "click", /*handleNext*/ ctx[12], false, false, false),
    					listen_dev(button1, "mouseenter", /*mouseenter_handler_4*/ ctx[23], false, false, false),
    					listen_dev(button1, "mouseleave", /*mouseleave_handler_4*/ ctx[24], false, false, false),
    					listen_dev(a0, "click", /*click_handler*/ ctx[25], false, false, false),
    					listen_dev(a0, "click", /*click_handler_1*/ ctx[26], false, false, false),
    					listen_dev(div15, "mouseenter", /*mouseenter_handler_5*/ ctx[27], false, false, false),
    					listen_dev(div15, "mouseleave", /*mouseleave_handler_5*/ ctx[28], false, false, false),
    					listen_dev(div18, "mouseenter", /*mouseenter_handler_6*/ ctx[29], false, false, false),
    					listen_dev(div18, "mouseleave", /*mouseleave_handler_6*/ ctx[30], false, false, false),
    					listen_dev(div21, "mouseenter", /*mouseenter_handler_7*/ ctx[31], false, false, false),
    					listen_dev(div21, "mouseleave", /*mouseleave_handler_7*/ ctx[32], false, false, false),
    					listen_dev(a4, "click", /*click_handler_2*/ ctx[33], false, false, false),
    					listen_dev(a4, "click", /*click_handler_3*/ ctx[34], false, false, false),
    					listen_dev(a6, "click", /*click_handler_4*/ ctx[35], false, false, false),
    					listen_dev(a6, "click", /*click_handler_5*/ ctx[36], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (!current || dirty[0] & /*hereKitty2*/ 16) {
    				toggle_class(div0, "curious2", /*hereKitty2*/ ctx[4]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					} else {
    						if_block1.p(ctx, dirty);
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(div2, t3);
    				} else {
    					if_block1 = null;
    				}
    			}

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_2(ctx))) {
    				if (if_block2) if_block2.d(1);
    				if_block2 = current_block_type_1 && current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			}

    			if (!current || dirty[0] & /*hereKitty*/ 8) {
    				toggle_class(div1, "curious", /*hereKitty*/ ctx[3]);
    			}

    			if (!current || dirty[0] & /*currentImg*/ 4) {
    				set_style(div3, "background-image", "url(" + /*currentImg*/ ctx[2] + ")");
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_3(ctx);

    			if (current_block_type_index_1 !== previous_block_index_1) {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block3 = if_blocks_1[current_block_type_index_1];

    				if (!if_block3) {
    					if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block3.c();
    				}

    				transition_in(if_block3, 1);
    				if_block3.m(div13, null);
    			}

    			let previous_block_index_2 = current_block_type_index_2;
    			current_block_type_index_2 = select_block_type_4(ctx);

    			if (current_block_type_index_2 !== previous_block_index_2) {
    				group_outros();

    				transition_out(if_blocks_2[previous_block_index_2], 1, 1, () => {
    					if_blocks_2[previous_block_index_2] = null;
    				});

    				check_outros();
    				if_block4 = if_blocks_2[current_block_type_index_2];

    				if (!if_block4) {
    					if_block4 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    					if_block4.c();
    				}

    				transition_in(if_block4, 1);
    				if_block4.m(div16, null);
    			}

    			let previous_block_index_3 = current_block_type_index_3;
    			current_block_type_index_3 = select_block_type_5(ctx);

    			if (current_block_type_index_3 !== previous_block_index_3) {
    				group_outros();

    				transition_out(if_blocks_3[previous_block_index_3], 1, 1, () => {
    					if_blocks_3[previous_block_index_3] = null;
    				});

    				check_outros();
    				if_block5 = if_blocks_3[current_block_type_index_3];

    				if (!if_block5) {
    					if_block5 = if_blocks_3[current_block_type_index_3] = if_block_creators_3[current_block_type_index_3](ctx);
    					if_block5.c();
    				}

    				transition_in(if_block5, 1);
    				if_block5.m(div19, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(horizontalstyledcard0.$$.fragment, local);
    			transition_in(horizontalstyledcard1.$$.fragment, local);
    			transition_in(horizontalstyledcard2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(horizontalstyledcard0.$$.fragment, local);
    			transition_out(horizontalstyledcard1.$$.fragment, local);
    			transition_out(horizontalstyledcard2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div29);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (if_block2) {
    				if_block2.d();
    			}

    			if_blocks_1[current_block_type_index_1].d();
    			if_blocks_2[current_block_type_index_2].d();
    			if_blocks_3[current_block_type_index_3].d();
    			destroy_component(horizontalstyledcard0);
    			destroy_component(horizontalstyledcard1);
    			destroy_component(horizontalstyledcard2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $progress;
    	let $aBtn;
    	let $currentPage;
    	validate_store(aBtn, 'aBtn');
    	component_subscribe($$self, aBtn, $$value => $$invalidate(9, $aBtn = $$value));
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(10, $currentPage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	syncPageBtn(aBtn, currentPage);
    	let interval;

    	function onInterval() {
    		interval = setInterval(handleNext, 7000);
    	}

    	function stopInterval() {
    		clearInterval(interval);
    	}

    	onInterval();
    	let count = 0;
    	let x = true;

    	function handlePrev() {
    		$$invalidate(0, count = count > 0 ? count - 1 : 2);
    		$$invalidate(1, x = false);
    		stopInterval();
    		onInterval();
    	}

    	function handleNext() {
    		$$invalidate(0, count = count < 2 ? count + 1 : 0);
    		$$invalidate(1, x = true);
    		stopInterval();
    		onInterval();
    	}

    	let time = new Date();
    	let hours = time.getHours();

    	onMount(() => {
    		setInterval(
    			() => {
    				time = new Date();
    				$$invalidate(14, hours = time.getHours());
    			},
    			1000
    		);
    	});

    	let day = '/assets/dayCycles/day.jpg'; // 

    	// let day = 'URL("https://www.publicdomainpictures.net/pictures/150000/velka/white-background-14532158163GC.jpg")';              // 
    	let afternoon = '/assets/dayCycles/afternoon.jpg'; //

    	let evening = '/assets/dayCycles/evening.jpg'; //
    	let night = '/assets/dayCycles/night.jpg'; //
    	let currentImg = day;
    	const progress = tweened(0, { duration: 400, easing: cubicOut });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(8, $progress = value));
    	let hereKitty = false;
    	let hereKitty2 = false;
    	let hover1 = false;
    	let hover2 = false;
    	let hover3 = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const mouseenter_handler = () => $$invalidate(4, hereKitty2 = true);
    	const mouseleave_handler = () => $$invalidate(4, hereKitty2 = false);
    	const mouseleave_handler_1 = () => progress.set(0);
    	const mouseenter_handler_1 = () => progress.set(1);
    	const mouseleave_handler_2 = () => progress.set(0);
    	const mouseenter_handler_2 = () => progress.set(1);
    	const mouseleave_handler_3 = () => progress.set(0);
    	const mouseenter_handler_3 = () => progress.set(1);
    	const mouseenter_handler_4 = () => $$invalidate(3, hereKitty = true);
    	const mouseleave_handler_4 = () => $$invalidate(3, hereKitty = false);
    	const click_handler = () => set_store_value(aBtn, $aBtn = "5", $aBtn);
    	const click_handler_1 = () => set_store_value(currentPage, $currentPage = "Academics", $currentPage);

    	const mouseenter_handler_5 = () => {
    		$$invalidate(5, hover1 = true);
    	};

    	const mouseleave_handler_5 = () => {
    		$$invalidate(5, hover1 = false);
    	};

    	const mouseenter_handler_6 = () => {
    		$$invalidate(6, hover2 = true);
    	};

    	const mouseleave_handler_6 = () => {
    		$$invalidate(6, hover2 = false);
    	};

    	const mouseenter_handler_7 = () => {
    		$$invalidate(7, hover3 = true);
    	};

    	const mouseleave_handler_7 = () => {
    		$$invalidate(7, hover3 = false);
    	};

    	const click_handler_2 = () => set_store_value(aBtn, $aBtn = "5", $aBtn);
    	const click_handler_3 = () => set_store_value(currentPage, $currentPage = "Academics", $currentPage);
    	const click_handler_4 = () => set_store_value(aBtn, $aBtn = "5", $aBtn);
    	const click_handler_5 = () => set_store_value(currentPage, $currentPage = "Academics", $currentPage);

    	$$self.$capture_state = () => ({
    		HorizontalStyledCard,
    		aBtn,
    		currentPage,
    		syncPageBtn,
    		fade,
    		fly,
    		onDestroy,
    		interval,
    		onInterval,
    		stopInterval,
    		count,
    		x,
    		handlePrev,
    		handleNext,
    		onMount,
    		time,
    		hours,
    		day,
    		afternoon,
    		evening,
    		night,
    		currentImg,
    		tweened,
    		cubicOut,
    		progress,
    		hereKitty,
    		hereKitty2,
    		hover1,
    		hover2,
    		hover3,
    		$progress,
    		$aBtn,
    		$currentPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('interval' in $$props) interval = $$props.interval;
    		if ('count' in $$props) $$invalidate(0, count = $$props.count);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('time' in $$props) time = $$props.time;
    		if ('hours' in $$props) $$invalidate(14, hours = $$props.hours);
    		if ('day' in $$props) $$invalidate(41, day = $$props.day);
    		if ('afternoon' in $$props) $$invalidate(42, afternoon = $$props.afternoon);
    		if ('evening' in $$props) $$invalidate(43, evening = $$props.evening);
    		if ('night' in $$props) $$invalidate(44, night = $$props.night);
    		if ('currentImg' in $$props) $$invalidate(2, currentImg = $$props.currentImg);
    		if ('hereKitty' in $$props) $$invalidate(3, hereKitty = $$props.hereKitty);
    		if ('hereKitty2' in $$props) $$invalidate(4, hereKitty2 = $$props.hereKitty2);
    		if ('hover1' in $$props) $$invalidate(5, hover1 = $$props.hover1);
    		if ('hover2' in $$props) $$invalidate(6, hover2 = $$props.hover2);
    		if ('hover3' in $$props) $$invalidate(7, hover3 = $$props.hover3);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*hours*/ 16384) {
    			if (hours >= 0 && hours <= 5 || hours >= 20 && hours <= 23) {
    				$$invalidate(2, currentImg = night);
    			} else if (hours >= 6 && hours <= 11) {
    				$$invalidate(2, currentImg = day);
    			} else if (hours >= 12 && hours <= 16) {
    				$$invalidate(2, currentImg = afternoon);
    			} else if (hours >= 17 && hours <= 19) {
    				$$invalidate(2, currentImg = evening);
    			}
    		}
    	};

    	return [
    		count,
    		x,
    		currentImg,
    		hereKitty,
    		hereKitty2,
    		hover1,
    		hover2,
    		hover3,
    		$progress,
    		$aBtn,
    		$currentPage,
    		handlePrev,
    		handleNext,
    		progress,
    		hours,
    		mouseenter_handler,
    		mouseleave_handler,
    		mouseleave_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_2,
    		mouseenter_handler_2,
    		mouseleave_handler_3,
    		mouseenter_handler_3,
    		mouseenter_handler_4,
    		mouseleave_handler_4,
    		click_handler,
    		click_handler_1,
    		mouseenter_handler_5,
    		mouseleave_handler_5,
    		mouseenter_handler_6,
    		mouseleave_handler_6,
    		mouseenter_handler_7,
    		mouseleave_handler_7,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\lib\components\content\welcomeImg.svelte generated by Svelte v3.55.1 */

    const file$j = "src\\lib\\components\\content\\welcomeImg.svelte";

    function create_fragment$l(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let t0;
    	let div2;
    	let h1;
    	let t1;
    	let t2;
    	let ol;
    	let li0;
    	let a;
    	let t4;
    	let li1;
    	let t5;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			ol = element("ol");
    			li0 = element("li");
    			a = element("a");
    			a.textContent = "Home";
    			t4 = space();
    			li1 = element("li");
    			t5 = text(/*title*/ ctx[0]);
    			attr_dev(div0, "class", "overImg");
    			add_location(div0, file$j, 7, 8, 161);
    			attr_dev(div1, "class", "welcomeMsg svelte-eedrxd");
    			set_style(div1, "background-image", "url(" + /*image*/ ctx[1] + ")");
    			add_location(div1, file$j, 6, 4, 87);
    			attr_dev(h1, "class", "display-4 ");
    			add_location(h1, file$j, 11, 8, 252);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "svelte-eedrxd");
    			add_location(a, file$j, 14, 40, 364);
    			attr_dev(li0, "class", "breadcrumb-item");
    			add_location(li0, file$j, 14, 12, 336);
    			attr_dev(li1, "class", "breadcrumb-item active");
    			attr_dev(li1, "aria-current", "page");
    			add_location(li1, file$j, 15, 12, 403);
    			attr_dev(ol, "class", "breadcrumb svelte-eedrxd");
    			add_location(ol, file$j, 13, 8, 299);
    			attr_dev(div2, "class", "WelcomeTitle svelte-eedrxd");
    			add_location(div2, file$j, 10, 4, 216);
    			attr_dev(div3, "class", "thisMain");
    			add_location(div3, file$j, 5, 0, 59);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(h1, t1);
    			append_dev(div2, t2);
    			append_dev(div2, ol);
    			append_dev(ol, li0);
    			append_dev(li0, a);
    			append_dev(ol, t4);
    			append_dev(ol, li1);
    			append_dev(li1, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*image*/ 2) {
    				set_style(div1, "background-image", "url(" + /*image*/ ctx[1] + ")");
    			}

    			if (dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);
    			if (dirty & /*title*/ 1) set_data_dev(t5, /*title*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WelcomeImg', slots, []);
    	let { title, image } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console.warn("<WelcomeImg> was created without expected prop 'title'");
    		}

    		if (image === undefined && !('image' in $$props || $$self.$$.bound[$$self.$$.props['image']])) {
    			console.warn("<WelcomeImg> was created without expected prop 'image'");
    		}
    	});

    	const writable_props = ['title', 'image'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WelcomeImg> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('image' in $$props) $$invalidate(1, image = $$props.image);
    	};

    	$$self.$capture_state = () => ({ title, image });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('image' in $$props) $$invalidate(1, image = $$props.image);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, image];
    }

    class WelcomeImg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { title: 0, image: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WelcomeImg",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get title() {
    		throw new Error("<WelcomeImg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WelcomeImg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<WelcomeImg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<WelcomeImg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\components\pages\aboutus.svelte generated by Svelte v3.55.1 */
    const file$i = "src\\lib\\components\\pages\\aboutus.svelte";

    function create_fragment$k(ctx) {
    	let t0;
    	let div11;
    	let welcomeimg;
    	let t1;
    	let div10;
    	let div2;
    	let div0;
    	let h30;
    	let t3;
    	let p0;
    	let t5;
    	let div1;
    	let h31;
    	let t7;
    	let p1;
    	let t9;
    	let div3;
    	let h32;
    	let t11;
    	let ul0;
    	let li0;
    	let t13;
    	let li1;
    	let t15;
    	let li2;
    	let t17;
    	let li3;
    	let t19;
    	let li4;
    	let t21;
    	let div4;
    	let h33;
    	let t23;
    	let ul1;
    	let li5;
    	let t25;
    	let li6;
    	let t27;
    	let li7;
    	let t29;
    	let li8;
    	let t31;
    	let li9;
    	let t33;
    	let li10;
    	let t35;
    	let li11;
    	let t37;
    	let li12;
    	let t39;
    	let li13;
    	let t41;
    	let li14;
    	let t43;
    	let div5;
    	let h34;
    	let t45;
    	let p2;
    	let t46;
    	let br0;
    	let t47;
    	let t48;
    	let div6;
    	let h35;
    	let t50;
    	let p3;
    	let t52;
    	let ul2;
    	let li15;
    	let t54;
    	let li16;
    	let t56;
    	let li17;
    	let t58;
    	let div7;
    	let h36;
    	let t60;
    	let p4;
    	let t62;
    	let div8;
    	let h37;
    	let t64;
    	let p5;
    	let t66;
    	let div9;
    	let h38;
    	let t68;
    	let p6;
    	let t69;
    	let br1;
    	let t70;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "About Us",
    				image: "https://image.freepik.com/free-vector/about-us-website-banner-concept-with-thin-line-flat-design_56103-96.jpg"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div11 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div10 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Message from Principal";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Welcome to Inspire College of Nursing & Health Sciences, everyone. Here, we're committed to giving the healthcare industry the best nurses possible.";
    			t5 = space();
    			div1 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Message from Vice Principal";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Our aim is to produce competent nurses enabling them to provide competent and holistic nursing care in variety of health care setting. We strive out best to provide conductive environment for learning in Inspire College of Nursing & Health Sciences.";
    			t9 = space();
    			div3 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Our Objectives";
    			t11 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "To increase the critically depleted pool of Pakistan's competent nursing professionals.";
    			t13 = space();
    			li1 = element("li");
    			li1.textContent = "To educate professional nurses and give them the practical, theoretical, and communicative skills they need to provide patients with high-quality care.";
    			t15 = space();
    			li2 = element("li");
    			li2.textContent = "To impart nursing expertise and the capacity to use it to address public health issues in resource-constrained developing nations.";
    			t17 = space();
    			li3 = element("li");
    			li3.textContent = "To give post-graduate nurses the skills they need to deliver safe, expert nursing care in specific fields.";
    			t19 = space();
    			li4 = element("li");
    			li4.textContent = "To launch M.Sc. and Ph.D. nursing programs in the future to improve the standard of nursing care in the healthcare sector.";
    			t21 = space();
    			div4 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Why ICONHS";
    			t23 = space();
    			ul1 = element("ul");
    			li5 = element("li");
    			li5.textContent = "Our cutting-edge academic facility is one of the best-equipped educational facilities in the nation.";
    			t25 = space();
    			li6 = element("li");
    			li6.textContent = "A variety of teaching and learning methods are supported by our specially constructed skill laboratories.";
    			t27 = space();
    			li7 = element("li");
    			li7.textContent = "Through our programs, you can pursue a career in a range of healthcare settings.";
    			t29 = space();
    			li8 = element("li");
    			li8.textContent = "We have a well-stocked library and computer lab, as well as a teaching staff committed to your success.";
    			t31 = space();
    			li9 = element("li");
    			li9.textContent = "Many different clinical situations.";
    			t33 = space();
    			li10 = element("li");
    			li10.textContent = "Active engagement with world-renowned experts and health care resources.";
    			t35 = space();
    			li11 = element("li");
    			li11.textContent = "A variety of clinical encounters.";
    			t37 = space();
    			li12 = element("li");
    			li12.textContent = "Scholarly endeavors and research that advance the field of nursing by promoting evidence-based patient care exposure to the enormous array of perspectives and backgrounds that our professors and students at this hospital possess.";
    			t39 = space();
    			li13 = element("li");
    			li13.textContent = "Placements will be made in both medical facilities and public places.";
    			t41 = space();
    			li14 = element("li");
    			li14.textContent = "Theoretical knowledge and practical experience are continuously assessed.";
    			t43 = space();
    			div5 = element("div");
    			h34 = element("h3");
    			h34.textContent = "Campus";
    			t45 = space();
    			p2 = element("p");
    			t46 = text("The purpose-built campus is renowned for its stunning, tranquil, and picturesque surroundings. It is situated in Lahore's Gulberg III.\r\n                ");
    			br0 = element("br");
    			t47 = text("\r\n                Our institution has the most cutting-edge teaching facilities and technology to deliver an extremely rigorous curriculum. The nurse education facilities are built on cutting-edge strategies and industry-recognized best practices. Plans are being made for exchange.");
    			t48 = space();
    			div6 = element("div");
    			h35 = element("h3");
    			h35.textContent = "Recognition";
    			t50 = space();
    			p3 = element("p");
    			p3.textContent = "ICON&HS Places a high priority on quality initiatives, leading its academic institutions to embark on quality certification and accreditation programs";
    			t52 = space();
    			ul2 = element("ul");
    			li15 = element("li");
    			li15.textContent = "Inspire College of Nursing & Health Sciences is recognized by the Pakistan Nursing Council";
    			t54 = space();
    			li16 = element("li");
    			li16.textContent = "Jinnah Hospital Lahore is recognized by the Pakistan Medical & Dental Council";
    			t56 = space();
    			li17 = element("li");
    			li17.textContent = "Inspire College of Nursing & Health Sciences is affiliated with University of Health Sciences.";
    			t58 = space();
    			div7 = element("div");
    			h36 = element("h3");
    			h36.textContent = "Faculty";
    			t60 = space();
    			p4 = element("p");
    			p4.textContent = "You will learn from professors at Inspire College of Nursing & Health Sciences who are committed to each student's success by promoting the values of nursing and social responsibility. We foster an environment where our staff and students advance the progress of science, education, and evidence-based practice in order to improve global health.";
    			t62 = space();
    			div8 = element("div");
    			h37 = element("h3");
    			h37.textContent = "Teaching Methodology";
    			t64 = space();
    			p5 = element("p");
    			p5.textContent = "The curriculum of Inspire College of Nursing & Health Sciences includes character development, research and project-based training, language competence development, leadership training, and computer training programs. The annual system of education is used, in which students take periodic written exams leading up to their final exams at the conclusion of the academic year.";
    			t66 = space();
    			div9 = element("div");
    			h38 = element("h3");
    			h38.textContent = "Clinical Education";
    			t68 = space();
    			p6 = element("p");
    			t69 = text("At the Jinnah Hospital Lahore, considerable practical work is used to supplement Skill lab tutorials. The Jinnah Hospital, Lahore has modern, fully functional departments for obstetrics and gynecology, medicine, surgery, ENT, ophthalmology, pediatric, psychiatry, dermatology, neurosurgery, an operating room, intensive care units, coronary care units, emergency services, dialysis units, dentistry, Burn Units and diagnostic services.\r\n                ");
    			br1 = element("br");
    			t70 = text("\r\n                Apart from the training at Jinnah Hospital Lahore, the nursing students also gain valuable clinical experience during their attachments at renowned hospitals of Lahore.");
    			document.title = "ICONHS - About Us";
    			add_location(h30, file$i, 15, 16, 467);
    			add_location(p0, file$i, 16, 16, 516);
    			attr_dev(div0, "class", "messageFromPrincipal");
    			add_location(div0, file$i, 14, 12, 415);
    			add_location(h31, file$i, 21, 16, 792);
    			add_location(p1, file$i, 22, 16, 846);
    			attr_dev(div1, "class", "messagefromVice");
    			add_location(div1, file$i, 20, 12, 745);
    			attr_dev(div2, "class", "messages");
    			add_location(div2, file$i, 13, 8, 379);
    			add_location(h32, file$i, 29, 12, 1231);
    			add_location(li0, file$i, 31, 16, 1290);
    			add_location(li1, file$i, 32, 16, 1404);
    			add_location(li2, file$i, 33, 16, 1582);
    			add_location(li3, file$i, 34, 16, 1739);
    			add_location(li4, file$i, 35, 16, 1872);
    			add_location(ul0, file$i, 30, 12, 1268);
    			attr_dev(div3, "class", "ourObjectives");
    			add_location(div3, file$i, 28, 8, 1190);
    			add_location(h33, file$i, 40, 12, 2087);
    			add_location(li5, file$i, 42, 16, 2142);
    			add_location(li6, file$i, 43, 16, 2269);
    			add_location(li7, file$i, 44, 16, 2401);
    			add_location(li8, file$i, 45, 16, 2508);
    			add_location(li9, file$i, 46, 16, 2638);
    			add_location(li10, file$i, 47, 16, 2700);
    			add_location(li11, file$i, 48, 16, 2799);
    			add_location(li12, file$i, 49, 16, 2859);
    			add_location(li13, file$i, 50, 16, 3115);
    			add_location(li14, file$i, 51, 16, 3211);
    			add_location(ul1, file$i, 41, 12, 2120);
    			attr_dev(div4, "class", "whyICONHS");
    			add_location(div4, file$i, 39, 8, 2050);
    			add_location(h34, file$i, 56, 12, 3374);
    			add_location(br0, file$i, 59, 16, 3576);
    			add_location(p2, file$i, 57, 12, 3403);
    			attr_dev(div5, "class", "campus");
    			add_location(div5, file$i, 55, 8, 3340);
    			add_location(h35, file$i, 65, 12, 3947);
    			add_location(p3, file$i, 66, 12, 3981);
    			add_location(li15, file$i, 70, 16, 4206);
    			add_location(li16, file$i, 71, 16, 4324);
    			add_location(li17, file$i, 72, 16, 4429);
    			add_location(ul2, file$i, 69, 12, 4184);
    			attr_dev(div6, "class", "recognition");
    			add_location(div6, file$i, 64, 8, 3908);
    			add_location(h36, file$i, 77, 12, 4614);
    			add_location(p4, file$i, 78, 12, 4644);
    			attr_dev(div7, "class", "faculty");
    			add_location(div7, file$i, 76, 8, 4579);
    			add_location(h37, file$i, 84, 12, 5103);
    			add_location(p5, file$i, 85, 12, 5146);
    			attr_dev(div8, "class", "teachingMethodology");
    			add_location(div8, file$i, 83, 8, 5056);
    			add_location(h38, file$i, 91, 12, 5633);
    			add_location(br1, file$i, 94, 16, 6148);
    			add_location(p6, file$i, 92, 12, 5674);
    			attr_dev(div9, "class", "clinicalEducation");
    			add_location(div9, file$i, 90, 8, 5588);
    			attr_dev(div10, "class", "this_Main");
    			add_location(div10, file$i, 12, 4, 346);
    			attr_dev(div11, "class", "thisAbout svelte-ij3vn4");
    			add_location(div11, file$i, 9, 0, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div11, anchor);
    			mount_component(welcomeimg, div11, null);
    			append_dev(div11, t1);
    			append_dev(div11, div10);
    			append_dev(div10, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h30);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, h31);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(div10, t9);
    			append_dev(div10, div3);
    			append_dev(div3, h32);
    			append_dev(div3, t11);
    			append_dev(div3, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t13);
    			append_dev(ul0, li1);
    			append_dev(ul0, t15);
    			append_dev(ul0, li2);
    			append_dev(ul0, t17);
    			append_dev(ul0, li3);
    			append_dev(ul0, t19);
    			append_dev(ul0, li4);
    			append_dev(div10, t21);
    			append_dev(div10, div4);
    			append_dev(div4, h33);
    			append_dev(div4, t23);
    			append_dev(div4, ul1);
    			append_dev(ul1, li5);
    			append_dev(ul1, t25);
    			append_dev(ul1, li6);
    			append_dev(ul1, t27);
    			append_dev(ul1, li7);
    			append_dev(ul1, t29);
    			append_dev(ul1, li8);
    			append_dev(ul1, t31);
    			append_dev(ul1, li9);
    			append_dev(ul1, t33);
    			append_dev(ul1, li10);
    			append_dev(ul1, t35);
    			append_dev(ul1, li11);
    			append_dev(ul1, t37);
    			append_dev(ul1, li12);
    			append_dev(ul1, t39);
    			append_dev(ul1, li13);
    			append_dev(ul1, t41);
    			append_dev(ul1, li14);
    			append_dev(div10, t43);
    			append_dev(div10, div5);
    			append_dev(div5, h34);
    			append_dev(div5, t45);
    			append_dev(div5, p2);
    			append_dev(p2, t46);
    			append_dev(p2, br0);
    			append_dev(p2, t47);
    			append_dev(div10, t48);
    			append_dev(div10, div6);
    			append_dev(div6, h35);
    			append_dev(div6, t50);
    			append_dev(div6, p3);
    			append_dev(div6, t52);
    			append_dev(div6, ul2);
    			append_dev(ul2, li15);
    			append_dev(ul2, t54);
    			append_dev(ul2, li16);
    			append_dev(ul2, t56);
    			append_dev(ul2, li17);
    			append_dev(div10, t58);
    			append_dev(div10, div7);
    			append_dev(div7, h36);
    			append_dev(div7, t60);
    			append_dev(div7, p4);
    			append_dev(div10, t62);
    			append_dev(div10, div8);
    			append_dev(div8, h37);
    			append_dev(div8, t64);
    			append_dev(div8, p5);
    			append_dev(div10, t66);
    			append_dev(div10, div9);
    			append_dev(div9, h38);
    			append_dev(div9, t68);
    			append_dev(div9, p6);
    			append_dev(p6, t69);
    			append_dev(p6, br1);
    			append_dev(p6, t70);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div11);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Aboutus', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Aboutus> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class Aboutus extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Aboutus",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\lib\components\content\nursingPogs.svelte generated by Svelte v3.55.1 */

    const file$h = "src\\lib\\components\\content\\nursingPogs.svelte";

    function create_fragment$j(ctx) {
    	let div2;
    	let div1;
    	let h3;
    	let t1;
    	let div0;
    	let table;
    	let tr0;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let tr1;
    	let td0;
    	let t9;
    	let td1;
    	let t11;
    	let td2;
    	let t13;
    	let tr2;
    	let td3;
    	let t15;
    	let td4;
    	let t17;
    	let td5;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Nursing Programs at ICONHS";
    			t1 = space();
    			div0 = element("div");
    			table = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Programs";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "Commencement of Classes";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Duration";
    			t7 = space();
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "B.Sc. Nursing";
    			t9 = space();
    			td1 = element("td");
    			td1.textContent = "February";
    			t11 = space();
    			td2 = element("td");
    			td2.textContent = "4-Years";
    			t13 = space();
    			tr2 = element("tr");
    			td3 = element("td");
    			td3.textContent = "Post RN B.Sc. Nursing";
    			t15 = space();
    			td4 = element("td");
    			td4.textContent = "February";
    			t17 = space();
    			td5 = element("td");
    			td5.textContent = "2-Years";
    			add_location(h3, file$h, 6, 8, 88);
    			attr_dev(th0, "class", "svelte-16apgnq");
    			add_location(th0, file$h, 10, 20, 217);
    			attr_dev(th1, "class", "svelte-16apgnq");
    			add_location(th1, file$h, 11, 20, 256);
    			attr_dev(th2, "class", "svelte-16apgnq");
    			add_location(th2, file$h, 12, 20, 310);
    			attr_dev(tr0, "class", "svelte-16apgnq");
    			add_location(tr0, file$h, 9, 16, 191);
    			attr_dev(td0, "class", "svelte-16apgnq");
    			add_location(td0, file$h, 15, 20, 394);
    			attr_dev(td1, "class", "svelte-16apgnq");
    			add_location(td1, file$h, 16, 20, 438);
    			attr_dev(td2, "class", "svelte-16apgnq");
    			add_location(td2, file$h, 17, 20, 477);
    			attr_dev(tr1, "class", "svelte-16apgnq");
    			add_location(tr1, file$h, 14, 16, 368);
    			attr_dev(td3, "class", "svelte-16apgnq");
    			add_location(td3, file$h, 20, 20, 560);
    			attr_dev(td4, "class", "svelte-16apgnq");
    			add_location(td4, file$h, 21, 20, 612);
    			attr_dev(td5, "class", "svelte-16apgnq");
    			add_location(td5, file$h, 22, 20, 651);
    			attr_dev(tr2, "class", "svelte-16apgnq");
    			add_location(tr2, file$h, 19, 16, 534);
    			attr_dev(table, "class", "svelte-16apgnq");
    			add_location(table, file$h, 8, 12, 166);
    			attr_dev(div0, "class", "table");
    			add_location(div0, file$h, 7, 8, 133);
    			attr_dev(div1, "class", "nursingPrograms");
    			add_location(div1, file$h, 5, 4, 49);
    			attr_dev(div2, "class", "this");
    			add_location(div2, file$h, 4, 0, 25);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h3);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t3);
    			append_dev(tr0, th1);
    			append_dev(tr0, t5);
    			append_dev(tr0, th2);
    			append_dev(table, t7);
    			append_dev(table, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t9);
    			append_dev(tr1, td1);
    			append_dev(tr1, t11);
    			append_dev(tr1, td2);
    			append_dev(table, t13);
    			append_dev(table, tr2);
    			append_dev(tr2, td3);
    			append_dev(tr2, t15);
    			append_dev(tr2, td4);
    			append_dev(tr2, t17);
    			append_dev(tr2, td5);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NursingPogs', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NursingPogs> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class NursingPogs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NursingPogs",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\lib\components\content\curriculum.svelte generated by Svelte v3.55.1 */

    const file$g = "src\\lib\\components\\content\\curriculum.svelte";

    function create_fragment$i(ctx) {
    	let div3;
    	let div2;
    	let h3;
    	let t1;
    	let div0;
    	let h50;
    	let t3;
    	let table0;
    	let tr0;
    	let th0;
    	let t5;
    	let th1;
    	let t7;
    	let tr1;
    	let td0;
    	let t9;
    	let td1;
    	let t11;
    	let tr2;
    	let td2;
    	let t13;
    	let td3;
    	let t15;
    	let tr3;
    	let td4;
    	let t17;
    	let td5;
    	let t19;
    	let tr4;
    	let td6;
    	let t21;
    	let td7;
    	let t23;
    	let tr5;
    	let td8;
    	let t25;
    	let td9;
    	let t27;
    	let tr6;
    	let td10;
    	let t29;
    	let td11;
    	let t31;
    	let tr7;
    	let td12;
    	let t33;
    	let td13;
    	let t35;
    	let tr8;
    	let td14;
    	let t37;
    	let td15;
    	let t38;
    	let tr9;
    	let td16;
    	let t40;
    	let td17;
    	let t41;
    	let tr10;
    	let td18;
    	let t43;
    	let td19;
    	let t44;
    	let tr11;
    	let td20;
    	let t46;
    	let td21;
    	let t47;
    	let br;
    	let t48;
    	let table1;
    	let tr12;
    	let th2;
    	let t50;
    	let th3;
    	let t52;
    	let tr13;
    	let td22;
    	let t54;
    	let td23;
    	let t56;
    	let tr14;
    	let td24;
    	let t58;
    	let td25;
    	let t60;
    	let tr15;
    	let td26;
    	let t62;
    	let td27;
    	let t64;
    	let tr16;
    	let td28;
    	let t66;
    	let td29;
    	let t68;
    	let tr17;
    	let td30;
    	let t70;
    	let td31;
    	let t72;
    	let tr18;
    	let td32;
    	let t74;
    	let td33;
    	let t76;
    	let tr19;
    	let td34;
    	let t78;
    	let td35;
    	let t80;
    	let tr20;
    	let td36;
    	let t82;
    	let td37;
    	let t84;
    	let tr21;
    	let td38;
    	let t86;
    	let td39;
    	let t87;
    	let div1;
    	let h51;
    	let t89;
    	let table2;
    	let tr22;
    	let th4;
    	let t91;
    	let th5;
    	let t93;
    	let tr23;
    	let td40;
    	let t94;
    	let ul0;
    	let li0;
    	let t96;
    	let li1;
    	let t98;
    	let li2;
    	let t100;
    	let td41;
    	let t102;
    	let tr24;
    	let td42;
    	let t103;
    	let ul1;
    	let li3;
    	let t105;
    	let li4;
    	let t107;
    	let td43;
    	let t108;
    	let ul2;
    	let li5;
    	let t110;
    	let li6;
    	let t112;
    	let tr25;
    	let td44;
    	let t113;
    	let ul3;
    	let li7;
    	let t115;
    	let li8;
    	let t117;
    	let li9;
    	let t119;
    	let td45;
    	let t120;
    	let ul4;
    	let li10;
    	let t122;
    	let li11;
    	let t124;
    	let li12;
    	let t126;
    	let tr26;
    	let td46;
    	let t127;
    	let ul5;
    	let li13;
    	let t129;
    	let li14;
    	let t131;
    	let td47;
    	let t133;
    	let tr27;
    	let td48;
    	let t134;
    	let li15;
    	let t136;
    	let li16;
    	let t138;
    	let td49;
    	let t140;
    	let tr28;
    	let td50;
    	let t142;
    	let td51;
    	let t144;
    	let tr29;
    	let td52;
    	let t146;
    	let td53;
    	let t147;
    	let tr30;
    	let td54;
    	let t149;
    	let td55;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Curriculum";
    			t1 = space();
    			div0 = element("div");
    			h50 = element("h5");
    			h50.textContent = "B.SC. NURSING (4-YEARS PROGRAM)";
    			t3 = space();
    			table0 = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "1st professional";
    			t5 = space();
    			th1 = element("th");
    			th1.textContent = "2nd professional";
    			t7 = space();
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Fundamental of Nursing-I & II";
    			t9 = space();
    			td1 = element("td");
    			td1.textContent = "Adult health Nursing I & II";
    			t11 = space();
    			tr2 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Microbiology";
    			t13 = space();
    			td3 = element("td");
    			td3.textContent = "Pathophysiology I & II";
    			t15 = space();
    			tr3 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Anatomy & Physiology- I";
    			t17 = space();
    			td5 = element("td");
    			td5.textContent = "Health assessment I & II";
    			t19 = space();
    			tr4 = element("tr");
    			td6 = element("td");
    			td6.textContent = "Biochemistry for Nursing";
    			t21 = space();
    			td7 = element("td");
    			td7.textContent = "Pharmacology I & II";
    			t23 = space();
    			tr5 = element("tr");
    			td8 = element("td");
    			td8.textContent = "English-I & II";
    			t25 = space();
    			td9 = element("td");
    			td9.textContent = "Mathematics";
    			t27 = space();
    			tr6 = element("tr");
    			td10 = element("td");
    			td10.textContent = "Computer Skills";
    			t29 = space();
    			td11 = element("td");
    			td11.textContent = "English III & IV";
    			t31 = space();
    			tr7 = element("tr");
    			td12 = element("td");
    			td12.textContent = "Anatomy and Physiology- II";
    			t33 = space();
    			td13 = element("td");
    			td13.textContent = "Developmental Psychology";
    			t35 = space();
    			tr8 = element("tr");
    			td14 = element("td");
    			td14.textContent = "Community Health Nursing- I";
    			t37 = space();
    			td15 = element("td");
    			t38 = space();
    			tr9 = element("tr");
    			td16 = element("td");
    			td16.textContent = "Applied Nutrition";
    			t40 = space();
    			td17 = element("td");
    			t41 = space();
    			tr10 = element("tr");
    			td18 = element("td");
    			td18.textContent = "Islamiat*";
    			t43 = space();
    			td19 = element("td");
    			t44 = space();
    			tr11 = element("tr");
    			td20 = element("td");
    			td20.textContent = "Pak. Studies*";
    			t46 = space();
    			td21 = element("td");
    			t47 = space();
    			br = element("br");
    			t48 = space();
    			table1 = element("table");
    			tr12 = element("tr");
    			th2 = element("th");
    			th2.textContent = "3rd professional";
    			t50 = space();
    			th3 = element("th");
    			th3.textContent = "4th professional";
    			t52 = space();
    			tr13 = element("tr");
    			td22 = element("td");
    			td22.textContent = "Pediatrics Health Nursing";
    			t54 = space();
    			td23 = element("td");
    			td23.textContent = "Critical care Nursing";
    			t56 = space();
    			tr14 = element("tr");
    			td24 = element("td");
    			td24.textContent = "Community Health Nursing II";
    			t58 = space();
    			td25 = element("td");
    			td25.textContent = "Introduction to Nursing Theories";
    			t60 = space();
    			tr15 = element("tr");
    			td26 = element("td");
    			td26.textContent = "Teaching/Learning Principles & practices";
    			t62 = space();
    			td27 = element("td");
    			td27.textContent = "Leadership & Management in Nursing";
    			t64 = space();
    			tr16 = element("tr");
    			td28 = element("td");
    			td28.textContent = "Mental health Nursing";
    			t66 = space();
    			td29 = element("td");
    			td29.textContent = "Nursing Research";
    			t68 = space();
    			tr17 = element("tr");
    			td30 = element("td");
    			td30.textContent = "English V";
    			t70 = space();
    			td31 = element("td");
    			td31.textContent = "English VII";
    			t72 = space();
    			tr18 = element("tr");
    			td32 = element("td");
    			td32.textContent = "Introduction to Biostatistics";
    			t74 = space();
    			td33 = element("td");
    			td33.textContent = "Community Health Nursing-III";
    			t76 = space();
    			tr19 = element("tr");
    			td34 = element("td");
    			td34.textContent = "Behavioral Psychology";
    			t78 = space();
    			td35 = element("td");
    			td35.textContent = "Nursing seminar role transition";
    			t80 = space();
    			tr20 = element("tr");
    			td36 = element("td");
    			td36.textContent = "Epidemiology";
    			t82 = space();
    			td37 = element("td");
    			td37.textContent = "Clinical practicum";
    			t84 = space();
    			tr21 = element("tr");
    			td38 = element("td");
    			td38.textContent = "Culture Health & Society";
    			t86 = space();
    			td39 = element("td");
    			t87 = space();
    			div1 = element("div");
    			h51 = element("h5");
    			h51.textContent = "POST RN B.SC. NURSING (2 YEARS PROGRAMME)";
    			t89 = space();
    			table2 = element("table");
    			tr22 = element("tr");
    			th4 = element("th");
    			th4.textContent = "1st professional";
    			t91 = space();
    			th5 = element("th");
    			th5.textContent = "2nd professional";
    			t93 = space();
    			tr23 = element("tr");
    			td40 = element("td");
    			t94 = text("Basic and Applied Sciences\r\n                        ");
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Biochemistry";
    			t96 = space();
    			li1 = element("li");
    			li1.textContent = "Physics";
    			t98 = space();
    			li2 = element("li");
    			li2.textContent = "Microbiology";
    			t100 = space();
    			td41 = element("td");
    			td41.textContent = "Mental Health Nursing";
    			t102 = space();
    			tr24 = element("tr");
    			td42 = element("td");
    			t103 = text("Global Health*\r\n                        ");
    			ul1 = element("ul");
    			li3 = element("li");
    			li3.textContent = "Trends And Issues in Nursing";
    			t105 = space();
    			li4 = element("li");
    			li4.textContent = "Nursing Ethics";
    			t107 = space();
    			td43 = element("td");
    			t108 = text("Nursing Management\r\n                        ");
    			ul2 = element("ul");
    			li5 = element("li");
    			li5.textContent = "Leadership and Management";
    			t110 = space();
    			li6 = element("li");
    			li6.textContent = "Professional Development";
    			t112 = space();
    			tr25 = element("tr");
    			td44 = element("td");
    			t113 = text("Advanced Concepts in Nursing \r\n                        ");
    			ul3 = element("ul");
    			li7 = element("li");
    			li7.textContent = "Health Assessment";
    			t115 = space();
    			li8 = element("li");
    			li8.textContent = "Pathophysiology";
    			t117 = space();
    			li9 = element("li");
    			li9.textContent = "Advanced Concepts in Clinical Nursing";
    			t119 = space();
    			td45 = element("td");
    			t120 = text("Community Health\r\n                        ");
    			ul4 = element("ul");
    			li10 = element("li");
    			li10.textContent = "Community health nursing";
    			t122 = space();
    			li11 = element("li");
    			li11.textContent = "Reproductive Health";
    			t124 = space();
    			li12 = element("li");
    			li12.textContent = "Applied Nutrition";
    			t126 = space();
    			tr26 = element("tr");
    			td46 = element("td");
    			t127 = text("Research \r\n                        ");
    			ul5 = element("ul");
    			li13 = element("li");
    			li13.textContent = "Biostatistician";
    			t129 = space();
    			li14 = element("li");
    			li14.textContent = "Nursing Research";
    			t131 = space();
    			td47 = element("td");
    			td47.textContent = "Clinical Practicum (Electives in nine different specialties)";
    			t133 = space();
    			tr27 = element("tr");
    			td48 = element("td");
    			t134 = text("Teaching and Learning* \r\n                        ");
    			li15 = element("li");
    			li15.textContent = "Classroom Teaching and Evaluation";
    			t136 = space();
    			li16 = element("li");
    			li16.textContent = "Clinical teaching and Evaluation";
    			t138 = space();
    			td49 = element("td");
    			td49.textContent = "Communication Skills (English)";
    			t140 = space();
    			tr28 = element("tr");
    			td50 = element("td");
    			td50.textContent = "Computer Skills*";
    			t142 = space();
    			td51 = element("td");
    			td51.textContent = "Self-Directed Learning";
    			t144 = space();
    			tr29 = element("tr");
    			td52 = element("td");
    			td52.textContent = "Communication Skills (English)*";
    			t146 = space();
    			td53 = element("td");
    			t147 = space();
    			tr30 = element("tr");
    			td54 = element("td");
    			td54.textContent = "Self-Directed Learning*";
    			t149 = space();
    			td55 = element("td");
    			add_location(h3, file$g, 6, 8, 83);
    			add_location(h50, file$g, 8, 12, 150);
    			attr_dev(th0, "class", "svelte-16apgnq");
    			add_location(th0, file$g, 11, 20, 255);
    			attr_dev(th1, "class", "svelte-16apgnq");
    			add_location(th1, file$g, 12, 20, 302);
    			attr_dev(tr0, "class", "svelte-16apgnq");
    			add_location(tr0, file$g, 10, 16, 229);
    			attr_dev(td0, "class", "svelte-16apgnq");
    			add_location(td0, file$g, 15, 20, 394);
    			attr_dev(td1, "class", "svelte-16apgnq");
    			add_location(td1, file$g, 16, 20, 458);
    			attr_dev(tr1, "class", "svelte-16apgnq");
    			add_location(tr1, file$g, 14, 16, 368);
    			attr_dev(td2, "class", "svelte-16apgnq");
    			add_location(td2, file$g, 19, 20, 565);
    			attr_dev(td3, "class", "svelte-16apgnq");
    			add_location(td3, file$g, 20, 20, 608);
    			attr_dev(tr2, "class", "svelte-16apgnq");
    			add_location(tr2, file$g, 18, 16, 539);
    			attr_dev(td4, "class", "svelte-16apgnq");
    			add_location(td4, file$g, 23, 20, 710);
    			attr_dev(td5, "class", "svelte-16apgnq");
    			add_location(td5, file$g, 24, 20, 768);
    			attr_dev(tr3, "class", "svelte-16apgnq");
    			add_location(tr3, file$g, 22, 16, 684);
    			attr_dev(td6, "class", "svelte-16apgnq");
    			add_location(td6, file$g, 27, 20, 872);
    			attr_dev(td7, "class", "svelte-16apgnq");
    			add_location(td7, file$g, 28, 20, 927);
    			attr_dev(tr4, "class", "svelte-16apgnq");
    			add_location(tr4, file$g, 26, 16, 846);
    			attr_dev(td8, "class", "svelte-16apgnq");
    			add_location(td8, file$g, 31, 20, 1026);
    			attr_dev(td9, "class", "svelte-16apgnq");
    			add_location(td9, file$g, 32, 20, 1075);
    			attr_dev(tr5, "class", "svelte-16apgnq");
    			add_location(tr5, file$g, 30, 16, 1000);
    			attr_dev(td10, "class", "svelte-16apgnq");
    			add_location(td10, file$g, 35, 20, 1162);
    			attr_dev(td11, "class", "svelte-16apgnq");
    			add_location(td11, file$g, 36, 20, 1208);
    			attr_dev(tr6, "class", "svelte-16apgnq");
    			add_location(tr6, file$g, 34, 16, 1136);
    			attr_dev(td12, "class", "svelte-16apgnq");
    			add_location(td12, file$g, 39, 20, 1304);
    			attr_dev(td13, "class", "svelte-16apgnq");
    			add_location(td13, file$g, 40, 20, 1361);
    			attr_dev(tr7, "class", "svelte-16apgnq");
    			add_location(tr7, file$g, 38, 16, 1278);
    			attr_dev(td14, "class", "svelte-16apgnq");
    			add_location(td14, file$g, 43, 20, 1461);
    			attr_dev(td15, "class", "svelte-16apgnq");
    			add_location(td15, file$g, 44, 20, 1519);
    			attr_dev(tr8, "class", "svelte-16apgnq");
    			add_location(tr8, file$g, 42, 16, 1435);
    			attr_dev(td16, "class", "svelte-16apgnq");
    			add_location(td16, file$g, 47, 20, 1595);
    			attr_dev(td17, "class", "svelte-16apgnq");
    			add_location(td17, file$g, 48, 20, 1643);
    			attr_dev(tr9, "class", "svelte-16apgnq");
    			add_location(tr9, file$g, 46, 16, 1569);
    			attr_dev(td18, "class", "svelte-16apgnq");
    			add_location(td18, file$g, 51, 20, 1719);
    			attr_dev(td19, "class", "svelte-16apgnq");
    			add_location(td19, file$g, 52, 20, 1759);
    			attr_dev(tr10, "class", "svelte-16apgnq");
    			add_location(tr10, file$g, 50, 16, 1693);
    			attr_dev(td20, "class", "svelte-16apgnq");
    			add_location(td20, file$g, 55, 20, 1835);
    			attr_dev(td21, "class", "svelte-16apgnq");
    			add_location(td21, file$g, 56, 20, 1879);
    			attr_dev(tr11, "class", "svelte-16apgnq");
    			add_location(tr11, file$g, 54, 16, 1809);
    			attr_dev(table0, "class", "svelte-16apgnq");
    			add_location(table0, file$g, 9, 12, 204);
    			add_location(br, file$g, 59, 12, 1947);
    			attr_dev(th2, "class", "svelte-16apgnq");
    			add_location(th2, file$g, 62, 20, 2016);
    			attr_dev(th3, "class", "svelte-16apgnq");
    			add_location(th3, file$g, 63, 20, 2063);
    			attr_dev(tr12, "class", "svelte-16apgnq");
    			add_location(tr12, file$g, 61, 16, 1990);
    			attr_dev(td22, "class", "svelte-16apgnq");
    			add_location(td22, file$g, 66, 20, 2155);
    			attr_dev(td23, "class", "svelte-16apgnq");
    			add_location(td23, file$g, 67, 20, 2211);
    			attr_dev(tr13, "class", "svelte-16apgnq");
    			add_location(tr13, file$g, 65, 16, 2129);
    			attr_dev(td24, "class", "svelte-16apgnq");
    			add_location(td24, file$g, 70, 20, 2308);
    			attr_dev(td25, "class", "svelte-16apgnq");
    			add_location(td25, file$g, 71, 20, 2366);
    			attr_dev(tr14, "class", "svelte-16apgnq");
    			add_location(tr14, file$g, 69, 16, 2282);
    			attr_dev(td26, "class", "svelte-16apgnq");
    			add_location(td26, file$g, 74, 20, 2474);
    			attr_dev(td27, "class", "svelte-16apgnq");
    			add_location(td27, file$g, 75, 20, 2549);
    			attr_dev(tr15, "class", "svelte-16apgnq");
    			add_location(tr15, file$g, 73, 16, 2448);
    			attr_dev(td28, "class", "svelte-16apgnq");
    			add_location(td28, file$g, 78, 20, 2663);
    			attr_dev(td29, "class", "svelte-16apgnq");
    			add_location(td29, file$g, 79, 20, 2715);
    			attr_dev(tr16, "class", "svelte-16apgnq");
    			add_location(tr16, file$g, 77, 16, 2637);
    			attr_dev(td30, "class", "svelte-16apgnq");
    			add_location(td30, file$g, 82, 20, 2807);
    			attr_dev(td31, "class", "svelte-16apgnq");
    			add_location(td31, file$g, 83, 20, 2847);
    			attr_dev(tr17, "class", "svelte-16apgnq");
    			add_location(tr17, file$g, 81, 16, 2781);
    			attr_dev(td32, "class", "svelte-16apgnq");
    			add_location(td32, file$g, 86, 20, 2934);
    			attr_dev(td33, "class", "svelte-16apgnq");
    			add_location(td33, file$g, 87, 20, 2994);
    			attr_dev(tr18, "class", "svelte-16apgnq");
    			add_location(tr18, file$g, 85, 16, 2908);
    			attr_dev(td34, "class", "svelte-16apgnq");
    			add_location(td34, file$g, 90, 20, 3098);
    			attr_dev(td35, "class", "svelte-16apgnq");
    			add_location(td35, file$g, 91, 20, 3150);
    			attr_dev(tr19, "class", "svelte-16apgnq");
    			add_location(tr19, file$g, 89, 16, 3072);
    			attr_dev(td36, "class", "svelte-16apgnq");
    			add_location(td36, file$g, 94, 20, 3257);
    			attr_dev(td37, "class", "svelte-16apgnq");
    			add_location(td37, file$g, 95, 20, 3300);
    			attr_dev(tr20, "class", "svelte-16apgnq");
    			add_location(tr20, file$g, 93, 16, 3231);
    			attr_dev(td38, "class", "svelte-16apgnq");
    			add_location(td38, file$g, 98, 20, 3394);
    			attr_dev(td39, "class", "svelte-16apgnq");
    			add_location(td39, file$g, 99, 20, 3453);
    			attr_dev(tr21, "class", "svelte-16apgnq");
    			add_location(tr21, file$g, 97, 16, 3368);
    			attr_dev(table1, "class", "svelte-16apgnq");
    			add_location(table1, file$g, 60, 12, 1965);
    			attr_dev(div0, "class", "bscNursing");
    			add_location(div0, file$g, 7, 8, 112);
    			add_location(h51, file$g, 104, 12, 3574);
    			attr_dev(th4, "class", "svelte-16apgnq");
    			add_location(th4, file$g, 107, 20, 3689);
    			attr_dev(th5, "class", "svelte-16apgnq");
    			add_location(th5, file$g, 108, 20, 3736);
    			attr_dev(tr22, "class", "svelte-16apgnq");
    			add_location(tr22, file$g, 106, 16, 3663);
    			add_location(li0, file$g, 114, 28, 3944);
    			add_location(li1, file$g, 115, 28, 3995);
    			add_location(li2, file$g, 116, 28, 4041);
    			add_location(ul0, file$g, 113, 24, 3910);
    			attr_dev(td40, "class", "svelte-16apgnq");
    			add_location(td40, file$g, 111, 20, 3828);
    			attr_dev(td41, "class", "svelte-16apgnq");
    			add_location(td41, file$g, 119, 20, 4142);
    			attr_dev(tr23, "class", "svelte-16apgnq");
    			add_location(tr23, file$g, 110, 16, 3802);
    			add_location(li3, file$g, 125, 28, 4343);
    			add_location(li4, file$g, 126, 28, 4410);
    			add_location(ul1, file$g, 124, 24, 4309);
    			attr_dev(td42, "class", "svelte-16apgnq");
    			add_location(td42, file$g, 122, 20, 4239);
    			add_location(li5, file$g, 132, 28, 4621);
    			add_location(li6, file$g, 133, 28, 4685);
    			add_location(ul2, file$g, 131, 24, 4587);
    			attr_dev(td43, "class", "svelte-16apgnq");
    			add_location(td43, file$g, 129, 20, 4513);
    			attr_dev(tr24, "class", "svelte-16apgnq");
    			add_location(tr24, file$g, 121, 16, 4213);
    			add_location(li7, file$g, 141, 28, 4963);
    			add_location(li8, file$g, 142, 28, 5020);
    			add_location(li9, file$g, 143, 28, 5075);
    			add_location(ul3, file$g, 140, 24, 4929);
    			attr_dev(td44, "class", "svelte-16apgnq");
    			add_location(td44, file$g, 138, 20, 4844);
    			add_location(li10, file$g, 149, 28, 5308);
    			add_location(li11, file$g, 150, 28, 5372);
    			add_location(li12, file$g, 151, 28, 5431);
    			add_location(ul4, file$g, 148, 24, 5274);
    			attr_dev(td45, "class", "svelte-16apgnq");
    			add_location(td45, file$g, 146, 20, 5202);
    			attr_dev(tr25, "class", "svelte-16apgnq");
    			add_location(tr25, file$g, 137, 16, 4818);
    			add_location(li13, file$g, 159, 28, 5683);
    			add_location(li14, file$g, 160, 28, 5738);
    			add_location(ul5, file$g, 158, 24, 5649);
    			attr_dev(td46, "class", "svelte-16apgnq");
    			add_location(td46, file$g, 156, 20, 5584);
    			attr_dev(td47, "class", "svelte-16apgnq");
    			add_location(td47, file$g, 163, 20, 5844);
    			attr_dev(tr26, "class", "svelte-16apgnq");
    			add_location(tr26, file$g, 155, 16, 5558);
    			add_location(li15, file$g, 168, 24, 6060);
    			add_location(li16, file$g, 169, 24, 6129);
    			attr_dev(td48, "class", "svelte-16apgnq");
    			add_location(td48, file$g, 166, 20, 5981);
    			attr_dev(td49, "class", "svelte-16apgnq");
    			add_location(td49, file$g, 171, 20, 6220);
    			attr_dev(tr27, "class", "svelte-16apgnq");
    			add_location(tr27, file$g, 165, 16, 5955);
    			attr_dev(td50, "class", "svelte-16apgnq");
    			add_location(td50, file$g, 174, 20, 6327);
    			attr_dev(td51, "class", "svelte-16apgnq");
    			add_location(td51, file$g, 175, 20, 6375);
    			attr_dev(tr28, "class", "svelte-16apgnq");
    			add_location(tr28, file$g, 173, 16, 6301);
    			attr_dev(td52, "class", "svelte-16apgnq");
    			add_location(td52, file$g, 178, 20, 6473);
    			attr_dev(td53, "class", "svelte-16apgnq");
    			add_location(td53, file$g, 179, 20, 6535);
    			attr_dev(tr29, "class", "svelte-16apgnq");
    			add_location(tr29, file$g, 177, 16, 6447);
    			attr_dev(td54, "class", "svelte-16apgnq");
    			add_location(td54, file$g, 182, 20, 6611);
    			attr_dev(td55, "class", "svelte-16apgnq");
    			add_location(td55, file$g, 183, 20, 6665);
    			attr_dev(tr30, "class", "svelte-16apgnq");
    			add_location(tr30, file$g, 181, 16, 6585);
    			attr_dev(table2, "class", "svelte-16apgnq");
    			add_location(table2, file$g, 105, 12, 3638);
    			attr_dev(div1, "class", "postRnNursing");
    			add_location(div1, file$g, 103, 8, 3533);
    			attr_dev(div2, "class", "curriculum");
    			add_location(div2, file$g, 5, 4, 49);
    			attr_dev(div3, "class", "this");
    			add_location(div3, file$g, 4, 0, 25);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, h3);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, h50);
    			append_dev(div0, t3);
    			append_dev(div0, table0);
    			append_dev(table0, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t5);
    			append_dev(tr0, th1);
    			append_dev(table0, t7);
    			append_dev(table0, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t9);
    			append_dev(tr1, td1);
    			append_dev(table0, t11);
    			append_dev(table0, tr2);
    			append_dev(tr2, td2);
    			append_dev(tr2, t13);
    			append_dev(tr2, td3);
    			append_dev(table0, t15);
    			append_dev(table0, tr3);
    			append_dev(tr3, td4);
    			append_dev(tr3, t17);
    			append_dev(tr3, td5);
    			append_dev(table0, t19);
    			append_dev(table0, tr4);
    			append_dev(tr4, td6);
    			append_dev(tr4, t21);
    			append_dev(tr4, td7);
    			append_dev(table0, t23);
    			append_dev(table0, tr5);
    			append_dev(tr5, td8);
    			append_dev(tr5, t25);
    			append_dev(tr5, td9);
    			append_dev(table0, t27);
    			append_dev(table0, tr6);
    			append_dev(tr6, td10);
    			append_dev(tr6, t29);
    			append_dev(tr6, td11);
    			append_dev(table0, t31);
    			append_dev(table0, tr7);
    			append_dev(tr7, td12);
    			append_dev(tr7, t33);
    			append_dev(tr7, td13);
    			append_dev(table0, t35);
    			append_dev(table0, tr8);
    			append_dev(tr8, td14);
    			append_dev(tr8, t37);
    			append_dev(tr8, td15);
    			append_dev(table0, t38);
    			append_dev(table0, tr9);
    			append_dev(tr9, td16);
    			append_dev(tr9, t40);
    			append_dev(tr9, td17);
    			append_dev(table0, t41);
    			append_dev(table0, tr10);
    			append_dev(tr10, td18);
    			append_dev(tr10, t43);
    			append_dev(tr10, td19);
    			append_dev(table0, t44);
    			append_dev(table0, tr11);
    			append_dev(tr11, td20);
    			append_dev(tr11, t46);
    			append_dev(tr11, td21);
    			append_dev(div0, t47);
    			append_dev(div0, br);
    			append_dev(div0, t48);
    			append_dev(div0, table1);
    			append_dev(table1, tr12);
    			append_dev(tr12, th2);
    			append_dev(tr12, t50);
    			append_dev(tr12, th3);
    			append_dev(table1, t52);
    			append_dev(table1, tr13);
    			append_dev(tr13, td22);
    			append_dev(tr13, t54);
    			append_dev(tr13, td23);
    			append_dev(table1, t56);
    			append_dev(table1, tr14);
    			append_dev(tr14, td24);
    			append_dev(tr14, t58);
    			append_dev(tr14, td25);
    			append_dev(table1, t60);
    			append_dev(table1, tr15);
    			append_dev(tr15, td26);
    			append_dev(tr15, t62);
    			append_dev(tr15, td27);
    			append_dev(table1, t64);
    			append_dev(table1, tr16);
    			append_dev(tr16, td28);
    			append_dev(tr16, t66);
    			append_dev(tr16, td29);
    			append_dev(table1, t68);
    			append_dev(table1, tr17);
    			append_dev(tr17, td30);
    			append_dev(tr17, t70);
    			append_dev(tr17, td31);
    			append_dev(table1, t72);
    			append_dev(table1, tr18);
    			append_dev(tr18, td32);
    			append_dev(tr18, t74);
    			append_dev(tr18, td33);
    			append_dev(table1, t76);
    			append_dev(table1, tr19);
    			append_dev(tr19, td34);
    			append_dev(tr19, t78);
    			append_dev(tr19, td35);
    			append_dev(table1, t80);
    			append_dev(table1, tr20);
    			append_dev(tr20, td36);
    			append_dev(tr20, t82);
    			append_dev(tr20, td37);
    			append_dev(table1, t84);
    			append_dev(table1, tr21);
    			append_dev(tr21, td38);
    			append_dev(tr21, t86);
    			append_dev(tr21, td39);
    			append_dev(div2, t87);
    			append_dev(div2, div1);
    			append_dev(div1, h51);
    			append_dev(div1, t89);
    			append_dev(div1, table2);
    			append_dev(table2, tr22);
    			append_dev(tr22, th4);
    			append_dev(tr22, t91);
    			append_dev(tr22, th5);
    			append_dev(table2, t93);
    			append_dev(table2, tr23);
    			append_dev(tr23, td40);
    			append_dev(td40, t94);
    			append_dev(td40, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t96);
    			append_dev(ul0, li1);
    			append_dev(ul0, t98);
    			append_dev(ul0, li2);
    			append_dev(tr23, t100);
    			append_dev(tr23, td41);
    			append_dev(table2, t102);
    			append_dev(table2, tr24);
    			append_dev(tr24, td42);
    			append_dev(td42, t103);
    			append_dev(td42, ul1);
    			append_dev(ul1, li3);
    			append_dev(ul1, t105);
    			append_dev(ul1, li4);
    			append_dev(tr24, t107);
    			append_dev(tr24, td43);
    			append_dev(td43, t108);
    			append_dev(td43, ul2);
    			append_dev(ul2, li5);
    			append_dev(ul2, t110);
    			append_dev(ul2, li6);
    			append_dev(table2, t112);
    			append_dev(table2, tr25);
    			append_dev(tr25, td44);
    			append_dev(td44, t113);
    			append_dev(td44, ul3);
    			append_dev(ul3, li7);
    			append_dev(ul3, t115);
    			append_dev(ul3, li8);
    			append_dev(ul3, t117);
    			append_dev(ul3, li9);
    			append_dev(tr25, t119);
    			append_dev(tr25, td45);
    			append_dev(td45, t120);
    			append_dev(td45, ul4);
    			append_dev(ul4, li10);
    			append_dev(ul4, t122);
    			append_dev(ul4, li11);
    			append_dev(ul4, t124);
    			append_dev(ul4, li12);
    			append_dev(table2, t126);
    			append_dev(table2, tr26);
    			append_dev(tr26, td46);
    			append_dev(td46, t127);
    			append_dev(td46, ul5);
    			append_dev(ul5, li13);
    			append_dev(ul5, t129);
    			append_dev(ul5, li14);
    			append_dev(tr26, t131);
    			append_dev(tr26, td47);
    			append_dev(table2, t133);
    			append_dev(table2, tr27);
    			append_dev(tr27, td48);
    			append_dev(td48, t134);
    			append_dev(td48, li15);
    			append_dev(td48, t136);
    			append_dev(td48, li16);
    			append_dev(tr27, t138);
    			append_dev(tr27, td49);
    			append_dev(table2, t140);
    			append_dev(table2, tr28);
    			append_dev(tr28, td50);
    			append_dev(tr28, t142);
    			append_dev(tr28, td51);
    			append_dev(table2, t144);
    			append_dev(table2, tr29);
    			append_dev(tr29, td52);
    			append_dev(tr29, t146);
    			append_dev(tr29, td53);
    			append_dev(table2, t147);
    			append_dev(table2, tr30);
    			append_dev(tr30, td54);
    			append_dev(tr30, t149);
    			append_dev(tr30, td55);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Curriculum', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Curriculum> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Curriculum extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Curriculum",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\lib\components\content\factSheet.svelte generated by Svelte v3.55.1 */

    const file$f = "src\\lib\\components\\content\\factSheet.svelte";

    function create_fragment$h(ctx) {
    	let div5;
    	let div4;
    	let h3;
    	let t1;
    	let div0;
    	let h40;
    	let t3;
    	let table0;
    	let tr0;
    	let th0;
    	let t5;
    	let tr1;
    	let th1;
    	let t7;
    	let td0;
    	let t9;
    	let tr2;
    	let th2;
    	let t11;
    	let td1;
    	let t13;
    	let tr3;
    	let th3;
    	let t15;
    	let td2;
    	let t17;
    	let tr4;
    	let th4;
    	let t19;
    	let br0;
    	let t20;
    	let table1;
    	let tr5;
    	let th5;
    	let t22;
    	let tr6;
    	let th6;
    	let t24;
    	let td3;
    	let t26;
    	let tr7;
    	let th7;
    	let t28;
    	let td4;
    	let t30;
    	let tr8;
    	let th8;
    	let t32;
    	let td5;
    	let ul0;
    	let li0;
    	let t34;
    	let li1;
    	let t36;
    	let tr9;
    	let th9;
    	let t38;
    	let td6;
    	let ul1;
    	let li2;
    	let t40;
    	let li3;
    	let t42;
    	let tr10;
    	let th10;
    	let t44;
    	let td7;
    	let ul2;
    	let li4;
    	let t46;
    	let li5;
    	let t48;
    	let li6;
    	let t50;
    	let li7;
    	let t52;
    	let li8;
    	let t54;
    	let div3;
    	let h41;
    	let t56;
    	let div1;
    	let p0;
    	let t58;
    	let ul3;
    	let li9;
    	let t60;
    	let li10;
    	let t62;
    	let h6;
    	let t64;
    	let ul4;
    	let li11;
    	let t66;
    	let li17;
    	let t67;
    	let ol;
    	let li12;
    	let t69;
    	let li13;
    	let t71;
    	let li14;
    	let t73;
    	let li15;
    	let t75;
    	let li16;
    	let t77;
    	let li18;
    	let t79;
    	let li19;
    	let t81;
    	let div2;
    	let h5;
    	let t83;
    	let p1;
    	let t84;
    	let br1;
    	let t85;
    	let br2;
    	let t86;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Factsheet of Nursing";
    			t1 = space();
    			div0 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Eligibility Criteria";
    			t3 = space();
    			table0 = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "B.Sc. Nursing (4 Years)";
    			t5 = space();
    			tr1 = element("tr");
    			th1 = element("th");
    			th1.textContent = "Age limit";
    			t7 = space();
    			td0 = element("td");
    			td0.textContent = "17-20 Years";
    			t9 = space();
    			tr2 = element("tr");
    			th2 = element("th");
    			th2.textContent = "Nationality";
    			t11 = space();
    			td1 = element("td");
    			td1.textContent = "Pakistani";
    			t13 = space();
    			tr3 = element("tr");
    			th3 = element("th");
    			th3.textContent = "Educational Background";
    			t15 = space();
    			td2 = element("td");
    			td2.textContent = "F.Sc. Pre-medical with at least 50% marks";
    			t17 = space();
    			tr4 = element("tr");
    			th4 = element("th");
    			th4.textContent = "Selection will be purely on merit";
    			t19 = space();
    			br0 = element("br");
    			t20 = space();
    			table1 = element("table");
    			tr5 = element("tr");
    			th5 = element("th");
    			th5.textContent = "Post RN B.Sc. Nursing (2 Years Program)";
    			t22 = space();
    			tr6 = element("tr");
    			th6 = element("th");
    			th6.textContent = "Age limit";
    			t24 = space();
    			td3 = element("td");
    			td3.textContent = "50 Years";
    			t26 = space();
    			tr7 = element("tr");
    			th7 = element("th");
    			th7.textContent = "Nationality";
    			t28 = space();
    			td4 = element("td");
    			td4.textContent = "Pakistani Candidates from other provinces may only be considered if no eligible applicant from Punjab has applied.";
    			t30 = space();
    			tr8 = element("tr");
    			th8 = element("th");
    			th8.textContent = "Educational Background";
    			t32 = space();
    			td5 = element("td");
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Diploma in General Nursing & Diploma in Midwifery.";
    			t34 = space();
    			li1 = element("li");
    			li1.textContent = "Candidates having Diploma in Nursing Management & Nursing Educational will be given 5 additional marks.";
    			t36 = space();
    			tr9 = element("tr");
    			th9 = element("th");
    			th9.textContent = "Experience Requires";
    			t38 = space();
    			td6 = element("td");
    			ul1 = element("ul");
    			li2 = element("li");
    			li2.textContent = "Teaching experience as Nursing Instructor in School of Nursing/Midwifery/PHN";
    			t40 = space();
    			li3 = element("li");
    			li3.textContent = "At least 2-years clinical experience";
    			t42 = space();
    			tr10 = element("tr");
    			th10 = element("th");
    			th10.textContent = "Other requirements";
    			t44 = space();
    			td7 = element("td");
    			ul2 = element("ul");
    			li4 = element("li");
    			li4.textContent = "Latest registration with PNC";
    			t46 = space();
    			li5 = element("li");
    			li5.textContent = "Medical Fitness Certificate";
    			t48 = space();
    			li6 = element("li");
    			li6.textContent = "Last 3 Years good ACRs";
    			t50 = space();
    			li7 = element("li");
    			li7.textContent = "3 years of clinical experience";
    			t52 = space();
    			li8 = element("li");
    			li8.textContent = "Character Certificate";
    			t54 = space();
    			div3 = element("div");
    			h41 = element("h4");
    			h41.textContent = "SELECTION PROCEDURE & POLICY";
    			t56 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "The Inspire College of Nursing & Health Sciences seeks to offer students the best learning environment possible by motivating and assisting them so that they can:";
    			t58 = space();
    			ul3 = element("ul");
    			li9 = element("li");
    			li9.textContent = "Realize their maximum potential in their academic field, as contributors to society, and as people.";
    			t60 = space();
    			li10 = element("li");
    			li10.textContent = "Get ready for the working world and commit to lifelong learning.";
    			t62 = space();
    			h6 = element("h6");
    			h6.textContent = "THE INSTITUTES POLICY IS THAT ALL APPLICANTS ARE SELECTED PRIMARILY ON MERIT AND THAT THEIR APPLICATIONS FOR ACADEMIC POTENTIAL ARE CONSIDERED ON THE BASIS OF:";
    			t64 = space();
    			ul4 = element("ul");
    			li11 = element("li");
    			li11.textContent = "Academic credentials (specific details for different programs outlined in Nursing Factsheet)";
    			t66 = space();
    			li17 = element("li");
    			t67 = text("Your performance on the entrance exam will be based on your familiarity with:\r\n                        ");
    			ol = element("ol");
    			li12 = element("li");
    			li12.textContent = "Biology";
    			t69 = space();
    			li13 = element("li");
    			li13.textContent = "Physics";
    			t71 = space();
    			li14 = element("li");
    			li14.textContent = "Chemistry";
    			t73 = space();
    			li15 = element("li");
    			li15.textContent = "Math";
    			t75 = space();
    			li16 = element("li");
    			li16.textContent = "English";
    			t77 = space();
    			li18 = element("li");
    			li18.textContent = "Asking questions during the interview to learn more about the applicants as persons and to evaluate their academic capacity and ability to successfully complete the program.";
    			t79 = space();
    			li19 = element("li");
    			li19.textContent = "The application process should be finished as soon as feasible. Final selection is contingent upon a positive medical examination. Once all of the application materials have been received, candidates who will be taking the admission test will be notified in writing or by phone.";
    			t81 = space();
    			div2 = element("div");
    			h5 = element("h5");
    			h5.textContent = "SELECTION PROCEDURE";
    			t83 = space();
    			p1 = element("p");
    			t84 = text("Entry tests, medical exams, and interviews are used for selection. When shortlisting candidates, we pay close attention to the information provided on the application form. In the application form, all information and supporting documentation should be listed as requirements.\r\n                    ");
    			br1 = element("br");
    			t85 = text("\r\n                    A physically demanding occupation is nursing. You must be physically and mentally capable of executing all the professional tasks necessary to be qualified. Every offer is contingent on a medical evaluation. An interviewee's general suitability to pursue a career in healthcare will be evaluated during the interview process.\r\n                    ");
    			br2 = element("br");
    			t86 = text("\r\n                    We encourage prospective candidates to an open day so they may learn more about the nursing programs, tour the campus, and get to know the staff.");
    			add_location(h3, file$f, 6, 8, 82);
    			add_location(h40, file$f, 9, 12, 178);
    			attr_dev(th0, "colspan", "2");
    			attr_dev(th0, "class", "svelte-16apgnq");
    			add_location(th0, file$f, 12, 20, 272);
    			attr_dev(tr0, "class", "svelte-16apgnq");
    			add_location(tr0, file$f, 11, 16, 246);
    			attr_dev(th1, "class", "svelte-16apgnq");
    			add_location(th1, file$f, 15, 20, 383);
    			attr_dev(td0, "class", "svelte-16apgnq");
    			add_location(td0, file$f, 16, 20, 424);
    			attr_dev(tr1, "class", "svelte-16apgnq");
    			add_location(tr1, file$f, 14, 16, 357);
    			attr_dev(th2, "class", "svelte-16apgnq");
    			add_location(th2, file$f, 19, 20, 511);
    			attr_dev(td1, "class", "svelte-16apgnq");
    			add_location(td1, file$f, 20, 20, 554);
    			attr_dev(tr2, "class", "svelte-16apgnq");
    			add_location(tr2, file$f, 18, 16, 485);
    			attr_dev(th3, "class", "svelte-16apgnq");
    			add_location(th3, file$f, 23, 20, 639);
    			attr_dev(td2, "class", "svelte-16apgnq");
    			add_location(td2, file$f, 24, 20, 693);
    			attr_dev(tr3, "class", "svelte-16apgnq");
    			add_location(tr3, file$f, 22, 16, 613);
    			attr_dev(th4, "colspan", "2");
    			attr_dev(th4, "class", "svelte-16apgnq");
    			add_location(th4, file$f, 27, 20, 810);
    			attr_dev(tr4, "class", "svelte-16apgnq");
    			add_location(tr4, file$f, 26, 16, 784);
    			attr_dev(table0, "class", "svelte-16apgnq");
    			add_location(table0, file$f, 10, 12, 221);
    			add_location(br0, file$f, 30, 12, 923);
    			attr_dev(th5, "colspan", "2");
    			attr_dev(th5, "class", "svelte-16apgnq");
    			add_location(th5, file$f, 33, 20, 992);
    			attr_dev(tr5, "class", "svelte-16apgnq");
    			add_location(tr5, file$f, 32, 16, 966);
    			attr_dev(th6, "class", "svelte-16apgnq");
    			add_location(th6, file$f, 36, 20, 1119);
    			attr_dev(td3, "class", "svelte-16apgnq");
    			add_location(td3, file$f, 37, 20, 1160);
    			attr_dev(tr6, "class", "svelte-16apgnq");
    			add_location(tr6, file$f, 35, 16, 1093);
    			attr_dev(th7, "class", "svelte-16apgnq");
    			add_location(th7, file$f, 40, 20, 1244);
    			attr_dev(td4, "class", "svelte-16apgnq");
    			add_location(td4, file$f, 41, 20, 1287);
    			attr_dev(tr7, "class", "svelte-16apgnq");
    			add_location(tr7, file$f, 39, 16, 1218);
    			attr_dev(th8, "class", "svelte-16apgnq");
    			add_location(th8, file$f, 44, 20, 1477);
    			add_location(li0, file$f, 47, 28, 1595);
    			add_location(li1, file$f, 48, 28, 1684);
    			add_location(ul0, file$f, 46, 24, 1561);
    			attr_dev(td5, "class", "svelte-16apgnq");
    			add_location(td5, file$f, 45, 20, 1531);
    			attr_dev(tr8, "class", "svelte-16apgnq");
    			add_location(tr8, file$f, 43, 16, 1451);
    			attr_dev(th9, "class", "svelte-16apgnq");
    			add_location(th9, file$f, 53, 20, 1921);
    			add_location(li2, file$f, 56, 28, 2036);
    			add_location(li3, file$f, 57, 28, 2151);
    			add_location(ul1, file$f, 55, 24, 2002);
    			attr_dev(td6, "class", "svelte-16apgnq");
    			add_location(td6, file$f, 54, 20, 1972);
    			attr_dev(tr9, "class", "svelte-16apgnq");
    			add_location(tr9, file$f, 52, 16, 1895);
    			attr_dev(th10, "class", "svelte-16apgnq");
    			add_location(th10, file$f, 62, 20, 2321);
    			add_location(li4, file$f, 65, 28, 2435);
    			add_location(li5, file$f, 66, 28, 2503);
    			add_location(li6, file$f, 67, 28, 2570);
    			add_location(li7, file$f, 68, 28, 2632);
    			add_location(li8, file$f, 69, 28, 2702);
    			add_location(ul2, file$f, 64, 24, 2401);
    			attr_dev(td7, "class", "svelte-16apgnq");
    			add_location(td7, file$f, 63, 20, 2371);
    			attr_dev(tr10, "class", "svelte-16apgnq");
    			add_location(tr10, file$f, 61, 16, 2295);
    			attr_dev(table1, "class", "svelte-16apgnq");
    			add_location(table1, file$f, 31, 12, 941);
    			attr_dev(div0, "class", "eligibilityCriteria");
    			add_location(div0, file$f, 8, 8, 131);
    			add_location(h41, file$f, 77, 12, 2918);
    			add_location(p0, file$f, 79, 16, 3010);
    			add_location(li9, file$f, 83, 20, 3263);
    			add_location(li10, file$f, 84, 20, 3393);
    			add_location(ul3, file$f, 82, 16, 3237);
    			add_location(h6, file$f, 86, 16, 3507);
    			add_location(li11, file$f, 90, 20, 3759);
    			add_location(li12, file$f, 94, 28, 4049);
    			add_location(li13, file$f, 95, 28, 4095);
    			add_location(li14, file$f, 96, 28, 4141);
    			add_location(li15, file$f, 97, 28, 4189);
    			add_location(li16, file$f, 98, 28, 4232);
    			add_location(ol, file$f, 93, 24, 4015);
    			add_location(li17, file$f, 91, 20, 3882);
    			add_location(li18, file$f, 101, 20, 4328);
    			add_location(li19, file$f, 102, 20, 4532);
    			add_location(ul4, file$f, 89, 16, 3733);
    			attr_dev(div1, "class", "selection");
    			add_location(div1, file$f, 78, 12, 2969);
    			add_location(h5, file$f, 107, 16, 4928);
    			add_location(br1, file$f, 110, 20, 5297);
    			add_location(br2, file$f, 112, 20, 5670);
    			add_location(p1, file$f, 108, 16, 4974);
    			attr_dev(div2, "class", "selectionProcedure");
    			add_location(div2, file$f, 106, 12, 4878);
    			attr_dev(div3, "class", "selectionProcedureAndPolicy");
    			add_location(div3, file$f, 76, 8, 2863);
    			attr_dev(div4, "class", "factSheet");
    			add_location(div4, file$f, 5, 4, 49);
    			attr_dev(div5, "class", "this");
    			add_location(div5, file$f, 4, 0, 25);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, h3);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div0, h40);
    			append_dev(div0, t3);
    			append_dev(div0, table0);
    			append_dev(table0, tr0);
    			append_dev(tr0, th0);
    			append_dev(table0, t5);
    			append_dev(table0, tr1);
    			append_dev(tr1, th1);
    			append_dev(tr1, t7);
    			append_dev(tr1, td0);
    			append_dev(table0, t9);
    			append_dev(table0, tr2);
    			append_dev(tr2, th2);
    			append_dev(tr2, t11);
    			append_dev(tr2, td1);
    			append_dev(table0, t13);
    			append_dev(table0, tr3);
    			append_dev(tr3, th3);
    			append_dev(tr3, t15);
    			append_dev(tr3, td2);
    			append_dev(table0, t17);
    			append_dev(table0, tr4);
    			append_dev(tr4, th4);
    			append_dev(div0, t19);
    			append_dev(div0, br0);
    			append_dev(div0, t20);
    			append_dev(div0, table1);
    			append_dev(table1, tr5);
    			append_dev(tr5, th5);
    			append_dev(table1, t22);
    			append_dev(table1, tr6);
    			append_dev(tr6, th6);
    			append_dev(tr6, t24);
    			append_dev(tr6, td3);
    			append_dev(table1, t26);
    			append_dev(table1, tr7);
    			append_dev(tr7, th7);
    			append_dev(tr7, t28);
    			append_dev(tr7, td4);
    			append_dev(table1, t30);
    			append_dev(table1, tr8);
    			append_dev(tr8, th8);
    			append_dev(tr8, t32);
    			append_dev(tr8, td5);
    			append_dev(td5, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t34);
    			append_dev(ul0, li1);
    			append_dev(table1, t36);
    			append_dev(table1, tr9);
    			append_dev(tr9, th9);
    			append_dev(tr9, t38);
    			append_dev(tr9, td6);
    			append_dev(td6, ul1);
    			append_dev(ul1, li2);
    			append_dev(ul1, t40);
    			append_dev(ul1, li3);
    			append_dev(table1, t42);
    			append_dev(table1, tr10);
    			append_dev(tr10, th10);
    			append_dev(tr10, t44);
    			append_dev(tr10, td7);
    			append_dev(td7, ul2);
    			append_dev(ul2, li4);
    			append_dev(ul2, t46);
    			append_dev(ul2, li5);
    			append_dev(ul2, t48);
    			append_dev(ul2, li6);
    			append_dev(ul2, t50);
    			append_dev(ul2, li7);
    			append_dev(ul2, t52);
    			append_dev(ul2, li8);
    			append_dev(div4, t54);
    			append_dev(div4, div3);
    			append_dev(div3, h41);
    			append_dev(div3, t56);
    			append_dev(div3, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t58);
    			append_dev(div1, ul3);
    			append_dev(ul3, li9);
    			append_dev(ul3, t60);
    			append_dev(ul3, li10);
    			append_dev(div1, t62);
    			append_dev(div1, h6);
    			append_dev(div1, t64);
    			append_dev(div1, ul4);
    			append_dev(ul4, li11);
    			append_dev(ul4, t66);
    			append_dev(ul4, li17);
    			append_dev(li17, t67);
    			append_dev(li17, ol);
    			append_dev(ol, li12);
    			append_dev(ol, t69);
    			append_dev(ol, li13);
    			append_dev(ol, t71);
    			append_dev(ol, li14);
    			append_dev(ol, t73);
    			append_dev(ol, li15);
    			append_dev(ol, t75);
    			append_dev(ol, li16);
    			append_dev(ul4, t77);
    			append_dev(ul4, li18);
    			append_dev(ul4, t79);
    			append_dev(ul4, li19);
    			append_dev(div3, t81);
    			append_dev(div3, div2);
    			append_dev(div2, h5);
    			append_dev(div2, t83);
    			append_dev(div2, p1);
    			append_dev(p1, t84);
    			append_dev(p1, br1);
    			append_dev(p1, t85);
    			append_dev(p1, br2);
    			append_dev(p1, t86);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FactSheet', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FactSheet> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class FactSheet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FactSheet",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\lib\components\pages\admissions.svelte generated by Svelte v3.55.1 */
    const file$e = "src\\lib\\components\\pages\\admissions.svelte";

    function create_fragment$g(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let nursingpogs;
    	let t2;
    	let curriculum;
    	let t3;
    	let factsheet;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Admissions",
    				image: "https://www.glentreeacademy.com/admissions-open/img/banner-1.jpg"
    			},
    			$$inline: true
    		});

    	nursingpogs = new NursingPogs({ $$inline: true });
    	curriculum = new Curriculum({ $$inline: true });
    	factsheet = new FactSheet({ $$inline: true });

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			create_component(nursingpogs.$$.fragment);
    			t2 = space();
    			create_component(curriculum.$$.fragment);
    			t3 = space();
    			create_component(factsheet.$$.fragment);
    			document.title = "ICONHS - Admissions";
    			attr_dev(div0, "class", "this_Main");
    			add_location(div0, file$e, 14, 4, 483);
    			attr_dev(div1, "class", "thisAdmission svelte-1fwfeqk");
    			add_location(div1, file$e, 11, 0, 336);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(nursingpogs, div0, null);
    			append_dev(div0, t2);
    			mount_component(curriculum, div0, null);
    			append_dev(div0, t3);
    			mount_component(factsheet, div0, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			transition_in(nursingpogs.$$.fragment, local);
    			transition_in(curriculum.$$.fragment, local);
    			transition_in(factsheet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			transition_out(nursingpogs.$$.fragment, local);
    			transition_out(curriculum.$$.fragment, local);
    			transition_out(factsheet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    			destroy_component(nursingpogs);
    			destroy_component(curriculum);
    			destroy_component(factsheet);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Admissions', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Admissions> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		WelcomeImg,
    		NursingPogs,
    		Curriculum,
    		FactSheet
    	});

    	return [];
    }

    class Admissions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Admissions",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\lib\components\pages\academics.svelte generated by Svelte v3.55.1 */
    const file$d = "src\\lib\\components\\pages\\academics.svelte";

    function create_fragment$f(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let nursingpogs;
    	let t2;
    	let curriculum;
    	let t3;
    	let factsheet;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Academics",
    				image: "https://th.bing.com/th/id/R.7fd1dab2640d2f223a7aaff6e13ac4d1?rik=tjbyURNPkcOyyg&pid=ImgRaw&r=0"
    			},
    			$$inline: true
    		});

    	nursingpogs = new NursingPogs({ $$inline: true });
    	curriculum = new Curriculum({ $$inline: true });
    	factsheet = new FactSheet({ $$inline: true });

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			create_component(nursingpogs.$$.fragment);
    			t2 = space();
    			create_component(curriculum.$$.fragment);
    			t3 = space();
    			create_component(factsheet.$$.fragment);
    			document.title = "ICONHS - Academics";
    			attr_dev(div0, "class", "this_Main");
    			add_location(div0, file$d, 14, 4, 515);
    			attr_dev(div1, "class", "thisAcademics svelte-1xwn8nr");
    			add_location(div1, file$d, 11, 0, 339);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(nursingpogs, div0, null);
    			append_dev(div0, t2);
    			mount_component(curriculum, div0, null);
    			append_dev(div0, t3);
    			mount_component(factsheet, div0, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			transition_in(nursingpogs.$$.fragment, local);
    			transition_in(curriculum.$$.fragment, local);
    			transition_in(factsheet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			transition_out(nursingpogs.$$.fragment, local);
    			transition_out(curriculum.$$.fragment, local);
    			transition_out(factsheet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    			destroy_component(nursingpogs);
    			destroy_component(curriculum);
    			destroy_component(factsheet);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Academics', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Academics> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		WelcomeImg,
    		NursingPogs,
    		Curriculum,
    		FactSheet
    	});

    	return [];
    }

    class Academics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Academics",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\lib\components\pages\studentLife.svelte generated by Svelte v3.55.1 */
    const file$c = "src\\lib\\components\\pages\\studentLife.svelte";

    function create_fragment$e(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Student Life",
    				image: "https://www.umt.edu/music/images/current-students/student-life.jpg"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "hi";
    			document.title = "ICONHS - Student Life";
    			attr_dev(div0, "class", "this_Main");
    			add_location(div0, file$c, 10, 4, 305);
    			attr_dev(div1, "class", "thisStudent svelte-1rgesha");
    			add_location(div1, file$c, 7, 0, 156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StudentLife', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StudentLife> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class StudentLife extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StudentLife",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\lib\components\pages\careers.svelte generated by Svelte v3.55.1 */
    const file$b = "src\\lib\\components\\pages\\careers.svelte";

    function create_fragment$d(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Career Services",
    				image: "https://th.bing.com/th/id/R.0c7ab4256d9cd75a35c39f665d59b39d?rik=HxqVkziZl1uhlQ&pid=ImgRaw&r=0"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Hi";
    			document.title = "ICONHS - Career Services";
    			attr_dev(div0, "class", "this_Main");
    			add_location(div0, file$b, 10, 4, 339);
    			attr_dev(div1, "class", "thisCareers svelte-1k3hvi6");
    			add_location(div1, file$b, 7, 0, 159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Careers', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Careers> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class Careers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Careers",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\lib\components\pages\newsevents.svelte generated by Svelte v3.55.1 */
    const file$a = "src\\lib\\components\\pages\\newsevents.svelte";

    function create_fragment$c(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "News & Events",
    				image: "https://th.bing.com/th/id/R.635080940b4fea19853984fee84e7a8b?rik=eT6q66OaC3bKwA&riu=http%3a%2f%2fwww.firstbasesolutions.com%2fwp-content%2fuploads%2f2015%2f11%2fnews-banner.jpg&ehk=ruFT1AavUR59vAEOye1RqRMAtvrAnxGqIgY%2fT6XxbtI%3d&risl=&pid=ImgRaw&r=0"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "hi";
    			document.title = "ICONHS - News & Events";
    			attr_dev(div0, "class", "this_Main");
    			add_location(div0, file$a, 10, 4, 488);
    			attr_dev(div1, "class", "thisNews svelte-10wl3iu");
    			add_location(div1, file$a, 7, 0, 157);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Newsevents', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Newsevents> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class Newsevents extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Newsevents",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\lib\components\pages\contactus.svelte generated by Svelte v3.55.1 */
    const file$9 = "src\\lib\\components\\pages\\contactus.svelte";

    function create_fragment$b(ctx) {
    	let t0;
    	let div3;
    	let welcomeimg;
    	let t1;
    	let div2;
    	let div1;
    	let span;
    	let strong0;
    	let t3;
    	let br0;
    	let t4;
    	let br1;
    	let t5;
    	let p0;
    	let strong1;
    	let t7;
    	let hr0;
    	let t8;
    	let br2;
    	let t9;
    	let div0;
    	let p1;
    	let strong2;
    	let t11;
    	let t12;
    	let p2;
    	let strong3;
    	let t14;
    	let t15;
    	let p3;
    	let strong4;
    	let t17;
    	let t18;
    	let p4;
    	let strong5;
    	let t20;
    	let t21;
    	let p5;
    	let strong6;
    	let t23;
    	let hr1;
    	let t24;
    	let br3;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Contact Us",
    				image: "https://th.bing.com/th/id/R.5d3bbbf6443a676f63083717385eb2b4?rik=uKWSnb0Hewkmmw&riu=http%3a%2f%2fwww.quickvisa.in%2fwp-content%2fuploads%2f2017%2f10%2fcontactus-banner.jpg&ehk=OkTMcS2WAhQjZ3Irkt6q%2bS42nLwvZrC3HWHxBx23IUY%3d&risl=&pid=ImgRaw&r=0"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div3 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span = element("span");
    			strong0 = element("strong");
    			strong0.textContent = "Get In Touch With Us";
    			t3 = space();
    			br0 = element("br");
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			p0 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Contact Info";
    			t7 = space();
    			hr0 = element("hr");
    			t8 = space();
    			br2 = element("br");
    			t9 = space();
    			div0 = element("div");
    			p1 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "Phone #1: ";
    			t11 = text("+92-42-37881521");
    			t12 = space();
    			p2 = element("p");
    			strong3 = element("strong");
    			strong3.textContent = "Phone #2: ";
    			t14 = text("+92-42-37881522");
    			t15 = space();
    			p3 = element("p");
    			strong4 = element("strong");
    			strong4.textContent = "Email: ";
    			t17 = text("info@ichonhs.net");
    			t18 = space();
    			p4 = element("p");
    			strong5 = element("strong");
    			strong5.textContent = "Address: ";
    			t20 = text("Plot# 14, Block E2, Hali Road, Gulberg III, Lahore");
    			t21 = space();
    			p5 = element("p");
    			strong6 = element("strong");
    			strong6.textContent = "Useful Links";
    			t23 = space();
    			hr1 = element("hr");
    			t24 = space();
    			br3 = element("br");
    			document.title = "ICONHS - Contact Us";
    			add_location(strong0, file$9, 12, 37, 573);
    			attr_dev(span, "class", "display-6 ");
    			add_location(span, file$9, 12, 12, 548);
    			add_location(br0, file$9, 12, 82, 618);
    			add_location(br1, file$9, 12, 87, 623);
    			add_location(strong1, file$9, 13, 59, 688);
    			attr_dev(p0, "class", "lead colourPrimary text-center px-4");
    			add_location(p0, file$9, 13, 12, 641);
    			attr_dev(hr0, "width", "250px");
    			set_style(hr0, "margin", "0 auto");
    			add_location(hr0, file$9, 14, 12, 736);
    			add_location(br2, file$9, 14, 55, 779);
    			add_location(strong2, file$9, 17, 32, 858);
    			attr_dev(p1, "class", "lead");
    			add_location(p1, file$9, 17, 16, 842);
    			add_location(strong3, file$9, 18, 32, 938);
    			attr_dev(p2, "class", "lead");
    			add_location(p2, file$9, 18, 16, 922);
    			add_location(strong4, file$9, 19, 32, 1018);
    			attr_dev(p3, "class", "lead");
    			add_location(p3, file$9, 19, 16, 1002);
    			add_location(strong5, file$9, 20, 32, 1096);
    			attr_dev(p4, "class", "lead");
    			add_location(p4, file$9, 20, 16, 1080);
    			attr_dev(div0, "class", "contactInfo");
    			add_location(div0, file$9, 16, 12, 799);
    			add_location(strong6, file$9, 24, 59, 1273);
    			attr_dev(p5, "class", "lead colourPrimary text-center px-4");
    			add_location(p5, file$9, 24, 12, 1226);
    			attr_dev(hr1, "width", "250px");
    			set_style(hr1, "margin", "0 auto");
    			add_location(hr1, file$9, 25, 12, 1321);
    			add_location(br3, file$9, 25, 55, 1364);
    			attr_dev(div1, "class", "inTouch");
    			add_location(div1, file$9, 11, 8, 513);
    			attr_dev(div2, "class", "that_Main");
    			add_location(div2, file$9, 10, 4, 480);
    			attr_dev(div3, "class", "thisContact svelte-14pyzjj");
    			add_location(div3, file$9, 7, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(welcomeimg, div3, null);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span);
    			append_dev(span, strong0);
    			append_dev(div1, t3);
    			append_dev(div1, br0);
    			append_dev(div1, t4);
    			append_dev(div1, br1);
    			append_dev(div1, t5);
    			append_dev(div1, p0);
    			append_dev(p0, strong1);
    			append_dev(div1, t7);
    			append_dev(div1, hr0);
    			append_dev(div1, t8);
    			append_dev(div1, br2);
    			append_dev(div1, t9);
    			append_dev(div1, div0);
    			append_dev(div0, p1);
    			append_dev(p1, strong2);
    			append_dev(p1, t11);
    			append_dev(div0, t12);
    			append_dev(div0, p2);
    			append_dev(p2, strong3);
    			append_dev(p2, t14);
    			append_dev(div0, t15);
    			append_dev(div0, p3);
    			append_dev(p3, strong4);
    			append_dev(p3, t17);
    			append_dev(div0, t18);
    			append_dev(div0, p4);
    			append_dev(p4, strong5);
    			append_dev(p4, t20);
    			append_dev(div1, t21);
    			append_dev(div1, p5);
    			append_dev(p5, strong6);
    			append_dev(div1, t23);
    			append_dev(div1, hr1);
    			append_dev(div1, t24);
    			append_dev(div1, br3);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contactus', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contactus> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class Contactus extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contactus",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\lib\components\content\applyForm.svelte generated by Svelte v3.55.1 */

    const file$8 = "src\\lib\\components\\content\\applyForm.svelte";
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    function create_fragment$a(ctx) {
    	let dialog_1;
    	let div;
    	let t0;
    	let hr0;
    	let t1;
    	let t2;
    	let hr1;
    	let t3;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const header_slot_template = /*#slots*/ ctx[3].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[2], get_header_slot_context);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			dialog_1 = element("dialog");
    			div = element("div");
    			if (header_slot) header_slot.c();
    			t0 = space();
    			hr0 = element("hr");
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			hr1 = element("hr");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Cancel";
    			add_location(hr0, file$8, 16, 2, 377);
    			add_location(hr1, file$8, 18, 2, 399);
    			button.autofocus = true;
    			attr_dev(button, "class", "btn btn-warning svelte-divf3d");
    			add_location(button, file$8, 20, 2, 450);
    			attr_dev(div, "class", "svelte-divf3d");
    			add_location(div, file$8, 14, 1, 317);
    			attr_dev(dialog_1, "class", "svelte-divf3d");
    			add_location(dialog_1, file$8, 9, 0, 205);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dialog_1, anchor);
    			append_dev(dialog_1, div);

    			if (header_slot) {
    				header_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, hr0);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t2);
    			append_dev(div, hr1);
    			append_dev(div, t3);
    			append_dev(div, button);
    			/*dialog_1_binding*/ ctx[6](dialog_1);
    			current = true;
    			button.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(div, "click", stop_propagation(/*click_handler*/ ctx[4]), false, false, true),
    					listen_dev(dialog_1, "close", /*close_handler*/ ctx[7], false, false, false),
    					listen_dev(dialog_1, "click", self(/*click_handler_2*/ ctx[8]), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[2], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dialog_1);
    			if (header_slot) header_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*dialog_1_binding*/ ctx[6](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ApplyForm', slots, ['header','default']);
    	let { showModal } = $$props;
    	let dialog; // HTMLDialogElement

    	$$self.$$.on_mount.push(function () {
    		if (showModal === undefined && !('showModal' in $$props || $$self.$$.bound[$$self.$$.props['showModal']])) {
    			console.warn("<ApplyForm> was created without expected prop 'showModal'");
    		}
    	});

    	const writable_props = ['showModal'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ApplyForm> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = () => dialog.close();

    	function dialog_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dialog = $$value;
    			$$invalidate(1, dialog);
    		});
    	}

    	const close_handler = () => $$invalidate(0, showModal = false);
    	const click_handler_2 = () => dialog.close();

    	$$self.$$set = $$props => {
    		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ showModal, dialog });

    	$$self.$inject_state = $$props => {
    		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ('dialog' in $$props) $$invalidate(1, dialog = $$props.dialog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dialog, showModal*/ 3) {
    			if (dialog && showModal) dialog.showModal();
    		}
    	};

    	return [
    		showModal,
    		dialog,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		dialog_1_binding,
    		close_handler,
    		click_handler_2
    	];
    }

    class ApplyForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { showModal: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ApplyForm",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get showModal() {
    		throw new Error("<ApplyForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showModal(value) {
    		throw new Error("<ApplyForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\components\pages2\applyNow.svelte generated by Svelte v3.55.1 */
    const file$7 = "src\\lib\\components\\pages2\\applyNow.svelte";

    // (47:0) <ApplyForm bind:showModal class="applyForm">
    function create_default_slot(ctx) {
    	let div11;
    	let form;
    	let div5;
    	let div3;
    	let div0;
    	let label0;
    	let t1;
    	let br0;
    	let t2;
    	let input0;
    	let br1;
    	let t3;
    	let label1;
    	let t5;
    	let br2;
    	let t6;
    	let input1;
    	let br3;
    	let t7;
    	let div1;
    	let label2;
    	let t9;
    	let br4;
    	let t10;
    	let input2;
    	let br5;
    	let t11;
    	let label3;
    	let t13;
    	let br6;
    	let t14;
    	let input3;
    	let br7;
    	let t15;
    	let div2;
    	let label4;
    	let t17;
    	let br8;
    	let t18;
    	let input4;
    	let br9;
    	let t19;
    	let label5;
    	let t21;
    	let br10;
    	let t22;
    	let input5;
    	let br11;
    	let t23;
    	let div4;
    	let label6;
    	let t25;
    	let input6;
    	let br12;
    	let t26;
    	let div8;
    	let div6;
    	let label7;
    	let t28;
    	let input7;
    	let br13;
    	let t29;
    	let div7;
    	let label8;
    	let t31;
    	let input8;
    	let t32;
    	let label9;
    	let t34;
    	let input9;
    	let t35;
    	let label10;
    	let br14;
    	let t37;
    	let label11;
    	let t39;
    	let input10;
    	let br15;
    	let t40;
    	let label12;
    	let t42;
    	let input11;
    	let br16;
    	let t43;
    	let div10;
    	let div9;
    	let label13;
    	let t45;
    	let br17;
    	let t46;
    	let input12;
    	let t47;
    	let label14;
    	let t49;
    	let input13;
    	let br18;
    	let t50;
    	let label15;
    	let t52;
    	let input14;
    	let br19;
    	let t53;
    	let label16;
    	let t55;
    	let textarea0;
    	let br20;
    	let t56;
    	let label17;
    	let t58;
    	let textarea1;
    	let br21;
    	let t59;
    	let h2;
    	let t61;
    	let label18;
    	let t63;
    	let input15;
    	let br22;
    	let t64;
    	let label19;
    	let t66;
    	let input16;
    	let br23;
    	let t67;
    	let label20;
    	let t69;
    	let input17;
    	let br24;
    	let t70;
    	let label21;
    	let t72;
    	let input18;
    	let br25;
    	let t73;
    	let label22;
    	let t75;
    	let input19;
    	let br26;

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			form = element("form");
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "First Name:";
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			input0 = element("input");
    			br1 = element("br");
    			t3 = space();
    			label1 = element("label");
    			label1.textContent = "Last Name:";
    			t5 = space();
    			br2 = element("br");
    			t6 = space();
    			input1 = element("input");
    			br3 = element("br");
    			t7 = space();
    			div1 = element("div");
    			label2 = element("label");
    			label2.textContent = "Father Name:";
    			t9 = space();
    			br4 = element("br");
    			t10 = space();
    			input2 = element("input");
    			br5 = element("br");
    			t11 = space();
    			label3 = element("label");
    			label3.textContent = "Father Occupation:";
    			t13 = space();
    			br6 = element("br");
    			t14 = space();
    			input3 = element("input");
    			br7 = element("br");
    			t15 = space();
    			div2 = element("div");
    			label4 = element("label");
    			label4.textContent = "Guardian Name:";
    			t17 = space();
    			br8 = element("br");
    			t18 = space();
    			input4 = element("input");
    			br9 = element("br");
    			t19 = space();
    			label5 = element("label");
    			label5.textContent = "Guardian Occupation:";
    			t21 = space();
    			br10 = element("br");
    			t22 = space();
    			input5 = element("input");
    			br11 = element("br");
    			t23 = space();
    			div4 = element("div");
    			label6 = element("label");
    			label6.textContent = "Photo:";
    			t25 = space();
    			input6 = element("input");
    			br12 = element("br");
    			t26 = space();
    			div8 = element("div");
    			div6 = element("div");
    			label7 = element("label");
    			label7.textContent = "Date of Birth:";
    			t28 = space();
    			input7 = element("input");
    			br13 = element("br");
    			t29 = space();
    			div7 = element("div");
    			label8 = element("label");
    			label8.textContent = "Gender:";
    			t31 = space();
    			input8 = element("input");
    			t32 = space();
    			label9 = element("label");
    			label9.textContent = "Male";
    			t34 = space();
    			input9 = element("input");
    			t35 = space();
    			label10 = element("label");
    			label10.textContent = "Female";
    			br14 = element("br");
    			t37 = space();
    			label11 = element("label");
    			label11.textContent = "Religion:";
    			t39 = space();
    			input10 = element("input");
    			br15 = element("br");
    			t40 = space();
    			label12 = element("label");
    			label12.textContent = "Nationality:";
    			t42 = space();
    			input11 = element("input");
    			br16 = element("br");
    			t43 = space();
    			div10 = element("div");
    			div9 = element("div");
    			label13 = element("label");
    			label13.textContent = "Contact Number:";
    			t45 = space();
    			br17 = element("br");
    			t46 = space();
    			input12 = element("input");
    			t47 = space();
    			label14 = element("label");
    			label14.textContent = "Email Address:";
    			t49 = space();
    			input13 = element("input");
    			br18 = element("br");
    			t50 = space();
    			label15 = element("label");
    			label15.textContent = "CNIC Number:";
    			t52 = space();
    			input14 = element("input");
    			br19 = element("br");
    			t53 = space();
    			label16 = element("label");
    			label16.textContent = "Permanent Address:";
    			t55 = space();
    			textarea0 = element("textarea");
    			br20 = element("br");
    			t56 = space();
    			label17 = element("label");
    			label17.textContent = "Mailing Address:";
    			t58 = space();
    			textarea1 = element("textarea");
    			br21 = element("br");
    			t59 = space();
    			h2 = element("h2");
    			h2.textContent = "Person to Notify in Case of Emergency";
    			t61 = space();
    			label18 = element("label");
    			label18.textContent = "Name:";
    			t63 = space();
    			input15 = element("input");
    			br22 = element("br");
    			t64 = space();
    			label19 = element("label");
    			label19.textContent = "Occupation:";
    			t66 = space();
    			input16 = element("input");
    			br23 = element("br");
    			t67 = space();
    			label20 = element("label");
    			label20.textContent = "Relationship:";
    			t69 = space();
    			input17 = element("input");
    			br24 = element("br");
    			t70 = space();
    			label21 = element("label");
    			label21.textContent = "Contact:";
    			t72 = space();
    			input18 = element("input");
    			br25 = element("br");
    			t73 = space();
    			label22 = element("label");
    			label22.textContent = "Address:";
    			t75 = space();
    			input19 = element("input");
    			br26 = element("br");
    			attr_dev(label0, "for", "fname");
    			add_location(label0, file$7, 57, 24, 2963);
    			add_location(br0, file$7, 57, 63, 3002);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "fname");
    			attr_dev(input0, "name", "fname");
    			input0.required = true;
    			add_location(input0, file$7, 58, 24, 3032);
    			add_location(br1, file$7, 58, 76, 3084);
    			attr_dev(label1, "for", "lname");
    			add_location(label1, file$7, 60, 24, 3140);
    			add_location(br2, file$7, 60, 62, 3178);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "lname");
    			attr_dev(input1, "name", "lname");
    			input1.required = true;
    			add_location(input1, file$7, 61, 24, 3208);
    			add_location(br3, file$7, 61, 76, 3260);
    			attr_dev(div0, "class", "d-flex");
    			add_location(div0, file$7, 56, 20, 2917);
    			attr_dev(label2, "for", "father-name");
    			add_location(label2, file$7, 65, 24, 3362);
    			add_location(br4, file$7, 65, 70, 3408);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "father-name");
    			attr_dev(input2, "name", "father-name");
    			input2.required = true;
    			add_location(input2, file$7, 66, 24, 3438);
    			add_location(br5, file$7, 66, 88, 3502);
    			attr_dev(label3, "for", "father-occupation");
    			add_location(label3, file$7, 68, 24, 3534);
    			add_location(br6, file$7, 68, 82, 3592);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "id", "father-occupation");
    			attr_dev(input3, "name", "father-occupation");
    			input3.required = true;
    			add_location(input3, file$7, 69, 24, 3622);
    			add_location(br7, file$7, 69, 100, 3698);
    			attr_dev(div1, "class", "d-flex");
    			add_location(div1, file$7, 64, 20, 3316);
    			attr_dev(label4, "for", "guardian-name");
    			add_location(label4, file$7, 73, 24, 3820);
    			add_location(br8, file$7, 73, 74, 3870);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "id", "guardian-name");
    			attr_dev(input4, "name", "guardian-name");
    			input4.required = true;
    			add_location(input4, file$7, 74, 24, 3900);
    			add_location(br9, file$7, 74, 92, 3968);
    			attr_dev(label5, "for", "guardian-occupation");
    			add_location(label5, file$7, 76, 24, 4000);
    			add_location(br10, file$7, 76, 86, 4062);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "id", "guardian-occupation");
    			attr_dev(input5, "name", "guardian-occupation");
    			input5.required = true;
    			add_location(input5, file$7, 77, 24, 4092);
    			add_location(br11, file$7, 77, 104, 4172);
    			attr_dev(div2, "class", "d-flex");
    			add_location(div2, file$7, 72, 20, 3774);
    			attr_dev(div3, "class", "leftApPt1");
    			add_location(div3, file$7, 55, 16, 2872);
    			attr_dev(label6, "for", "photo");
    			add_location(label6, file$7, 81, 20, 4292);
    			attr_dev(input6, "type", "file");
    			attr_dev(input6, "id", "photo");
    			attr_dev(input6, "name", "photo");
    			add_location(input6, file$7, 82, 20, 4347);
    			add_location(br12, file$7, 82, 63, 4390);
    			attr_dev(div4, "class", "rightApPt1");
    			add_location(div4, file$7, 80, 16, 4246);
    			attr_dev(div5, "class", "apPt1 d-flex");
    			add_location(div5, file$7, 54, 12, 2828);
    			attr_dev(label7, "for", "dob");
    			add_location(label7, file$7, 88, 20, 4542);
    			attr_dev(input7, "type", "date");
    			attr_dev(input7, "id", "dob");
    			attr_dev(input7, "name", "dob");
    			input7.required = true;
    			add_location(input7, file$7, 89, 20, 4603);
    			add_location(br13, file$7, 89, 68, 4651);
    			attr_dev(div6, "class", "leftApPt2");
    			add_location(div6, file$7, 87, 16, 4497);
    			attr_dev(label8, "for", "gender");
    			add_location(label8, file$7, 92, 20, 4750);
    			attr_dev(input8, "type", "radio");
    			attr_dev(input8, "id", "male");
    			attr_dev(input8, "name", "gender");
    			input8.value = "male";
    			input8.required = true;
    			add_location(input8, file$7, 93, 20, 4807);
    			attr_dev(label9, "for", "male");
    			add_location(label9, file$7, 94, 20, 4895);
    			attr_dev(input9, "type", "radio");
    			attr_dev(input9, "id", "female");
    			attr_dev(input9, "name", "gender");
    			input9.value = "female";
    			input9.required = true;
    			add_location(input9, file$7, 95, 20, 4947);
    			attr_dev(label10, "for", "female");
    			add_location(label10, file$7, 96, 20, 5039);
    			add_location(br14, file$7, 96, 54, 5073);
    			attr_dev(label11, "for", "religion");
    			add_location(label11, file$7, 98, 20, 5101);
    			attr_dev(input10, "type", "text");
    			attr_dev(input10, "id", "religion");
    			attr_dev(input10, "name", "religion");
    			input10.required = true;
    			add_location(input10, file$7, 99, 20, 5162);
    			add_location(br15, file$7, 99, 78, 5220);
    			attr_dev(label12, "for", "nationality");
    			add_location(label12, file$7, 101, 20, 5248);
    			attr_dev(input11, "type", "text");
    			attr_dev(input11, "id", "nationality");
    			attr_dev(input11, "name", "nationality");
    			input11.required = true;
    			add_location(input11, file$7, 102, 20, 5315);
    			add_location(br16, file$7, 102, 84, 5379);
    			attr_dev(div7, "class", "rightApPt2 d-flex");
    			add_location(div7, file$7, 91, 16, 4697);
    			attr_dev(div8, "class", "aPt2 d-flex");
    			add_location(div8, file$7, 86, 12, 4454);
    			attr_dev(label13, "for", "contact-number");
    			add_location(label13, file$7, 108, 20, 5513);
    			add_location(br17, file$7, 108, 72, 5565);
    			attr_dev(input12, "type", "tel");
    			attr_dev(input12, "id", "contact-number");
    			attr_dev(input12, "name", "contact-number");
    			input12.required = true;
    			add_location(input12, file$7, 109, 20, 5591);
    			add_location(div9, file$7, 107, 16, 5486);
    			attr_dev(label14, "for", "email-address");
    			add_location(label14, file$7, 112, 16, 5708);
    			attr_dev(input13, "type", "email");
    			attr_dev(input13, "id", "email-address");
    			attr_dev(input13, "name", "email-address");
    			input13.required = true;
    			add_location(input13, file$7, 113, 16, 5775);
    			add_location(br18, file$7, 113, 85, 5844);
    			attr_dev(div10, "class", "aPt3 d-flex");
    			add_location(div10, file$7, 106, 12, 5443);
    			attr_dev(label15, "for", "cnic-number");
    			add_location(label15, file$7, 116, 12, 5884);
    			attr_dev(input14, "type", "text");
    			attr_dev(input14, "id", "cnic-number");
    			attr_dev(input14, "name", "cnic-number");
    			input14.required = true;
    			add_location(input14, file$7, 117, 12, 5943);
    			add_location(br19, file$7, 117, 76, 6007);
    			attr_dev(label16, "for", "permanent-address");
    			add_location(label16, file$7, 119, 12, 6027);
    			attr_dev(textarea0, "id", "permanent-address");
    			attr_dev(textarea0, "name", "permanent-address");
    			attr_dev(textarea0, "rows", "4");
    			attr_dev(textarea0, "cols", "50");
    			textarea0.required = true;
    			add_location(textarea0, file$7, 120, 12, 6098);
    			add_location(br20, file$7, 120, 109, 6195);
    			attr_dev(label17, "for", "mailing-address");
    			add_location(label17, file$7, 122, 12, 6215);
    			attr_dev(textarea1, "id", "mailing-address");
    			attr_dev(textarea1, "name", "mailing-address");
    			attr_dev(textarea1, "rows", "4");
    			attr_dev(textarea1, "cols", "50");
    			textarea1.required = true;
    			add_location(textarea1, file$7, 123, 12, 6282);
    			add_location(br21, file$7, 123, 105, 6375);
    			add_location(h2, file$7, 125, 12, 6395);
    			attr_dev(label18, "for", "emergency-name");
    			add_location(label18, file$7, 126, 12, 6455);
    			attr_dev(input15, "type", "text");
    			attr_dev(input15, "id", "emergency-name");
    			attr_dev(input15, "name", "emergency-name");
    			input15.required = true;
    			add_location(input15, file$7, 127, 12, 6510);
    			add_location(br22, file$7, 127, 82, 6580);
    			attr_dev(label19, "for", "emergency-occupation");
    			add_location(label19, file$7, 129, 12, 6600);
    			attr_dev(input16, "type", "text");
    			attr_dev(input16, "id", "emergency-occupation");
    			attr_dev(input16, "name", "emergency-occupation");
    			input16.required = true;
    			add_location(input16, file$7, 130, 12, 6667);
    			add_location(br23, file$7, 130, 94, 6749);
    			attr_dev(label20, "for", "emergency-relationship");
    			add_location(label20, file$7, 132, 12, 6769);
    			attr_dev(input17, "type", "text");
    			attr_dev(input17, "id", "emergency-relationship");
    			attr_dev(input17, "name", "emergency-relationship");
    			input17.required = true;
    			add_location(input17, file$7, 133, 12, 6840);
    			add_location(br24, file$7, 133, 98, 6926);
    			attr_dev(label21, "for", "emergency-contact");
    			add_location(label21, file$7, 135, 12, 6946);
    			attr_dev(input18, "type", "text");
    			attr_dev(input18, "id", "emergency-contact");
    			attr_dev(input18, "name", "emergency-contact");
    			input18.required = true;
    			add_location(input18, file$7, 136, 12, 7007);
    			add_location(br25, file$7, 136, 88, 7083);
    			attr_dev(label22, "for", "emergency-address");
    			add_location(label22, file$7, 138, 12, 7103);
    			attr_dev(input19, "type", "text");
    			attr_dev(input19, "id", "emergency-address");
    			attr_dev(input19, "name", "emergency-address");
    			input19.required = true;
    			add_location(input19, file$7, 139, 12, 7164);
    			add_location(br26, file$7, 139, 88, 7240);
    			attr_dev(form, "class", "addmissionFormSection svelte-13qndgo");
    			attr_dev(form, "action", "");
    			add_location(form, file$7, 52, 8, 2716);
    			attr_dev(div11, "class", "pg1");
    			add_location(div11, file$7, 51, 4, 2689);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, form);
    			append_dev(form, div5);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, t2);
    			append_dev(div0, input0);
    			append_dev(div0, br1);
    			append_dev(div0, t3);
    			append_dev(div0, label1);
    			append_dev(div0, t5);
    			append_dev(div0, br2);
    			append_dev(div0, t6);
    			append_dev(div0, input1);
    			append_dev(div0, br3);
    			append_dev(div3, t7);
    			append_dev(div3, div1);
    			append_dev(div1, label2);
    			append_dev(div1, t9);
    			append_dev(div1, br4);
    			append_dev(div1, t10);
    			append_dev(div1, input2);
    			append_dev(div1, br5);
    			append_dev(div1, t11);
    			append_dev(div1, label3);
    			append_dev(div1, t13);
    			append_dev(div1, br6);
    			append_dev(div1, t14);
    			append_dev(div1, input3);
    			append_dev(div1, br7);
    			append_dev(div3, t15);
    			append_dev(div3, div2);
    			append_dev(div2, label4);
    			append_dev(div2, t17);
    			append_dev(div2, br8);
    			append_dev(div2, t18);
    			append_dev(div2, input4);
    			append_dev(div2, br9);
    			append_dev(div2, t19);
    			append_dev(div2, label5);
    			append_dev(div2, t21);
    			append_dev(div2, br10);
    			append_dev(div2, t22);
    			append_dev(div2, input5);
    			append_dev(div2, br11);
    			append_dev(div5, t23);
    			append_dev(div5, div4);
    			append_dev(div4, label6);
    			append_dev(div4, t25);
    			append_dev(div4, input6);
    			append_dev(div4, br12);
    			append_dev(form, t26);
    			append_dev(form, div8);
    			append_dev(div8, div6);
    			append_dev(div6, label7);
    			append_dev(div6, t28);
    			append_dev(div6, input7);
    			append_dev(div6, br13);
    			append_dev(div8, t29);
    			append_dev(div8, div7);
    			append_dev(div7, label8);
    			append_dev(div7, t31);
    			append_dev(div7, input8);
    			append_dev(div7, t32);
    			append_dev(div7, label9);
    			append_dev(div7, t34);
    			append_dev(div7, input9);
    			append_dev(div7, t35);
    			append_dev(div7, label10);
    			append_dev(div7, br14);
    			append_dev(div7, t37);
    			append_dev(div7, label11);
    			append_dev(div7, t39);
    			append_dev(div7, input10);
    			append_dev(div7, br15);
    			append_dev(div7, t40);
    			append_dev(div7, label12);
    			append_dev(div7, t42);
    			append_dev(div7, input11);
    			append_dev(div7, br16);
    			append_dev(form, t43);
    			append_dev(form, div10);
    			append_dev(div10, div9);
    			append_dev(div9, label13);
    			append_dev(div9, t45);
    			append_dev(div9, br17);
    			append_dev(div9, t46);
    			append_dev(div9, input12);
    			append_dev(div10, t47);
    			append_dev(div10, label14);
    			append_dev(div10, t49);
    			append_dev(div10, input13);
    			append_dev(div10, br18);
    			append_dev(form, t50);
    			append_dev(form, label15);
    			append_dev(form, t52);
    			append_dev(form, input14);
    			append_dev(form, br19);
    			append_dev(form, t53);
    			append_dev(form, label16);
    			append_dev(form, t55);
    			append_dev(form, textarea0);
    			append_dev(form, br20);
    			append_dev(form, t56);
    			append_dev(form, label17);
    			append_dev(form, t58);
    			append_dev(form, textarea1);
    			append_dev(form, br21);
    			append_dev(form, t59);
    			append_dev(form, h2);
    			append_dev(form, t61);
    			append_dev(form, label18);
    			append_dev(form, t63);
    			append_dev(form, input15);
    			append_dev(form, br22);
    			append_dev(form, t64);
    			append_dev(form, label19);
    			append_dev(form, t66);
    			append_dev(form, input16);
    			append_dev(form, br23);
    			append_dev(form, t67);
    			append_dev(form, label20);
    			append_dev(form, t69);
    			append_dev(form, input17);
    			append_dev(form, br24);
    			append_dev(form, t70);
    			append_dev(form, label21);
    			append_dev(form, t72);
    			append_dev(form, input18);
    			append_dev(form, br25);
    			append_dev(form, t73);
    			append_dev(form, label22);
    			append_dev(form, t75);
    			append_dev(form, input19);
    			append_dev(form, br26);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(47:0) <ApplyForm bind:showModal class=\\\"applyForm\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:4) 
    function create_header_slot(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Admission Application Form";
    			attr_dev(h2, "slot", "header");
    			attr_dev(h2, "class", "applicationHeader svelte-13qndgo");
    			add_location(h2, file$7, 47, 4, 2590);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(48:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let t0;
    	let div5;
    	let welcomeimg;
    	let t1;
    	let div4;
    	let div3;
    	let span0;
    	let strong0;
    	let t3;
    	let br0;
    	let t4;
    	let br1;
    	let t5;
    	let p0;
    	let strong1;
    	let t7;
    	let hr0;
    	let t8;
    	let br2;
    	let t9;
    	let div2;
    	let a1;
    	let div0;
    	let span1;
    	let t11;
    	let br3;
    	let t12;
    	let br4;
    	let t13;
    	let a0;
    	let t14;
    	let i0;
    	let t15;
    	let a3;
    	let div1;
    	let span2;
    	let t17;
    	let br5;
    	let t18;
    	let br6;
    	let t19;
    	let a2;
    	let t20;
    	let i1;
    	let t21;
    	let br7;
    	let t22;
    	let p1;
    	let strong2;
    	let t24;
    	let hr1;
    	let t25;
    	let br8;
    	let t26;
    	let p2;
    	let t28;
    	let button;
    	let t30;
    	let br9;
    	let t31;
    	let br10;
    	let t32;
    	let applyform;
    	let updating_showModal;
    	let current;
    	let mounted;
    	let dispose;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Apply Now",
    				image: "https://th.bing.com/th/id/R.caf956233ae284a2c77e379c81ebbe1a?rik=X7outa9vIzQ7qA&pid=ImgRaw&r=0"
    			},
    			$$inline: true
    		});

    	function applyform_showModal_binding(value) {
    		/*applyform_showModal_binding*/ ctx[8](value);
    	}

    	let applyform_props = {
    		class: "applyForm",
    		$$slots: {
    			header: [create_header_slot],
    			default: [create_default_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*showModal*/ ctx[0] !== void 0) {
    		applyform_props.showModal = /*showModal*/ ctx[0];
    	}

    	applyform = new ApplyForm({ props: applyform_props, $$inline: true });
    	binding_callbacks.push(() => bind(applyform, 'showModal', applyform_showModal_binding));

    	const block = {
    		c: function create() {
    			t0 = space();
    			div5 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div4 = element("div");
    			div3 = element("div");
    			span0 = element("span");
    			strong0 = element("strong");
    			strong0.textContent = "Start Here To Be A Part of ICONHS";
    			t3 = space();
    			br0 = element("br");
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			p0 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Programs";
    			t7 = space();
    			hr0 = element("hr");
    			t8 = space();
    			br2 = element("br");
    			t9 = space();
    			div2 = element("div");
    			a1 = element("a");
    			div0 = element("div");
    			span1 = element("span");
    			span1.textContent = "B.Sc. Nursing";
    			t11 = space();
    			br3 = element("br");
    			t12 = space();
    			br4 = element("br");
    			t13 = space();
    			a0 = element("a");
    			t14 = text("Learn More ");
    			i0 = element("i");
    			t15 = space();
    			a3 = element("a");
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "Post RN B.Sc. Nursing";
    			t17 = space();
    			br5 = element("br");
    			t18 = space();
    			br6 = element("br");
    			t19 = space();
    			a2 = element("a");
    			t20 = text("Learn More ");
    			i1 = element("i");
    			t21 = space();
    			br7 = element("br");
    			t22 = space();
    			p1 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "Application";
    			t24 = space();
    			hr1 = element("hr");
    			t25 = space();
    			br8 = element("br");
    			t26 = space();
    			p2 = element("p");
    			p2.textContent = "Fill out the application and then submit it, we will contact you after reviewing it.";
    			t28 = space();
    			button = element("button");
    			button.textContent = "FILL APPLICATION FORM ONLINE!";
    			t30 = space();
    			br9 = element("br");
    			t31 = space();
    			br10 = element("br");
    			t32 = space();
    			create_component(applyform.$$.fragment);
    			document.title = "ICONHS - Apply Now";
    			add_location(strong0, file$7, 17, 37, 625);
    			attr_dev(span0, "class", "display-6 ");
    			add_location(span0, file$7, 17, 12, 600);
    			add_location(br0, file$7, 17, 95, 683);
    			add_location(br1, file$7, 17, 100, 688);
    			add_location(strong1, file$7, 18, 59, 753);
    			attr_dev(p0, "class", "lead colourPrimary text-center px-4");
    			add_location(p0, file$7, 18, 12, 706);
    			attr_dev(hr0, "width", "250px");
    			set_style(hr0, "margin", "0 auto");
    			add_location(hr0, file$7, 19, 12, 797);
    			add_location(br2, file$7, 19, 55, 840);
    			attr_dev(span1, "class", "colourPrimary lead");
    			set_style(span1, "font-size", "xx-large");
    			add_location(span1, file$7, 24, 24, 1198);
    			add_location(br3, file$7, 24, 105, 1279);
    			add_location(br4, file$7, 24, 110, 1284);
    			attr_dev(i0, "class", "fa fa-external-link");
    			attr_dev(i0, "aria-hidden", "true");
    			add_location(i0, file$7, 25, 68, 1358);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "btnLearnMore svelte-13qndgo");
    			add_location(a0, file$7, 25, 24, 1314);
    			attr_dev(div0, "class", "inProg svelte-13qndgo");
    			add_location(div0, file$7, 23, 20, 1152);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "progs deAnc svelte-13qndgo");
    			set_style(a1, "background-image", "url('https://th.bing.com/th/id/R.e6fe35bc4de47978af8b989c02489e46?rik=lTfvBxvdbZJOPw&pid=ImgRaw&r=0')");
    			add_location(a1, file$7, 22, 16, 900);
    			attr_dev(span2, "class", "colourPrimary lead");
    			set_style(span2, "font-size", "xx-large");
    			add_location(span2, file$7, 30, 24, 1782);
    			add_location(br5, file$7, 30, 113, 1871);
    			add_location(br6, file$7, 30, 118, 1876);
    			attr_dev(i1, "class", "fa fa-external-link");
    			attr_dev(i1, "aria-hidden", "true");
    			add_location(i1, file$7, 31, 69, 1951);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "btnLearnMore svelte-13qndgo");
    			add_location(a2, file$7, 31, 24, 1906);
    			attr_dev(div1, "class", "inProg svelte-13qndgo");
    			add_location(div1, file$7, 29, 20, 1736);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "progs deAnc svelte-13qndgo");
    			set_style(a3, "background-image", "url('https://th.bing.com/th/id/R.a924cc167c78ac7e62d5327eb2a624e4?rik=wFSOvBDqXhBQ2A&pid=ImgRaw&r=0')");
    			add_location(a3, file$7, 28, 16, 1484);
    			attr_dev(div2, "class", "progCont svelte-13qndgo");
    			add_location(div2, file$7, 21, 12, 860);
    			add_location(br7, file$7, 36, 12, 2095);
    			add_location(strong2, file$7, 37, 59, 2160);
    			attr_dev(p1, "class", "lead colourPrimary text-center px-4");
    			add_location(p1, file$7, 37, 12, 2113);
    			attr_dev(hr1, "width", "250px");
    			set_style(hr1, "margin", "0 auto");
    			add_location(hr1, file$7, 38, 12, 2207);
    			add_location(br8, file$7, 38, 55, 2250);
    			attr_dev(p2, "class", "lead");
    			add_location(p2, file$7, 39, 12, 2268);
    			attr_dev(button, "class", "openFormBtn svelte-13qndgo");
    			add_location(button, file$7, 41, 12, 2388);
    			add_location(br9, file$7, 41, 115, 2491);
    			add_location(br10, file$7, 41, 120, 2496);
    			attr_dev(div3, "class", "programs");
    			add_location(div3, file$7, 16, 8, 564);
    			attr_dev(div4, "class", "that_Main");
    			add_location(div4, file$7, 15, 4, 531);
    			attr_dev(div5, "class", "thisApply svelte-13qndgo");
    			add_location(div5, file$7, 12, 0, 359);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			mount_component(welcomeimg, div5, null);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, span0);
    			append_dev(span0, strong0);
    			append_dev(div3, t3);
    			append_dev(div3, br0);
    			append_dev(div3, t4);
    			append_dev(div3, br1);
    			append_dev(div3, t5);
    			append_dev(div3, p0);
    			append_dev(p0, strong1);
    			append_dev(div3, t7);
    			append_dev(div3, hr0);
    			append_dev(div3, t8);
    			append_dev(div3, br2);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, a1);
    			append_dev(a1, div0);
    			append_dev(div0, span1);
    			append_dev(div0, t11);
    			append_dev(div0, br3);
    			append_dev(div0, t12);
    			append_dev(div0, br4);
    			append_dev(div0, t13);
    			append_dev(div0, a0);
    			append_dev(a0, t14);
    			append_dev(a0, i0);
    			append_dev(div2, t15);
    			append_dev(div2, a3);
    			append_dev(a3, div1);
    			append_dev(div1, span2);
    			append_dev(div1, t17);
    			append_dev(div1, br5);
    			append_dev(div1, t18);
    			append_dev(div1, br6);
    			append_dev(div1, t19);
    			append_dev(div1, a2);
    			append_dev(a2, t20);
    			append_dev(a2, i1);
    			append_dev(div3, t21);
    			append_dev(div3, br7);
    			append_dev(div3, t22);
    			append_dev(div3, p1);
    			append_dev(p1, strong2);
    			append_dev(div3, t24);
    			append_dev(div3, hr1);
    			append_dev(div3, t25);
    			append_dev(div3, br8);
    			append_dev(div3, t26);
    			append_dev(div3, p2);
    			append_dev(div3, t28);
    			append_dev(div3, button);
    			append_dev(div3, t30);
    			append_dev(div3, br9);
    			append_dev(div3, t31);
    			append_dev(div3, br10);
    			insert_dev(target, t32, anchor);
    			mount_component(applyform, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a1, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(a1, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(a3, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(a3, "click", /*click_handler_3*/ ctx[6], false, false, false),
    					listen_dev(button, "click", /*click_handler_4*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const applyform_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				applyform_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_showModal && dirty & /*showModal*/ 1) {
    				updating_showModal = true;
    				applyform_changes.showModal = /*showModal*/ ctx[0];
    				add_flush_callback(() => updating_showModal = false);
    			}

    			applyform.$set(applyform_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			transition_in(applyform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			transition_out(applyform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			destroy_component(welcomeimg);
    			if (detaching) detach_dev(t32);
    			destroy_component(applyform, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $aBtn;
    	let $currentPage;
    	validate_store(aBtn, 'aBtn');
    	component_subscribe($$self, aBtn, $$value => $$invalidate(1, $aBtn = $$value));
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(2, $currentPage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ApplyNow', slots, []);
    	syncPageBtn(aBtn, currentPage);
    	let showModal = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ApplyNow> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => set_store_value(aBtn, $aBtn = "5", $aBtn);
    	const click_handler_1 = () => set_store_value(currentPage, $currentPage = "Academics", $currentPage);
    	const click_handler_2 = () => set_store_value(aBtn, $aBtn = "5", $aBtn);
    	const click_handler_3 = () => set_store_value(currentPage, $currentPage = "Academics", $currentPage);
    	const click_handler_4 = () => $$invalidate(0, showModal = true);

    	function applyform_showModal_binding(value) {
    		showModal = value;
    		$$invalidate(0, showModal);
    	}

    	$$self.$capture_state = () => ({
    		WelcomeImg,
    		ApplyForm,
    		aBtn,
    		currentPage,
    		syncPageBtn,
    		showModal,
    		$aBtn,
    		$currentPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showModal,
    		$aBtn,
    		$currentPage,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		applyform_showModal_binding
    	];
    }

    class ApplyNow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ApplyNow",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\lib\components\pages2\campus.svelte generated by Svelte v3.55.1 */
    const file$6 = "src\\lib\\components\\pages2\\campus.svelte";

    function create_fragment$8(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Campus",
    				image: "https://th.bing.com/th/id/OIP.PnHeDt1uxgRIX6wRs8rr3AHaEx?pid=ImgDet&rs=1"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "hi";
    			document.title = "ICONHS - Campus";
    			attr_dev(div0, "class", "that_Main");
    			add_location(div0, file$6, 10, 4, 298);
    			attr_dev(div1, "class", "thisCampus svelte-1ne6rbg");
    			add_location(div1, file$6, 7, 0, 150);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Campus', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Campus> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class Campus extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Campus",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\lib\components\pages2\faculty.svelte generated by Svelte v3.55.1 */
    const file$5 = "src\\lib\\components\\pages2\\faculty.svelte";

    function create_fragment$7(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Faculty",
    				image: "https://th.bing.com/th/id/OIP.WcXS2XXAPna_GLRfas-1uwHaD5?pid=ImgDet&w=862&h=453&rs=1"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "hi";
    			document.title = "ICONHS - Faculty";
    			attr_dev(div0, "class", "that_Main");
    			add_location(div0, file$5, 10, 4, 313);
    			attr_dev(div1, "class", "thisFaculty svelte-19wokjf");
    			add_location(div1, file$5, 7, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Faculty', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Faculty> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class Faculty extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Faculty",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\lib\components\pages2\library.svelte generated by Svelte v3.55.1 */
    const file$4 = "src\\lib\\components\\pages2\\library.svelte";

    function create_fragment$6(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Library",
    				image: "https://th.bing.com/th/id/R.5ebfa882747526098a8ac3e383a1ce4d?rik=G%2fWdadIXsD%2fZAQ&pid=ImgRaw&r=0"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "hi";
    			document.title = "ICONHS - Library";
    			attr_dev(div0, "class", "that_Main");
    			add_location(div0, file$4, 10, 4, 327);
    			attr_dev(div1, "class", "thisLibrary svelte-ne753q");
    			add_location(div1, file$4, 7, 0, 151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Library', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Library> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class Library extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Library",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\lib\components\pages2\map.svelte generated by Svelte v3.55.1 */
    const file$3 = "src\\lib\\components\\pages2\\map.svelte";

    function create_fragment$5(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Map",
    				image: "https://th.bing.com/th/id/R.7a30e90e21d08b353c9278f084ce8386?rik=qsole7NHLob6qQ&pid=ImgRaw&r=0"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "hi";
    			document.title = "ICONHS - Map";
    			attr_dev(div0, "class", "that_Main");
    			add_location(div0, file$3, 10, 4, 311);
    			attr_dev(div1, "class", "thisMap svelte-16de7kl");
    			add_location(div1, file$3, 7, 0, 147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Map', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\lib\components\pages2\privacyP.svelte generated by Svelte v3.55.1 */
    const file$2 = "src\\lib\\components\\pages2\\privacyP.svelte";

    function create_fragment$4(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Privacy Policy",
    				image: "https://th.bing.com/th/id/R.b54dc637385b16aa4ab1ec0a0821cba8?rik=HXgOJYgAoHnQfg&pid=ImgRaw&r=0"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "hi";
    			document.title = "ICONHS - Privacy Policy";
    			attr_dev(div0, "class", "that_Main");
    			add_location(div0, file$2, 10, 4, 338);
    			attr_dev(div1, "class", "thisPrivacyP svelte-1ywf05p");
    			add_location(div1, file$2, 7, 0, 158);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrivacyP', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrivacyP> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class PrivacyP extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrivacyP",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\lib\components\pages2\studentP.svelte generated by Svelte v3.55.1 */
    const file$1 = "src\\lib\\components\\pages2\\studentP.svelte";

    function create_fragment$3(ctx) {
    	let t0;
    	let div1;
    	let welcomeimg;
    	let t1;
    	let div0;
    	let current;

    	welcomeimg = new WelcomeImg({
    			props: {
    				title: "Student Policy",
    				image: "https://th.bing.com/th/id/OIP._PpgVpHPjHST-ivzGojXcgHaE9?pid=ImgDet&rs=1"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			div1 = element("div");
    			create_component(welcomeimg.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "hi";
    			document.title = "ICONHS - Student Policy";
    			attr_dev(div0, "class", "that_Main");
    			add_location(div0, file$1, 10, 4, 316);
    			attr_dev(div1, "class", "thisStudentP svelte-yekid8");
    			add_location(div1, file$1, 7, 0, 158);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(welcomeimg, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcomeimg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcomeimg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(welcomeimg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StudentP', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StudentP> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ WelcomeImg });
    	return [];
    }

    class StudentP extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StudentP",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\lib\components\portalpages\loginPg.svelte generated by Svelte v3.55.1 */

    function create_fragment$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Login Page");
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoginPg', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoginPg> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LoginPg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoginPg",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\lib\components\portalpages\loggedIn.svelte generated by Svelte v3.55.1 */

    function create_fragment$1(ctx) {
    	const block = {
    		c: noop$1,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoggedIn', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoggedIn> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LoggedIn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoggedIn",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.55.1 */
    const file = "src\\App.svelte";

    // (78:40) 
    function create_if_block_16(ctx) {
    	let loggedin;
    	let current;
    	loggedin = new LoggedIn({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loggedin.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loggedin, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loggedin.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loggedin.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loggedin, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(78:40) ",
    		ctx
    	});

    	return block;
    }

    // (76:37) 
    function create_if_block_15(ctx) {
    	let loginpg;
    	let current;
    	loginpg = new LoginPg({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loginpg.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loginpg, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loginpg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loginpg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loginpg, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(76:37) ",
    		ctx
    	});

    	return block;
    }

    // (73:40) 
    function create_if_block_14(ctx) {
    	let privacyp;
    	let current;
    	privacyp = new PrivacyP({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(privacyp.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(privacyp, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(privacyp.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(privacyp.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(privacyp, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(73:40) ",
    		ctx
    	});

    	return block;
    }

    // (71:40) 
    function create_if_block_13(ctx) {
    	let studentp;
    	let current;
    	studentp = new StudentP({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(studentp.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(studentp, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(studentp.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(studentp.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(studentp, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(71:40) ",
    		ctx
    	});

    	return block;
    }

    // (69:35) 
    function create_if_block_12(ctx) {
    	let map;
    	let current;
    	map = new Map$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(map.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(map, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(map.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(map.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(map, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(69:35) ",
    		ctx
    	});

    	return block;
    }

    // (67:39) 
    function create_if_block_11(ctx) {
    	let library;
    	let current;
    	library = new Library({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(library.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(library, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(library.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(library.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(library, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(67:39) ",
    		ctx
    	});

    	return block;
    }

    // (65:39) 
    function create_if_block_10(ctx) {
    	let faculty;
    	let current;
    	faculty = new Faculty({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(faculty.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(faculty, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(faculty.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(faculty.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(faculty, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(65:39) ",
    		ctx
    	});

    	return block;
    }

    // (63:38) 
    function create_if_block_9(ctx) {
    	let campus;
    	let current;
    	campus = new Campus({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(campus.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(campus, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(campus.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(campus.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(campus, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(63:38) ",
    		ctx
    	});

    	return block;
    }

    // (61:37) 
    function create_if_block_8(ctx) {
    	let applynow;
    	let current;
    	applynow = new ApplyNow({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(applynow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(applynow, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(applynow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(applynow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(applynow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(61:37) ",
    		ctx
    	});

    	return block;
    }

    // (58:39) 
    function create_if_block_7(ctx) {
    	let contactus;
    	let current;
    	contactus = new Contactus({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contactus.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contactus, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactus.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contactus.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contactus, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(58:39) ",
    		ctx
    	});

    	return block;
    }

    // (56:36) 
    function create_if_block_6(ctx) {
    	let newsevents;
    	let current;
    	newsevents = new Newsevents({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(newsevents.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(newsevents, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newsevents.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newsevents.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(newsevents, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(56:36) ",
    		ctx
    	});

    	return block;
    }

    // (54:39) 
    function create_if_block_5(ctx) {
    	let careers;
    	let current;
    	careers = new Careers({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(careers.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(careers, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(careers.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(careers.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(careers, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(54:39) ",
    		ctx
    	});

    	return block;
    }

    // (52:39) 
    function create_if_block_4(ctx) {
    	let studentlife;
    	let current;
    	studentlife = new StudentLife({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(studentlife.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(studentlife, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(studentlife.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(studentlife.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(studentlife, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(52:39) ",
    		ctx
    	});

    	return block;
    }

    // (50:41) 
    function create_if_block_3(ctx) {
    	let academics;
    	let current;
    	academics = new Academics({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(academics.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(academics, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(academics.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(academics.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(academics, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(50:41) ",
    		ctx
    	});

    	return block;
    }

    // (48:42) 
    function create_if_block_2(ctx) {
    	let admissions;
    	let current;
    	admissions = new Admissions({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(admissions.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(admissions, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(admissions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(admissions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(admissions, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(48:42) ",
    		ctx
    	});

    	return block;
    }

    // (46:37) 
    function create_if_block_1(ctx) {
    	let about;
    	let current;
    	about = new Aboutus({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(about.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(about, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(about, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(46:37) ",
    		ctx
    	});

    	return block;
    }

    // (44:2) {#if $currentPage === "Home"}
    function create_if_block(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(44:2) {#if $currentPage === \\\"Home\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let navbar;
    	let t0;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let div2;
    	let footer;
    	let current;

    	navbar = new Navbar({
    			props: { currentPage: /*currentPage*/ ctx[1] },
    			$$inline: true
    		});

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8,
    		create_if_block_9,
    		create_if_block_10,
    		create_if_block_11,
    		create_if_block_12,
    		create_if_block_13,
    		create_if_block_14,
    		create_if_block_15,
    		create_if_block_16
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$currentPage*/ ctx[0] === "Home") return 0;
    		if (/*$currentPage*/ ctx[0] === "About") return 1;
    		if (/*$currentPage*/ ctx[0] === "Admissions") return 2;
    		if (/*$currentPage*/ ctx[0] === "Academics") return 3;
    		if (/*$currentPage*/ ctx[0] === "Student") return 4;
    		if (/*$currentPage*/ ctx[0] === "Careers") return 5;
    		if (/*$currentPage*/ ctx[0] === "News") return 6;
    		if (/*$currentPage*/ ctx[0] === "Contact") return 7;
    		if (/*$currentPage*/ ctx[0] === "Apply") return 8;
    		if (/*$currentPage*/ ctx[0] === "Campus") return 9;
    		if (/*$currentPage*/ ctx[0] === "Faculty") return 10;
    		if (/*$currentPage*/ ctx[0] === "Library") return 11;
    		if (/*$currentPage*/ ctx[0] === "Map") return 12;
    		if (/*$currentPage*/ ctx[0] === "StudentP") return 13;
    		if (/*$currentPage*/ ctx[0] === "PrivacyP") return 14;
    		if (/*$currentPage*/ ctx[0] === "Login") return 15;
    		if (/*$currentPage*/ ctx[0] === "LoggedIn") return 16;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	footer = new Footer({
    			props: { currentPage: /*currentPage*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t1 = space();
    			div2 = element("div");
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "class", "navbar svelte-dsaqgh");
    			add_location(div0, file, 38, 1, 1608);
    			attr_dev(div1, "class", "body");
    			add_location(div1, file, 42, 1, 1670);
    			attr_dev(div2, "class", "footer svelte-dsaqgh");
    			add_location(div2, file, 82, 1, 2682);
    			attr_dev(main, "class", "svelte-dsaqgh");
    			add_location(main, file, 37, 0, 1599);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			mount_component(navbar, div0, null);
    			append_dev(main, t0);
    			append_dev(main, div1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div1, null);
    			}

    			append_dev(main, t1);
    			append_dev(main, div2);
    			mount_component(footer, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $currentPage;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let currentPage = writable(localStorage.getItem('currentPage') || "Home");
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, value => $$invalidate(0, $currentPage = value));

    	currentPage.subscribe(value => {
    		localStorage.setItem('currentPage', value);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		writable,
    		Navbar,
    		Footer,
    		Home,
    		About: Aboutus,
    		Admissions,
    		Academics,
    		StudentLife,
    		Careers,
    		Newsevents,
    		Contactus,
    		ApplyNow,
    		Campus,
    		Faculty,
    		Library,
    		Map: Map$1,
    		PrivacyP,
    		StudentP,
    		LoginPg,
    		LoggedIn,
    		currentPage,
    		$currentPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentPage' in $$props) $$invalidate(1, currentPage = $$props.currentPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$currentPage, currentPage];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
