#!/usr/bin/env node
// List where upstream pstack skills rely on Cursor tools or features, and what
// the matching -pi skill says about the same topic. The quoted sentence is a
// keyword match for a human to check, not a verdict. Read-only.
// Usage: node scripts/adaptation-report.mjs <path-to-upstream-pstack> [--markdown]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
// up: how upstream refers to the Cursor feature. pi: how the -pi skills describe their handling.
export const FEATURES = {
  "Task / subagents": { up: /\b(Task tool|Task\(|subagent_type|subagents?)\b/i, pi: /\bworkers?\b|dispatch route|coordinator/i },
  "TodoWrite / task lists": { up: /\bTodoWrite\b|\btodo list\b/i, pi: /session tasks|checklist/i },
  "AskQuestion": { up: /\bAskQuestion\b|AskUserQuestion/, pi: /multiple-choice|ask the owner|owner approv|\bask\b/i },
  "CloudAgent / background agents": { up: /\bCloudAgent\b|background agent|cloud agent/i, pi: /background|unattended|scheduler/i },
  "MCP": { up: /\bMCP\b/, pi: /\bMCP\b/ },
  "Browser / computer use": { up: /\bbrowser\b|computer[- ]use/i, pi: /browser|real entry point|user-facing (surface|path)|real app/i },
  "Cursor rules (.mdc)": { up: /\.cursor\/rules|\.mdc\b/, pi: /\.pi\/|project-local|WORKFLOW_BOUNDARIES/ },
  "Model names and effort": { up: /\b(opus|sonnet|haiku|gpt-\d|gemini|composer)\b|reasoning effort/i, pi: /independent-review|`development`|setup-pstack-pi/ },
  "Cursor transcripts": { up: /agent-transcripts|transcripts?\b/i, pi: /transcript/i },
};

function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : p.endsWith(".md") ? [p] : [];
  });
}

export function report(upstreamDir, root = ROOT) {
  const out = {};
  for (const [feature, { up: re, pi: piRe }] of Object.entries(FEATURES)) {
    out[feature] = [];
    for (const skill of readdirSync(join(upstreamDir, "skills")).sort()) {
      const up = files(join(upstreamDir, "skills", skill)).filter((f) => re.test(readFileSync(f, "utf8")));
      if (!up.length) continue;
      const piDir = join(root, "skills", `${skill}-pi`);
      let excerpt = "";
      for (const f of existsSync(piDir) ? files(piDir) : []) {
        const sentence = readFileSync(f, "utf8").replace(/^---\n[\s\S]*?\n---\n/, "").replace(/\n/g, " ").split(/(?<=[.!?])\s+/).find((x) => piRe.test(x));
        if (sentence) { excerpt = `${f.slice(root.length).replace(/^\/?/, "")}: ${sentence.trim().slice(0, 220)}`; break; }
      }
      out[feature].push({ skill, upstreamFiles: up.map((f) => f.slice(join(upstreamDir, "skills", skill).length + 1)), piHandling: excerpt });
    }
  }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2];
  if (!dir || !existsSync(join(dir, "skills"))) {
    console.error("usage: node scripts/adaptation-report.mjs <path-to-upstream-pstack> [--markdown]");
    process.exit(2);
  }
  const r = report(dir);
  if (!process.argv.includes("--markdown")) { console.log(JSON.stringify(r, null, 2)); process.exit(0); }
  for (const [feature, rows] of Object.entries(r)) {
    console.log(`### ${feature}\n`);
    if (!rows.length) { console.log("No upstream skill uses this.\n"); continue; }
    console.log("| Upstream skill | Upstream files | First `-pi` sentence on the topic (evidence to check, not a verdict) |\n|---|---|---|");
    for (const x of rows) console.log(`| ${x.skill} | ${x.upstreamFiles.join(", ")} | ${(x.piHandling || "no matching text").replace(/\|/g, "\\|")} |`);
    console.log("");
  }
}
