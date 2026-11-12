import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const readJson = path => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const manifest = readJson('pack/catalog/skill-manifest.v1.json');
const lock = readJson('UPSTREAM.lock.json');
const pkg = readJson('package.json');
const pilots = new Map([
  ['workflow-statechart-v1', 'statechart'],
  ['workflow-poteto-v1', 'poteto-mode'],
  ['workflow-proof-v1', 'principle-prove-it-works'],
]);

// R01 checks the static catalog. Runtime request and proof validation belong to later units.
function checkCatalog(catalog) {
  assert.equal(catalog.schema, 'workflow-skill.catalog.v1', 'unknown catalog version');
  assert.equal(catalog.sourceLock, 'UPSTREAM.lock.json');
  assert.equal(catalog.sourceVersion, lock.version, 'unknown source version');
  assert.ok(Array.isArray(catalog.skills));
  assert.equal(catalog.skills.length, pilots.size, 'pilot size');
  const ids = new Set();
  const registered = new Set(pkg.pi.skills.map(path => path.split('/').at(-1)));
  for (const entry of catalog.skills) {
    assert.ok(!registered.has(entry.id), `registered skill collision: ${entry.id}`);
    assert.ok(!entry.id.endsWith('-pi'), `legacy skill collision: ${entry.id}`);
    assert.match(entry.id, /^workflow-[a-z0-9-]+-v1$/, 'unknown skill version');
    assert.ok(!ids.has(entry.id), `duplicate ID: ${entry.id}`);
    ids.add(entry.id);
    assert.equal(entry.source.skill, pilots.get(entry.id), 'unknown pilot ID or wrong source');
    const pinned = lock.skills[entry.source.skill];
    assert.ok(pinned && pinned.status === 'instruction-port', 'source must be locked');
    assert.equal(entry.source.path, pinned.path, 'wrong source path');
    assert.equal(entry.source.sha256, pinned.sha256, 'wrong source digest');
    assert.equal(entry.source.bodySha256, pinned.bodySha256, 'wrong body digest');
    assert.ok(Array.isArray(entry.requiredStepIds) && entry.requiredStepIds.length > 0, 'required steps missing');
    assert.ok(entry.requiredStepIds.every(id => /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id)), 'invalid step ID');
    assert.equal(new Set(entry.requiredStepIds).size, entry.requiredStepIds.length, 'duplicate step ID');
  }
  assert.deepEqual(ids, new Set(pilots.keys()), 'pilot IDs');
}

const changed = change => {
  const copy = structuredClone(manifest);
  change(copy);
  return copy;
};

// Why: the catalog must pin three source methods without changing the published port.
test('three opt-in versioned pilots bind locked source skills and required steps', () => {
  checkCatalog(manifest);
  assert.ok(!pkg.files.some(path => path === 'pack/' || path.startsWith('pack/')), 'pack must not be published');
  assert.ok(!pkg.pi.skills.some(path => path.startsWith('./pack/')), 'pack must not be registered');
});

// Why: ambiguous IDs or steps cannot identify a unique future recipe.
test('duplicate skill IDs and duplicate required steps fail', () => {
  assert.throws(() => checkCatalog(changed(c => { c.skills[1].id = c.skills[0].id; })), /duplicate ID/);
  assert.throws(() => checkCatalog(changed(c => { c.skills[0].requiredStepIds.push(c.skills[0].requiredStepIds[0]); })), /duplicate step ID/);
});

// Why: a source label alone cannot stand in for the locked source bytes.
test('wrong source digest, body digest, path or mapping fails', () => {
  for (const field of ['sha256', 'bodySha256']) {
    assert.throws(() => checkCatalog(changed(c => { c.skills[0].source[field] = '0'.repeat(64); })), /wrong .*digest/);
  }
  assert.throws(() => checkCatalog(changed(c => { c.skills[0].source.path = 'skills/other/SKILL.md'; })), /wrong source path/);
  assert.throws(() => checkCatalog(changed(c => { c.skills[0].source.skill = 'architect'; })), /wrong source/);
});

// Why: an unrecognized version must not inherit v1 semantics by default.
test('unknown catalog, source and skill versions fail', () => {
  assert.throws(() => checkCatalog(changed(c => { c.schema = 'workflow-skill.catalog.v2'; })), /unknown catalog version/);
  assert.throws(() => checkCatalog(changed(c => { c.sourceVersion = '0.15.37'; })), /unknown source version/);
  assert.throws(() => checkCatalog(changed(c => { c.skills[0].id = 'workflow-statechart-v2'; })), /unknown skill version/);
});

// Why: a new recipe cannot replace a registered instruction skill or silently expand the pilot.
test('registered legacy names, absent steps and extra pilots fail', () => {
  assert.throws(() => checkCatalog(changed(c => { c.skills[0].id = 'statechart-pi'; })), /collision/);
  assert.throws(() => checkCatalog(changed(c => { c.skills[0].requiredStepIds = []; })), /required steps missing/);
  assert.throws(() => checkCatalog(changed(c => { c.skills.push(structuredClone(c.skills[0])); })), /pilot size/);
});
