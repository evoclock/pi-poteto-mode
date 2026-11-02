---
name: principle-encode-lessons-in-structure-pi
description: "Pi adaptation: Apply when you catch yourself writing the same instruction a second time, or notice a recurring correction. Encode the rule as a lint, metadata flag, runtime check, or script instead of more text."
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
# Encode Lessons in Structure

If the lesson needs judgment and cannot be encoded, make the instruction more prominent and add an example of the failure mode.

**Corollary:** If the fix is structural, only use the structural fix. The instruction is the symptom.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.
