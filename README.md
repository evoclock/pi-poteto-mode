# @evoclock/pi-poteto-mode

pstack for Pi, published as pi-poteto-mode. I ported all 54 skills of Lauren Tan's
[pstack](https://github.com/cursor/plugins/tree/main/pstack) **v0.15.25** to the
[Pi coding agent](https://pi.dev), keeping each skill as close to the upstream
text as Pi allows. This package holds only the port. It adds no extensions and
no workflows of my own.

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

Each skill carries a `-pi` suffix so it can sit next to other pstack ports.

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
