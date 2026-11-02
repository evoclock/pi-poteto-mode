Source: pstack 0.15.36, Lauren Tan (MIT); [UPSTREAM.lock.json](../../../UPSTREAM.lock.json). Read [Pi boundaries](../../how/WORKFLOW_BOUNDARIES.md) and [source-name mapping](../../how/UPSTREAM_MAPPING.md) first. Copy the source steps verbatim into the task list, retaining skipped steps and their reasons. Add the boundary under each step; never silently replace the source checklist.

<!-- pstack-source:start -->
### Feature

**You own the design. Plan, review, verify.** Delegate implementation. Stay in the lead.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
1. `how` over the affected subsystem.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
2. `architect` for parallel design exploration.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Disjoint files, services, or layers parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target (the **separate-before-serializing-shared-state** principle skill). Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
4. Delegate code-writing to a subagent using your configured feature model (default `grok-4.7-xhigh-fast`) with a specific scope (file paths, named data shape and its organizing structure per **principle-model-the-domain**, a state machine over scattered booleans, a table/registry over branching, a typed model over repeated shape assumptions, chosen before the delegate writes logic, and success criteria). Pick each subagent's reasoning level and fast or standard speed for the job, per the Subagents section. When the implementation admits multiple valid shapes (error handling, abstraction layer, test structure), delegate via the **arena** skill instead so the runners surface the alternatives and the cross-judge guards the pick. Mandatory: no skip-with-reason escape, and Laziness Protocol does not override it (the gain is review separation, not lines saved). A subagent forbidden to spawn satisfies this by owning the diff directly with the same review separation. No "standing by" reply that waits on a nested agent. Comments per **Comments**. Surgical edits, re-ground against the source for upstream-derived files. Port shared-primitive improvements to all consumers and verify each. Commit liberally.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. Ignore any source `(default …)` model slug; spawn with the exact approved identity from project-local `.pi/pstack-model-roles.v1.json` (development for implementation delegates; independent-review when a reviewer is required). If that file or role is missing or null, block and run setup-pstack-pi — never invent a package default. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
5. Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass. Flag it.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
6. Rebase into small, ordered commits. Stack follow-ups.
   Use the **sequence-verifiable-units** principle skill, building, verifying, and committing each small unit before the next.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
7. If the design is contested, `interrogate` before shipping.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.

<!-- pstack-source:start -->
8. Run **Opening a PR**.

Code-coupled work (one feature, one migration) goes to a single owner with the checkpoint inline. That owner fans out internally after the blocking phase. Parent-level fan-out is for slices that produce independent artifacts (audits, cross-subsystem investigations, competing experiments). Rewrite the checkpoint at phase boundaries. Spawn a fresh owner rather than chaining interrupts.

**Reply:** what you built, what you chose and why, the throughput checkpoint, open decisions. Tables for design alternatives.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use read, edit and bash only within this step's scope, and TaskList/TaskCreate/TaskUpdate for the checklist. For delegated steps, use a Treehouse lease and agentic_herdr_spawn_worker for a Pi agent in a Herdr pane; brief/report via agentic_herdr_communication. Follow UPSTREAM_MAPPING.md for exact calls. If a required tool or role is absent, retain this step as blocked/skip; never substitute a cloud agent.
