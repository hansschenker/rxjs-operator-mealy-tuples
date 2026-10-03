# Next session — F02 mapping and per-value selection

**Checkpoint:** F00 and F01 completed for their declared scopes, 3 October 2026.  
**Repository:** hansschenker/rxjs-operator-mealy-tuples; branch main.  
**Current task:** F02 — Mapping and per-value selection. **Reference:** map.  
**Assigned entries:** P:map, P:filter, P:ignoreElements, P:mapTo, P:pluck.

Read current main, [AGENTS.md](../AGENTS.md), the [family tracker](FAMILY-IMPLEMENTATION-PLAN.md), [F01 evidence](../evidence/F01-prefix-selection.md), [F01 comparison](../families/F01-prefix-selection.md), and the [execution contract](EXECUTION-CONTRACT.md). Check for later work before starting. This is a user-initiated handoff, not scheduled execution.

## Reuse the completed baseline

Keep RxJS 7.8.2, the dependency lock, canonical S/S0/Z/A/T/G language, four prefix models, existing rule IDs, and all regression tests. Current recorded checks: 45 model tests, 68 RxJS tests, 6,534 bounded comparisons. There are twelve generated prefix views. Do not rebuild F00/F01 or treat their bounded execution notes as universal microstep models.

Run npm ci --ignore-scripts and npm run check. Use the existing read-only hosted workflow when local networking is unavailable and inspect completed results. Existing test:model/test:rxjs/generate/check:generated/check:docs scripts must include all new files before completion. No test:family command is promised.

## Bounded F02 profiles

| Entry | Required analysis |
|---|---|
| map | Value transformation, indexed projection, callback return/throw, payload identity, lifecycle forwarding |
| filter | Predicate selection versus transformation, index on suppressed inputs, source completion/error/cancellation |
| ignoreElements | Suppression of next notifications while preserving the relevant terminal and resource behavior |
| mapTo | Fixed configured value and delegation/compatibility compared with map; exact API/overload limits |
| pluck | Property-path traversal and delegation, missing/nullish path behavior, construction/argument edges; derive from the pinned source rather than assuming all map-like APIs coincide |

Read implementations, delegated helpers and upstream tests. Use functional named domain functions. Declare supported arguments, overloads, callback assumptions, exception origins, resource ownership, and exclusions. Legacy/deprecated names remain valid subjects on the 7.8.2 baseline; no migration is part of this package.

## Deliverables and discriminating checks

Produce five canonical dispositions (a verified compatibility appendix is allowed where justified), guarded tables, linked model/RxJS tests, diagrams/traces, a family comparison, and evidence/F02-value-selection.md. The F01 filter contrast is a fixture, not an existing complete filter profile.

Distinguish changing a payload from deciding whether any payload is emitted. Show rejected inputs still advancing a predicate index, intentional [] output versus Next(undefined), callback failures, empty/never inputs, source terminals, external cancellation, and independent subscriptions. Compare output timing and source lifetimes, not just final values. Include construction versus subscription observations where the exact API needs them. Reentrancy stays excluded unless separately specified and observed.

Extend the generator and documentation checker without duplicating or hand-editing generated artifacts. Update the qualified coverage index while preserving all owning-family assignments. Add new tests to the aggregate regression suite; keep expected fixtures independent of the actual evaluator. Do not broaden a profile simply because a finite sample passes.

## Completion and next task

Complete F02 only after its declared profiles, source review, views, tests, evidence, full regression checks, tracker updates, and saved revision are verified. Advance completion to 2/34 only then. On failure, retain In progress/Blocked with the actual reason; F01's success does not excuse a new regression.

After F02, the default next family is F03 — Distinctness and adjacent-value memory. Do not implement F03 as an unannounced extension to this session.

> Implement F02 from this handoff and the current family plan, preserving RxJS 7.8.2 and the F00/F01 baseline. Derive the six-tuples, tables, tests and visualizations, run and record actual checks, update coverage and progress, save to main without force, and verify the final commit.
