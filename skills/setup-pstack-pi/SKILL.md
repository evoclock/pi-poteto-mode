---
name: setup-pstack-pi
description: "Pi adaptation: Configure exact model roles, native reasoning budgets and multi-seat panels. Detects available Pi models, previews, and writes only approved selections to project-local .pi/pstack-model-roles.v1.json (no package defaults). Use for /setup-pstack, \"configure pstack models\", \"pstack budget\", or panel choices."
license: MIT; see ../how/LICENSE
---

> Adapted from pstack by Lauren Tan (MIT).

## Pi adaptation contract

Read [shared boundaries](../how/WORKFLOW_BOUNDARIES.md) and [the source-name mapping](../how/UPSTREAM_MAPPING.md) before the procedure. Source: pstack 0.15.36; file and body hashes in [UPSTREAM.lock.json](../../UPSTREAM.lock.json). The source wording below is retained verbatim; the additive Pi boundaries constrain its effects. This is an instruction port with declared policy and capability differences, not a claim of runtime equivalence.

The supported destination is the project-local .pi/pstack-model-roles.v1.json, not a Cursor rule or Pi defaults.

- Preserve unknown keys. Load existing project-local choices only; if absent, start from assets/pstack-model-roles.v1.example.json with null/null roles, never the source defaults.
- Detect available exact Pi identities, preview the selections and obtain operator approval before writing development and independent-review. Never infer a selection from the parent session, a source slug, a budget ladder or an alias.
- Missing or null roles block role-dependent work until the operator selects an available identity.
- The operator may select the same identity for both roles. Recording that choice does not satisfy a review step that requires a different model or family. Report that review blocked; never silently substitute another identity.
- Budget and panel roles are supported through the v1 format below. Fallback aliases remain unsupported; absent seats block rather than inheriting the parent or a core role.
- After setup, offer real-app and formal verification skills separately and only once; neither offer authorizes execution.

## Pi budget and panel setup

Keep schema `pstack-model-roles.v1`; no migration is required for existing flat role keys. The example file remains the two null core roles, with no preselected budget or panels.

| Field | Shape and use |
|---|---|
| `roles.development`, `roles.independent-review` | Exact available identity strings selected by the operator |
| `roles["arena runners"]` | Ordered nonempty list; one candidate per entry |
| `roles["arena cross-judge pool"]` | Ordered nonempty list; select one eligible judge, not one per entry |
| `roles["architect runners"]` | Ordered nonempty list; one runner per entry |
| `roles["interrogate reviewers"]` | Ordered nonempty list; one adversary per entry; no arena pick/graft |
| `roles["swarm workers"]` | Scalar default worker identity; an explicitly approved race arm may override it |
| `budget` | Object with `label` and `effort`; preserve additional keys |

Budget choices retain upstream labels: `unlimited` → `max`, `large` → `xhigh`, `medium` → `high`, `small` → `medium`. These are native Pi reasoning levels, never model-slug suffixes. Ask for the label, preview its effort and all selected identities, then obtain approval. Do not preselect a budget. Apply the approved effort to each worker session through a supported installed Pi reasoning control; the spawn model identity stays unchanged. Pi's native `/thinking` picker selects the level for the current session without saving a startup default; trusted launch routes may use `--thinking <effort>` only if they actually expose it. Do not invent a thinking field on agentic_herdr_spawn_worker or drive a pane through raw terminal commands. Inspect the worker's effective level before work: Pi can clamp unsupported levels, which is not an accepted budget match. If a model or installed worker route cannot honor that effort, block the affected step and ask for a new explicit selection. Never downgrade silently or claim the effort was applied merely because it is stored.

Use `scripts/model-roles.mjs` from this skill for pure validation: `previewSetup(current, selections, available)` returns the complete proposed document; `roleModels(config, role, available)` returns the ordered seats (a scalar becomes one seat); `budgetSetting(config)` validates the label/effort pair. `available` is the exact identity list detected from the installed Pi `/model` picker or `pi --list-models` in this session, not from package text or a guessed provider list. The helper performs no writes, discovery, spawning or authorization. On a new setup, load the null/null example as `current`. Preview the returned document, obtain operator approval, then write only that document to project-local `.pi/pstack-model-roles.v1.json` with the ordinary approved file-edit route. Reread it and validate again. Retain unknown top-level, role and budget keys; do not rewrite either example file or global settings.

Panel lists preserve order and duplicates: one seat per entry, not one per unique model. Recheck availability at execution. A missing panel must not reuse `development` or `independent-review`. For the cross-judge pool, test entries in order against the parent identity/family and run only the first eligible judge. Different model families may share a provider; use verified model-family information or operator-confirmed family groups, never provider-name equality or inferred slug substrings. Where the operator explicitly designates two available model families as the Pi stand-in, use that designation for the scoped gate without embedding those identities in the package. If family identity, diversity, capacity or reasoning control cannot be verified, keep the affected phase blocked/unrun and retain any source-required disclosure.

<!-- pstack-source:start -->

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
# Setup pstack

Write `~/.cursor/rules/pstack-models.mdc`, an always-applied rule that sets pstack's model per role.

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
## Steps

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
### 1. Detect available models

Enumerate the model slugs you can pass to a `Task` subagent in this session. That is the dependable source. If Cursor also exposes a models API or CLI that lists the user's entitled models, prefer it for completeness. If you cannot detect any, ask the user to paste the slugs they have access to. Never write a real slug you have not confirmed is available. The aliases `inherit-parent` and `auto` are always valid even though they are not detected slugs.

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
### 2. Load current state

The default role-to-model mapping is the rule shape shown in step 5 below. If `~/.cursor/rules/pstack-models.mdc` already exists, read it and treat its `# budget` line and its role values as the current choices. Otherwise start from those defaults. A line whose role is not in step 5, such as `how critics`, is from a retired role. Drop it.

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
### 3. Budget, map, and confirm

**(a) Ask for a budget.** Prefer AskQuestion over free text. Offer these four options with these exact labels, and name the current budget when the rule records one. With no rule, say that `large` matches the skill defaults.

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
- `unlimited — max reasoning`
<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
- `large — xhigh reasoning`
<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
- `medium — high reasoning`
<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
- `small — medium reasoning`

**(b) Apply it.** Build the working table from the skill defaults, and on a re-run keep any role you changed by family, list, or alias (`inherit-parent`, `auto`). `unlimited`, `large`, `medium`, and `small` set the effort token of every real slug, panel entries included, to `max`, `xhigh`, `high`, or `medium`. The effort token is the last token, or the one before a trailing `fast`, on the ladder `max` > `xhigh` > `high` > `medium` > `low`. If the result is not a detected slug, use the same family's detected slug with the highest effort at or below the target, else mark the role as needing a choice. `inherit-parent` and `auto` do not change. So `unlimited` turns `claude-opus-5-5-xhigh` into `claude-opus-5-5-max`. Grok slugs top out at `xhigh`, so under `unlimited` the fallback puts Grok at `xhigh` and keeps `grok-4.7-xhigh-fast` as it is. `large` keeps both defaults. `small` turns them into `claude-opus-5-5-medium` and `grok-4.7-medium-fast`.

**(c) Show the roles and confirm.** Show every role with its model, marking any real slug not in the detected set as needing a choice. Also list each line step 2 dropped. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit-parent` and `auto` (both mean: this role runs on the parent chat model, which is how Auto users stay on Auto) as the options. Prefer AskQuestion over free text. For panel roles (arena runners, architect runners, interrogate reviewers) the value is a list, and one subagent runs per entry, alias entries included, so the list length sets the count. `arena cross-judge pool` is also a list, but Arena runs one judge. It tries only values from a family other than the parent's, in list order, so order it by preference. An `inherit-parent` or `auto` value never judges. `swarm workers` is the default model for every worker unless a race or comparison assigns another model per arm.

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
### 4. Validate

Every real slug written must be in the detected set. `inherit-parent` and `auto` always pass. If a chosen real slug is not available, stop and ask again.

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
### 5. Write the rule

Write `~/.cursor/rules/pstack-models.mdc` with `alwaysApply: true`, a `# budget` line with the chosen label and its target effort, and one line per role, using the same labels poteto-mode uses. Overwrite the whole file so re-runs stay idempotent. Shape:

```
---
description: pstack per-role model choices (overrides skill defaults)
alwaysApply: true
---
# pstack model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat model (omit Task `model`). Alias entries in a panel list still count toward its fan-out.
# budget: large (xhigh)
feature, refactoring: grok-4.7-xhigh-fast
bug-fix: grok-4.7-xhigh-fast
perf-issue: grok-4.7-xhigh-fast
hillclimb: grok-4.7-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh
hardest tasks: claude-opus-5-5-xhigh
how explorer: grok-4.7-xhigh-fast
how explainer: claude-opus-5-5-xhigh
why investigators: grok-4.7-xhigh-fast
why synthesizer: claude-opus-5-5-xhigh
reflect tooling: grok-4.7-xhigh-fast
reflect judgment, divergent, synthesizer: claude-opus-5-5-xhigh
arena runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
arena cross-judge pool: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
swarm workers: grok-4.7-xhigh-fast
architect runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
interrogate reviewers: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
```

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
### 6. Confirm

Tell the user the rule was written and that it applies to new sessions. Re-running this skill updates it.

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke `/create-verification-skill` (resolves wherever pstack is installed: workspace, user, or plugin). On no, move on without pushing.

<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.

<!-- pstack-source:start -->
### 8. Offer a formal verification skill (optional)

Check whether the project already has a formal verification skill (a project skill that runs a model checker, a proof, or another verifier against the code). If not, offer once: "want a formal verification skill, so agents can prove a key property of your code holds in every case in scope, not only the cases tests reach? I can generate one with /create-formal-verification-skill." On yes, invoke `/create-formal-verification-skill` (resolves wherever pstack is installed: workspace, user, or plugin). On no, move on without pushing.
<!-- pstack-source:end -->

> **Pi boundary.** Use only the approved project-local exact-role map and preview writes. Source model defaults, budget aliases and Cursor rule destinations are not Pi configuration.
