> **Current status: F00 complete.** The original entry below is retained as history; its unexecuted-runtime statements describe the initial checkpoint, not the current status. See the F00 entry at the end and [F00 evidence](../evidence/F00-baseline-validation.md).

# Verification record — 2 October 2026

## Baseline and reviewed evidence

RxJS 7.8.2. The [references](REFERENCES.md) and [companion review](COMPANION-REVIEW.md) identify pinned project sources and the operator/helper/test files inspected. The companion review sampled selected documents; it is not a full catalogue audit. Neither predecessor repository was modified.

## Checks actually completed in the working environment

| Check | Result | What it establishes |
|---|---|---|
| `tsc -p tsconfig.json` | Passed with TypeScript 5.8.3 | The reference model satisfies the selected strict type checks |
| `npm run test:model` | 15 passed, 0 failed | Independent fixtures cover TW01–TW08, initial state, callback-once behavior, and settled terminal attempts |
| `npm run generate` | Created three artifacts | Table, control-state diagram source, and model-predicted trace |
| `npm run check:generated` | Passed | Checked-in generated text matches the current descriptors/reference trace |
| `node --check tests/rxjs.test.mjs` | Passed | JavaScript syntax only; imports and runtime assertions are not validated by this check |
| `python3 scripts/check_docs.py` | Passed | Local Markdown targets, selected delimiters, source-version links, canonical vocabulary, and profile heading order |

Runtime environment for these checks: Node 22.16.0, npm 10.9.2, globally available TypeScript 5.8.3. Node's type-stripping feature emitted an experimental warning; the model tests completed successfully.

## Checks not completed

`npm install --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=12000` failed with `EAI_AGAIN` while resolving `registry.npmjs.org`. Therefore the actual RxJS runtime suite and its 1,452 bounded comparisons were **not executed**. The all-in-one `npm run check` must not be described as passing.

The repository pins direct RxJS and TypeScript versions but does not contain a generated dependency lockfile at this checkpoint. After a successful installation, a lockfile and updated execution evidence can be committed. No package audit result is claimed.

No exhaustive conformance proof, full operator catalogue validation, real-browser timing validation, CI execution, or Mermaid renderer run was performed. Generated diagram text was inspected structurally; visual layout is not certified. Counterexample sampling and matching rule IDs do not prove semantic completeness.

## Interpretation of the results

Reference-model tests validate the authored model against its fixtures. They do not demonstrate that RxJS implements it. The runtime suite is the separate intended comparison, using notifications, predicate arguments, source subscription intervals, and owned teardown. It needs a successful actual run before the profile can be labeled selectively RxJS-tested.

The generated table and diagram use reviewed textual descriptors, not a general executable specification language. The trace uses the reference evaluator. Reproducible generation prevents stale files, not mistaken semantics.

## Next verification gate

In a connected environment, run `npm install --ignore-scripts`, then `npm run check`. Investigate any failures, record actual commands/results, and update this record and the profile statuses together. Do not convert an authored test obligation into a passing test merely by changing its status label.

## F00 completed — 2 October 2026

A fresh local npm attempt again failed DNS resolution. The existing harness was then executed successfully on GitHub-hosted Ubuntu using Node 22.16.0, npm 10.9.2, Python 3.12.3, TypeScript 5.8.3, and RxJS 7.8.2. The npm-generated lockfile was reviewed, hash-verified, committed, and independently exercised by a clean npm ci run.

[Locked run 36968623943](https://github.com/hansschenker/rxjs-operator-mealy-tuples/actions/runs/36968623943) passed: **15 model tests**, **14 actual RxJS tests**, **all 1,452 bounded comparisons inside the RxJS suite**, type checking, the three generated-view checks, and documentation checks. Regeneration produced no drift and a second aggregate check passed. See [F00 evidence](../evidence/F00-baseline-validation.md) for exact revisions, commands, logs, checksums, and limits. No operator model or assertion was repaired or weakened.

The historical missing-lockfile and unexecuted-RxJS blocker is resolved for the hosted environment. This is selective runtime evidence for the existing scope, not exhaustive equivalence or a rendered-diagram check. The initial evidence above remains unchanged. The next task is **F01 — Taking and dropping prefixes**, not another F00 setup pass.
