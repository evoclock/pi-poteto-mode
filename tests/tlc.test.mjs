import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, realpathSync, writeFileSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const helper = new URL('../skills/statechart-pi/scripts/run-tlc.mjs', import.meta.url);
async function api() {
  assert.ok(existsSync(helper), 'installed-only TLC helper must exist');
  return import(helper.href);
}

test('missing TLC fails closed without running or installing anything', async () => {
  // Why: a missing executable must never become a verified statechart.
  const { detectChecker } = await api();
  assert.deepEqual(detectChecker({ path: '', jar: '' }), { status: 'blocked', reason: 'No tlc on PATH and no approved TLA2TOOLS_JAR selected.' });
});

test('an explicitly selected missing jar cannot silently fall back', async () => {
  // Why: a configured checker is a specific tool choice, not permission to substitute one.
  const { detectChecker } = await api();
  const result = detectChecker({ path: '', jar: '/nonexistent/selected-tools.jar' });
  assert.equal(result.status, 'blocked');
  assert.match(result.reason, /selected jar/);
});

test('only a completed TLC no-error summary counts as a checked model', async () => {
  // Why: a zero exit or a rendered Mermaid view alone is not model-checking evidence.
  const { classifyResult } = await api();
  assert.equal(classifyResult({ status: 0, stdout: 'graph rendered', stderr: '' }).status, 'blocked');
  assert.equal(classifyResult({ status: 0, stdout: 'Model checking completed. No error has been found.', stderr: '' }).status, 'checked-no-errors');
  assert.equal(classifyResult({ status: 12, stdout: 'Invariant Safety is violated.', stderr: '' }).status, 'failed');
  assert.equal(classifyResult({ status: null, error: { code: 'ETIMEDOUT' }, stdout: '', stderr: '' }).status, 'blocked');
});

test('scratch inputs and output stay inside the real repository scratch directory', async () => {
  // Why: neither path traversal nor symlinks may redirect checker writes outside repo scratch.
  const { scratchPath } = await api();
  const root = mkdtempSync(join(tmpdir(), 'tlc-path-'));
  mkdirSync(join(root, '.scratch'));
  writeFileSync(join(root, '.scratch', 'Spec.tla'), '---- MODULE Spec ----\n====\n');
  // macOS temporary roots can be aliases; scratchPath returns canonical paths.
  const realRoot = realpathSync(root);
  assert.equal(scratchPath(root, '.scratch/Spec.tla', true), join(realRoot, '.scratch', 'Spec.tla'));
  assert.equal(scratchPath(root, '.scratch/new-result'), join(realRoot, '.scratch', 'new-result'));
  assert.throws(() => scratchPath(root, '../outside'), /scratch/);
  const outside = realpathSync(mkdtempSync(join(tmpdir(), 'tlc-outside-')));
  symlinkSync(outside, join(root, '.scratch', 'escape'));
  assert.throws(() => scratchPath(root, '.scratch/escape/result'), /scratch/);
});

test('TLC invocation has one worker, explicit config and local metadata path', async () => {
  // Why: the Mac execution path must be concrete and must not call a bootstrap installer.
  const { invocation } = await api();
  const command = invocation({ executable: '/opt/approved/tlc', prefix: [] }, '/repo/.scratch/Spec.tla', '/repo/.scratch/Spec.cfg', '/repo/.scratch/run');
  assert.deepEqual(command, { executable: '/opt/approved/tlc', args: ['-workers', '1', '-config', '/repo/.scratch/Spec.cfg', '-metadir', '/repo/.scratch/run/meta', '/repo/.scratch/Spec.tla'] });
});
