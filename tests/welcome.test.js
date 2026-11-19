import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { apply, cleanName, readName } from '../host.js';

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');

// Stand-ins for the host's ui-primitives: they record what the card builds.
function fakePrimitives() {
  const made = {};
  class SettingsFormModel {
    constructor(scope, specs) { made.scope = scope; made.specs = specs; made.model = this; }
    bind(project) { made.project = project; return { kind: 'store' }; }
    shell() { return { available: true, writable: true, dirty: false, invalid: false, saving: false, failed: false }; }
    field() { return { text: 'Lazarev', overridden: true, invalid: false }; }
    actions() { return { edit() {}, resetField() {}, save() {}, discard() {} }; }
    dispose() { made.disposed = true; }
  }
  // Mirrors the real exports' shapes: components may be forwardRef objects.
  return { made, ui: { SettingsFormModel, SettingsForm: { $$typeof: 'forwardRef', render() {} }, SettingsValueField: function SettingsValueField() {} } };
}

// Evaluate client.js the way the Harness module loader does and capture what it registers.
function loadClient({ name = null, rpc = async () => ({ ok: true, value: { name: 'Alex' } }), ui, configForms } = {}) {
  let registration;
  vm.runInNewContext(source, { window: { __ModuleLoader__: { load: value => { registration = value; } } }, console });
  let calls = 0;
  const React = {
    Fragment: 'Fragment',
    createElement: (type, props, ...children) => ({ type, props, children }),
    useState: init => [calls++ % 2 === 0 ? (typeof init === 'function' ? init() : init) : name, () => {}],
    useEffect: () => {},
  };
  const module = registration.factory(id => {
    if (id === 'react') return React;
    if (id === '@deepseek-ai/dsh-client-ui-primitives' && ui) return ui;
    throw new Error('not found: ' + id);
  });
  const seen = { rpc: [], registered: [] };
  const slots = {
    inject: (slot, fn) => { fn(); },
    register: (meta, component) => { seen.registered.push({ meta, component }); },
  };
  const ctx = {
    effect: fn => fn(),
    locale: { register: (ns, dict) => { seen.namespace = ns; seen.dictionaries = dict; } },
    slots,
    connection: { rpc: { call: (...args) => { seen.rpc.push(args); return rpc(...args); } } },
    inject: (names, fn) => { if (configForms) fn({ effect: f => f(), slots, configForms }); },
  };
  module.apply(ctx);
  seen.hero = seen.registered.find(r => r.meta.name === 'conversation.hero.brand.mark');
  seen.card = seen.registered.find(r => r.meta.name === 'plugins.bundle.config');
  return { module, seen };
}

const servedForms = () => ({ get: ns => ({ ns }), whileServed: (namespaces, register) => { assert.deepEqual([...namespaces], ['dsh-welcome']); return register(new Set(namespaces)); } });

test('every language has a named and a plain greeting and the full settings copy', () => {
  const { seen } = loadClient();
  assert.equal(seen.namespace, 'dsh-welcome');
  assert.deepEqual(Object.keys(seen.dictionaries).sort(), ['de', 'en', 'es', 'fr', 'ja', 'pt', 'ru', 'zh']);
  for (const [lang, dict] of Object.entries(seen.dictionaries)) {
    for (const key of ['hello', 'welcome', 'return', 'ready', 'good']) {
      assert.match(dict[key], /\{name\}/, `${lang}.${key}`);
      assert.ok(dict[key + '.plain'] && !dict[key + '.plain'].includes('{name}'), `${lang}.${key}.plain`);
    }
    for (const key of ['label', 'hint', 'placeholder', 'invalid', 'preview', 'overridden', 'reset', 'unavailable', 'readOnly', 'saveFailed', 'save', 'saving']) {
      assert.ok(dict['settings.' + key], `${lang}.settings.${key}`);
    }
  }
});

test('the greeting uses the configured name, or the plain form without one', () => {
  const t = key => loadClient().seen.dictionaries.en[key];
  const span = tree => tree.children[1];
  const named = loadClient({ name: 'Alex' }).seen.hero.component({ t });
  assert.equal(named.children[0].type, 'style');
  assert.match(span(named).children[0], /Alex/);
  const plain = loadClient({ name: '' }).seen.hero.component({ t });
  assert.doesNotMatch(span(plain).children[0], /\{name\}|Alex/);
  assert.equal(loadClient({ name: null }).seen.hero.component({ t }), null);
});

test('the greeting uses the documented slot and does not call the Host before a mount', () => {
  const { seen } = loadClient();
  assert.equal(seen.hero.meta.locale, 'dsh-welcome');
  assert.equal(seen.rpc.length, 0);
});

test('without the settings service or primitives only the greeting registers', () => {
  assert.equal(loadClient().seen.card, undefined);
  assert.equal(loadClient({ configForms: servedForms() }).seen.card, undefined);
  assert.equal(loadClient({ ui: fakePrimitives().ui }).seen.card, undefined);
});

test('the settings card edits the dsh-welcome namespace on the bundle page', () => {
  const { ui, made } = fakePrimitives();
  const { seen } = loadClient({ ui, configForms: servedForms() });
  assert.equal(seen.card.meta.key, '@adsqwui/dsh-welcome');
  assert.equal(seen.card.meta.locale, 'dsh-welcome');
  assert.deepEqual(made.scope, { ns: 'dsh-welcome' });
  const face = seen.card.meta.inject();
  assert.equal(face.hooks.welcomeSettings.kind, 'store');
  assert.equal(typeof face.save, 'function');
  assert.equal(made.project().field.text, 'Lazarev');

  const [spec] = made.specs;
  // Objects made inside the vm realm have another prototype, so compare them as JSON.
  const parsed = text => JSON.parse(JSON.stringify(spec.parse(text) ?? null));
  assert.equal(spec.field, 'name');
  assert.deepEqual(parsed('   '), { kind: 'clear' });
  assert.deepEqual(parsed('  Al \n ex '), { kind: 'set', value: 'Al ex' });
  assert.equal(spec.parse('x'.repeat(41)), undefined);
  assert.equal(spec.format(undefined), '');
});

test('the settings card renders the shared form with a live preview', () => {
  const { ui } = fakePrimitives();
  const { seen } = loadClient({ ui, configForms: servedForms() });
  const t = key => seen.dictionaries.ru[key];
  const state = { available: true, writable: true, saving: false, field: { text: ' Lazarev ', overridden: true, invalid: false } };
  const tree = seen.card.component({ t, view: 'page', useWelcomeSettings: select => select(state), edit() {}, resetField() {}, save() {}, discard() {} });
  assert.equal(tree.type, ui.SettingsForm);
  assert.equal(tree.props.labels.save, 'Сохранить');
  const [input, preview] = tree.children;
  assert.equal(input.type, ui.SettingsValueField);
  assert.equal(input.props.label, 'Имя в приветствии');
  assert.equal(input.props.overridden, true);
  assert.equal(preview.children[0], 'Так это будет выглядеть: С возвращением, Lazarev');
  assert.equal(seen.card.component({ t, view: 'summary' }), null);
  const invalid = seen.card.component({ t, view: 'page', useWelcomeSettings: select => select({ ...state, field: { text: 'x', overridden: true, invalid: true } }), edit() {} });
  assert.equal(invalid.children[1], null);
});

test('the Host serves only a cleaned, current name', async () => {
  assert.equal(cleanName('  Al\u0007ex \n Smith  '), 'Alex Smith');
  assert.equal(cleanName(42), '');
  assert.equal(cleanName('x'.repeat(100)).length, 40);
  let current = ' Lazarev ';
  assert.equal(readName({ name: { get: () => current } }), 'Lazarev');
  assert.equal(readName({ name: 'Plain' }), 'Plain');
  let route;
  const config = { name: { get: () => current } };
  apply({ effect: fn => fn(), connection: { fetch: { register: r => { route = r; } } } }, config);
  assert.equal(route.path, '/api/dsh-welcome/config');
  const ask = async body => (await route.fetch(new Request('http://localhost/api/dsh-welcome/config', { method: 'POST', body }))).json();
  assert.deepEqual(await ask(JSON.stringify({ rpcId: 'r1', payload: {} })), { type: 'server-response', rpcId: 'r1', result: { ok: true, value: { name: 'Lazarev' } } });
  current = 'Alex';
  assert.equal((await ask(JSON.stringify({ rpcId: 'r2' }))).result.value.name, 'Alex');
  assert.equal((await ask('not json')).result.value.name, 'Alex');
});
