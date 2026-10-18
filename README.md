# @evoclock/pi-poteto-mode

The skills in this package are **[pstack](https://github.com/cursor/plugins/tree/main/pstack)
by Lauren Tan** (v0.15.25, MIT). Copyright stays with Lauren Tan. I adapted all
54 skills for the [Pi coding agent](https://pi.dev) to keep a port that is
maintainable and close to the upstream text, and to cover the gaps I found in
other Pi ports. This package holds only the adaptation; it adds no extensions or
workflows of my own.

I compared the other published Pi ports in
[docs/pstack-pi-ports-comparison.md](docs/pstack-pi-ports-comparison.md).

## Install

```sh
pi install npm:@evoclock/pi-poteto-mode
```

Add `-l` to install it for the current project only. Remove it with
`pi remove npm:@evoclock/pi-poteto-mode`.

## Set up roles

The skills never name a model. They ask for two roles, `development` and
`independent-review`, which you map once per project:

1. Run `/skill:setup-pstack-pi`, or copy
   `config/pstack-model-roles.v1.example.json` to `.pi/pstack-model-roles.v1.json`
   in your repository.
2. Set each role to an exact `provider/modelId` from your own Pi setup. The two
   roles must differ.

Keep that file out of version control if it names your own models. Until it is
filled in, skills that need a role stop and tell you to run setup.

## Skills

Each skill carries a `-pi` suffix. Another package that ships skills with the
same names will clash: Pi keeps the first one it finds and warns. To load this
package's copies, exclude the other package's duplicates in your Pi settings,
for example `{ "source": "npm:other-package", "skills": ["!skills/*-pi"] }`.

- `architect-pi`
- `arena-pi`
- `automate-me-pi`
- `benchmark-checklist-pi`
- `blast-radius-pi`
- `bro-pi`
- `correct-pi`
- `create-verification-skill-pi`
- `figure-it-out-pi`
- `how-pi`
- `in-your-own-words-pi`
- `interrogate-pi`
- `ketchup-pi`
- `maintain-verification-skill-pi`
- `make-bot-ui-pi`
- `no-comments-pi`
- `poteto-help-pi`
- `poteto-mode-pi`
- `principle-attack-the-premise-pi`
- `principle-boundary-discipline-pi`
- `principle-build-the-lever-pi`
- `principle-encode-lessons-in-structure-pi`
- `principle-exhaust-the-design-space-pi`
- `principle-experience-first-pi`
- `principle-explain-the-number-pi`
- `principle-fix-root-causes-pi`
- `principle-foundational-thinking-pi`
- `principle-guard-the-context-window-pi`
- `principle-laziness-protocol-pi`
- `principle-make-operations-idempotent-pi`
- `principle-migrate-callers-then-delete-legacy-apis-pi`
- `principle-minimize-reader-load-pi`
- `principle-model-the-domain-pi`
- `principle-never-block-on-the-human-pi`
- `principle-outcome-oriented-execution-pi`
- `principle-prove-it-works-pi`
- `principle-redesign-from-first-principles-pi`
- `principle-separate-before-serializing-shared-state-pi`
- `principle-sequence-verifiable-units-pi`
- `principle-subtract-before-you-add-pi`
- `principle-test-behavior-not-implementation-pi`
- `principle-type-system-discipline-pi`
- `recall-pi`
- `reflect-pi`
- `setup-pstack-pi`
- `sharpen-pi`
- `show-me-your-work-pi`
- `swarm-pi`
- `tdd-pi`
- `teach-pi`
- `technical-writing-pi`
- `typescript-best-practices-pi`
- `unslop-pi`
- `why-pi`

## Keeping up with upstream

`node scripts/sync-upstream.mjs <path-to-upstream-pstack>` compares the port with
a local copy of upstream and lists missing or extra skills and the upstream
version. It only reads. I port upstream changes by hand and review each one.

## Tests

`npm test` checks that every upstream skill is present, that frontmatter is
valid, that no model names or personal paths ship, and what `npm pack` would
publish.

## Licence

MIT; see [LICENSE](LICENSE). The upstream skills are by Lauren Tan,
MIT; see [NOTICE](NOTICE).
