---
name: interrogate-pi
description: "Pi adaptation: Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Adversaries try to break a change or design, and only findings proven by a run survive."
disable-model-invocation: true
license: MIT; see ../how/LICENSE
---

> Adapted from pstack by Lauren Tan (MIT).

## Pi adaptation contract

Read [shared boundaries](../how/WORKFLOW_BOUNDARIES.md) and [the source-name mapping](../how/UPSTREAM_MAPPING.md) before the procedure. Source: pstack 0.15.36; file and body hashes in [UPSTREAM.lock.json](../../UPSTREAM.lock.json). The source wording below is retained verbatim; the additive Pi boundaries constrain its effects. This is an instruction port with declared policy and capability differences, not a claim of runtime equivalence.

Read the ordered `interrogate reviewers` list from the project-local role map through setup-pstack-pi; one adversary per entry, including duplicates, with the approved native budget effort applied through a supported Pi session control. Missing list, seat availability or effort support blocks this phase; do not use the arena runner list or a core role as fallback. Follow arena-pi A3/A4 and B, replacing the runner seat with each configured adversary in a fresh Pi/Herdr pane and Treehouse lease. Copy the scoped uncommitted diff into every adversary checkout. Send the source brief verbatim with agentic_herdr_communication. Reports need title, exact command, observed output and intended output. Rerun each command against the real scoped artifact per F; keep only observed intent violations, merge shared root causes, and report dropped counts/reasons per adversary. Skip C/D/E; no judge, winning list, speculative buckets or fixes. Missing capacity is blocked, not self-review.

<!-- pstack-source:start -->

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.

<!-- pstack-source:start -->
# Interrogate

Adversaries try to break a change or a design. A finding survives only when a run proves it. Report the findings. Do not apply fixes.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.

<!-- pstack-source:start -->
## Frame

The scope is what the user names. Otherwise it is the branch diff from its merge base with the base branch, through the working tree. State the intent with the **in-your-own-words** skill, from the user's message, the commits, and the PR description. Ask the user when the intent is unclear.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.

<!-- pstack-source:start -->
## Fan out

Run Phase A steps 3 and 4 and Phase B of the **arena** skill, with four changes. Read the `interrogate reviewers` line in place of `arena runners`. Copy the scope's uncommitted changes into each worktree. Spawn each adversary as `generalPurpose`. In place of the arena task and rationale, give each adversary the scope, the intent, and this brief:

> Break this change. Prove each finding with a run against the real code, such as a failing test, a repro script, or command output that shows the wrong behavior. For a design or plan, run a prototype or probe the current tree. Keep repros in your own worktree. Report each finding with a title, the exact command, the output it printed, and the output the intent requires. Leave out anything you did not run. That covers style, naming, structure, and risks that need a future change to matter. No findings is a valid result.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.

<!-- pstack-source:start -->
## Verify

Verify each finding per arena Phase F by rerunning its command. Keep a finding when the output shows the failure and the failure breaks the intent. Drop the rest. Merge findings that share a root cause.

Skip arena Phases C, D, and E. Adversaries find different failures, so the verdict keeps every verified finding, not one adversary's list.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.

<!-- pstack-source:start -->
## Output

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.

<!-- pstack-source:start -->
- **Intent**: the restatement.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.

<!-- pstack-source:start -->
- **Findings**: for each verified finding, the command, its output, how it breaks the intent, and the adversaries that found it. Say "no verified findings" when none survive.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.

<!-- pstack-source:start -->
- **Dropped**: for each adversary, the count of dropped findings and why.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use arena-pi A3/A4/B with configured adversaries in Treehouse-leased Herdr/Pi panes; send the unchanged break-this-change brief via agentic_herdr_communication. Per F, rerun each reported command with bash and keep only failures that violate intent. Report exact outputs and dropped counts; skip C/D/E and apply no fixes.
