# pstack 0.15.36 restoration: native-source review handoff

Status: implementation submitted for independent native-source review, not an independent alignment verdict or release. The goal is to preserve pstack's actual procedures while making Pi-only capability and safety limits explicit, not to improve a word-overlap score by replacing instructions with summaries.

## Source and provenance

The source manifest reports 0.15.36. UPSTREAM.lock.json records its SHA-256 plus exact file/body hashes for 58 skill roots, all 23 playbooks and 29 supporting prose references. The Cursor cache identity is recorded as a cache identity, not asserted to be a Git commit. The offline test baseline contains the source text, not a corpus or model result. Existing MIT attribution remains intact.

No source executable helper, model configuration, credential, agent file or self-installing runtime is imported. Model names inside the retained source are examples, not operational Pi defaults. The package scanner verifies those blocks against locked source text before treating them as source evidence. The only home-path example permitted is the source's generic user placeholder; personal paths and secret-like tokens remain rejected.

## Restored

- 23 separate `skills/poteto-mode-pi/playbooks/<slug>.md` files. Source paragraphs, steps, nested lists, code examples and the complete plan skeleton reconstruct exactly. Pi boundary blocks are additive and never substitute for those steps.
- The source contract to copy matched playbook steps verbatim into a todolist, before task-specific tasks, retaining skipped steps with reasons. The former 95-line method map is now only an index.
- All 58 skill bodies, including the 24 principles and every lossy/partial workflow skill, restored from the same baseline. Invocation flags also match the source; no claim that Pi automatically activates the mode follows from restoration.
- Interrogate's Frame → arena adversaries → rerun verification → Output contract, with no obsolete finding buckets or automatic fixes.
- Sharpen's four questions followed by the rewritten prompt, while preserving user-held choices.
- Current orchestrate owner/fresh-worker/verifier/pilot/live-state contract, and autopilot-stack's dependent-only stacking without merge. The retired queue/store/topology text is not retained as the active procedure.
- Arena, ketchup, poteto-help, setup-pstack, reflect, swarm, TypeScript guidance, explain-the-number's before-measure instruction and the other source bodies synchronized together.
- Formal-verification creation and maintenance procedures plus statechart instructions. These three new instruction skills are registered; all 57 registered skills have Pi names. Ketchup-video is the 58th source procedure but remains planned and unregistered.

## Phase A concrete Pi remapping

The runnable Pi route is now explicit in the shared boundaries, mapping table and additive playbook notes, including Shipping step 1. Treehouse supplies leased checkouts; `agentic_herdr_spawn_worker` starts Pi agents in Herdr panes. `agentic_herdr_communication` supplies bounded prompt/delivery/read exchanges. Configured session-task roles can use `agentic_worker_dispatch_async` submit/poll/observe/read; worker pulse is read-only liveness, not a resume. TaskList/TaskCreate/TaskUpdate replace todolist operations. GitHub state and approved PR delivery use gh and git, with no required Origin or cloud agent.

Shipping's verifier is explicitly a non-author Pi agent in a Herdr pane on a Treehouse lease, running parent versus head on the real local surface. Independent roles and family constraints must actually be met. A pane, lease, green CI or delivery receipt is not a runtime verdict. Missing named tools/isolation/surface access remain specific blocked steps. Persistent wake is separately configured; a bounded dispatch tool is not misrepresented as a scheduler.

Interrogate's Pi notes now carry the exact source adversary brief, dirty-diff copying into each leased adversary checkout, exact command/observed/required output, coordinator rerun against real code, intent check, root-cause deduplication and per-adversary dropped counts/reasons. Arena C/D/E remain skipped, with no judge or chosen winning list and no applied fixes.

The resumed test run reproduced the reported setup-pstack invocation mismatch (44/45). Regeneration now derives that flag from the source frontmatter only; setup-pstack correctly has no disable flag. The new concrete-route regression and all prior tests pass (46/46). No worker, cloud agent or other model was started to implement this remapping.

## Deliberate differences and capability gaps

See adaptation-guide.md, Policy divergences, for source quotes and reasons. In particular:

- Shipping prepares verification and a landing ceiling; only the repository owner merges.
- Autopilot-full may perform granted build/verification, but landing stays owner-held and the complete upstream lifecycle must not be claimed.
- Opening a PR is always reached as a checklist/handoff. Actual publication needs an accepted destination/content grant; loading the tail is not that grant.
- Pi role lookup remains project-local with exact distinct identities, not source model defaults, inherited aliases or a Cursor rule. Extra panel routes and budget controls need explicit configuration.
- Scratch, disposal, transcript scope, MCP and external effects follow the shared Pi boundary. Missing tooling is blocked, not silently omitted or counted as passed.
- Statechart's upstream TLC/Java self-installing executable is not bundled. The new Mac adapter, skills/statechart-pi/scripts/run-tlc.mjs, detects and invokes an already installed tlc or an explicitly approved existing tools jar plus Java. It never installs and confines spec/config/output to repo scratch. A diagram is view-only, never proof. On the current Mac, detection returned blocked/exit 3: no tlc on PATH and no approved tools jar selected. A real TLC run remains unrun.
- Ketchup-video has no validated Pi slide/video render-and-inspection route. It is planned, not advertised as working; text ketchup remains available.

These differences are not hidden recall exceptions. No below-floor recall exception is used in this revision.

## Before/after instruction recall

Comparison base: `27ddbc78dec58a30321df6ccfc784edd4695f0c9`. Compare that revision's playbooks.md sections to the **same 0.15.36** source used for the restoration. Normalize headings to canonical slugs, including the historical authoring and cleanup titles. Instruction units are nontrivial paragraphs/list items; a unit counts when at least 40% of its non-stopword content terms survive, following the diagnostic implemented in scripts/instruction-recall.mjs.

| Measure across 23 playbooks | Before | After |
|---|---:|---:|
| Mean unit recall | 11.48% | 100% |
| Median unit recall | 4.55% | 100% |
| Playbooks below 50% | 21/23 | 0/23 |
| Minimum after recall | n/a | 100% |

All 81 skill/principle/playbook entries meet their floors, with a minimum observed recall of 100% and zero exemptions. Exact reconstruction tests are stronger than this word-coverage diagnostic: they also catch deletions and reordered source text. These figures do **not** measure semantic equivalence under Pi boundaries, runtime behavior, invocation/firing rate, or task quality.

## Checks performed

- Fail-first: the new alignment tests failed on absent lock/playbook/baseline files and the old review/prompt contracts before restoration.
- Package suite after premerge changes: 52 tests passed, zero failures or skips. The added adapter tests check missing-tool failure, selected-jar refusal, completed-summary classification, scratch/symlink confinement and invocation construction. These are unit tests, not a claim that TLC ran. Existing package, PR policy and wording tests remain enabled.
- Deterministic restoration check: 58 skills, 23 playbooks, zero differences on a second run.
- Sync check: source and target 0.15.36, no missing or extra source skill directories. Planned video registration is checked separately.
- Offline recall floors: >=0.8 for principles/playbooks, >=0.6 for workflow skills. A deleted-procedure mutant is rejected; all current source bodies/references reconstruct exactly and match lock hashes.
- Package whitelist/dry-run: lock and instruction assets included; tests, restoration scripts and offline baseline excluded. No install hook or dependency was added.
- Diff whitespace check passed. No package publication, automatic Pi settings change, model-provider call, independent reviewer run, live browser journey, or formal proof is claimed.

Reproduce with `npm test`, `node scripts/instruction-recall.mjs`, `node scripts/sync-upstream.mjs <native-source>`, and `node scripts/restore-upstream.mjs <native-source>`. The restoration checker is read-only unless `--write` is supplied. The source corpus/taxonomy pipeline is not required to run these tests.

## Premerge review gate

Opening a PR now has concrete Treehouse/Herdr notes even for its unnumbered worktree/Task paragraphs; git reset --hard is explicitly blocked there. Pi review defaults to draft and the live-Pi gate overrides the source ready-only rule. Shipping step 1's independent verifier note is unchanged. Step 3 now specifies recorded/current base-head patch-id comparison and re-verification. Step 4 explicitly blocks merge/auto-merge/retarget/force-with-lease operations. Step 5 explicitly marks /loop and watch-pr unsupported rather than claiming a persistent watcher.

Live smoke was attempted after the premerge code was committed and pushed at `e17cd4be6dfb0f7dab2b3ac80803a6a5f0e3fc67`. **Overall result: BLOCKED. Keep draft; do not mark ready or merge.**

The routing subcheck passed in a fresh real Pi 1.4.0 JSON session with discovered skills disabled and this lease's poteto-mode resource explicitly supplied. The organic explanation request did not name a playbook. Observed tool calls read the leased poteto-mode, boundaries/mapping, Investigation, how and unslop; then ran the actual installed-only detector. It returned blocked/exit 3, and the session explained that a diagram is not proof. The session exited zero and made no source edits. This establishes live routing, not full procedure compliance or a formal proof.

For the second subcheck, a separate Treehouse lease at that pushed branch was acquired and a guarded Pi/Herdr worker start attempted. The route refused because this repository is not enabled in its trusted registry. No worker pane or delivery was created, and no registration, parked-pane reuse or bypass was attempted. Thus the required Treehouse-to-Herdr round trip is not demonstrated. The smoke lease is preserved for reconciliation.

The installed-only TLC route is wired and unit-tested, but no tlc on PATH or approved tools jar was selected on this Mac; no actual model-checker pass exists. Bounded known-location searches found no candidate, not proof that none exists anywhere. This remains a separate runtime gap.

Raw commands, session/tool events, lease metadata, pane/delivery null results and the refusal are retained only in ignored `.scratch/premerge-smoke-summary.json`, `.scratch/premerge-live-routing.jsonl`, `.scratch/premerge-herdr-result.json`, `.scratch/premerge-smoke-lease.json` and `.scratch/premerge-tlc.json`. No private session transcript or host identifier is committed. Static tests/source recall and a successful routing subcheck do not override the blocked overall live gate.

## Independent review requested

Compare the exact PR head to native Cursor pstack 0.15.36. Inspect the source hashes independently, then inspect whether the additive Pi boundary notes preserve each decision/ordering requirement without accidentally granting Cursor commands, model fallbacks or irreversible effects. In particular review source-name resolution for nested references, explicit invocation flags, automatic PR-tail versus publication gating, and the distinction between an instruction port and an executable statechart/video route.

The implementation is not self-certified as a faithful runtime port. Corpus re-pinning, taxonomy parser changes and skill-overlay ledger migration are separate follow-ups after this adaptation is reviewed; they are deliberately unchanged here.
