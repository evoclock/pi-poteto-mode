import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { compare } from "../scripts/sync-upstream.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const upstream = JSON.parse(readFileSync(join(ROOT, "tests/fixtures/upstream-0.15.25-skills.json"), "utf8"));
const skillDirs = readdirSync(join(ROOT, "skills")).filter((n) => n.endsWith("-pi"));

function walk(dir) {
  return readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
}
const textFiles = walk(join(ROOT, "skills")).concat(["README.md", "docs/pstack-pi-ports-comparison.md", "config/pstack-model-roles.v1.example.json"].map((f) => join(ROOT, f)));

test("every upstream pstack 0.15.25 skill has a port and the manifest lists it", () => {
  assert.equal(upstream.length, 54);
  for (const name of upstream) {
    assert.ok(skillDirs.includes(`${name}-pi`), `missing ${name}-pi`);
    assert.ok(pkg.pi.skills.includes(`./skills/${name}-pi`), `manifest lacks ${name}-pi`);
  }
  assert.equal(pkg.pi.skills.length, 54);
});

test("each SKILL.md has valid frontmatter whose name matches its folder", () => {
  for (const dir of skillDirs) {
    const text = readFileSync(join(ROOT, "skills", dir, "SKILL.md"), "utf8");
    const m = text.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(m, `${dir}: no frontmatter`);
    const fields = Object.fromEntries(m[1].split("\n").filter((l) => /^[a-z-]+:/.test(l)).map((l) => [l.slice(0, l.indexOf(":")), l.slice(l.indexOf(":") + 1).trim()]));
    assert.equal(fields.name, dir);
    assert.ok(text.includes("Adapted from pstack by Lauren Tan (MIT)."), `${dir}: attribution line`);
    assert.match(fields.name, /^[a-z0-9-]{1,64}$/);
    assert.ok(fields.description && fields.description.length <= 1024, `${dir}: description`);
  }
});

test("no model names or personal paths in shipped text", () => {
  // Public list: model names, personal paths and secrets. Private names (people, bots,
  // internal projects) go in a gitignored scan-terms.local.json: ["name", ...].
  const local = existsSync(join(ROOT, "scan-terms.local.json")) ? JSON.parse(readFileSync(join(ROOT, "scan-terms.local.json"), "utf8")) : [];
  const words = ["opus", "sonnet", "haiku", "claude", "gpt-?\\d*", "gemini", "grok", "codex", "copilot", "glm-?\\d*", "llama", "mistral", "qwen", "deepseek", "kimi", "anthropic", "openai", "xai", ...local.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))];
  const banned = new RegExp(`\\b(${words.join("|")})\\b|\\/Users\\/|\\/home\\/[a-z]|~\\/\\.pi\\/agent|(api[_-]?key|secret|token|password)\\s*[:=]\\s*\\S{8,}|sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}`, "i");
  for (const f of textFiles) {
    const hit = readFileSync(f, "utf8").replaceAll("@evoclock/pi-poteto-mode", "").replaceAll("evoclock/pi-poteto-mode", "").match(banned); // the npm scope is allowed
    assert.equal(hit, null, `${f}: ${hit && hit[0]}`);
  }
});

test("role example uses placeholders only", () => {
  const ex = JSON.parse(readFileSync(join(ROOT, "config/pstack-model-roles.v1.example.json"), "utf8"));
  assert.deepEqual(Object.values(ex.roles), [null, null]);
  assert.deepEqual(ex, JSON.parse(readFileSync(join(ROOT, "skills/setup-pstack-pi/assets/pstack-model-roles.v1.example.json"), "utf8")), "the two role examples must match");
});

test("package has no install scripts", () => {
  for (const k of ["preinstall", "install", "postinstall", "prepare"]) assert.equal(pkg.scripts?.[k], undefined);
});

test("npm pack contents are the whitelist only", () => {
  const out = JSON.parse(execFileSync("npm", ["pack", "--dry-run", "--json"], { cwd: ROOT, encoding: "utf8" }));
  const files = out[0].files.map((f) => f.path);
  assert.ok(files.every((f) => /^(skills\/|config\/pstack-model-roles\.v1\.example\.json$|README\.md$|LICENSE$|NOTICE$|docs\/pstack-pi-ports-comparison\.md$|package\.json$)/.test(f)), files.join(","));
  assert.ok(!files.some((f) => f.includes("node_modules") || f.startsWith("tests/") || f.startsWith("scripts/")));
  assert.ok(files.includes("skills/how/LICENSE"));
});

test("sync script reports drift against an upstream copy", () => {
  const r = compare(join(ROOT, "tests/fixtures/upstream"));
  assert.equal(r.version, "9.9.9");
  assert.deepEqual(r.missing, ["alpha", "beta"]);
  assert.equal(r.extra.length, 54);
});
