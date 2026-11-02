---
name: principle-redesign-from-first-principles-pi
description: "Pi adaptation: Apply when integrating a new requirement into an existing design."
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
# Redesign From First Principles

When integrating a change, don't bolt it onto the existing design. Redesign as if the requirement had been a foundational assumption from the start.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Read all affected files and understand the current design
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Ask: "if we were writing this from scratch with this new requirement, what would we build?"
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Propagate the change through every reference: types, docs, examples, rationale sections
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
- Think about the whole redesign, then deliver it incrementally

This is the method for preserving option value when integrating changes into an existing design.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.
