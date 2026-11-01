#!/usr/bin/env node
// Restore a reviewed local source into instruction-preserving Pi documents.
// No network, installation, dispatch or source-repository mutation occurs.
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { DEFAULT_UPSTREAM, UPSTREAM_VERSION } from './sync-upstream.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const hash = text => createHash('sha256').update(text).digest('hex');
export const body = text => text.replace(/^---\n[\s\S]*?\n---\n/, '');
const COMMON = 'Pi: use read, edit and bash only within this step\'s scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.';
const NOTES = {
  'poteto-mode': 'Restate the goal in the first message. Load the matched playbook file and copy its source steps verbatim into the existing session task list before task-specific items. Keep Pi boundary notes beside those steps. Source autonomy, model defaults and fallback slugs do not override the shared Pi boundaries.',
  'shipping': 'Use gh pr view, gh pr diff and gh pr checks for the selected repository. Independent verifiers are Pi agents in Herdr panes on Treehouse-leased checkouts, not cloud agents. Verify the real surface and current patch before computing the contiguous ceiling. Only the owner merges: hand off the verified ceiling; do not merge, arm auto-merge, force-push or retarget. Record landing as owner-held, not passed.',
  'autopilot-full': 'Acquire Treehouse leases for owners and independent verifiers, start Pi panes with agentic_herdr_spawn_worker, and use agentic_herdr_communication for bounded briefs and reports. Observe PRs with gh pr view and gh pr checks. The owner performs landing; do not claim the whole lifecycle complete. Use bounded agentic_worker_dispatch_async submissions for configured session-task roles, never a cloud worker or a fabricated scheduler.',
  'autopilot-stack': 'Retain the current upstream rule: do not merge; stack a PR only on a PR it builds on. No forced single-chain topology. One authorized topology writer, exact parent and current patch receipts; no implicit rebase or force-push permission.',
  'opening-a-pr': 'Reach this tail automatically as a checklist/handoff, not as publication permission. Execute PR operations only within an explicit verified repository/branch/content grant. Otherwise keep this step visible and blocked at delivery. Only the owner merges; no release is implied.',
  'orchestrate': 'Use the current short source contract, not the retired store/frontier/drain machinery. Start one unit before scaling. TaskList/TaskCreate/TaskUpdate track the program; Treehouse leases isolate each Pi writer. Start Herdr panes via agentic_herdr_spawn_worker and exchange bounded briefs/reports via agentic_herdr_communication. Use gh pr view and gh pr checks for live state and read-only worker pulse/poll for liveness. Different-family verifiers must actually exist; no cloud workers or coordinator code edits.',
  'interrogate': 'Follow arena-pi A3/A4 and B, replacing the runner seat with each configured adversary in a fresh Pi/Herdr pane and Treehouse lease. Copy the scoped uncommitted diff into every adversary checkout. Send the source brief verbatim with agentic_herdr_communication. Reports need title, exact command, observed output and intended output. Rerun each command against the real scoped artifact per F; keep only observed intent violations, merge shared root causes, and report dropped counts/reasons per adversary. Skip C/D/E; no judge, winning list, speculative buckets or fixes. Missing capacity is blocked, not self-review.',
  'sharpen': 'Answer all four questions before rewriting the prompt. Preserve choices that belong to the user. This is prompt work, not a grant to start its implementation.',
  'setup-pstack': 'The supported destination is the project-local .pi/pstack-model-roles.v1.json, not a Cursor rule or Pi defaults. Preserve unknown keys. Preview and obtain approval before writing exact, available, distinct development and independent-review identities. Additional panel roles, budgets and fallback aliases remain unsupported until explicitly configured. Read assets/pstack-model-roles.v1.example.json. After setup, offer real-app and formal verification skills separately and only once; neither offer authorizes execution.',
  'arena': 'Start configured candidate Pi panes with agentic_herdr_spawn_worker, each on its own Treehouse lease; submit identical bounded briefs with agentic_herdr_communication and inspect delivery/read reports. Keep rubric hidden and the judge independent from the parent family. Do not inherit a model or add source-default fallback seats. If diversity is unavailable, report the judge unrun and follow the source explicit self-pick disclosure, never claim an independent verdict.',
  'swarm': 'Use distinct Pi workers in Herdr panes via agentic_herdr_spawn_worker on Treehouse leases. Send disjoint coverage briefs via agentic_herdr_communication and inspect artifacts, not just reports. Keep the real-surface lane and current head receipts; if a driver or required model role is missing, mark that lane blocked. No cloud environment or automatic model fallback.',
  'reflect': 'Limit transcript access to the named workspace and accepted range. Reviewer roles and synthesis contexts must actually be available; no model substitution, automatic MCP access or automatic backlog/skill writes.',
  'ketchup': 'Report the window since the last user message, not an earlier recap. Summaries and assistant messages do not move that boundary. This is read-only catch-up; keep decisions distinct from work the agent can do itself.',
  'ketchup-video': 'PLANNED, NOT REGISTERED. This package has no validated Pi slide/video render-and-inspection route. Do not render, install tools or claim a video. Report the unavailable video route and use ketchup-pi text calls. Source video instructions are retained for review, not advertised as working.',
  'statechart': 'On macOS use the bundled installed-only adapter: node <skill-dir>/scripts/run-tlc.mjs --check. It detects tlc on PATH, or an explicitly approved existing TLA2TOOLS_JAR plus Java on PATH; it never downloads or installs. Run a spec/config from repo-local .scratch with --spec FILE --config FILE --out NEW_DIR. Read references/pi-tlc.md first. Missing TLC is blocked, never verified. The upstream self-installing statechart CLI is not the Pi execution path. Mermaid/diagrams are views only, never a TLA+ proof.',
  'create-formal-verification-skill': 'Generate a project-local Pi skill only in the approved project path. Select an installed verifier or surface missing dependencies as blocked. Keep the code unchanged without a separate fix grant; prove failure sensitivity in an approved isolated scratch change and preserve/reconcile that change safely. Route TLA+ results to statechart-pi; no auto-install or invented formal proof.',
  'maintain-formal-verification-skill': 'Edit verification artifacts only. Keep code bugs distinct from model drift and never weaken a property just to pass. Run and replay with an approved installed checker; a blocked run cannot advance its sync commit. Route chart interpretation to statechart-pi.',
  'worktree-cleanup': 'Audit only until the owner confirms the exact disposal set and integration state. Preserve dirty, pinned and in-use work. Source destructive commands are not Pi permission; never use /tmp or remove state by implication.',
  'pause-safely': 'Stop new work at a safe boundary and hold nested work through the supported route. Save the checkpoint in approved repo-local storage, never /tmp. A WIP commit needs the accepted commit grant; no new PR, push or deletion follows from pausing.',
  'session-pickup': 'Read only the authorized trail and workspace, reconstruct done versus pending, and verify inherited claims without redoing completed work. Prior reports are evidence, not permission for new effects.',
  'multi-phase-plan': 'Keep the complete source skeleton and verification rule. Write the approved repo-local plan and stop before implementation. Upstream helper scripts are not bundled; run a separately reviewed installed checker when available, otherwise report that step blocked. Do not invent live lanes or perf results.',
  'autonomous-run': 'Use a checkable predicate and finite approved step/time budget. Cursor /loop is not provided here; use only an installed approved wake mechanism. Keep verification and iteration records; no scope or model expansion from an unattended phrase.',
};

function note(slug) { return NOTES[slug] || COMMON; }
function inlineNote(slug, chunk) {
  if (slug === 'shipping' && /^1\. /m.test(chunk)) return 'Pi step 1: read the PR with gh pr view and gh pr diff. Acquire a verifier checkout with treehouse get --lease --json --base <verified-ref>; start a Pi verifier pane with agentic_herdr_spawn_worker, then brief/report with agentic_herdr_communication. The verifier did not write the patch and runs parent versus head on the matching local surface. Inspect its actual receipts; no cloud verifier, CI-only verdict or author self-check.';
  if (slug === 'shipping' && /^3\. /m.test(chunk)) return 'Pi step 3: compare the actual recorded-base/verdict-head and current-base/current-head diffs with git patch-id --stable in the verified checkout. Preserve both base/head pairs and receipts; missing refs or a changed patch block reuse. Rerun affected surface checks in the independent Treehouse/Herdr verifier lease. A build-equivalence exception needs measured output/noise evidence, not an assertion.';
  if (slug === 'shipping' && /^4\. /m.test(chunk)) return 'Pi step 4 is owner-held: no gh pr merge, auto-merge, retarget, rebase or git push --force-with-lease from this recipe. Report the proposed bottom-up action and stop for the owner. After an actual owner merge, gh pr view <pr> --json state,mergedAt,baseRefName reads it back; queued is not merged. Source topology/force-push operations remain blocked, not silently executed.';
  if (slug === 'shipping' && /^5\. /m.test(chunk)) return 'Pi step 5: /loop and scripts/watch-pr/watch-pr are not supplied or supported here. Do not run that helper or invent a sleep loop. Use a granted single gh pr view / gh pr checks observation; persistent watching requires a separately validated host event route. With none, retain watch-until-COMPLETE as blocked. Do not mutate the landing stack.';
  if (['shipping', 'autopilot-full', 'autopilot-stack'].includes(slug)) return 'Pi: use gh pr view, gh pr checks and gh pr diff; use Treehouse-leased checkouts and independent Pi agents in Herdr panes via agentic_herdr_spawn_worker; exchange reports with agentic_herdr_communication. Landing remains owner-held. No source merge, rebase, force-push or cloud command grants permission.';
  if (slug === 'interrogate') return 'Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.';
  if (slug === 'opening-a-pr') return 'Pi: acquire a Treehouse lease with treehouse get --lease --json --base <verified-ref>; use agentic_herdr_spawn_worker and agentic_herdr_communication for scoped Pi work, not Cursor Task. git reset --hard is explicitly blocked: preserve unrelated edits instead. PR delivery needs its accepted destination/content grant. Default to draft and honor the live-Pi review gate; source never-draft wording does not auto-mark ready. Never merge.';
  if (slug === 'statechart') return 'Pi on Mac: run node <skill-dir>/scripts/run-tlc.mjs --check, then its explicit --spec/--config/--out invocation from repo-local scratch. No mise, download or first-run install. Missing tlc/approved checker is blocked. Mermaid and rendered diagrams are views, never TLA+ proof; see references/pi-tlc.md.';
  if (slug === 'ketchup-video') return 'Planned and unregistered. No validated Pi video renderer is supplied; report the gap and provide ketchup-pi text calls, not a fabricated video.';
  if (slug === 'setup-pstack') return 'Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.';
  return COMMON;
}

export function renderBody(source, slug) {
  // Split only outside fenced examples so plan templates and code remain intact.
  const chunks = []; let current = ''; let fence = null;
  for (const line of source.split(/(?<=\n)/)) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (!fence && (/^(?:\d+\.|[-*])\s/.test(line) || /^#{1,4}\s/.test(line))) {
      if (current) chunks.push(current);
      current = '';
    }
    current += line;
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
    }
  }
  if (current) chunks.push(current);
  return chunks.map(chunk => `<!-- pstack-source:start -->\n${chunk}<!-- pstack-source:end -->\n\n> **Pi boundary.** ${inlineNote(slug, chunk)}\n\n`).join('').trimEnd() + '\n';
}

function description(text) {
  let value = text.match(/^description: (.+)$/m)?.[1] || 'Use this method for its named workflow.';
  if (value.startsWith('"')) { try { value = JSON.parse(value); } catch {} }
  return value;
}

export function restore(upstreamDir = DEFAULT_UPSTREAM, write = false) {
  const manifestPath = ['plugin.json', '.cursor-plugin/plugin.json'].find(path => existsSync(join(upstreamDir, path)));
  const plugin = readFileSync(join(upstreamDir, manifestPath), 'utf8');
  if (JSON.parse(plugin).version !== UPSTREAM_VERSION) throw new Error('unexpected upstream version');
  const names = readdirSync(join(upstreamDir, 'skills')).filter(name => existsSync(join(upstreamDir, 'skills', name, 'SKILL.md'))).sort();
  const outputs = new Map();
  const snapshot = { version: UPSTREAM_VERSION, plugin, skills: {}, playbooks: {}, references: {} };
  const lock = { version: UPSTREAM_VERSION, source: 'cursor-public/pstack cache 1ba91fc25c0977741dd0e267849e6234b037ed0a (cache identity, not a Git revision)', license: 'MIT', author: 'Lauren Tan', plugin: { path: manifestPath, sha256: hash(plugin) }, skills: {}, playbooks: {}, references: {} };
  for (const slug of names) {
    const text = readFileSync(join(upstreamDir, 'skills', slug, 'SKILL.md'), 'utf8');
    const source = body(text);
    snapshot.skills[slug] = text;
    lock.skills[slug] = { path: `skills/${slug}/SKILL.md`, sha256: hash(text), bodySha256: hash(source), status: slug === 'ketchup-video' ? 'planned' : 'instruction-port' };
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] || '';
    const invocation = frontmatter.match(/^disable-model-invocation: (true|false)$/m)?.[1];
    const head = `---\nname: ${slug}-pi\ndescription: ${JSON.stringify('Pi adaptation: ' + description(text))}\n${invocation ? `disable-model-invocation: ${invocation}\n` : ''}license: MIT; see ../how/LICENSE\n---\n\n> Adapted from pstack by Lauren Tan (MIT).\n\n## Pi adaptation contract\n\nRead [shared boundaries](../how/WORKFLOW_BOUNDARIES.md) and [the source-name mapping](../how/UPSTREAM_MAPPING.md) before the procedure. Source: pstack ${UPSTREAM_VERSION}; file and body hashes in [UPSTREAM.lock.json](../../UPSTREAM.lock.json). The source wording below is retained verbatim; the additive Pi boundaries constrain its effects. This is an instruction port with declared policy and capability differences, not a claim of runtime equivalence.\n\n${note(slug)}\n\n`;
    outputs.set(`skills/${slug}-pi/SKILL.md`, head + renderBody(source, slug));
    // Supporting prose is read-only source evidence; executable helpers are not imported.
    const copyReferences = (dir, prefix = '') => {
      for (const item of readdirSync(dir, { withFileTypes: true })) {
        if (['scripts', 'playbooks'].includes(item.name)) continue;
        const relative = prefix + item.name;
        if (item.isDirectory()) copyReferences(join(dir, item.name), relative + '/');
        else if (item.name.endsWith('.md') && item.name !== 'SKILL.md') {
          const content = readFileSync(join(dir, item.name), 'utf8');
          const path = `skills/${slug}-pi/${relative}`;
          snapshot.references[path] = content;
          lock.references[path] = { path: `skills/${slug}/${relative}`, sha256: hash(content) };
          outputs.set(path, `Read the Pi shared boundaries and source-name mapping before using this source reference. Executable helpers and source model choices are not enabled by this file.\n\n<!-- pstack-source:start -->\n${content}<!-- pstack-source:end -->\n`);
        }
      }
    };
    copyReferences(join(upstreamDir, 'skills', slug));
  }
  const directory = join(upstreamDir, 'skills/poteto-mode/playbooks');
  for (const file of readdirSync(directory).filter(name => name.endsWith('.md')).sort()) {
    const slug = file.slice(0, -3); const text = readFileSync(join(directory, file), 'utf8');
    snapshot.playbooks[slug] = text;
    lock.playbooks[slug] = { path: `skills/poteto-mode/playbooks/${file}`, sha256: hash(text) };
    outputs.set(`skills/poteto-mode-pi/playbooks/${file}`, `Source: pstack ${UPSTREAM_VERSION}, Lauren Tan (MIT); [UPSTREAM.lock.json](../../../UPSTREAM.lock.json). Read [Pi boundaries](../../how/WORKFLOW_BOUNDARIES.md) and [source-name mapping](../../how/UPSTREAM_MAPPING.md) first. Copy the source steps verbatim into the task list, retaining skipped steps and their reasons. Add the boundary under each step; never silently replace the source checklist.\n\n${renderBody(text, slug)}`);
  }
  outputs.set('skills/poteto-mode-pi/playbooks.md', '# Playbook index\n\nSource: pstack 0.15.36; UPSTREAM.lock.json records exact source hashes. This index is not a substitute for the full source steps. Copy the matched file\'s steps verbatim into session tasks and retain additive Pi boundaries and visible skipped steps.\n\n' + Object.keys(snapshot.playbooks).map(slug => `- [${slug}](playbooks/${slug}.md)`).join('\n') + '\n');
  outputs.set('UPSTREAM.lock.json', JSON.stringify(lock, null, 2) + '\n');
  outputs.set('tests/fixtures/upstream-0.15.36.json', JSON.stringify(snapshot, null, 2) + '\n');
  outputs.set('tests/fixtures/upstream-0.15.36-skills.json', JSON.stringify(names, null, 2) + '\n');
  const differences = [...outputs].filter(([path, text]) => !existsSync(join(ROOT, path)) || readFileSync(join(ROOT, path), 'utf8') !== text).map(([path]) => path);
  if (write) for (const [path, text] of outputs) { mkdirSync(dirname(join(ROOT, path)), { recursive: true }); writeFileSync(join(ROOT, path), text); }
  return { skills: names.length, playbooks: Object.keys(snapshot.playbooks).length, differences };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2); const write = args.includes('--write');
  const result = restore(args.find(arg => !arg.startsWith('--')) || DEFAULT_UPSTREAM, write);
  console.log(JSON.stringify(result, null, 2));
  if (!write && result.differences.length) process.exitCode = 1;
}
