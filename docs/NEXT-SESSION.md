# Next session — F03 distinctness and adjacent-value memory

**Checkpoint:** F00, F01 and F02 completed for their declared scopes, 3 October 2026.  
**Repository:** hansschenker/rxjs-operator-mealy-tuples; branch main.  
**Current task:** F03 — Distinctness and adjacent-value memory. **Reference:** distinctUntilChanged.  
**Assigned entries:** P:distinctUntilChanged, P:distinctUntilKeyChanged, P:distinct, P:pairwise.

Read current main, [AGENTS.md](../AGENTS.md), the [family tracker](FAMILY-IMPLEMENTATION-PLAN.md), [F02 evidence](../evidence/F02-value-selection.md), the [F02 comparison](../families/F02-value-selection.md), and the [execution contract](EXECUTION-CONTRACT.md). Check for later work before starting. This is a user-initiated handoff, not scheduled execution.

## Preserve the validated baseline

Keep RxJS 7.8.2, TypeScript 5.8.3, the dependency lock, nine scoped profiles, 60 transition IDs plus PL-C00, all 27 generated views, and all prior assertions. The executable checkpoint passed 88 model tests and 142 actual RxJS tests, with 13,584 bounded comparisons. Final package/run boundaries are recorded in F02 evidence.

Use npm ci --ignore-scripts and npm run check. When local networking fails, reuse the read-only hosted workflow and inspect its completed result. Do not equate triggering CI with passing it. Reuse existing script names; add new test/view files to the aggregate commands. Do not rebuild F00/F01/F02 or silently introduce a generic replacement Observable runtime.

## Bounded F03 profiles to establish

| Entry | Questions the analysis must resolve from pinned source |
|---|---|
| distinctUntilChanged | What key/value is retained: prior input or prior emitted value? What happens on the first input? Which comparison/key-selection rules and exceptions apply? |
| distinctUntilKeyChanged | How does configured property access and optional comparison delegate? Which missing/nullish values and errors are in scope? |
| distinct | What key set is retained, how can it grow, and what does a flush notifier's next/complete/error do? Which subscription order and ownership apply? |
| pairwise | What is remembered after the first value, when is a pair emitted, and does completion invent a partial pair? What identity/snapshot guarantees are observed? |

Inspect the four implementations, delegated helpers, and relevant upstream tests on 7.8.2. Specify exact callback/configuration domains, default versus custom comparison, equality boundary fixtures such as repeated references and NaN where applicable, reset/flush policies, notifier timing and subscription order. Derive actual answers rather than copying an intuitive operator-name description.

Use S, S0, Z, A, T, G. Distinguish first-value absence from a valid undefined payload. Keep ordered pairs/buffers as sequences, not sets; name a set only where membership, not order, is the relevant state. Shared source execution is not implicit.

## Deliverables and discriminating checks

Four canonical dispositions, guarded rule-ID tables, independent model fixtures and RxJS tests, state diagrams/traces, a family comparison, and evidence/F03-distinctness.md. Use a repeated-value history that distinguishes previous input, last emitted key, all previously seen keys, and adjacent pairs. Check first input, empty/never, source complete/error, callback/key failures, cancellation, independent subscriptions, and notifier cases where applicable.

Declare bounds and exclusions for unbounded retained keys and callback-dependent policies. Reentrancy remains excluded unless separately modeled and tested; prior execution-boundary tests are not generic microstep semantics. Verify timing, subscription lifetimes, and disposal as well as final values. Link every observed quality to rules and evidence before assigning classification tags.

Extend the current generator and documentation checker; do not edit generated views by hand. Keep all existing outputs unchanged unless a reviewed cross-cutting correction is explicitly justified and regression-tested. Update the 146-identity coverage index without changing ownership assignments silently.

## Completion and handoff

Run full regression, type, generated-view and document checks on the final tree. Record actual source/run scope and limitations, update README, coverage, family tracker, ROADMAP, verification and CHANGELOG, save to main without force, and verify the final commit and CI result. A failure leaves F03 In progress/Blocked rather than advancing the count.

F03 completion advances families to 3/34 only for the declared profiles. After F03 the next default family is F04 — Search and cardinality constraints. Do not implement F04 as an unannounced extension.

> Implement F03 from this brief and the current family plan, preserving the F00/F01/F02 baseline and RxJS 7.8.2. Derive and validate the six-tuples, tables, tests and visualizations, record evidence, update progress, save to main, and verify the result.
