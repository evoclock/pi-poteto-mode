# Adaptation guide: pstack 0.15.36 on Pi

This package preserves Lauren Tan's MIT-licensed pstack instruction bodies with additive Pi boundaries. It is **not an unqualified faithful port or a claim of runtime parity**. UPSTREAM.lock.json identifies the plugin version, exact source file/body hashes, and cache identity. A cache directory name is not asserted to be a Git revision.

There are 58 source skill directories, 57 registered Pi instruction skills, one planned video adaptation, and 23 full playbook files. The former compressed playbooks.md is now an index only. Source steps are copied verbatim into the session todolist before task-specific items; boundary notes and blocked/skipped reasons stay beside them, not in place of them.

## Policy divergences

These are deliberate safety choices, not missing Cursor APIs. Source quotes are evidence of the divergence, not execution permission. Table keys also identify possible recall exceptions; the current restoration needs **no below-floor recall exemptions** because it retains the source text.

| Element | Upstream quote | Deliberate Pi behavior and reason |
|---|---|---|
| playbook:shipping | “Land bottom-up, one PR at a time.” | Only the repository owner merges. Prepare independent verdicts, patch freshness and the contiguous verified ceiling, then hand off. Merge/auto-merge/retarget/force-push steps stay owner-held, not reported passed. A broad autonomy grant does not bypass this safety stance. |
| playbook:autopilot-full | “One owner carries each PR from build to merge” | Authorized build and verification work can proceed with actual Pi routes; landing remains owner-held. Do not call the whole lifecycle complete. This is not the old blanket proposal-only ban on useful implementation. |
| playbook:opening-a-pr | “Invoked at the end of every other playbook.” | Always reach the checklist/handoff, but publication is not automatic. A verified explicit task grant must cover destination, branch and outgoing content. Otherwise retain the delivery step as blocked. No skill grants a release. |
| skill:poteto-mode | “Use any MCP tool. Reversible work and external actions … proceed without asking.” | Use only accepted model/data, repository and effect scope. No automatic external messages, tool discovery, provider changes or unsupported fallbacks. Restatement, routing, verbatim todo steps and evidence discipline are retained. |
| skill:setup-pstack | “Write `~/.cursor/rules/pstack-models.mdc`” | Write only the explicitly approved project-local `.pi/pstack-model-roles.v1.json`; keep exact distinct development/reviewer identities, preserve unknown keys, no Cursor rule or Pi-default mutation. Panels, budget ladders and aliases are unsupported until separately configured. Both verification offers are retained as optional, separate steps. |
| playbook:worktree-cleanup | “Prune the confirmed set.” | Audit and preserve state until the owner confirms exact integration/disposal scope. No automatic deletion, OS scratch paths or simulator/cache purge. Dirty or active state remains held. |
| playbook:pause-safely | “Commit uncommitted edits as one clear `wip:` commit” | A pause grants no Git write. A WIP commit needs the accepted commit scope; otherwise save a durable approved repo-local checkpoint. No implicit push or new PR. |
| skill:statechart | “Work in a scratch folder outside the repo.” / “The first run installs TLC and Java with mise and needs the network.” | Use approved repo-local scratch and an already installed, approved checker. No self-installing runtime is bundled. Missing TLC/render capability is blocked, not a verified result. Diagram tooling alone is not a TLA+ proof. |
| skill:ketchup-video | “Writing and rendering the video, outside the repo, is the one exception to its read-only rule.” | Planned, not registered. No validated Pi slide/video-render-and-inspection route is supplied. Keep the source procedure for review, report the missing route, and use ketchup-pi text catch-up. Do not claim a video was made. |

Babysit stopping at merge-ready is aligned upstream, not a policy inversion. Autopilot-stack now means Autopilot-full without merging; only dependent PRs stack. Orchestrate uses the current short owner/fresh-worker/verifier/pilot/live-state contract, not the retired store/frontier/drain framework. Interrogate now runs adversaries via arena and reruns findings, without speculative finding buckets. Sharpen answers four questions and then rewrites the prompt.

## Capability mapping

| Source mechanism | Pi mapping | Missing capability result |
|---|---|---|
| Task, subagent types and cloud flags | `treehouse get --lease --json --base <verified-ref>`, then `agentic_herdr_spawn_worker` starts a Pi agent in a Herdr pane at that lease. Brief/report with `agentic_herdr_communication` prompt/delivery/read. | Block the specific missing tool, role or isolation requirement; never substitute CloudAgent or self-review. |
| TodoWrite | `TaskList`, `TaskCreate` with priority, and `TaskUpdate`; source steps word for word, then task-specific entries | Report unsupported task-tool operation; an approved local checklist may preserve the plan. |
| Cursor custom mode / always-on behavior | Source invocation flags retained; Pi skills apply when actually loaded | No always-on extension or default setting change ships. Do not infer improved firing rate from text recall. |
| AskQuestion | One plain chat question or an installed structured question tool | Ask only for an irreducible preference/permission, not an observable fact. |
| Per-role models and fallback slugs | Exact available identities from setup-pstack-pi; independent family checks when required | No default-provider, parent inheritance, seat filling or guessed fallback. Extra panel routes are explicitly configured or blocked. |
| `/loop`, background work and watchers | Bounded configured session-task exchanges through `agentic_worker_dispatch_async` submit/poll/observe/read or `agentic_worker_dispatch`; persistent wake requires a separate host event route. | No scheduler ships here. No configured wake means background watch is unsupported, not a new polling loop. |
| Browser, CLI and live verification | Approved project control surface and receipts at the actual artifact/head | Source inspection or green CI is not runtime proof. |
| Cursor transcript paths and MCP | Named active-workspace files/ranges and explicit tool/data scope | No global chat scan or automatic server discovery. |
| Upstream executable helpers and agent files | Not bundled; separately reviewed installed equivalents only | Explicit blocked helper step. Never fetch/install/run a bootstrap by implication. |
| Forge and source Origin preference | `gh repo view`, `gh pr view`, `gh pr diff`, `gh pr checks` and scoped `gh api`; approved PR delivery uses `git push` and `gh pr create`/`gh pr edit` readback | Origin is not required by this Pi mapping. No merge, auto-merge or force-push is imported. |

The three new non-video instruction ports retain code-linked properties, bounds, failure-sensitivity checks, counterexample replay and sync records. Formal verification maintenance edits verification artifacts only; current-code bugs remain findings unless a fix is separately requested. Statechart retains invariant/deadlock handling, reader-facing state/step labels, shortest bug paths, bounds and chart/report interpretation, but this package does not ship its upstream TypeScript/TLC runtime or a replacement with an unverified equivalence claim.

## Source-name and file mapping

Read skills/how/UPSTREAM_MAPPING.md and WORKFLOW_BOUNDARIES.md at the actual load location. Source skill X maps to X-pi; playbooks resolve beneath poteto-mode-pi/playbooks/. Source-relative internal references retain their layout. Upstream model defaults and command examples are visibly retained source text, **never operational Pi configuration**. Cross-skill links resolve via the mapping rather than creating duplicate unsuffixed skill directories. Supporting source prose is bundled; its executable helpers are not.

## Provenance and checks

- `node scripts/sync-upstream.mjs [local-upstream]` is read-only and defaults to the reviewed 0.15.36 Cursor cache location.
- `node scripts/restore-upstream.mjs [local-upstream]` checks deterministic restoration; `--write` explicitly regenerates the reviewed source bodies and lock. It performs no network request, install, worker dispatch or upstream mutation.
- `tests/fixtures/upstream-0.15.36.json` is the offline text baseline; it is test-only and excluded from the package. The shipped lock can be checked against an independent native source.
- `node scripts/instruction-recall.mjs` measures instruction-unit recall against that baseline: principles/playbooks >=0.8, workflow skills >=0.6. Explicit element rows in the divergence table may exempt a low recall, but exemptions are reported, not hidden. Current scores use no exemptions.
- Tests additionally require exact reconstruction of every retained skill/playbook/reference body, hash consistency, the 23 files, new contracts and manifest state. Recall alone is a diagnostic word-coverage signal, not semantic or runtime proof; exact source order plus additive-boundary review is stronger.

Concrete recipe call paths, including Shipping step 1 and Interrogate's exact reruns, are in skills/how/UPSTREAM_MAPPING.md. Pi agents in Herdr panes replace cloud workers/verifiers; leases come from Treehouse, PR state comes from gh, and source commands remain verbatim for comparison rather than serving as the executable harness path.

A discoverable skill is not proof of loading, configured roles, a live verifier, a formal proof, safe automation, or an independent review. The current branch is for native-source review before integration. No package release or corpus migration is part of this change.
