import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { apply, cleanName } from '../host.js';

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');

// Evaluate client.js the way the Harness module loader does and capture what it registers.
function loadClient({ name = null, rpc = async () => ({ ok: true, value: { name: 'Alex' } }) } = {}) {
  let registration;
  vm.runInNewContext(source, { window: { __ModuleLoader__: { load: value => { registration = value; } } } });
  let calls = 0;
  const React = {
    Fragment: 'Fragment',
    createElement: (type, props, ...children) => ({ type, props, children }),
    useState: init => [calls++ % 2 === 0 ? (typeof init === 'function' ? init() : init) : name, () => {}],
    useEffect: () => {},
  };
  const module = registration.factory(id => { assert.equal(id, 'react'); return React; });
  const seen = { rpc: [] };
  module.apply({
    effect: fn => fn(),
    locale: { register: (ns, dict) => { seen.namespace = ns; seen.dictionaries = dict; } },
    slots: { inject: (slot, fn) => { seen.slot = slot; fn(); }, register: (meta, component) => { seen.meta = meta; seen.Welcome = component; } },
    connection: { rpc: { call: (...args) => { seen.rpc.push(args); return rpc(...args); } } },
  });
  return { module, seen };
}

test('every language has a named and a plain form for every greeting', () => {
  const { seen } = loadClient();
  assert.equal(seen.namespace, 'dsh-welcome');
  assert.deepEqual(Object.keys(seen.dictionaries).sort(), ['de', 'en', 'es', 'fr', 'ja', 'pt', 'ru', 'zh']);
  for (const [lang, dict] of Object.entries(seen.dictionaries)) {
    for (const key of ['hello', 'welcome', 'return', 'ready', 'good']) {
      assert.match(dict[key], /\{name\}/, `${lang}.${key}`);
      assert.ok(dict[key + '.plain'] && !dict[key + '.plain'].includes('{name}'), `${lang}.${key}.plain`);
    }
  }
});

test('the greeting uses the configured name, or the plain form without one', () => {
  const t = key => loadClient().seen.dictionaries.en[key];
  const span = tree => tree.children[1];
  const named = loadClient({ name: 'Alex' }).seen.Welcome({ t });
  assert.equal(named.children[0].type, 'style');
  assert.match(span(named).children[0], /Alex/);
  const plain = loadClient({ name: '' }).seen.Welcome({ t });
  assert.doesNotMatch(span(plain).children[0], /\{name\}|Alex/);
  assert.equal(loadClient({ name: null }).seen.Welcome({ t }), null);
});

test('the client uses the documented slot and does not call the Host before a mount', () => {
  const { seen } = loadClient();
  assert.equal(seen.slot, 'conversation.hero.brand.mark');
  assert.equal(seen.meta.locale, 'dsh-welcome');
  assert.equal(seen.rpc.length, 0);
});

test('the Host serves only a cleaned name', async () => {
  assert.equal(cleanName('  Al\u0007ex \n Smith  '), 'Alex Smith');
  assert.equal(cleanName(42), '');
  assert.equal(cleanName('x'.repeat(100)).length, 40);
  let route;
  apply({ effect: fn => fn(), connection: { fetch: { register: r => { route = r; } } } }, { name: ' Lazarev ' });
  assert.equal(route.path, '/api/dsh-welcome/config');
  const response = await route.fetch(new Request('http://localhost/api/dsh-welcome/config', { method: 'POST', body: JSON.stringify({ rpcId: 'r1', payload: {} }) }));
  assert.deepEqual(await response.json(), { type: 'server-response', rpcId: 'r1', result: { ok: true, value: { name: 'Lazarev' } } });
  const broken = await route.fetch(new Request('http://localhost/x', { method: 'POST', body: 'not json' }));
  assert.equal((await broken.json()).result.value.name, 'Lazarev');
});
