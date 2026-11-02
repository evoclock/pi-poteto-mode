#!/usr/bin/env node
// Invoke an already installed TLC. No downloads, installs or diagram-as-proof fallback.
import { accessSync, constants, existsSync, statSync, realpathSync, mkdirSync, writeFileSync } from 'node:fs';
import { delimiter, resolve, dirname, relative, join, isAbsolute } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function executable(name, path) {
  for (const directory of path.split(delimiter).filter(Boolean)) {
    const candidate = resolve(directory, name);
    try {
      if (statSync(candidate).isFile()) {
        accessSync(candidate, constants.X_OK);
        return realpathSync(candidate);
      }
    } catch {}
  }
  return null;
}

export function detectChecker({ path = process.env.PATH || '', jar = process.env.TLA2TOOLS_JAR || '' } = {}) {
  if (jar) {
    if (!existsSync(jar) || !statSync(jar).isFile()) return { status: 'blocked', reason: 'The selected jar does not exist as a regular file.' };
    const java = executable('java', path);
    if (!java) return { status: 'blocked', reason: 'The selected jar requires an already installed Java on PATH.' };
    return { status: 'available-not-run', executable: java, prefix: ['-cp', realpathSync(jar), 'tlc2.TLC'] };
  }
  const tlc = executable('tlc', path);
  return tlc ? { status: 'available-not-run', executable: tlc, prefix: [] }
    : { status: 'blocked', reason: 'No tlc on PATH and no approved TLA2TOOLS_JAR selected.' };
}

function within(root, path) {
  const rel = relative(root, path);
  return rel !== '' && rel !== '..' && !rel.startsWith('../') && !isAbsolute(rel);
}

export function scratchPath(repository, input, mustExist = false) {
  const root = realpathSync(repository);
  const scratch = join(root, '.scratch');
  if (!existsSync(scratch) || realpathSync(scratch) !== scratch) throw new Error('Create a real repo-local .scratch directory first; symlink scratch is forbidden.');
  const candidate = resolve(root, input);
  if (!within(scratch, candidate)) throw new Error('Path must be beneath repo-local .scratch.');
  let ancestor = candidate;
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  const actual = resolve(realpathSync(ancestor), relative(ancestor, candidate));
  if (!within(scratch, actual)) throw new Error('Resolved path escapes repo-local .scratch.');
  if (mustExist && (!existsSync(actual) || !statSync(actual).isFile())) throw new Error('Expected an existing scratch input file.');
  return actual;
}

export function invocation(checker, spec, config, out) {
  return { executable: checker.executable, args: [...checker.prefix, '-workers', '1', '-config', config, '-metadir', join(out, 'meta'), spec] };
}

export function classifyResult(result) {
  if (result.error || result.status === null) return { status: 'blocked', reason: result.error?.code || 'Checker did not finish.' };
  const output = (result.stdout || '') + '\n' + (result.stderr || '');
  if (result.status !== 0) return { status: 'failed', reason: 'TLC returned a nonzero exit; inspect tlc.out and replay any counterexample.' };
  if (!/Model checking completed\. No error has been found\./.test(output)) return { status: 'blocked', reason: 'No completed TLC no-error summary; exit zero alone is not proof.' };
  return { status: 'checked-no-errors', reason: 'Only the supplied model, bounds and assumptions were checked; diagrams are views, not proof.' };
}

export function run(args = process.argv.slice(2)) {
  const checker = detectChecker();
  if (args.length === 1 && args[0] === '--check') return { ...checker, exit: checker.status === 'blocked' ? 3 : 0 };
  if (checker.status === 'blocked') return { ...checker, exit: 3 };
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    if (!['--spec', '--config', '--out', '--timeout-seconds'].includes(key) || !args[index + 1] || options[key]) throw new Error('Use --check, or --spec FILE --config FILE --out NEW_DIR [--timeout-seconds 60].');
    options[key] = args[index + 1];
  }
  if (!options['--spec'] || !options['--config'] || !options['--out']) throw new Error('Spec, config and a new output directory are required.');
  const seconds = Number(options['--timeout-seconds'] || 60);
  if (!Number.isFinite(seconds) || seconds < 1 || seconds > 300) throw new Error('Timeout must be between 1 and 300 seconds.');
  const repository = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const spec = scratchPath(repository, options['--spec'], true);
  const config = scratchPath(repository, options['--config'], true);
  const out = scratchPath(repository, options['--out']);
  if (existsSync(out)) throw new Error('Output must be new; previous evidence is never overwritten.');
  mkdirSync(dirname(out), { recursive: true });
  mkdirSync(out);
  mkdirSync(join(out, 'meta'));
  const command = invocation(checker, spec, config, out);
  const execution = spawnSync(command.executable, command.args, { cwd: dirname(spec), encoding: 'utf8', timeout: seconds * 1000, maxBuffer: 4 * 1024 * 1024 });
  const result = { ...classifyResult(execution), command, checkerExit: execution.status, timeoutSeconds: seconds, evidence: relative(repository, out), scope: 'Supplied TLA+ model/config only; not product-code correctness or a diagram proof.' };
  writeFileSync(join(out, 'tlc.out'), (execution.stdout || '') + '\n' + (execution.stderr || ''));
  writeFileSync(join(out, 'result.json'), JSON.stringify(result, null, 2) + '\n');
  return { ...result, exit: result.status === 'checked-no-errors' ? 0 : result.status === 'failed' ? 1 : 3 };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const result = run();
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.exit;
  } catch (error) {
    console.log(JSON.stringify({ status: 'blocked', reason: error.message, exit: 3 }));
    process.exitCode = 3;
  }
}
