# Installed-only TLC on macOS

This is the Pi execution path, not the retained source's self-installing CLI. No mise, package manager, download or network bootstrap is called. Mermaid and images are views only, never a TLA+ proof.

## Detect before running

From the approved repository, run the adapter by its actual package path:

```sh
node <skill-dir>/scripts/run-tlc.mjs --check
```

`<skill-dir>` is the installed `statechart-pi` directory, not a shell literal. The adapter looks for executable `tlc` on PATH. Alternatively, only when the task approves an already installed tools jar, select its exact path with `TLA2TOOLS_JAR`; Java must already be on PATH. It then invokes `java -cp <approved-jar> tlc2.TLC`. A missing selected jar does not fall back to another checker.

Detection returns `available-not-run`, not a proof. No `tlc` or selected approved checker means `blocked` and exit 3. Do not fetch a jar or install Java to turn this into a pass. On a Mac with only the system Java stub, actual execution may still fail; inspect the real output and report that failure.

## Run a bounded model

Create a real `.scratch/` directory inside the approved git repository. Put the reviewed `.tla` model, its `.cfg`, and any model dependencies there. Keep the source code and its bounds/assumptions in view; do not weaken an invariant to pass.

```sh
node <skill-dir>/scripts/run-tlc.mjs --spec .scratch/model/Spec.tla --config .scratch/model/Spec.cfg --out .scratch/tlc/run-01 --timeout-seconds 60
```

The helper rejects paths and symlinks escaping repository scratch. The output directory must be new, so earlier evidence is not overwritten. It runs one TLC worker, uses an explicit config and local metadata directory, and stops a command that exceeds the bounded timeout. It writes `tlc.out` and `result.json` under that output directory.

- `checked-no-errors`, exit 0: TLC exited zero and emitted its completed no-error summary. This covers only that model/config, bounds and assumptions, not all product behavior.
- `failed`, exit 1: TLC exited nonzero. Inspect the output for a counterexample, configuration error or missing runtime; replay a bug path on actual code before claiming a product finding.
- `blocked`, exit 3: missing checker, invalid path, timeout, incomplete output or zero exit without a completed TLC summary. Never label this verified.

The helper does not derive shortest bug paths, render a chart, or install the upstream chart pipeline. Interpret actual counterexamples and limits under the retained statechart procedure; use an approved view renderer separately if present. Diagram success cannot change the TLC result, and a TLC pass does not establish that the model describes the code. Missing checker evidence and the live Pi smoke gate must remain visible in the review handoff.
