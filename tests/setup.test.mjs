import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { budgetSetting, previewSetup, roleModels } from '../skills/setup-pstack-pi/scripts/model-roles.mjs';

const available = ['provider/build-a', 'provider/review-b'];
const config = {
  schema: 'pstack-model-roles.v1',
  budget: { label: 'medium', effort: 'high', note: 'keep' },
  roles: {
    development: available[0],
    'independent-review': available[1],
    'arena runners': [...available],
    'arena cross-judge pool': [...available].reverse(),
    'swarm workers': available[1],
    'architect runners': [...available],
    'interrogate reviewers': [...available],
    future: { keep: true },
  },
  future: { keep: true },
};

test('existing v1 budget and flat panel roles load without migration or mutation', () => {
  // Why: the operator already has this exact shape, including ordered panel seats.
  const before = structuredClone(config);
  assert.deepEqual(previewSetup(config, {}, available), config);
  assert.deepEqual(budgetSetting(config), config.budget);
  for (const role of ['arena runners', 'arena cross-judge pool', 'architect runners', 'interrogate reviewers']) {
    assert.deepEqual(roleModels(config, role, available), config.roles[role]);
  }
  assert.deepEqual(roleModels(config, 'swarm workers', available), [available[1]]);
  assert.deepEqual(config, before);
});

test('setup starts with null core roles and previews only explicit available choices', () => {
  // Why: neither package examples nor preview may supply a live model choice.
  const example = JSON.parse(readFileSync(new URL('../config/pstack-model-roles.v1.example.json', import.meta.url)));
  assert.deepEqual(Object.values(example.roles), [null, null]);
  assert.throws(() => previewSetup(example, {}, available), /not configured/);
  const result = previewSetup(example, {
    roles: { development: available[0], 'independent-review': available[1], 'arena runners': available },
    budget: { label: 'medium', effort: 'high' },
  }, available);
  assert.equal(result.roles.development, available[0]);
  assert.deepEqual(result.roles['arena runners'], available);
  assert.deepEqual(result.budget, { label: 'medium', effort: 'high' });
  assert.deepEqual(Object.values(example.roles), [null, null]);
});

test('budget changes preserve unknown fields and do not rewrite selected identities', () => {
  // Why: effort is native Pi session state, not a model-slug transformation.
  for (const [label, effort] of [['unlimited', 'max'], ['large', 'xhigh'], ['medium', 'high'], ['small', 'medium']]) {
    const result = previewSetup(config, { budget: { label, effort } }, available);
    assert.deepEqual(result.roles, config.roles);
    assert.deepEqual(result.future, config.future);
    assert.equal(result.budget.note, 'keep');
    assert.equal(budgetSetting(result).effort, effort);
  }
  assert.throws(() => previewSetup(config, { budget: { label: 'medium', effort: 'low' } }, available), /budget/);
  assert.throws(() => budgetSetting({ budget: { label: 'unknown', effort: 'high' } }), /budget/);
  assert.equal(budgetSetting({}), null);
});

test('missing, empty, malformed and unavailable roles block without fallback', () => {
  // Why: a core role or parent session must never fill a missing panel seat.
  for (const value of [undefined, null, [], '', available[0], [null], ['auto'], ['inherit-parent'], ['provider/missing']]) {
    const invalid = { ...config, roles: { ...config.roles, 'arena runners': value } };
    assert.throws(() => roleModels(invalid, 'arena runners', available));
  }
  for (const alias of ['auto', 'inherit-parent']) {
    assert.throws(() => roleModels({ ...config, roles: { ...config.roles, development: alias } }, 'development', [...available, alias]), /invalid identity/);
  }
  for (const role of ['development', 'independent-review', 'swarm workers']) {
    assert.throws(() => roleModels({ ...config, roles: { ...config.roles, [role]: available } }, role, available), /scalar/);
  }
  assert.throws(() => roleModels(config, 'missing panel', available), /Unsupported role/);
  assert.throws(() => roleModels({ ...config, schema: 'unknown' }, 'development', available), /schema/);
  assert.throws(() => previewSetup(config, {}, []), /unavailable/);
  for (const selections of [null, [], { roles: null }, { roles: 'invalid' }, { budget: null }, { budget: [] }]) {
    assert.throws(() => previewSetup(config, selections, available), /selections|roles|budget/);
  }
});

test('duplicate panel entries retain one seat per entry and cannot mutate configuration', () => {
  // Why: upstream list length determines fan-out, even when entries repeat.
  const selected = previewSetup(config, { roles: { 'arena runners': [available[0], available[0]] } }, available);
  const seats = roleModels(selected, 'arena runners', available);
  assert.deepEqual(seats, [available[0], available[0]]);
  seats.pop();
  assert.equal(selected.roles['arena runners'].length, 2);
});

test('same core selections are stored without claiming independent family review', () => {
  // Why: setup records consent; a later diversity gate must not substitute a model.
  const selected = previewSetup(config, { roles: { 'independent-review': available[0] } }, available);
  assert.equal(selected.roles['independent-review'], available[0]);
});
