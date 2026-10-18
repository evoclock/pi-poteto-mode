#!/usr/bin/env node
// Compare this port with a local copy of upstream pstack.
// Usage: node scripts/sync-upstream.mjs <path-to-upstream-pstack>
// Prints the upstream version, skills missing from the port, port skills with
// no upstream match, and the baseline version this port tracks. It only reads; it never edits files.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const UPSTREAM_VERSION = "0.15.25";

export function upstreamSkills(dir) {
  return readdirSync(join(dir, "skills")).filter((n) => statSync(join(dir, "skills", n)).isDirectory()).sort();
}
export function portSkills(root = ROOT) {
  return readdirSync(join(root, "skills")).filter((n) => n.endsWith("-pi")).map((n) => n.slice(0, -3)).sort();
}
export function compare(upstreamDir, root = ROOT) {
  const up = upstreamSkills(upstreamDir);
  const port = portSkills(root);
  const manifest = ["plugin.json", ".cursor-plugin/plugin.json"].map((p) => join(upstreamDir, p)).find(existsSync);
  const version = manifest ? JSON.parse(readFileSync(manifest, "utf8")).version : "unknown";
  return {
    version,
    baseline: UPSTREAM_VERSION,
    missing: up.filter((s) => !port.includes(s)),
    extra: port.filter((s) => !up.includes(s)),
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2];
  if (!dir || !existsSync(join(dir, "skills"))) {
    console.error("usage: node scripts/sync-upstream.mjs <path-to-upstream-pstack>");
    process.exit(2);
  }
  const r = compare(dir);
  console.log(JSON.stringify(r, null, 2));
  if (r.version !== r.baseline) console.log(`Upstream is ${r.version}; this port tracks ${r.baseline}. Review the upstream changes and port them by hand.`);
  process.exit(r.missing.length || r.extra.length ? 1 : 0);
}
