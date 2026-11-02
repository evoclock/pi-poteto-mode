Source: pstack 0.15.36, Lauren Tan (MIT); [UPSTREAM.lock.json](../../../UPSTREAM.lock.json). Read [Pi boundaries](../../how/WORKFLOW_BOUNDARIES.md) and [source-name mapping](../../how/UPSTREAM_MAPPING.md) first. Copy the source steps verbatim into the task list, retaining skipped steps and their reasons. Add the boundary under each step; never silently replace the source checklist.

<!-- pstack-source:start -->
### Shipping

**You own what lands. Verify each PR independently, land only the verified run from the root, then keep your hands off the stack.**

<!-- pstack-source:end -->

> **Pi boundary.** Pi: use gh pr view, gh pr checks and gh pr diff; use Treehouse-leased checkouts and independent Pi agents in Herdr panes via agentic_herdr_spawn_worker; exchange reports with agentic_herdr_communication. Landing remains owner-held. No source merge, rebase, force-push or cloud command grants permission.

<!-- pstack-source:start -->
1. **Resolve the forge, then verify each PR independently before it lands.** GitHub CLI (`gh`) is the default. If `command -v origin` succeeds and Origin can resolve the repository, use `origin pr` for every PR operation. Otherwise stay on `gh` and record the fallback. Never require Graphite (`gt`). One verifier per PR, each a Cursor cloud agent, runs the change the way a user would with the matching control skill (such as `control-ui` or `control-cli` from `cursor-team-kit`), parent against head, and posts `PASS`, `PASS+NOTES`, or `FAIL` on that PR. Only a verdict from an agent that did not write the code counts, because an author checks what it meant to build. Green CI and an approving bot review are not verdicts, because neither runs the change as a user would.
<!-- pstack-source:end -->

> **Pi boundary.** Pi step 1: read the PR with gh pr view and gh pr diff. Acquire a verifier checkout with treehouse get --lease --json --base <verified-ref>; start a Pi verifier pane with agentic_herdr_spawn_worker, then brief/report with agentic_herdr_communication. The verifier did not write the patch and runs parent versus head on the matching local surface. Inspect its actual receipts; no cloud verifier, CI-only verdict or author self-check.

<!-- pstack-source:start -->
2. **Land only the contiguous verified run rooted at the bottom.** Walk up from the lowest unmerged PR and stop at the first one without `PASS` or `PASS+NOTES`. The PRs below it are the run, and the top one is the ceiling. A verified PR above an unverified one waits, because it cannot land without the code below it. One whose branch neither holds nor needs that code can move onto trunk and land on its own. It needs a fresh verdict first, because its old one ran with that code beneath it and trunk does not have it.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use gh pr view, gh pr checks and gh pr diff; use Treehouse-leased checkouts and independent Pi agents in Herdr panes via agentic_herdr_spawn_worker; exchange reports with agentic_herdr_communication. Landing remains owner-held. No source merge, rebase, force-push or cloud command grants permission.

<!-- pstack-source:start -->
3. **Re-check that the verdicts still describe the code.** A verdict covers a patch, and a chain rebase moves every PR above it to a new SHA without failing any check. Compare `git patch-id` at the verdict SHA with the current head before trusting an older verdict. When the patches differ only in tests, docs, or lint config, a lane's result stands if what it ran builds the same at both SHAs apart from noise. Noise is a difference that also shows up between two builds of the verdict SHA, or an embedded commit SHA. Report each kind of noise with its files, so a reader can check the call. The change itself still gets fresh checks and a review, because the old verdict never saw it. A lane with no build output, such as a dev server, cannot show this, so rerun it, and re-verify anything else that drifted.
<!-- pstack-source:end -->

> **Pi boundary.** Pi step 3: compare the actual recorded-base/verdict-head and current-base/current-head diffs with git patch-id --stable in the verified checkout. Preserve both base/head pairs and receipts; missing refs or a changed patch block reuse. Rerun affected surface checks in the independent Treehouse/Herdr verifier lease. A build-equivalence exception needs measured output/noise evidence, not an assertion.

<!-- pstack-source:start -->
4. **Land bottom-up, one PR at a time.** Always merge the run's lowest unmerged PR, with `origin pr merge <pr>` or `gh pr merge <pr> --squash`. On Origin the plain command also merges every PR below the one you name, and on GitHub a PR whose base is still its parent's branch merges into that branch, not trunk. Read the PR back for the result (`origin pr view <pr>` or `gh pr view <pr> --json state,mergedAt,baseRefName`), because a merge command can report success when a merge queue only queued the PR, and a requested auto-merge is not a merge. A landed PR reads merged with trunk as its base, not its parent's branch. Arm `--auto` (Origin merge-when-ready or GitHub auto-merge) only on a PR whose verdict covers its current head, because it lands whatever head is ready. After a merge lands, retarget the PR whose base was the merged branch to trunk (`origin pr edit <pr> --base <trunk>` or `gh pr edit <pr> --base <trunk>`), move its patch onto the merge result, and push with `--force-with-lease`. The verdict covers the patch, not its commits, so step 3's patch-id rule decides whether the verdict survives. Merge it once its checks pass and its verdict survives.
<!-- pstack-source:end -->

> **Pi boundary.** Pi step 4 is owner-held: no gh pr merge, auto-merge, retarget, rebase or git push --force-with-lease from this recipe. Report the proposed bottom-up action and stop for the owner. After an actual owner merge, gh pr view <pr> --json state,mergedAt,baseRefName reads it back; queued is not merged. Source topology/force-push operations remain blocked, not silently executed.

<!-- pstack-source:start -->
5. **Leave the stack alone while it lands.** Step 4's move of the next PR is the only change to a branch or base, because a merge lands whatever its branch and base hold at that moment, verdict or not. On GitHub, watch the run with the queued watcher from `playbooks/babysit.md` (`scripts/watch-pr/watch-pr --queued-stack --stack-prs <bottom-to-top>`) under `/loop` until it reports `COMPLETE` at the ceiling. On Origin, re-read the current PR with `origin pr view <pr> --checks` each time `origin pr checks <pr> --watch` returns, until the ceiling reads merged. A base that moves to trunk when its parent merges is expected, not damage to repair. If a merge stalls, find out why before you change anything.
<!-- pstack-source:end -->

> **Pi boundary.** Pi step 5: /loop and scripts/watch-pr/watch-pr are not supplied or supported here. Do not run that helper or invent a sleep loop. Use a granted single gh pr view / gh pr checks observation; persistent watching requires a separately validated host event route. With none, retain watch-until-COMPLETE as blocked. Do not mutate the landing stack.

<!-- pstack-source:start -->
6. **Stop at the ceiling.** Extending the run takes new verdicts, so it is a new pass through step 1.

**Reply:** the verified run and its ceiling, each PR's verdict and who produced it, what landed and how you confirmed it, and what the next gap needs.
<!-- pstack-source:end -->

> **Pi boundary.** Pi: use gh pr view, gh pr checks and gh pr diff; use Treehouse-leased checkouts and independent Pi agents in Herdr panes via agentic_herdr_spawn_worker; exchange reports with agentic_herdr_communication. Landing remains owner-held. No source merge, rebase, force-push or cloud command grants permission.
