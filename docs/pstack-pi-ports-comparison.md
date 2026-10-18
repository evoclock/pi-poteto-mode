# pstack ports for Pi: comparison

Date: 18 Oct 2026

I compared nine published Pi packages that port pstack against upstream pstack v0.15.25 (54 skills, MIT, published from `cursor/plugins/pstack`).

## Method

- Contents: each package was fetched with `npm pack --ignore-scripts` and unpacked. Nothing was installed and no install script ran.
- Metadata: `npm view` for version, publish dates, repository, license, peer dependencies, scripts and size.
- Fidelity: for each skill present in both upstream and the package, I compared `SKILL.md` byte for byte with upstream v0.15.25.
- Maintenance: stars, open issues and last push come from the GitHub API on 18 Oct 2026.
- Ranking: by coverage of current upstream skills, maintenance activity and install-time behaviour, with the identical count as a secondary signal.
- Limitation: the upstream GitHub clone was not accessible, so the upstream baseline is the locally installed v0.15.25 plugin. Some packages were built from older upstream versions, which lowers their identical counts.

## Ranked table

| # | Package | Version / last publish | Skills (missing / added) | Identical `SKILL.md` | Pi mapping of subagents, hooks and model roles | Install scripts / notes | Stars / open issues / last push | Hardcoded model ids |
|---|---|---|---|---|---|---|---|---|
| 1 | pi-herdr-pstack ([npm](https://www.npmjs.com/package/pi-herdr-pstack), [pi.dev](https://pi.dev/packages/pi-herdr-pstack)) | 0.3.2 / 16 Oct 2026 | 51 (missing in-your-own-words, ketchup, sharpen) | 13/51 | Pi extension for mode, setup and config; subagents through the `pi-herdr-agents` peer dependency | None; ships THIRD_PARTY_NOTICES and a changelog | 2 / 0 / 16 Oct 2026 | Almost none |
| 2 | @casualjim/pi-pstack ([npm](https://www.npmjs.com/package/@casualjim/pi-pstack), [pi.dev](https://pi.dev/packages/@casualjim/pi-pstack)) | 0.1.14 / 17 Oct 2026 | 50 (missing in-your-own-words, make-bot-ui, setup-pstack, sharpen) | 19/50 | Model roles through a config-backed roles extension | None; tarball includes `node_modules` (about 37 MB, 1,182 files) | 12 / 1 / 17 Oct 2026 (repo `casualjim/pi-mimir`) | Some model family names |
| 3 | @mccune1224/pi-pstack ([npm](https://www.npmjs.com/package/@mccune1224/pi-pstack), [pi.dev](https://pi.dev/packages/@mccune1224/pi-pstack)) | 0.2.0 / 13 Sep 2026 | 46 + 4 added (control-cli, control-ui, create-skill, deslop); 8 missing | 7/46 | Context guard, compaction and doctor extensions; upstream sync script and sync check | None | 2 / 2 / 13 Sep 2026 | Yes |
| 4 | @whamp/pi-pstack ([npm](https://www.npmjs.com/package/@whamp/pi-pstack), [pi.dev](https://pi.dev/packages/@whamp/pi-pstack)) | 0.10.1 / 12 Oct 2026 | 46 + code-review, deslop; 8 missing | 10/46 | Configurable model roles; ask-user-question tool | `postinstall` symlinks skills into `~/.agents/skills` (keeps existing entries; opt out with `PI_PSTACK_SKIP_SKILL_LINKS=1`) | 1 / 4 / 15 Oct 2026 | No |
| 5 | @zenspc/pi-pstack ([npm](https://www.npmjs.com/package/@zenspc/pi-pstack), [pi.dev](https://pi.dev/packages/@zenspc/pi-pstack)) | 0.6.0 / 9 Sep 2026 | 46 + deslop; 8 missing | 6/46 | Config plus a skill-strip extension | None | 10 / 6 / 9 Sep 2026 | No |
| 6 | potetos-for-everyone ([npm](https://www.npmjs.com/package/potetos-for-everyone), [pi.dev](https://pi.dev/packages/potetos-for-everyone)) | 0.1.0 / 10 Sep 2026 | 49 (adds triage-issue-reports, reproduce-and-fix-issues); 7 missing | 0/47 shared | Multi-agent installer with hooks and adapters rather than a native Pi package; based on upstream v0.15.0 | `postinstall` writes skills into the current project on a local install | 15 / 1 / 10 Sep 2026 | No |
| 7 | poteto-pi ([npm](https://www.npmjs.com/package/poteto-pi), [pi.dev](https://pi.dev/packages/poteto-pi)) | 0.1.0 / 5 Sep 2026 | 44 + loop; 10 missing | 1/44 | Generates 37 subagent files; memory, todo and update-check extensions | None | 0 / 0 / 5 Sep 2026 | Yes, in every generated agent |
| 8 | @0xrsydn/pstack-pi ([npm](https://www.npmjs.com/package/@0xrsydn/pstack-pi), [pi.dev](https://pi.dev/packages/@0xrsydn/pstack-pi)) | 0.15.1 / 27 Aug 2026 | 44; 10 missing | 1/44 | Own subagent extension | None; npm repository field points to `cursor/plugins` | 6 / not checked / 14 Oct 2026 | Yes |
| 9 | pi-pstack ([npm](https://www.npmjs.com/package/pi-pstack), [pi.dev](https://pi.dev/packages/pi-pstack)) | 0.1.0 / 8 Aug 2026 | 44; 10 missing | 1/44 | Basic agents extension | None; no repository field on npm | 8 / not checked / 8 Aug 2026 | No |

Skills missing from most packages: sharpen, in-your-own-words, ketchup, benchmark-checklist, correct, poteto-help, principle-explain-the-number and make-bot-ui.

## Findings

- No package is a faithful, complete port of v0.15.25. The highest identical count is 19 of 50.
- potetos-for-everyone is a rewrite (none of its 49 `SKILL.md` files is identical to upstream, including the 47 that share an upstream name), so it cannot claim parity with upstream.
- All nine are MIT. Only pi-herdr-pstack and potetos-for-everyone ship a notice file crediting upstream.
- Upstream itself names specific models. poteto-pi, @0xrsydn/pstack-pi and @mccune1224/pi-pstack add further hardcoded model ids.
- Two packages write outside their install directory from `postinstall`: @whamp/pi-pstack and potetos-for-everyone.
- This package covers all 54 upstream skills as `*-pi` adaptations. I did not byte-compare them, because they are adapted for Pi on purpose.

## Name clash

The unscoped npm name `pi-pstack` is taken (one publish, 8 Aug 2026). `@mccune1224/pi-pstack`, `@whamp/pi-pstack`, `@zenspc/pi-pstack` and `@casualjim/pi-pstack` use the same name under their own scopes. This package publishes as `@evoclock/pi-poteto-mode`.

## Decision

I maintain this port myself so I can keep it close to upstream and cover the gaps above without inheriting other packages' design choices.
