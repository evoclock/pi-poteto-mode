import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import * as roles from '../skills/setup-pstack-pi/scripts/model-roles.mjs';

const available = ['provider/first', 'provider/second'];
const names = ['development', 'independent-review', 'swarm workers', 'arena runners',
  'arena cross-judge pool', 'architect runners', 'interrogate reviewers'];
const configured = {
  schema: 'pstack-model-roles.v1',
  budget: { label: 'medium', effort: 'high' },
  roles: Object.fromEntries(names.map((name, i) => [name,
    i < 3 ? available[1] : [available[1], available[0], available[1]]])),
};

function fixture(t) {
  mkdirSync('.scratch', { recursive: true });
  const dir = mkdtempSync('.scratch/role-default-test-');
  t.after(() => rmSync(dir, { recursive: true }));
  return `${dir}/role-map.fixture.json`;
}

test('absent configuration resolves every role anew from the runtime Pi default', () => {
  let current = available[0];
  let calls = 0;
  const resolveDefault = () => { calls++; return current; };
  for (const role of names) {
    assert.deepEqual(roles.roleModels(undefined, role, available, resolveDefault), [current]);
  }
  current = available[1];
  for (const role of names) {
    assert.deepEqual(roles.roleModels(undefined, role, available, resolveDefault), [current]);
  }
  assert.equal(calls, names.length * 2);
});

test('missing file uses the runtime resolver without creating configuration', t => {
  const file = fixture(t);
  let current = available[0];
  for (const role of names) {
    assert.deepEqual(roles.readRoleModels(file, role, available, () => current), [current]);
    current = current === available[0] ? available[1] : available[0];
  }
  assert.equal(existsSync(file), false);
});

test('present file preserves exact identities, order, duplicates and bytes without default lookup', t => {
  const file = fixture(t);
  const bytes = JSON.stringify({ ...configured, future: { keep: true } });
  writeFileSync(file, bytes);
  const noDefault = () => { assert.fail('present files must not resolve a default'); };
  for (const [role, value] of Object.entries(configured.roles)) {
    assert.deepEqual(roles.readRoleModels(file, role, available, noDefault),
      Array.isArray(value) ? value : [value]);
  }
  assert.equal(readFileSync(file, 'utf8'), bytes);
});

test('present malformed documents and needed missing/null roles error without fallback', t => {
  const file = fixture(t);
  const noDefault = () => { assert.fail('invalid files must not resolve a default'); };
  const documents = ['{broken-json', 'null', '[]', '{}',
    JSON.stringify({ ...configured, schema: 'other' }),
    JSON.stringify({ ...configured, roles: [] }),
    JSON.stringify({ ...configured, budget: { label: 'medium', effort: 'low' } }),
    ...[null, '', 'auto', 'inherit-parent', 'provider/unavailable', [], ['provider/first']].map(value =>
      JSON.stringify({ ...configured, roles: { ...configured.roles, development: value } })),
    JSON.stringify({ ...configured, roles: {} }),
    JSON.stringify({ ...configured, roles: { ...configured.roles, 'arena runners': 'provider/first' } }),
    JSON.stringify({ ...configured, roles: { ...configured.roles, 'arena runners': ['auto'] } }),
  ];
  for (const bytes of documents) {
    writeFileSync(file, bytes);
    assert.throws(() => roles.readRoleModels(file, 'development', available, noDefault),
      /JSON|schema|roles|budget|configured|identity|scalar|panel/);
    assert.equal(readFileSync(file, 'utf8'), bytes);
  }
});

test('non-missing IO failures and unavailable runtime defaults are explicit errors', t => {
  const file = fixture(t);
  mkdirSync(file);
  assert.throws(() => roles.readRoleModels(file, 'development', available,
    () => { assert.fail('IO errors must not resolve a default'); }), /EISDIR/);
  for (const identity of [undefined, null, '', 'auto', 'inherit-parent', 'provider/unavailable']) {
    assert.throws(() => roles.roleModels(undefined, 'development', available, () => identity), /default|identity/);
  }
  assert.throws(() => roles.roleModels(undefined, 'development', available), /runtime Pi default/);
  assert.throws(() => roles.roleModels(null, 'development', available, () => available[0]), /schema/);
  assert.throws(() => roles.roleModels(undefined, 'unknown', available, () => available[0]), /Unsupported role/);
});
