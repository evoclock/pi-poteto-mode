Source: pstack 0.15.36, Lauren Tan (MIT); [UPSTREAM.lock.json](../../../UPSTREAM.lock.json). Read [Pi boundaries](../../how/WORKFLOW_BOUNDARIES.md) and [source-name mapping](../../how/UPSTREAM_MAPPING.md) first. Copy the source steps verbatim into the task list, retaining skipped steps and their reasons. Add the boundary under each step; never silently replace the source checklist.

<!-- pstack-source:start -->
### Autopilot-stack

Run the Autopilot-full playbook, but do not merge.

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use gh pr view, gh pr checks and gh pr diff; use Treehouse-leased checkouts and independent Pi agents in Herdr panes via agentic_herdr_spawn_worker; exchange reports with agentic_herdr_communication. Landing remains owner-held. No source merge, rebase, force-push or cloud command grants permission.

<!-- pstack-source:start -->
1. **In place of step 5, stop at verified.** Stop when each PR is verified and green at its current head, then hand the PRs to the operator. After the handoff, nobody pushes without the operator's go. Every loop tick prompt names this file, so each tick sees the no-merge rule.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use gh pr view, gh pr checks and gh pr diff; use Treehouse-leased checkouts and independent Pi agents in Herdr panes via agentic_herdr_spawn_worker; exchange reports with agentic_herdr_communication. Landing remains owner-held. No source merge, rebase, force-push or cloud command grants permission.

<!-- pstack-source:start -->
2. **Stack a PR only when it builds on another PR.** This is the one exception to step 3. Base the PR on the other PR's branch in place of trunk, per **Size and stacks** in `playbooks/opening-a-pr.md`. In place of step 2's rebase onto trunk, each PR rebases onto its parent PR's branch, and the stack root rebases onto trunk. A new head on the lower PR restacks the PRs above it, and a PR whose `git patch-id` the restack leaves unchanged keeps its verdict.

**Reply:** list each PR with its verdict, in place of what merged.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use gh pr view, gh pr checks and gh pr diff; use Treehouse-leased checkouts and independent Pi agents in Herdr panes via agentic_herdr_spawn_worker; exchange reports with agentic_herdr_communication. Landing remains owner-held. No source merge, rebase, force-push or cloud command grants permission.
