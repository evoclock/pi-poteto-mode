import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const skill = new URL("../.github/tools/pr-wording/", import.meta.url).pathname;
const wf = readFileSync(new URL("../.github/workflows/pr-wording.yml", import.meta.url), "utf8");

test("public-pr-wording skill: bundled lint unit tests pass", () => {
  const out = execFileSync("python3", [join(skill, "tests/test_pr_wording_lint.py")], { encoding: "utf8", stdio: "pipe", env: isolatedEnv({ PYTHONDONTWRITEBYTECODE: "1" }) });
  assert.equal(typeof out, "string");
});

// No personal config may leak into these tests: point the lint at an empty one.
function isolatedEnv(extra) {
  const home = mkdtempSync(join(tmpdir(), "wording-home-"));
  const empty = join(home, "empty-config.json");
  writeFileSync(empty, "{}");
  const env = { ...process.env, HOME: home, PR_WORDING_CONFIG: empty, ...extra };
  delete env.PI_CODING_AGENT_DIR;
  return env;
}

function lintStep() {
  const m = wf.match(/run: \|\n((?: {10}.*\n?)+)/);
  assert.ok(m, "lint step uses an inline run block");
  return m[1].replace(/^ {10}/gm, "");
}

test("pr-wording workflow: base without the lint emits a notice and passes", () => {
  const empty = mkdtempSync(join(tmpdir(), "wording-boot-"));
  const out = execFileSync("bash", ["-e", "-c", lintStep()], { cwd: empty, env: isolatedEnv({ GITHUB_EVENT_PATH: "/nonexistent" }), encoding: "utf8" });
  assert.match(out, /^::notice title=PR wording::.*not on the base branch/m);
});

test("pr-wording workflow: base with the lint runs it on the event and fails bad text", () => {
  const base = mkdtempSync(join(tmpdir(), "wording-base-"));
  const dir = join(base, ".github/tools/pr-wording");
  mkdirSync(dir, { recursive: true });
  for (const f of ["pr_wording_lint.py", "pr_wording_rules.json"]) copyFileSync(join(skill, f), join(dir, f));
  const event = join(base, "event.json");
  writeFileSync(event, JSON.stringify({ pull_request: { title: "short", body: "no sections" } }));
  assert.throws(() => execFileSync("bash", ["-e", "-c", lintStep()], { cwd: base, env: isolatedEnv({ GITHUB_EVENT_PATH: event }), encoding: "utf8", stdio: "pipe" }),
    (e) => e.status === 1 && /pr-wording-lint:/.test(e.stdout) && !/::notice/.test(e.stdout));
});
