# Next session — F01 prefix-family continuation

**Checkpoint:** F00 completed, 2 October 2026; plan revision 1.1.  
**Repository:** `hansschenker/rxjs-operator-mealy-tuples`, branch `main`.  
**Current task:** F01 — Taking and dropping prefixes.  
**After complete F01:** F02 — Mapping and per-value selection.

Read [AGENTS.md](../AGENTS.md), the authoritative [family plan](FAMILY-IMPLEMENTATION-PLAN.md), [F00 evidence](../evidence/F00-baseline-validation.md), and the [execution contract](EXECUTION-CONTRACT.md) from current main. Check for work saved after this handoff. This is a user-initiated session brief, not scheduled family implementation.

## Reuse the validated baseline

F00 is complete: the committed npm lockfile passed clean installation, 15 model tests and 14 actual RxJS tests passed, including all 1,452 bounded comparisons, and generated views reproduced without drift. Read the actual run references and limits in F00 evidence. Keep RxJS 7.8.2 and the existing script names; no new framework or replacement RxJS runtime is needed.

Use `npm ci --ignore-scripts`, then `npm run check`. The committed GitHub Actions workflow provides a connected runner when local networking is unavailable. Inspect its actual result; do not equate a triggered run with a pass. It has read-only repository permissions and never publishes or commits automatically.

Preserve `operators/takeWhile.md`, `model/takeWhile.ts`, TW01–TW08, the generator, and existing tests. Do not rebuild F00 or mark the entire prefix family complete because its reference passed baseline tests.

## Exact family scope

| Entry | Work required |
|---|---|
| takeWhile | Retain the indexed Boolean predicate and explicit inclusive false/true profile; check the omitted-default-argument form and complete family-level evidence |
| skipWhile | Specify initial skipping and later forwarding; include the failing boundary and verify that predicate calls stop after it |
| take | Specify nonnegative integer counts, including zero, one, and parameterized positive counts; activation and early cancellation |
| skip | Specify nonnegative integer counts, including zero, one, and parameterized positive counts; prefix suppression and continued participation |

Read the pinned implementations, delegated helpers, Subscriber/Subscription behavior, and relevant upstream tests. Use the six sections S, S0, Z, A, T, G. Keep completion, error, cancellation, and disposal distinct. Declare unsupported counts, predicate return forms, overload narrowing, mutation, and reentrancy explicitly.

## Required comparison and boundary checks

Use independent subscriptions to values 2, 4, 7, 1 followed by completion, with predicate `value < 5` and counts of two. Compare default/exclusive takeWhile, inclusive takeWhile, skipWhile, take(2), and skip(2). Assert source subscription intervals and terminal timing as well as values.

Include first-value rejection, always-true predicates, empty/never, source error, callback throw, callback indexes/call counts, take(0) versus skip(0), count boundaries, external cancellation, and cooperative synchronous production. A filter comparison is only a contrast fixture, not completion of F02.

The existing takeWhile macrostep model excludes cancellation during emission and reentrant callbacks. Preserve that scope. Add an execution-boundary note with separate discriminating observations, or a separately named finer model; never force nested execution through an atomically installed final state.

## Deliverables and completion gate

Produce four canonical profiles, guarded rule-ID tables, test obligations, state diagrams and time/resource traces, a family comparison, model and real RxJS tests, an initialized qualified coverage index, and `evidence/F01-prefix-selection.md`. Reuse existing locations and give new rules noncolliding IDs. Extend the generator incrementally; do not hand-edit generated artifacts.

Make all new tests part of npm test and all new generated views part of check:generated. Preserve independent expected fixtures. Run the complete baseline and family regression checks on the final tree, inspect generated drift, and record actual evidence. The old proposed test:family command still does not exist unless deliberately implemented and verified in this session.

Update coverage, the family tracker, README, ROADMAP, this handoff, verification evidence, and CHANGELOG together. Save to main without force, preserve unrelated edits and attribution, and verify the commit/check results. A failed core check leaves F01 unfinished; F00's historical success does not excuse a new regression.

F01 is Complete only for explicitly declared profiles after every assigned identity satisfies the family gate. Until then completed families remain 0/34. Advance to F02 only after that verified checkpoint.

## Session-start instruction

> Implement F01 from docs/NEXT-SESSION.md and section 9 of docs/FAMILY-IMPLEMENTATION-PLAN.md using current main. Reuse the F00-validated takeWhile model, rule IDs, lockfile, tests, and generator; add skipWhile, take, and skip. Keep RxJS 7.8.2 and canonical six-tuple language, derive tables/tests/visualizations, run and record actual checks, update coverage and progress, save, and verify the commit.
