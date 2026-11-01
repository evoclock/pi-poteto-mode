import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const sha = text => createHash('sha256').update(text).digest('hex');
const sourceBody = text => text.replace(/^---\n[\s\S]*?\n---\n/, '');
const restored = text => [...text.matchAll(/<!-- pstack-source:start -->\n([\s\S]*?)<!-- pstack-source:end -->\n/g)].map(m => m[1]).join('');

function baseline() {
  assert.ok(existsSync(new URL('tests/fixtures/upstream-0.15.36.json', root)), 'locked offline source baseline required');
  return JSON.parse(read('tests/fixtures/upstream-0.15.36.json'));
}

test('lock records plugin version and every source skill content hash', () => {
  // Why: a cache identifier is not a verified Git commit or sufficient provenance.
  assert.ok(existsSync(new URL('UPSTREAM.lock.json', root)), 'content lock required');
  const lock = JSON.parse(read('UPSTREAM.lock.json'));
  const snapshot = baseline();
  assert.equal(lock.version, '0.15.36');
  assert.equal(Object.keys(lock.skills).length, 58);
  assert.equal(sha(snapshot.plugin), lock.plugin.sha256);
  assert.equal(JSON.parse(snapshot.plugin).version, lock.version);
  for (const [slug, text] of Object.entries(snapshot.skills)) {
    assert.equal(lock.skills[slug].sha256, sha(text), slug);
    assert.equal(lock.skills[slug].bodySha256, sha(sourceBody(text)), slug);
  }
});

test('all skill and reference source bodies match the offline baseline exactly', () => {
  // Why: prose lost from a skill must not hide behind word overlap or source markers.
  const snapshot = baseline();
  const lock = JSON.parse(read('UPSTREAM.lock.json'));
  for (const [slug, text] of Object.entries(snapshot.skills)) {
    const port = read(`skills/${slug}-pi/SKILL.md`);
    assert.equal(restored(port), sourceBody(text), slug);
    assert.equal(port.match(/^disable-model-invocation: (true|false)$/m)?.[1], text.match(/^disable-model-invocation: (true|false)$/m)?.[1], `${slug}: invocation parity`);
  }
  for (const [path, text] of Object.entries(snapshot.references)) {
    assert.equal(restored(read(path)), text, path);
    assert.equal(lock.references[path].sha256, sha(text), path);
  }
});

test('all 23 playbooks retain exact upstream bodies with additive boundaries', () => {
  // Why: recall of scattered vocabulary alone does not preserve ordered instructions.
  const snapshot = baseline();
  const directory = new URL('skills/poteto-mode-pi/playbooks/', root);
  assert.ok(existsSync(directory), 'per-playbook directory required');
  assert.equal(readdirSync(directory).filter(n => n.endsWith('.md')).length, 23);
  for (const [slug, source] of Object.entries(snapshot.playbooks)) {
    const port = read(`skills/poteto-mode-pi/playbooks/${slug}.md`);
    assert.equal(restored(port), source, slug);
    assert.match(port, /Pi boundary/);
    assert.match(port, /UPSTREAM\.lock\.json/);
  }
  assert.match(read('skills/poteto-mode-pi/SKILL.md'), /steps[\s\S]*verbatim/);
});

test('Pi remapping names concrete Herdr, Treehouse, task and forge routes', () => {
  // Why: preserving source text must not leave cloud-only instructions as the runnable path.
  const adapted = path => read(path).replace(/<!-- pstack-source:start -->\n[\s\S]*?<!-- pstack-source:end -->\n/g, '');
  const shipping = adapted('skills/poteto-mode-pi/playbooks/shipping.md');
  assert.match(shipping, /agentic_herdr_spawn_worker/);
  assert.match(shipping, /treehouse get --lease --json/);
  assert.match(shipping, /gh pr view/);
  assert.match(shipping, /author|did not write/);
  for (const slug of ['feature', 'bug-fix', 'eval', 'orchestrate', 'autopilot-full', 'autopilot-stack']) {
    const text = adapted(`skills/poteto-mode-pi/playbooks/${slug}.md`);
    assert.match(text, /Herdr/);
    assert.match(text, /Treehouse|treehouse/);
    assert.doesNotMatch(text, /through available Pi routes/);
  }
  const boundaries = read('skills/how/WORKFLOW_BOUNDARIES.md');
  assert.match(boundaries, /agentic_herdr_spawn_worker/);
  assert.match(boundaries, /agentic_herdr_communication/);
  assert.match(boundaries, /agentic_worker_dispatch_async/);
  assert.match(boundaries, /TaskList/);
  assert.match(boundaries, /gh pr checks/);
});

test('premerge boundaries cover destructive and unsupported source steps explicitly', () => {
  // Why: a global caveat cannot hide a destructive command or unsupported watch step.
  const adapted = path => read(path).replace(/<!-- pstack-source:start -->\n[\s\S]*?<!-- pstack-source:end -->\n/g, '');
  const opening = adapted('skills/poteto-mode-pi/playbooks/opening-a-pr.md');
  assert.match(opening, /Treehouse/);
  assert.match(opening, /agentic_herdr_spawn_worker/);
  assert.match(opening, /agentic_herdr_communication/);
  assert.match(opening, /git reset --hard is explicitly blocked/);
  assert.match(opening, /draft/);
  const shipping = adapted('skills/poteto-mode-pi/playbooks/shipping.md');
  assert.match(shipping, /Pi step 3:[\s\S]*git patch-id --stable/);
  assert.match(shipping, /Pi step 4 is owner-held:[\s\S]*--force-with-lease/);
  assert.match(shipping, /Pi step 5:[\s\S]*watch-pr[\s\S]*blocked/);
  assert.match(adapted('skills/statechart-pi/SKILL.md'), /run-tlc\.mjs --check/);
});

test('new review and prompt contracts replace the old inversions', () => {
  // Why: the old bucket and no-rewrite contracts directly contradict this baseline.
  const interrogate = read('skills/interrogate-pi/SKILL.md');
  assert.match(interrogate, /## Frame[\s\S]*## Fan out[\s\S]*## Verify[\s\S]*## Output/);
  assert.match(interrogate, /rerunning its command/);
  assert.doesNotMatch(interrogate, /Act on|Consider \/ Noted|finding.buckets/i);
  const sharpen = read('skills/sharpen-pi/SKILL.md');
  assert.match(sharpen, /Then rewrite my prompt/);
  assert.doesNotMatch(sharpen, /Don't hand back a rewritten prompt/);
});

test('new formal and statechart skills register while video remains explicitly planned', () => {
  // Why: retained upstream video prose must not advertise an unavailable execution route.
  const pkg = JSON.parse(read('package.json'));
  for (const slug of ['create-formal-verification-skill', 'maintain-formal-verification-skill', 'statechart']) {
    assert.ok(pkg.pi.skills.includes(`./skills/${slug}-pi`));
    assert.ok(existsSync(new URL(`skills/${slug}-pi/SKILL.md`, root)));
  }
  assert.ok(!pkg.pi.skills.includes('./skills/ketchup-video-pi'));
  assert.match(read('docs/adaptation-guide.md'), /ketchup-video[\s\S]*planned/i);
});

test('instruction recall floors bind to offline source and reject deleted procedures', async () => {
  // Why: empty or compressed ports must fail without access to a local Cursor cache.
  assert.ok(existsSync(new URL('scripts/instruction-recall.mjs', root)));
  const { instructionRecall, checkRecall } = await import('../scripts/instruction-recall.mjs');
  const snapshot = baseline();
  assert.equal(instructionRecall('1. Preserve the exact ordered procedure and verify its result.', ''), 0);
  const rows = checkRecall(snapshot, path => read(path));
  assert.equal(rows.length, 81);
  assert.deepEqual(rows.filter(row => !row.passed), []);
  assert.ok(rows.every(row => row.floor === (row.kind === 'skill' ? 0.6 : 0.8)));
  const mutant = checkRecall(snapshot, path => path.endsWith('/playbooks/bug-fix.md') ? '# Empty\n' : read(path));
  assert.equal(mutant.find(row => row.slug === 'bug-fix').passed, false);
});
