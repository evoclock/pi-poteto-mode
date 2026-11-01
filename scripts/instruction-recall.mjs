#!/usr/bin/env node
// Diagnostic instruction-unit recall, plus explicit source-order tests elsewhere.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const STOP = new Set('the a an of and or to in on for with is are be it this that your you when then from into before after only each every what which more than have does dont not'.split(' '));
const contentWords = text => new Set((text.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) || []).filter(word => word.length > 3 && !STOP.has(word)));
export const sourceProcedure = text => [...text.matchAll(/<!-- pstack-source:start -->\n([\s\S]*?)<!-- pstack-source:end -->\n/g)].map(match => match[1]).join('');

export function units(text) {
  const result = []; let current = [];
  for (const line of text.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')) {
    if (/^\s*(?:[-*]|\d+\.)\s+/.test(line) || line.startsWith('#')) {
      if (current.length) result.push(current.join(' '));
      current = line.startsWith('#') ? [] : [line];
    } else current.push(line);
  }
  if (current.length) result.push(current.join(' '));
  return result.filter(unit => contentWords(unit).size >= 4);
}

export function instructionRecall(upstream, port) {
  const source = units(upstream); if (!source.length) return 1;
  const available = contentWords(port);
  return source.filter(unit => {
    const words = [...contentWords(unit)];
    return words.filter(word => available.has(word)).length / words.length >= 0.4;
  }).length / source.length;
}

export function checkRecall(snapshot, read, divergenceTable = '') {
  const exceptions = new Set([...divergenceTable.matchAll(/^\|\s*((?:skill|principle|playbook):[a-z0-9-]+)\s*\|/gm)].map(match => match[1]));
  const rows = [];
  for (const [group, values] of [['skills', snapshot.skills], ['playbooks', snapshot.playbooks]]) {
    for (const [slug, source] of Object.entries(values)) {
      const kind = group === 'playbooks' ? 'playbook' : slug.startsWith('principle-') ? 'principle' : 'skill';
      const path = group === 'playbooks' ? `skills/poteto-mode-pi/playbooks/${slug}.md` : `skills/${slug}-pi/SKILL.md`;
      const score = instructionRecall(source, sourceProcedure(read(path)));
      const floor = kind === 'skill' ? 0.6 : 0.8;
      const exempted = score < floor && exceptions.has(`${kind}:${slug}`);
      rows.push({ kind, slug, score, floor, exempted, passed: score >= floor || exempted });
    }
  }
  return rows;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const read = path => readFileSync(join(ROOT, path), 'utf8');
  const rows = checkRecall(JSON.parse(read('tests/fixtures/upstream-0.15.36.json')), read, read('docs/adaptation-guide.md'));
  console.log(JSON.stringify(rows, null, 2));
  if (rows.some(row => !row.passed)) process.exitCode = 1;
}
