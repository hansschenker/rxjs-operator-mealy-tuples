# Plan migration record — 2 October 2026

## Source and destination

Source: [ROB-SN plan revision 1.0](https://github.com/hansschenker/rxjs-operator-behavior-set-notation/blob/69d32fdff0a368989ff76505c4884aedc49bfb33/docs/FAMILY-IMPLEMENTATION-PLAN.md), commit `69d32fdff0a368989ff76505c4884aedc49bfb33`, blob `ec0159bf33471c3bbd66776217c570c3a50ec5b3`.

Destination before this change: [Mealy-tuples c2bbd1c](https://github.com/hansschenker/rxjs-operator-mealy-tuples/tree/c2bbd1c780be4e0aff63a0a7027a80c0b44ce7ea), tree `c173d35d994adccb38ed6ac583f24aea889333ff`.

Read the complete source roadmap in overlapping ranges, the destination AGENTS, README, ROADMAP, VERIFICATION, package.json, and CHANGELOG. The existing foundation, execution contract, templates, model, test, and generated-file context was retained at that immutable destination revision. Both source repositories remain unchanged.

## Changes

Adapted the full roadmap as [FAMILY-IMPLEMENTATION-PLAN.md](FAMILY-IMPLEMENTATION-PLAN.md), revision 1.1. Kept all 34 IDs, eight phases, reference operators, assigned API identities, and inter-family dependencies. Added a separate F00 validation/reproducibility gate, retained F01 as partially started, and kept completed families at 0/34.

The primary vocabulary is S, S0, Z, A, T, G. The specification package includes guarded T/G tables, rule-linked obligations, diagrams/traces, evidence, and derived classification. Existing operator/model/generator/test paths and command names are reused; the original plan's not-yet-created harness is no longer a prerequisite. Future paths and commands are explicitly distinguished from existing ones.

Added [NEXT-SESSION.md](NEXT-SESSION.md); replaced the short ROADMAP with a synchronized summary; added README navigation and a next-step section; updated AGENTS and CHANGELOG. The original verification record, runtime implementation, tests, and generated views were not changed by this planning migration.

## Planning checks performed

A local planning check verified the seven authored/updated Markdown files for balanced code/display-math delimiters, local target paths against the inspected repository path inventory, consistent next-task/checkpoint language, and the absence of the old combined notation outside its existing crosswalk. Existing documents outside those seven were not rerun through the full repository checker.

The adapted family table was parsed and checked for F01–F34 exactly once, eight phase groups, unique ownership of 146 entries (113 P, 30 C, 3 X), and dependencies referring only to earlier family IDs. Assigned names/dependencies were cross-checked against the reviewed source-plan rows. F00 was excluded from the 34-family denominator. F01 alone is In progress; the remaining 33 are Planned.

This is **planning-structure validation**, not a fresh RxJS export audit, model-test run, runtime suite, generated-artifact check, Markdown renderer run, or equivalence proof. The npm clean-install prerequisite was checked against the [official npm ci documentation](https://docs.npmjs.com/cli/v10/commands/npm-ci/).

## Runtime evidence remains unchanged

The [initial verification record](VERIFICATION.md) reports 15 model tests passed, authored but unexecuted actual RxJS tests including 1,452 bounded comparisons, and a dependency-installation DNS failure. Those historical claims were not promoted to newly measured results. F00 requires actual installation, lockfile verification, full execution, and a new evidence record before its gate can close.

The working container could not resolve github.com for a direct clone; repository reads and saves use the GitHub connector. No new npm installation attempt or RxJS run was made by this plan-only change. Do not interpret a successfully saved plan as a successful F00 run.

The final commit identity is supplied by Git history and the session handoff after saving, not invented inside the commit being authored. Read back the saved revision before reporting publication as verified.
