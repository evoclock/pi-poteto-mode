import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { compare } from "../scripts/sync-upstream.mjs";
import { sourceProcedure } from "../scripts/instruction-recall.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const upstream = JSON.parse(readFileSync(join(ROOT, "tests/fixtures/upstream-0.15.36-skills.json"), "utf8"));
const skillDirs = readdirSync(join(ROOT, "skills")).filter((n) => n.endsWith("-pi"));

function walk(dir) {
  return readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
}
const textFiles = walk(join(ROOT, "skills")).concat(["README.md", "docs/pstack-pi-ports-comparison.md", "docs/adaptation-guide.md", "config/pstack-model-roles.v1.example.json"].map((f) => join(ROOT, f)));

test("every upstream pstack 0.15.36 skill has an instruction port or explicit planned status", () => {
  // Why: the video procedure must not be registered as an available renderer.
  assert.equal(upstream.length, 58);
  for (const name of upstream) {
    assert.ok(skillDirs.includes(`${name}-pi`), `missing ${name}-pi`);
    assert.equal(pkg.pi.skills.includes(`./skills/${name}-pi`), name !== 'ketchup-video', name);
  }
  assert.equal(pkg.pi.skills.length, 57);
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

test("no operational model defaults, personal paths or secrets in shipped text", () => {
  // Why: exact locked upstream examples are evidence, never Pi role defaults.
  const snapshot = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/upstream-0.15.36.json'), 'utf8'));
  // Public list: model names, personal paths and secrets. Private names (people, bots,
  // internal projects) go in a gitignored scan-terms.local.json: ["name", ...].
  const local = existsSync(join(ROOT, "scan-terms.local.json")) ? JSON.parse(readFileSync(join(ROOT, "scan-terms.local.json"), "utf8")) : [];
  const words = ["opus", "sonnet", "haiku", "claude", "gpt-?\\d*", "gemini", "grok", "codex", "copilot", "glm-?\\d*", "llama", "mistral", "qwen", "deepseek", "kimi", "anthropic", "openai", "xai", ...local.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))];
  const banned = new RegExp(`\\b(${words.join("|")})\\b|\\/Users\\/|\\/home\\/[a-z]|~\\/\\.pi\\/agent|(api[_-]?key|secret|token|password)\\s*[:=]\\s*\\S{8,}|sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}`, "i");
  for (const f of textFiles) {
    const raw = readFileSync(f, 'utf8');
    const relative = f.slice(ROOT.length);
    const source = sourceProcedure(raw);
    if (source) {
      const skill = relative.match(/^skills\/([^/]+)-pi\/SKILL\.md$/)?.[1];
      const playbook = relative.match(/^skills\/poteto-mode-pi\/playbooks\/([^/]+)\.md$/)?.[1];
      const expected = skill ? snapshot.skills[skill].replace(/^---\n[\s\S]*?\n---\n/, '') : playbook ? snapshot.playbooks[playbook] : snapshot.references[relative];
      assert.equal(source, expected, `unverified source block: ${relative}`);
    }
    const scanned = source ? raw.replaceAll('/Users/you/proj', '<upstream-placeholder>') : raw;
    assert.doesNotMatch(scanned, /\/Users\/|\/home\/[a-z]|sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}/, relative);
    const adapted = raw.replace(/<!-- pstack-source:start -->\n[\s\S]*?<!-- pstack-source:end -->\n/g, '');
    const hit = adapted.replaceAll('@evoclock/pi-poteto-mode', '').replaceAll('Grok Bot', '').replaceAll('evoclock/pi-poteto-mode', '').match(banned);
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
  // Why: provenance must ship without leaking test baselines or authoring helpers.
  const out = JSON.parse(execFileSync("npm", ["pack", "--dry-run", "--json"], { cwd: ROOT, encoding: "utf8" }));
  const files = out[0].files.map((f) => f.path);
  const diagrams = [
    "assets/coding-system-external-work-loop-and-internal-playbook-loop.webp",
    "assets/pi-coding-system.html",
    "assets/pi-poteto-mode-routing.png",
  ];
  assert.ok(files.every((f) => diagrams.includes(f) || /^(skills\/|config\/pstack-model-roles\.v1\.example\.json$|README\.md$|CHANGELOG\.md$|LICENSE$|NOTICE$|docs\/pstack-pi-ports-comparison\.md$|docs\/adaptation-guide\.md$|UPSTREAM\.lock\.json$|package\.json$)/.test(f)), files.join(","));
  for (const diagram of diagrams) assert.ok(files.includes(diagram), `missing ${diagram}`);
  assert.ok(!files.some((f) => f.includes("node_modules") || f.startsWith("tests/") || f.startsWith("scripts/")));
  assert.ok(files.includes("skills/how/LICENSE"));
  assert.ok(files.includes("CHANGELOG.md"));
});

test("sync script reports drift against an upstream copy", () => {
  // Why: a newer source inventory must still report unrelated or missing slugs.
  const r = compare(join(ROOT, "tests/fixtures/upstream"));
  assert.equal(r.version, "9.9.9");
  assert.deepEqual(r.missing, ["alpha", "beta"]);
  assert.equal(r.extra.length, 58);
});

test("adaptation report finds each feature in an upstream copy", async () => {
  const { report } = await import("../scripts/adaptation-report.mjs");
  const r = report(join(ROOT, "tests/fixtures/upstream"));
  assert.deepEqual(r["Task / subagents"].map((x) => x.skill), ["alpha"]);
  assert.deepEqual(r["MCP"], []);
});
