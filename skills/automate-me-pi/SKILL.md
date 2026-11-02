---
name: automate-me-pi
description: "Pi adaptation: Use for \"automate me\", \"create/update/refresh my -mode skill\", \"turn/capture my preferences or working style into a skill\", or wanting agents to follow how the user works. Drafts or revises a personal -mode skill via create-skill + unslop, optionally pulling fresh evidence from recent transcripts."
disable-model-invocation: true
license: MIT; see ../how/LICENSE
---

> Adapted from pstack by Lauren Tan (MIT).

## Pi adaptation contract

Read [shared boundaries](../how/WORKFLOW_BOUNDARIES.md) and [the source-name mapping](../how/UPSTREAM_MAPPING.md) before the procedure. Source: pstack 0.15.36; file and body hashes in [UPSTREAM.lock.json](../../UPSTREAM.lock.json). The source wording below is retained verbatim; the additive Pi boundaries constrain its effects. This is an instruction port with declared policy and capability differences, not a claim of runtime equivalence.

Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
# Automate me

A guided flow for turning the user's working conventions into a skill agents will follow. The output is one `-mode` skill tailored to them (e.g. `jay-mode`, `priya-mode`).

This skill orchestrates three others: an inline mining pass (see step 1), Cursor's built-in `create-skill` (authoring), and the **unslop** skill (prose discipline). It sequences them. It doesn't replace them.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
## Flow

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
### 0. Check for an existing skill

Look recursively for `.cursor/skills/**/*-mode/SKILL.md` and `~/.cursor/skills/*-mode/SKILL.md` matching the user's handle. Mode skills can live in a personal category directory (`.cursor/skills/<handle>/`), not only at the top level. If one exists, confirm intent with `AskQuestion` (unless they already said "update my skill" or similar):

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Update the existing skill (default for repeat runs)
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Start fresh (rare, ask why before doing it)

Update mode changes the rest of the flow:
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Step 1 mines only history since the skill was last edited (`git log -1 --format=%cI <path>`).
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Step 2 asks what's changed or missing, not what to capture from zero.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Step 4 edits the existing file in place. Preserve sections the user hasn't contradicted. Revise ones with new evidence. Add new sections only for genuinely new rules.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
### 1. Mine their history

Locate the active workspace's transcripts before fanning out. The system prompt names the workspace's `agent-transcripts/` directory. Use only that path. Don't glob across `~/.cursor/projects/*/`. That crosses workspace boundaries and reads private chats from unrelated projects.

Survey recent agent conversations within that scope for recurring patterns. Run multiple parallel subagents across slices of history (e.g. last 2-4 weeks, split into 3 slices so each has enough material). Pick each subagent's reasoning level and fast or standard speed for the job, per the Subagents section of the **poteto-mode** skill. Each slice mining subagent reads transcripts from the workspace-scoped path the parent provides, looks for the signals below, and returns a short structured list of patterns it saw with evidence pointers. Default signals worth hunting:

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Response preferences (length, tone, format, "dumb it down" corrections)
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Delegation habits (subagents, models, specialized workflows, parallelism)
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Verification posture (what "done" means, unit tests vs live repro, reviewers)
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Code and prose discipline (style, principles cited, lint/format tools)
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Process conventions (worktrees, commits, PRs, review/merge tooling)
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Meta preferences (fixing skills mid-task, proposing new ones)

Cross-check across slices before elevating a signal. Patterns seen in 2+ slices are high-confidence. Lone signals are weak and usually get dropped.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
### 2. Ask the user directly

Mining misses intent that hasn't come up yet. Use the `AskQuestion` tool (structured multi-choice) rather than asking the user to type from scratch.

Shape: one or two questions with 4-6 options each, `allow_multiple: true` for category questions. Start broad ("Which areas matter most?"), then follow up on selected areas with specific options. After the structured rounds, one free-form chat question catches anything the options missed.

Don't dump 20 questions.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
### 3. Cluster findings

Group the combined signals into sections. Common ones (use only what applies):

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Response style**: length, tone, format.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Autonomy**: how much to do without asking, MCP tool use.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Understand first**: which skills to reach for when scoping or investigating a change.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Subagents**: default, parallelism, model-to-task, specialized workflows.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Prose / code discipline**: principles, lint tools, style guides.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Review and verify**: repro posture, verification skills, live-testing tools.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Process**: git worktrees, commits, PRs, review/merge tooling.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Skills**: skill-authoring habits, fix-the-skill-first, proposing new skills.

The **poteto-mode** skill shows the shape. Read it for granularity. Don't copy its content. The user's rules are not the same as poteto-mode's.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
### 4. Draft the skill

Use Cursor's built-in `create-skill` skill to author the skill. Placement:

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Path: preserve an existing mode skill's category. For a new mode, use `.cursor/skills/<handle>/<handle>-mode/SKILL.md` when the repo has an established personal category for that handle. Otherwise default to `.cursor/skills/<handle>-mode/SKILL.md` in the project (or `~/.cursor/skills/<handle>-mode/` if the user prefers a personal skill).
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Handle: the user's first name or chosen identifier.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Frontmatter `description`: trigger on their name + `/<handle>-mode` + "work in their style", not on generic keywords like "write code" or "review PR".
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Frontmatter formatting: follow `create-skill`'s YAML rules. Keep `description` as one YAML scalar. Quote it or use `description: >-` with indented continuation lines when punctuation or wrapping requires it.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Frontmatter `disable-model-invocation: true` by default. Opt out only if the user explicitly wants their mode to apply on every turn.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
### 5. Iterate on prose

Apply the **unslop** skill and `create-skill`'s writing guidelines to every line.

Show the draft to the user and take feedback. Expect multiple iterations. Cut ruthlessly. A mode skill is not a manual.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
### 6. Land it

Work in a worktree off main. Commit and open a PR. Don't push to main directly.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
## Guardrails

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Don't overfit to one conversation.** A preference stated once and contradicted another time is noise. Require multiple instances before codifying it.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Don't be clever.** Restating other skills' contents, inventing metaphors, or writing "poetic" prose for an agent reader is cost without benefit. Keep it operational.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Reference, don't inline.** Other skills the user relies on should appear as path references, not pasted excerpts. Same for any principle docs they maintain elsewhere.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Keep sections minimal.** Only add a section if the user has a specific, non-default rule there. "Communicate clearly" is not a section. "Short paragraphs. Tables when comparing options. Bullets only when items are genuinely parallel." is.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Name conventions generic.** Use "the user" or "the human" in imperatives, not the author's first name.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- **Don't force symmetry.** If a user has no process rules worth writing down, skip the Process section entirely.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
## Evaluation

A `-mode` skill is subjective output. A `create-skill`-style test/iterate benchmark loop isn't useful here. Vibe-check with the user: does it read like them? Did it miss anything? Then ship.

Run a description-optimization loop only if the skill's trigger accuracy turns out to be a problem in practice.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
## When not to use

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- User wants a task-specific skill (not working conventions): `create-skill` alone, no mining required.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- User wants to capture one narrow workflow (e.g. "how I write commit messages"). That's a regular skill, not a mode skill.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.
