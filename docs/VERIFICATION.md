> **Current status: F00, F01 and F02 complete for their declared scopes.** The dated entries below are retained as history; initial unexecuted-runtime statements do not describe the current status. See the newest F02 entry and [F02 evidence](../evidence/F02-value-selection.md).

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

## F01 completed — 3 October 2026

The prefix family now has four source-backed profiles: takeWhile, skipWhile, take, and skip. [F01 evidence](../evidence/F01-prefix-selection.md) records a successful clean-install hosted run on `9e30a4058201b17a35d6141fe9ebdf935bfae7f3`: **45 model tests, 68 actual RxJS tests, all 6,534 bounded comparisons**, and four separately scoped execution-boundary observations. No original takeWhile assertion/model was changed. Final documentation/generator validation is performed again on the complete saved revision.

The three new profiles add nine generated views; all twelve views and all 45 Markdown files pass local consistency checks. The family coverage index records four scoped identities, 142 still planned, and **1/34 completed families**, not exhaustive API equivalence. The next task is **F02 — Mapping and per-value selection**. Historical F00 evidence above is retained as history; its earlier next-F01 statements do not override this checkpoint.

## F02 completed — 3 October 2026

[F02 evidence](../evidence/F02-value-selection.md) records successful hosted run 37122505531 on code revision `95c8bdb7eaa73e1f6105b5145efe19a81305b4e9`: **88 model tests, 142 actual RxJS tests, all 13,584 bounded comparisons**, including 7,050 new F02 comparisons. Property, identity, empty-path construction, callback/index, lifetime and cancellation fixtures passed. All original prefix models/assertions and dependency pins/lock remain unchanged. No expectation or model was weakened to obtain a pass.

The completed family package adds five profiles, five test plans and fifteen generated views. The final documentation/generator check is repeated on its saved revision; local checks cover all 27 views and 73 Markdown files. The executable checkpoint's 45-document/12-view check is not relabeled as that later validation. See the exact revision/run boundaries in evidence.

The current checkpoint is **2/34 families**, **nine scoped identities** and **137 Planned identities**; next is **F03 — Distinctness and adjacent-value memory**. This entry supersedes earlier dated next-session statements without erasing them. Bounded runtime tests are not exhaustive equivalence or renderer validation.
