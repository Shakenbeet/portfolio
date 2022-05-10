
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

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
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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
    function hash(str) {
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
        const name = `__svelte_${hash(rule)}_${uid}`;
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
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
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
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function getAllContexts() {
        return get_current_component().$$.context;
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
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
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
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
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
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
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
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
                        config = config();
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
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
            ctx: null,
            // state
            props,
            update: noop,
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
            this.$destroy = noop;
        }
        $on(type, callback) {
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
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
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to separate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }

    /* src\components\Header.svelte generated by Svelte v3.48.0 */

    const file$6 = "src\\components\\Header.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let a0;
    	let h30;
    	let t1;
    	let a1;
    	let h31;
    	let t3;
    	let a2;
    	let h32;
    	let t5;
    	let a3;
    	let h33;
    	let t7;
    	let a4;
    	let h34;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			h30 = element("h3");
    			h30.textContent = "Home";
    			t1 = space();
    			a1 = element("a");
    			h31 = element("h3");
    			h31.textContent = "About";
    			t3 = space();
    			a2 = element("a");
    			h32 = element("h3");
    			h32.textContent = "Applications";
    			t5 = space();
    			a3 = element("a");
    			h33 = element("h3");
    			h33.textContent = "Games";
    			t7 = space();
    			a4 = element("a");
    			h34 = element("h3");
    			h34.textContent = "Contact";
    			attr_dev(h30, "class", "svelte-chgos3");
    			add_location(h30, file$6, 23, 20, 393);
    			attr_dev(a0, "href", "#home");
    			add_location(a0, file$6, 23, 4, 377);
    			attr_dev(h31, "class", "svelte-chgos3");
    			add_location(h31, file$6, 24, 21, 433);
    			attr_dev(a1, "href", "#about");
    			add_location(a1, file$6, 24, 4, 416);
    			attr_dev(h32, "class", "svelte-chgos3");
    			add_location(h32, file$6, 25, 20, 473);
    			attr_dev(a2, "href", "#work");
    			add_location(a2, file$6, 25, 4, 457);
    			attr_dev(h33, "class", "svelte-chgos3");
    			add_location(h33, file$6, 26, 21, 521);
    			attr_dev(a3, "href", "#games");
    			add_location(a3, file$6, 26, 4, 504);
    			attr_dev(h34, "class", "svelte-chgos3");
    			add_location(h34, file$6, 27, 23, 564);
    			attr_dev(a4, "href", "#contact");
    			add_location(a4, file$6, 27, 4, 545);
    			attr_dev(div, "class", "navbar svelte-chgos3");
    			add_location(div, file$6, 22, 0, 351);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(a0, h30);
    			append_dev(div, t1);
    			append_dev(div, a1);
    			append_dev(a1, h31);
    			append_dev(div, t3);
    			append_dev(div, a2);
    			append_dev(a2, h32);
    			append_dev(div, t5);
    			append_dev(div, a3);
    			append_dev(a3, h33);
    			append_dev(div, t7);
    			append_dev(div, a4);
    			append_dev(a4, h34);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.48.0 */

    const file$5 = "src\\components\\Footer.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let a0;
    	let button0;
    	let t3;
    	let a1;
    	let button1;
    	let t5;
    	let br;
    	let t6;
    	let p;
    	let t7;
    	let b;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Copyright © 2022 Luke Gobin";
    			t1 = space();
    			a0 = element("a");
    			button0 = element("button");
    			button0.textContent = "Visit My Github Profile";
    			t3 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "Send an E-Mail";
    			t5 = space();
    			br = element("br");
    			t6 = space();
    			p = element("p");
    			t7 = text("I am also on Discord: ");
    			b = element("b");
    			b.textContent = "Prodski#2432";
    			attr_dev(h1, "class", "copyrightText");
    			add_location(h1, file$5, 14, 4, 206);
    			add_location(button0, file$5, 17, 8, 353);
    			attr_dev(a0, "href", "https://github.com/Shakenbeet");
    			set_style(a0, "text-decoration", "none");
    			add_location(a0, file$5, 16, 4, 272);
    			add_location(button1, file$5, 20, 8, 490);
    			attr_dev(a1, "href", "mailto:luke.gobin1@icloud.com");
    			set_style(a1, "text-decoration", "none");
    			add_location(a1, file$5, 19, 4, 409);
    			add_location(br, file$5, 23, 4, 539);
    			add_location(b, file$5, 25, 29, 577);
    			add_location(p, file$5, 25, 4, 552);
    			attr_dev(div, "class", "footer svelte-z1peg0");
    			attr_dev(div, "id", "contact");
    			add_location(div, file$5, 13, 0, 167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, a0);
    			append_dev(a0, button0);
    			append_dev(div, t3);
    			append_dev(div, a1);
    			append_dev(a1, button1);
    			append_dev(div, t5);
    			append_dev(div, br);
    			append_dev(div, t6);
    			append_dev(div, p);
    			append_dev(p, t7);
    			append_dev(p, b);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\Project.svelte generated by Svelte v3.48.0 */

    const file$4 = "src\\components\\Project.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let a;
    	let button;
    	let t5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(/*projectName*/ ctx[0]);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			p = element("p");
    			t3 = text(/*projectDesc*/ ctx[2]);
    			t4 = space();
    			a = element("a");
    			button = element("button");
    			t5 = text(/*buttonText*/ ctx[4]);
    			add_location(h2, file$4, 16, 4, 367);
    			if (!src_url_equal(img.src, img_src_value = /*projectImage*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "image of " + /*projectName*/ ctx[0] + "'s logo");
    			attr_dev(img, "class", "svelte-m69z29");
    			add_location(img, file$4, 17, 4, 395);
    			add_location(p, file$4, 18, 4, 464);
    			add_location(button, file$4, 20, 8, 524);
    			attr_dev(a, "href", /*projectLink*/ ctx[3]);
    			add_location(a, file$4, 19, 4, 490);
    			attr_dev(div, "class", "Project");
    			add_location(div, file$4, 15, 0, 340);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, img);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);
    			append_dev(div, t4);
    			append_dev(div, a);
    			append_dev(a, button);
    			append_dev(button, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projectName*/ 1) set_data_dev(t0, /*projectName*/ ctx[0]);

    			if (dirty & /*projectImage*/ 2 && !src_url_equal(img.src, img_src_value = /*projectImage*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*projectName*/ 1 && img_alt_value !== (img_alt_value = "image of " + /*projectName*/ ctx[0] + "'s logo")) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*projectDesc*/ 4) set_data_dev(t3, /*projectDesc*/ ctx[2]);
    			if (dirty & /*buttonText*/ 16) set_data_dev(t5, /*buttonText*/ ctx[4]);

    			if (dirty & /*projectLink*/ 8) {
    				attr_dev(a, "href", /*projectLink*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	validate_slots('Project', slots, []);
    	let { projectName = 'Github Project' } = $$props;
    	let { projectImage = 'VC.png' } = $$props;
    	let { projectDesc = 'Description of this Project' } = $$props;
    	let { projectLink = '' } = $$props;
    	let { buttonText = 'View on Github' } = $$props;
    	const writable_props = ['projectName', 'projectImage', 'projectDesc', 'projectLink', 'buttonText'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('projectName' in $$props) $$invalidate(0, projectName = $$props.projectName);
    		if ('projectImage' in $$props) $$invalidate(1, projectImage = $$props.projectImage);
    		if ('projectDesc' in $$props) $$invalidate(2, projectDesc = $$props.projectDesc);
    		if ('projectLink' in $$props) $$invalidate(3, projectLink = $$props.projectLink);
    		if ('buttonText' in $$props) $$invalidate(4, buttonText = $$props.buttonText);
    	};

    	$$self.$capture_state = () => ({
    		projectName,
    		projectImage,
    		projectDesc,
    		projectLink,
    		buttonText
    	});

    	$$self.$inject_state = $$props => {
    		if ('projectName' in $$props) $$invalidate(0, projectName = $$props.projectName);
    		if ('projectImage' in $$props) $$invalidate(1, projectImage = $$props.projectImage);
    		if ('projectDesc' in $$props) $$invalidate(2, projectDesc = $$props.projectDesc);
    		if ('projectLink' in $$props) $$invalidate(3, projectLink = $$props.projectLink);
    		if ('buttonText' in $$props) $$invalidate(4, buttonText = $$props.buttonText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [projectName, projectImage, projectDesc, projectLink, buttonText];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			projectName: 0,
    			projectImage: 1,
    			projectDesc: 2,
    			projectLink: 3,
    			buttonText: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get projectName() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set projectName(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get projectImage() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set projectImage(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get projectDesc() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set projectDesc(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get projectLink() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set projectLink(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonText() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        SvelteComponentTyped: SvelteComponentTyped,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getAllContexts: getAllContexts,
        getContext: getContext,
        hasContext: hasContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules\svelte-simple-modal\src\Modal.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1, window: window_1 } = globals;
    const file$3 = "node_modules\\svelte-simple-modal\\src\\Modal.svelte";

    // (401:0) {#if Component}
    function create_if_block(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div0_class_value;
    	let div1_class_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let div2_class_value;
    	let div3_class_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[1].closeButton && create_if_block_1(ctx);
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"));
    			attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			add_location(div0, file$3, 444, 8, 11301);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"));
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null);
    			attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			add_location(div1, file$3, 416, 6, 10354);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"));
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			add_location(div2, file$3, 410, 4, 10221);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"));
    			attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			add_location(div3, file$3, 401, 2, 9975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[48](div1);
    			/*div2_binding*/ ctx[49](div2);
    			/*div3_binding*/ ctx[50](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[13])) /*onOpen*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[14])) /*onClose*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[15])) /*onOpened*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[16])) /*onClosed*/ ctx[16].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[1].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 512) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_label_value !== (div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null)) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 256) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 128) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 64) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[48](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[49](null);
    			/*div3_binding*/ ctx[50](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(401:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (432:8) {#if state.closeButton}
    function create_if_block_1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 2) show_if = null;
    		if (show_if == null) show_if = !!/*isFunction*/ ctx[17](/*state*/ ctx[1].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(432:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (435:10) {:else}
    function create_else_block(ctx) {
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"));
    			attr_dev(button, "aria-label", "Close modal");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			add_location(button, file$3, 435, 12, 11050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*cssCloseButton*/ 1024) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(435:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (433:10) {#if isFunction(state.closeButton)}
    function create_if_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[1].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[18] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[1].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(433:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[2] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[47].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[46], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[46],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[46])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[46], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
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

    function bind(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;
    	let { show = null } = $$props;
    	let { key = 'simple-modal' } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { ariaLabelledBy = null } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { classBg = null } = $$props;
    	let { classWindowWrap = null } = $$props;
    	let { classWindow = null } = $$props;
    	let { classContent = null } = $$props;
    	let { classCloseButton = null } = $$props;
    	let { unstyled = false } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;
    	let { disableFocusTrap = false } = $$props;

    	const defaultState = {
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		unstyled
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, '')
    	: '';

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(6, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(7, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(8, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(9, cssContent = toCssString(state.styleContent));
    		$$invalidate(10, cssCloseButton = toCssString(state.styleCloseButton));
    		$$invalidate(11, currentTransitionBg = state.transitionBg);
    		$$invalidate(12, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(2, Component = bind(NewComponent, newProps));
    		$$invalidate(1, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		$$invalidate(13, onOpen = event => {
    			if (callback.onOpen) callback.onOpen(event);

    			/**
     * The open event is fired right before the modal opens
     * @event {void} open
     */
    			dispatch('open');

    			/**
     * The opening event is fired right before the modal opens
     * @event {void} opening
     * @deprecated Listen to the `open` event instead
     */
    			dispatch('opening'); // Deprecated. Do not use!
    		});

    		$$invalidate(14, onClose = event => {
    			if (callback.onClose) callback.onClose(event);

    			/**
     * The close event is fired right before the modal closes
     * @event {void} close
     */
    			dispatch('close');

    			/**
     * The closing event is fired right before the modal closes
     * @event {void} closing
     * @deprecated Listen to the `close` event instead
     */
    			dispatch('closing'); // Deprecated. Do not use!
    		});

    		$$invalidate(15, onOpened = event => {
    			if (callback.onOpened) callback.onOpened(event);

    			/**
     * The opened event is fired after the modal's opening transition
     * @event {void} opened
     */
    			dispatch('opened');
    		});

    		$$invalidate(16, onClosed = event => {
    			if (callback.onClosed) callback.onClosed(event);

    			/**
     * The closed event is fired after the modal's closing transition
     * @event {void} closed
     */
    			dispatch('closed');
    		});
    	};

    	const close = (callback = {}) => {
    		if (!Component) return;
    		$$invalidate(14, onClose = callback.onClose || onClose);
    		$$invalidate(16, onClosed = callback.onClosed || onClosed);
    		$$invalidate(2, Component = null);
    		enableScroll();
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === 'Escape') {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === 'Tab' && !state.disableFocusTrap) {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(node => node.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = 'fixed';
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = 'hidden';
    		document.body.style.width = '100%';
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || '';
    		document.body.style.top = '';
    		document.body.style.overflow = prevBodyOverflow || '';
    		document.body.style.width = prevBodyWidth || '';
    		window.scrollTo(0, scrollY);
    	};

    	setContext$1(key, { open, close });
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(45, isMounted = true);
    	});

    	const writable_props = [
    		'show',
    		'key',
    		'ariaLabel',
    		'ariaLabelledBy',
    		'closeButton',
    		'closeOnEsc',
    		'closeOnOuterClick',
    		'styleBg',
    		'styleWindowWrap',
    		'styleWindow',
    		'styleContent',
    		'styleCloseButton',
    		'classBg',
    		'classWindowWrap',
    		'classWindow',
    		'classContent',
    		'classCloseButton',
    		'unstyled',
    		'setContext',
    		'transitionBg',
    		'transitionBgProps',
    		'transitionWindow',
    		'transitionWindowProps',
    		'disableFocusTrap'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('$$scope' in $$props) $$invalidate(46, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		bind,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		unstyled,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		isMounted
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ('modalWindow' in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ('scrollY' in $$props) scrollY = $$props.scrollY;
    		if ('cssBg' in $$props) $$invalidate(6, cssBg = $$props.cssBg);
    		if ('cssWindowWrap' in $$props) $$invalidate(7, cssWindowWrap = $$props.cssWindowWrap);
    		if ('cssWindow' in $$props) $$invalidate(8, cssWindow = $$props.cssWindow);
    		if ('cssContent' in $$props) $$invalidate(9, cssContent = $$props.cssContent);
    		if ('cssCloseButton' in $$props) $$invalidate(10, cssCloseButton = $$props.cssCloseButton);
    		if ('currentTransitionBg' in $$props) $$invalidate(11, currentTransitionBg = $$props.currentTransitionBg);
    		if ('currentTransitionWindow' in $$props) $$invalidate(12, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ('prevBodyPosition' in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ('prevBodyOverflow' in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ('prevBodyWidth' in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ('outerClickTarget' in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ('onOpen' in $$props) $$invalidate(13, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(14, onClose = $$props.onClose);
    		if ('onOpened' in $$props) $$invalidate(15, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(16, onClosed = $$props.onClosed);
    		if ('isMounted' in $$props) $$invalidate(45, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 4194304 | $$self.$$.dirty[1] & /*isMounted*/ 16384) {
    			{
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		unstyled,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				show: 22,
    				key: 23,
    				ariaLabel: 24,
    				ariaLabelledBy: 25,
    				closeButton: 26,
    				closeOnEsc: 27,
    				closeOnOuterClick: 28,
    				styleBg: 29,
    				styleWindowWrap: 30,
    				styleWindow: 31,
    				styleContent: 32,
    				styleCloseButton: 33,
    				classBg: 34,
    				classWindowWrap: 35,
    				classWindow: 36,
    				classContent: 37,
    				classCloseButton: 38,
    				unstyled: 0,
    				setContext: 39,
    				transitionBg: 40,
    				transitionBgProps: 41,
    				transitionWindow: 42,
    				transitionWindowProps: 43,
    				disableFocusTrap: 44
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unstyled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unstyled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableFocusTrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableFocusTrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\PopUp.svelte generated by Svelte v3.48.0 */

    const file$2 = "src\\components\\PopUp.svelte";

    function create_fragment$3(ctx) {
    	let h2;
    	let t0;
    	let t1;
    	let p;
    	let t2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*message*/ ctx[1]);
    			add_location(h2, file$2, 5, 0, 120);
    			add_location(p, file$2, 6, 0, 138);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*message*/ 2) set_data_dev(t2, /*message*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
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
    	validate_slots('PopUp', slots, []);
    	let { title = 'About Project' } = $$props;
    	let { message = 'Lorem ipsum dolor sit amet' } = $$props;
    	const writable_props = ['title', 'message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PopUp> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ title, message });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, message];
    }

    class PopUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { title: 0, message: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PopUp",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get title() {
    		throw new Error("<PopUp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<PopUp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<PopUp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<PopUp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\PopUpContent.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\components\\PopUpContent.svelte";

    function create_fragment$2(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*buttonText*/ ctx[0]);
    			add_location(button, file$1, 11, 0, 390);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*showPopup*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*buttonText*/ 1) set_data_dev(t, /*buttonText*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PopUpContent', slots, []);
    	let { popupMessage = 'Lorem ipsum dolor sit amet' } = $$props;
    	let { popupTitle = 'Title' } = $$props;
    	let { buttonText = 'Project Flaws' } = $$props;
    	const { open } = getContext('simple-modal');
    	const showPopup = () => open(PopUp, { title: popupTitle, message: popupMessage });
    	const writable_props = ['popupMessage', 'popupTitle', 'buttonText'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PopUpContent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('popupMessage' in $$props) $$invalidate(2, popupMessage = $$props.popupMessage);
    		if ('popupTitle' in $$props) $$invalidate(3, popupTitle = $$props.popupTitle);
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    	};

    	$$self.$capture_state = () => ({
    		popupMessage,
    		popupTitle,
    		buttonText,
    		getContext,
    		PopUp,
    		open,
    		showPopup
    	});

    	$$self.$inject_state = $$props => {
    		if ('popupMessage' in $$props) $$invalidate(2, popupMessage = $$props.popupMessage);
    		if ('popupTitle' in $$props) $$invalidate(3, popupTitle = $$props.popupTitle);
    		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [buttonText, showPopup, popupMessage, popupTitle];
    }

    class PopUpContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			popupMessage: 2,
    			popupTitle: 3,
    			buttonText: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PopUpContent",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get popupMessage() {
    		throw new Error("<PopUpContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set popupMessage(value) {
    		throw new Error("<PopUpContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get popupTitle() {
    		throw new Error("<PopUpContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set popupTitle(value) {
    		throw new Error("<PopUpContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonText() {
    		throw new Error("<PopUpContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<PopUpContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ShortModal.svelte generated by Svelte v3.48.0 */

    // (8:0) <Modal>
    function create_default_slot(ctx) {
    	let popupcontent;
    	let current;

    	popupcontent = new PopUpContent({
    			props: {
    				popupMessage: /*msg*/ ctx[0],
    				popupTitle: "About",
    				buttonText: "Learn More"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(popupcontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(popupcontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const popupcontent_changes = {};
    			if (dirty & /*msg*/ 1) popupcontent_changes.popupMessage = /*msg*/ ctx[0];
    			popupcontent.$set(popupcontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popupcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popupcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(popupcontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(8:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, msg*/ 3) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ShortModal', slots, []);
    	let { msg = 'lorem ipsum dolor sit amet' } = $$props;
    	const writable_props = ['msg'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ShortModal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('msg' in $$props) $$invalidate(0, msg = $$props.msg);
    	};

    	$$self.$capture_state = () => ({ Modal, PopUpContent, msg });

    	$$self.$inject_state = $$props => {
    		if ('msg' in $$props) $$invalidate(0, msg = $$props.msg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [msg];
    }

    class ShortModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { msg: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ShortModal",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get msg() {
    		throw new Error("<ShortModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<ShortModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let div0;
    	let h10;
    	let t2;
    	let p0;
    	let t4;
    	let div1;
    	let h11;
    	let t6;
    	let p1;
    	let t8;
    	let img;
    	let img_src_value;
    	let t9;
    	let h30;
    	let t11;
    	let h40;
    	let t13;
    	let h31;
    	let t15;
    	let h41;
    	let t17;
    	let h42;
    	let t19;
    	let h43;
    	let t21;
    	let h32;
    	let t23;
    	let h44;
    	let t25;
    	let h33;
    	let t27;
    	let h45;
    	let t29;
    	let h12;
    	let t31;
    	let h20;
    	let t33;
    	let project0;
    	let t34;
    	let shortmodal0;
    	let t35;
    	let h21;
    	let t37;
    	let project1;
    	let t38;
    	let shortmodal1;
    	let t39;
    	let project2;
    	let t40;
    	let shortmodal2;
    	let t41;
    	let h13;
    	let t43;
    	let h22;
    	let t45;
    	let project3;
    	let t46;
    	let a0;
    	let button0;
    	let t48;
    	let h23;
    	let t50;
    	let project4;
    	let t51;
    	let shortmodal3;
    	let t52;
    	let project5;
    	let t53;
    	let a1;
    	let button1;
    	let t55;
    	let project6;
    	let t56;
    	let project7;
    	let t57;
    	let a2;
    	let button2;
    	let t59;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	project0 = new Project({
    			props: {
    				projectName: "Visual Code",
    				projectDesc: "Visual Code is an application to help new programmers write C# code with ease.",
    				projectImage: "VC.png",
    				projectLink: "https://github.com/Shakenbeet/VisualCode"
    			},
    			$$inline: true
    		});

    	shortmodal0 = new ShortModal({
    			props: {
    				msg: "When I started to learn how to program I always wanted to try and get friends and family to learn aswell, however programming proved difficult for them. So I created VisualCode, which use dropboxes and simple UI to help the end user create simple C# console apps"
    			},
    			$$inline: true
    		});

    	project1 = new Project({
    			props: {
    				projectName: "Image Resize",
    				projectDesc: "Image Resize was made with the purpose of resizing multiple images quickly.",
    				projectImage: "ImageResize.png",
    				projectLink: "https://github.com/Shakenbeet/ImageResizeTool"
    			},
    			$$inline: true
    		});

    	shortmodal1 = new ShortModal({
    			props: {
    				msg: "In my school's yearbook department, my peers would always ask me to resize their images in Photoshop. Photoshop is very slow and these tasks were very tedious, so I created ImageResize so my peers and I can easily and quickly resize several images"
    			},
    			$$inline: true
    		});

    	project2 = new Project({
    			props: {
    				projectName: "Nova Storefront",
    				projectDesc: "My most successful application to date, Nova was a psuedo game-storefront.",
    				projectImage: "nova.png",
    				buttonText: "Source not Available"
    			},
    			$$inline: true
    		});

    	shortmodal2 = new ShortModal({
    			props: {
    				msg: "My schoolmates wanted to play my games, so I created Nova as a launcher for all my games. The website was made with raw HTML and the client was made in WPF"
    			},
    			$$inline: true
    		});

    	project3 = new Project({
    			props: {
    				projectName: "Snake Hunter",
    				projectDesc: "Simple game where you shoot the snake for points, made with java in LibGDX",
    				projectImage: "snake.png",
    				buttonText: "Play On Web",
    				projectLink: "https://shakenbeet.github.io/SnakeHunter/"
    			},
    			$$inline: true
    		});

    	project4 = new Project({
    			props: {
    				projectName: "Lucy Simulator",
    				projectDesc: "Lucy Simulator is a small cult-classic 'franchise' of pet simulators where you take care of a dog named Lucy",
    				projectImage: "lucy.png",
    				buttonText: "Download Lucy Simulator 2019 (Nova)",
    				projectLink: "http://nova-storefront.glitch.me/games/Lucy.html"
    			},
    			$$inline: true
    		});

    	shortmodal3 = new ShortModal({
    			props: {
    				msg: "Lucy Simulator was a game I made on scratch in 2017 about my Grandma's dog, Lucy. The game was very popular among my friends and many unofficial spin-offs were made. Eventually I created an official sequel in Unity during 2019 for the Nova Launcher."
    			},
    			$$inline: true
    		});

    	project5 = new Project({
    			props: {
    				projectName: "Flappuccino",
    				projectDesc: "Flappuccino is a Unity remake of Polymars' game of the same name",
    				projectImage: "flap.png",
    				buttonText: "Download Flappuccino (Nova)",
    				projectLink: "http://nova-storefront.glitch.me/games/Flap.html"
    			},
    			$$inline: true
    		});

    	project6 = new Project({
    			props: {
    				projectName: "Unreal CubeBlaster",
    				projectDesc: "Explode cubes with your exceptionally weird rifle or ride them, but at all costs don't get knocked off the platform!",
    				projectImage: "blast.png",
    				buttonText: "Download Unreal CubeBlaster (GameJolt)",
    				projectLink: "https://gamejolt.com/games/CubeBlaster/469015"
    			},
    			$$inline: true
    		});

    	project7 = new Project({
    			props: {
    				projectName: "Hobbit VideoGame",
    				projectDesc: "A 'game' made for a school project about The Hobbit",
    				projectImage: "hobbit.png",
    				buttonText: "Download The Hobbit (Nova)",
    				projectLink: "http://nova-storefront.glitch.me/games/Hobbit.html"
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Luke Gobin";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "an endless journey of spaghetti code";
    			t4 = space();
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = "About Me";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "My name is Luke Gobin and I'm from Houston. I'm proficient in C#, C++, and HTML but I am always open to learn new languages.";
    			t8 = space();
    			img = element("img");
    			t9 = space();
    			h30 = element("h3");
    			h30.textContent = "When Did You Start Programming?";
    			t11 = space();
    			h40 = element("h4");
    			h40.textContent = "I have no certain date of when I started programming, I think I started programming around 2016 and 2017";
    			t13 = space();
    			h31 = element("h3");
    			h31.textContent = "How Did You Learn How to Program?";
    			t15 = space();
    			h41 = element("h4");
    			h41.textContent = "I learned how to program using a HTML book I got for christmas one year, for all the other languages, I used W3Schools and StackOverflow";
    			t17 = space();
    			h42 = element("h4");
    			h42.textContent = "I started programming with Scratch.mit.edu, a block-coding website, to make fun little games and animations.";
    			t19 = space();
    			h43 = element("h4");
    			h43.textContent = "However, I started to realise the limitations of Scratch, so I started to learn HTML and C# using books and W3Schools";
    			t21 = space();
    			h32 = element("h3");
    			h32.textContent = "What Are You Doing Now?";
    			t23 = space();
    			h44 = element("h4");
    			h44.textContent = "Currently I am exploring the programming world, but my main interest is in game engines such as Unity.";
    			t25 = space();
    			h33 = element("h3");
    			h33.textContent = "What Do You Want to Do in The Future?";
    			t27 = space();
    			h45 = element("h4");
    			h45.textContent = "In the future I want to work in the game development industry, as a kid I always wanted to build games and now I am trying to make that dream a reality.";
    			t29 = space();
    			h12 = element("h1");
    			h12.textContent = "My Applications";
    			t31 = space();
    			h20 = element("h2");
    			h20.textContent = "Featured Project";
    			t33 = space();
    			create_component(project0.$$.fragment);
    			t34 = space();
    			create_component(shortmodal0.$$.fragment);
    			t35 = space();
    			h21 = element("h2");
    			h21.textContent = "Other Projects";
    			t37 = space();
    			create_component(project1.$$.fragment);
    			t38 = space();
    			create_component(shortmodal1.$$.fragment);
    			t39 = space();
    			create_component(project2.$$.fragment);
    			t40 = space();
    			create_component(shortmodal2.$$.fragment);
    			t41 = space();
    			h13 = element("h1");
    			h13.textContent = "My Games";
    			t43 = space();
    			h22 = element("h2");
    			h22.textContent = "Featured Game";
    			t45 = space();
    			create_component(project3.$$.fragment);
    			t46 = space();
    			a0 = element("a");
    			button0 = element("button");
    			button0.textContent = "View on Github";
    			t48 = space();
    			h23 = element("h2");
    			h23.textContent = "Other Games";
    			t50 = space();
    			create_component(project4.$$.fragment);
    			t51 = space();
    			create_component(shortmodal3.$$.fragment);
    			t52 = space();
    			create_component(project5.$$.fragment);
    			t53 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "View on Github";
    			t55 = space();
    			create_component(project6.$$.fragment);
    			t56 = space();
    			create_component(project7.$$.fragment);
    			t57 = space();
    			a2 = element("a");
    			button2 = element("button");
    			button2.textContent = "Alternate Download (GameJolt)";
    			t59 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h10, "class", "title svelte-4z60l9");
    			add_location(h10, file, 10, 2, 283);
    			add_location(p0, file, 11, 2, 320);
    			attr_dev(div0, "class", "banner svelte-4z60l9");
    			add_location(div0, file, 9, 1, 259);
    			attr_dev(h11, "id", "about");
    			attr_dev(h11, "class", "svelte-4z60l9");
    			add_location(h11, file, 15, 2, 402);
    			attr_dev(p1, "class", "textblock");
    			add_location(p1, file, 16, 2, 434);
    			if (!src_url_equal(img.src, img_src_value = "https://avatars.githubusercontent.com/u/68769498?v=4")) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "350px");
    			set_style(img, "height", "350px");
    			attr_dev(img, "alt", "My Profile Image from Github");
    			add_location(img, file, 18, 2, 636);
    			attr_dev(h30, "class", "svelte-4z60l9");
    			add_location(h30, file, 20, 2, 779);
    			add_location(h40, file, 21, 2, 823);
    			attr_dev(h31, "class", "svelte-4z60l9");
    			add_location(h31, file, 23, 2, 942);
    			add_location(h41, file, 24, 2, 988);
    			add_location(h42, file, 25, 2, 1137);
    			add_location(h43, file, 26, 2, 1258);
    			attr_dev(h32, "class", "svelte-4z60l9");
    			add_location(h32, file, 28, 2, 1390);
    			add_location(h44, file, 29, 2, 1426);
    			attr_dev(h33, "class", "svelte-4z60l9");
    			add_location(h33, file, 31, 2, 1543);
    			add_location(h45, file, 32, 2, 1593);
    			attr_dev(h12, "id", "work");
    			attr_dev(h12, "class", "svelte-4z60l9");
    			add_location(h12, file, 34, 2, 1760);
    			attr_dev(h20, "class", "svelte-4z60l9");
    			add_location(h20, file, 35, 2, 1798);
    			attr_dev(h21, "class", "svelte-4z60l9");
    			add_location(h21, file, 39, 2, 2325);
    			attr_dev(h13, "id", "games");
    			attr_dev(h13, "class", "svelte-4z60l9");
    			add_location(h13, file, 46, 2, 3221);
    			attr_dev(h22, "class", "svelte-4z60l9");
    			add_location(h22, file, 47, 2, 3253);
    			add_location(button0, file, 50, 3, 3572);
    			attr_dev(a0, "href", "https://shakenbeet.github.io/SnakeHunter/");
    			add_location(a0, file, 49, 2, 3515);
    			attr_dev(h23, "class", "svelte-4z60l9");
    			add_location(h23, file, 53, 2, 3619);
    			add_location(button1, file, 59, 3, 4531);
    			attr_dev(a1, "href", "https://github.com/Shakenbeet/FlappuccinoUnity");
    			add_location(a1, file, 58, 2, 4469);
    			add_location(button2, file, 66, 3, 5205);
    			attr_dev(a2, "href", "https://gamejolt.com/games/thehobbitvideogame/552429");
    			add_location(a2, file, 65, 2, 5137);
    			attr_dev(div1, "class", "content svelte-4z60l9");
    			add_location(div1, file, 14, 1, 377);
    			attr_dev(main, "class", "svelte-4z60l9");
    			add_location(main, file, 7, 0, 237);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, div0);
    			append_dev(div0, h10);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(main, t4);
    			append_dev(main, div1);
    			append_dev(div1, h11);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			append_dev(div1, t8);
    			append_dev(div1, img);
    			append_dev(div1, t9);
    			append_dev(div1, h30);
    			append_dev(div1, t11);
    			append_dev(div1, h40);
    			append_dev(div1, t13);
    			append_dev(div1, h31);
    			append_dev(div1, t15);
    			append_dev(div1, h41);
    			append_dev(div1, t17);
    			append_dev(div1, h42);
    			append_dev(div1, t19);
    			append_dev(div1, h43);
    			append_dev(div1, t21);
    			append_dev(div1, h32);
    			append_dev(div1, t23);
    			append_dev(div1, h44);
    			append_dev(div1, t25);
    			append_dev(div1, h33);
    			append_dev(div1, t27);
    			append_dev(div1, h45);
    			append_dev(div1, t29);
    			append_dev(div1, h12);
    			append_dev(div1, t31);
    			append_dev(div1, h20);
    			append_dev(div1, t33);
    			mount_component(project0, div1, null);
    			append_dev(div1, t34);
    			mount_component(shortmodal0, div1, null);
    			append_dev(div1, t35);
    			append_dev(div1, h21);
    			append_dev(div1, t37);
    			mount_component(project1, div1, null);
    			append_dev(div1, t38);
    			mount_component(shortmodal1, div1, null);
    			append_dev(div1, t39);
    			mount_component(project2, div1, null);
    			append_dev(div1, t40);
    			mount_component(shortmodal2, div1, null);
    			append_dev(div1, t41);
    			append_dev(div1, h13);
    			append_dev(div1, t43);
    			append_dev(div1, h22);
    			append_dev(div1, t45);
    			mount_component(project3, div1, null);
    			append_dev(div1, t46);
    			append_dev(div1, a0);
    			append_dev(a0, button0);
    			append_dev(div1, t48);
    			append_dev(div1, h23);
    			append_dev(div1, t50);
    			mount_component(project4, div1, null);
    			append_dev(div1, t51);
    			mount_component(shortmodal3, div1, null);
    			append_dev(div1, t52);
    			mount_component(project5, div1, null);
    			append_dev(div1, t53);
    			append_dev(div1, a1);
    			append_dev(a1, button1);
    			append_dev(div1, t55);
    			mount_component(project6, div1, null);
    			append_dev(div1, t56);
    			mount_component(project7, div1, null);
    			append_dev(div1, t57);
    			append_dev(div1, a2);
    			append_dev(a2, button2);
    			append_dev(div1, t59);
    			mount_component(footer, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(project0.$$.fragment, local);
    			transition_in(shortmodal0.$$.fragment, local);
    			transition_in(project1.$$.fragment, local);
    			transition_in(shortmodal1.$$.fragment, local);
    			transition_in(project2.$$.fragment, local);
    			transition_in(shortmodal2.$$.fragment, local);
    			transition_in(project3.$$.fragment, local);
    			transition_in(project4.$$.fragment, local);
    			transition_in(shortmodal3.$$.fragment, local);
    			transition_in(project5.$$.fragment, local);
    			transition_in(project6.$$.fragment, local);
    			transition_in(project7.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(project0.$$.fragment, local);
    			transition_out(shortmodal0.$$.fragment, local);
    			transition_out(project1.$$.fragment, local);
    			transition_out(shortmodal1.$$.fragment, local);
    			transition_out(project2.$$.fragment, local);
    			transition_out(shortmodal2.$$.fragment, local);
    			transition_out(project3.$$.fragment, local);
    			transition_out(project4.$$.fragment, local);
    			transition_out(shortmodal3.$$.fragment, local);
    			transition_out(project5.$$.fragment, local);
    			transition_out(project6.$$.fragment, local);
    			transition_out(project7.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(project0);
    			destroy_component(shortmodal0);
    			destroy_component(project1);
    			destroy_component(shortmodal1);
    			destroy_component(project2);
    			destroy_component(shortmodal2);
    			destroy_component(project3);
    			destroy_component(project4);
    			destroy_component(shortmodal3);
    			destroy_component(project5);
    			destroy_component(project6);
    			destroy_component(project7);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header, Footer, Project, ShortModal });
    	return [];
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

    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
