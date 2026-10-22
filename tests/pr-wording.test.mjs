import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const skill = new URL("../.github/tools/pr-wording/", import.meta.url).pathname;

test("public-pr-wording: bundled lint unit tests pass", () => {
  const home = mkdtempSync(join(tmpdir(), "wording-home-"));
  const config = join(home, "empty-config.json");
  writeFileSync(config, "{}");
  const env = { ...process.env, HOME: home, PR_WORDING_CONFIG: config, PYTHONDONTWRITEBYTECODE: "1" };
  delete env.PI_CODING_AGENT_DIR;
  execFileSync("python3", [join(skill, "tests/test_pr_wording_lint.py")], { stdio: "pipe", env });
});

test("Buildkite wording uses the base revision and the PR payload", () => {
  const script = readFileSync(new URL("../.buildkite/pr-checks.sh", import.meta.url), "utf8");
  const pipeline = readFileSync(new URL("../.buildkite/pipeline.yml", import.meta.url), "utf8");
  assert.match(script, /git show "\$base_sha:\$base\/\$name"/);
  assert.match(script, /--event "\$scratch\/event.json"/);
  assert.match(script, /python3 "\$scratch\/pr-wording\/pr_wording_lint.py"/);
  assert.match(pipeline, /label: "lint"[\s\S]*?queue: mac-mini[\s\S]*?pr-checks\.sh wording/);
});
