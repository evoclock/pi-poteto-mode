import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import {
  evaluatePrReviewGate, checkReviewFreeze, checkCommentTags, checkJourneyClaims,
  tagOf, hasJourneyClaim, gatherFromGitHub, gatherMaintainers,
} from "../.github/tools/pr_review_gate.js";

const A = "a".repeat(40);
const B = "b".repeat(40);
const C = "c".repeat(40);
const approve = (user, commit_id, at = "2026-10-01T10:00:00Z") => ({ id: 1, user, state: "APPROVED", commit_id, body: "", submitted_at: at });

function pr(over = {}) {
  return {
    headSha: A, draft: false, author: "dev", body: "Adds a thing.",
    reviews: [approve("rev", A)], reviewComments: [], issueComments: [],
    commits: [{ sha: A, date: "2026-10-01T09:00:00Z" }],
    ...over,
  };
}
const freeze = (p) => checkReviewFreeze(p);
const tags = (p) => checkCommentTags(p);
const claims = (p) => checkJourneyClaims(p);

test("clean PR with approval on head passes all three checks", () => {
  const r = evaluatePrReviewGate(pr());
  assert.equal(r.ok, true);
  assert.deepEqual(r.checks.map((c) => c.name), ["review-freeze", "comment-tags", "journey-claims"]);
});

test("draft PRs are skipped until ready for review", () => {
  const r = evaluatePrReviewGate(pr({ draft: true, reviews: [] }));
  assert.equal(r.ok, true);
  assert.match(r.skipped, /draft/);
});

test("freeze: a push after approval fails until a fresh review on the new head", () => {
  const p = pr({ headSha: B, reviews: [approve("rev", A)] });
  const r = freeze(p);
  assert.equal(r.ok, false);
  assert.match(r.failures[0], /given on aaaaaaa, head is now bbbbbbb/);
  p.reviews.push(approve("rev", B, "2026-10-02T10:00:00Z"));
  assert.equal(freeze(p).ok, true);
});

test("freeze: one stale approver fails even when another approved the head", () => {
  const r = freeze(pr({ headSha: B, reviews: [approve("x", B), approve("y", A)] }));
  assert.equal(r.ok, false);
  assert.match(r.failures.join(), /y was given on aaaaaaa/);
});

test("freeze: no approval, or outstanding change request, fails", () => {
  assert.equal(freeze(pr({ reviews: [] })).ok, false);
  const r = freeze(pr({ reviews: [approve("x", A), { id: 2, user: "y", state: "CHANGES_REQUESTED", commit_id: A, submitted_at: "2026-10-01T11:00:00Z" }] }));
  assert.equal(r.ok, false);
});

test("freeze: a later dismissal or change request replaces that reviewer's approval", () => {
  const r = freeze(pr({ reviews: [approve("x", A), { id: 2, user: "x", state: "DISMISSED", commit_id: A, submitted_at: "2026-10-01T12:00:00Z" }] }));
  assert.equal(r.ok, false);
  assert.match(r.failures[0], /no approval/);
});

test("tagOf reads only a leading tag", () => {
  assert.equal(tagOf("[question] why?"), "question");
  assert.equal(tagOf("  [Work-Request] rename"), "work-request");
  assert.equal(tagOf("please [question]"), null);
  assert.equal(tagOf("nit: rename"), null);
});

test("tags: untagged review comment fails; author's own comments and replies are exempt", () => {
  const p = pr({ reviewComments: [{ id: 10, user: "rev", body: "rename this", created_at: "2026-10-01T10:00:00Z" }] });
  assert.match(tags(p).failures[0], /no \[question\] or \[work-request\] tag/);
  const own = pr({ reviewComments: [{ id: 11, user: "dev", body: "note to self", created_at: "2026-10-01T10:00:00Z" }] });
  assert.equal(tags(own).ok, true);
});

test("tags: a question needs a reply from someone else", () => {
  const q = { id: 10, user: "rev", body: "[question] why sync?", created_at: "2026-10-01T10:00:00Z" };
  assert.match(tags(pr({ reviewComments: [q] })).failures[0], /question with no reply/);
  const self = { id: 11, user: "rev", in_reply_to_id: 10, body: "bump", created_at: "2026-10-01T10:05:00Z" };
  assert.equal(tags(pr({ reviewComments: [q, self] })).ok, false);
  const ans = { id: 12, user: "dev", in_reply_to_id: 10, body: "Because the caller blocks.", created_at: "2026-10-01T11:00:00Z" };
  assert.equal(tags(pr({ reviewComments: [q, ans] })).ok, true);
});

test("tags: a work request needs a reply naming a PR commit made after the request", () => {
  const wr = { id: 20, user: "rev", body: "[work-request] add a test", created_at: "2026-10-01T10:00:00Z" };
  const commits = [{ sha: A, date: "2026-10-01T09:00:00Z" }, { sha: B, date: "2026-10-01T12:00:00Z" }];
  const words = { id: 21, user: "dev", in_reply_to_id: 20, body: "will do", created_at: "2026-10-01T11:00:00Z" };
  assert.match(tags(pr({ commits, reviewComments: [wr, words] })).failures[0], /work request with no reply naming a follow-up commit/);
  const old = { ...words, body: `done in ${A.slice(0, 7)}` };
  assert.equal(tags(pr({ commits, reviewComments: [wr, old] })).ok, false, "commit before the request does not count");
  const foreign = { ...words, body: `done in ${C.slice(0, 7)}` };
  assert.equal(tags(pr({ commits, reviewComments: [wr, foreign] })).ok, false, "commit not on the PR does not count");
  const good = { ...words, body: `done in ${B.slice(0, 7)}` };
  assert.equal(tags(pr({ commits, reviewComments: [wr, good] })).ok, true);
});

test("tags: review summaries need a tag and are answered with 'Re: review <id>'", () => {
  const review = { id: 77, user: "rev", state: "COMMENTED", commit_id: A, body: "looks odd", submitted_at: "2026-10-01T10:00:00Z" };
  assert.equal(tags(pr({ reviews: [review] })).ok, false);
  const q = { ...review, body: "[question] is the cache needed?" };
  assert.equal(tags(pr({ reviews: [q] })).ok, false);
  const reply = { id: 5, user: "dev", body: "Re: review 77 - yes, for cold starts.", created_at: "2026-10-01T11:00:00Z" };
  assert.equal(tags(pr({ reviews: [q], issueComments: [reply] })).ok, true);
  const empty = { ...review, body: "" };
  assert.equal(tags(pr({ reviews: [empty] })).ok, true, "a bare approval has no comment to tag");
});

test("hasJourneyClaim catches whole-journey claims and leaves ordinary results alone", () => {
  for (const s of ["The whole user journey works now.", "Works end-to-end.", "end to end passes", "Full flow works", "e2e passes on my machine"]) {
    assert.equal(hasJourneyClaim(s), true, s);
  }
  for (const s of ["Unit tests pass.", "Adds an end-to-end test harness.", "Journey planner refactor."]) {
    assert.equal(hasJourneyClaim(s), false, s);
  }
});

test("claims: a journey claim needs Evidence-SHA equal to head plus an evidence link", () => {
  const claim = "The whole user journey works.";
  assert.match(claims(pr({ body: claim })).failures[0], /no "Evidence-SHA/);
  assert.match(claims(pr({ body: `${claim}\nEvidence-SHA: ${B}\nEvidence: https://example.test/run/1` })).failures[0], /not the head/);
  assert.match(claims(pr({ body: `${claim}\nEvidence-SHA: ${A}` })).failures[0], /no "Evidence: <link or file>"/);
  assert.equal(claims(pr({ body: `${claim}\nEvidence-SHA: ${A}\nEvidence: https://example.test/run/1` })).ok, true);
});

test("claims: comments are checked too, and a push makes old evidence stale", () => {
  const c = { id: 9, user: "dev", body: `Works end to end.\nEvidence-SHA: ${A}\nEvidence: run.log`, created_at: "2026-10-01T10:00:00Z" };
  assert.equal(claims(pr({ issueComments: [c] })).ok, true);
  assert.equal(claims(pr({ headSha: B, issueComments: [c] })).ok, false);
});

test("a malformed head SHA is an error, not a pass", () => {
  assert.throws(() => evaluatePrReviewGate(pr({ headSha: "abc" })), /40-character/);
});

test("gatherFromGitHub maps the REST shapes", () => {
  const data = {
    "repos/o/r/pulls/3": { head: { sha: A }, draft: false, user: { login: "dev" }, body: "b" },
    "repos/o/r/pulls/3/reviews": [{ id: 1, user: { login: "rev" }, state: "APPROVED", commit_id: A, body: "", submitted_at: "t" }],
    "repos/o/r/pulls/3/comments": [{ id: 2, user: { login: "rev" }, body: "[question] x", in_reply_to_id: undefined, created_at: "t" }],
    "repos/o/r/issues/3/comments": [],
    "repos/o/r/pulls/3/commits": [{ sha: A, commit: { committer: { date: "t" } } }],
  };
  const g = gatherFromGitHub("o/r", 3, (p) => data[p]);
  assert.equal(g.headSha, A);
  assert.equal(g.author, "dev");
  assert.equal(g.reviews[0].user, "rev");
  assert.equal(g.reviewComments[0].in_reply_to_id, null);
  assert.equal(g.commits[0].date, "t");
});

test("CLI exits 1 on failure and 0 on pass from a snapshot", () => {
  const dir = mkdtempSync(join(tmpdir(), "pr-gate-"));
  const script = new URL("../.github/tools/pr_review_gate.js", import.meta.url).pathname;
  const good = join(dir, "good.json");
  writeFileSync(good, JSON.stringify(pr()));
  assert.match(execFileSync("node", [script, "--snapshot", good], { encoding: "utf8" }), /PASS/);
  const bad = join(dir, "bad.json");
  writeFileSync(bad, JSON.stringify(pr({ headSha: B })));
  assert.throws(() => execFileSync("node", [script, "--snapshot", bad], { encoding: "utf8", stdio: "pipe" }), (e) => e.status === 1 && /FAIL/.test(e.stdout));
});

test("workflow: base checkout without the gate script emits a notice and passes; with it, runs the gate", async () => {
  const { readFileSync, mkdirSync, copyFileSync } = await import("node:fs");
  const wf = readFileSync(new URL("../.github/workflows/pr-review-gate.yml", import.meta.url), "utf8");
  assert.doesNotMatch(wf, /head\.sha|head\.ref/, "the gate must never check out the PR head");
  const m = wf.match(/run: \|\n((?: {10}.*\n?)+)/);
  assert.ok(m, "gate step uses an inline run block");
  const script = m[1].replace(/^ {10}/gm, "");
  const env = { ...process.env, GITHUB_REPOSITORY: "o/r", PR_NUMBER: "1" };

  const empty = mkdtempSync(join(tmpdir(), "gate-boot-"));
  const out = execFileSync("bash", ["-e", "-c", script], { cwd: empty, env, encoding: "utf8" });
  assert.match(out, /^::notice title=PR review gate::.*not on the base branch/m);

  // With the script present the step runs it and propagates its failure.
  const base = mkdtempSync(join(tmpdir(), "gate-base-"));
  mkdirSync(join(base, ".github/tools"), { recursive: true });
  copyFileSync(new URL("../.github/tools/pr_review_gate.js", import.meta.url), join(base, ".github/tools/pr_review_gate.js"));
  const snap = join(base, "s.json");
  writeFileSync(snap, JSON.stringify(pr({ headSha: B })));
  const ran = script.replace('--repo "$GITHUB_REPOSITORY" --pr "$PR_NUMBER"', `--snapshot ${snap}`);
  assert.throws(() => execFileSync("bash", ["-e", "-c", ran], { cwd: base, env, encoding: "utf8", stdio: "pipe" }),
    (e) => e.status === 1 && /FAIL/.test(e.stdout) && !/::notice/.test(e.stdout));
});

const SOLE = { author: "Maint1", maintainers: ["maint1"] };

test("sole maintainer: no approval needed when the author is the only maintainer", () => {
  const p = pr({ ...SOLE, reviews: [] });
  const r = freeze(p);
  assert.equal(r.ok, true);
  assert.match(r.note, /sole maintainer/);
  assert.equal(evaluatePrReviewGate(p).ok, true);
});

test("two or more maintainers: the author still needs a non-author approval on head", () => {
  const two = { author: "maint1", maintainers: ["maint1", "maint2"] };
  assert.equal(freeze(pr({ ...two, reviews: [] })).ok, false);
  assert.equal(freeze(pr({ ...two, reviews: [approve("maint2", A)] })).ok, true);
  assert.equal(freeze(pr({ ...two, headSha: B, reviews: [approve("maint2", A)] })).ok, false);
});

test("unknown maintainers (API unreadable, no list) stay strict", () => {
  assert.equal(freeze(pr({ author: "maint1", maintainers: null, reviews: [] })).ok, false);
  assert.equal(freeze(pr({ author: "maint1", reviews: [] })).ok, false);
  assert.equal(freeze(pr({ author: "maint1", maintainers: [], reviews: [] })).ok, false);
});

test("sole maintainer list that is not the author skips nothing", () => {
  assert.equal(freeze(pr({ author: "dev", maintainers: ["maint1"], reviews: [] })).ok, false);
  assert.equal(evaluatePrReviewGate(pr({ author: "", maintainers: [""], reviews: [] })).ok, false);
  assert.equal(freeze(pr({ author: "maint1", maintainers: ["Maint1", "maint1"], reviews: [] })).ok, true, "duplicates count once");
});

test("sole maintainer: a non-author approval must still be on the current head", () => {
  const r = freeze(pr({ ...SOLE, headSha: B, reviews: [approve("helper", A)] }));
  assert.equal(r.ok, false);
  assert.match(r.failures[0], /helper was given on aaaaaaa/);
  assert.equal(freeze(pr({ ...SOLE, headSha: B, reviews: [approve("helper", B)] })).ok, true);
});

test("sole maintainer: an open change request still fails", () => {
  const cr = { id: 3, user: "helper", state: "CHANGES_REQUESTED", commit_id: A, submitted_at: "2026-10-01T11:00:00Z" };
  assert.equal(freeze(pr({ ...SOLE, reviews: [cr] })).ok, false);
});

test("sole maintainer: comment tags and journey claims still run", () => {
  const p = pr({
    ...SOLE, reviews: [],
    body: "The whole user journey works.",
    reviewComments: [{ id: 10, user: "helper", body: "rename this", created_at: "2026-10-01T10:00:00Z" }],
  });
  const r = evaluatePrReviewGate(p);
  assert.equal(r.ok, false);
  assert.deepEqual(r.checks.filter((c) => !c.ok).map((c) => c.name), ["comment-tags", "journey-claims"]);
});

test("gatherMaintainers: list wins, else collaborators API, else null when unreadable", () => {
  const calls = [];
  const users = [
    { login: "admin1", permissions: { admin: true, maintain: true, push: true } },
    { login: "maint1", permissions: { admin: false, maintain: true, push: true } },
    { login: "writer", permissions: { admin: false, maintain: false, push: true } },
    { login: "noflags" },
  ];
  const api = (p) => { calls.push(p); return users; };
  assert.deepEqual(gatherMaintainers("o/r", api, ["x"]), ["x"]);
  assert.equal(calls.length, 0);
  assert.deepEqual(gatherMaintainers("o/r", api, null), ["admin1", "maint1"], "admins and maintainers count; writers do not");
  assert.match(calls[0], /^repos\/o\/r\/collaborators\?affiliation=all$/);
  assert.equal(gatherMaintainers("o/r", () => { throw new Error("HTTP 403"); }, null), null);
  assert.equal(gatherMaintainers("o/r", () => ({ message: "x" }), null), null);
});

test("gatherFromGitHub: forbidden collaborators API leaves the gate strict", () => {
  const data = {
    "repos/o/r/pulls/3": { head: { sha: A }, draft: false, user: { login: "maint1" }, body: "" },
    "repos/o/r/pulls/3/reviews": [], "repos/o/r/pulls/3/comments": [], "repos/o/r/issues/3/comments": [],
    "repos/o/r/pulls/3/commits": [{ sha: A, commit: { committer: { date: "t" } } }],
  };
  const api = (p) => { if (p.includes("collaborators")) throw new Error("HTTP 403"); return data[p]; };
  const strict = gatherFromGitHub("o/r", 3, api);
  assert.equal(strict.maintainers, null);
  assert.equal(evaluatePrReviewGate(strict).ok, false);
  const collab = (list) => (p) => (p.includes("collaborators") ? list : data[p]);
  const admin = (login) => ({ login, permissions: { admin: true, maintain: true } });
  assert.equal(evaluatePrReviewGate(gatherFromGitHub("o/r", 3, collab([admin("maint1"), { login: "w", permissions: { push: true } }]))).ok, true);
  assert.equal(evaluatePrReviewGate(gatherFromGitHub("o/r", 3, collab([admin("maint1"), admin("other")]))).ok, false, "an admin elsewhere means two maintainers");
});

test("CLI reads maintainers from PR_GATE_MAINTAINERS and --maintainers", () => {
  const dir = mkdtempSync(join(tmpdir(), "pr-gate-maint-"));
  const script = new URL("../.github/tools/pr_review_gate.js", import.meta.url).pathname;
  const snap = join(dir, "s.json");
  writeFileSync(snap, JSON.stringify(pr({ author: "maint1", reviews: [] })));
  const env = (v) => ({ ...process.env, PR_GATE_MAINTAINERS: v });
  assert.throws(() => execFileSync("node", [script, "--snapshot", snap], { encoding: "utf8", stdio: "pipe", env: env("") }), (e) => e.status === 1);
  assert.throws(() => execFileSync("node", [script, "--snapshot", snap], { encoding: "utf8", stdio: "pipe", env: env("maint1, maint2") }), (e) => e.status === 1);
  assert.match(execFileSync("node", [script, "--snapshot", snap], { encoding: "utf8", env: env("maint1") }), /PASS[\s\S]*note: author maint1 is the sole maintainer/);
  assert.match(execFileSync("node", [script, "--snapshot", snap, "--maintainers", "maint1"], { encoding: "utf8", env: env("") }), /PASS/);
});

test("workflow passes the optional maintainer list from a repo variable", () => {
  const wf = readFileSync(new URL("../.github/workflows/pr-review-gate.yml", import.meta.url), "utf8");
  assert.match(wf, /PR_GATE_MAINTAINERS: \$\{\{ vars\.PR_GATE_MAINTAINERS \}\}/);
  assert.match(wf, /pull-requests: read/);
});
