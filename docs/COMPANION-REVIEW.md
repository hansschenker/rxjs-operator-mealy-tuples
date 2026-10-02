# Lessons from rxjs-operator-mealy-analysis

**Reviewed snapshot:** [402f007](https://github.com/hansschenker/rxjs-operator-mealy-analysis/tree/402f00708c3ddb40ca451775fe38f9d80b4b90ed), inspected 2 October 2026.  
**Original attribution:** that repository names **SuperGrok** as its main contributor and Hans Schenker as repository owner. This review preserves that attribution; it does not relabel its work as ours.

## Scope of this review

Read the [README](https://github.com/hansschenker/rxjs-operator-mealy-analysis/blob/402f00708c3ddb40ca451775fe38f9d80b4b90ed/README.md), [methodology](https://github.com/hansschenker/rxjs-operator-mealy-analysis/blob/402f00708c3ddb40ca451775fe38f9d80b4b90ed/docs/methodology.md), [test-plan method](https://github.com/hansschenker/rxjs-operator-mealy-analysis/blob/402f00708c3ddb40ca451775fe38f9d80b4b90ed/docs/test-plan.md), [custom-operator checklist](https://github.com/hansschenker/rxjs-operator-mealy-analysis/blob/402f00708c3ddb40ca451775fe38f9d80b4b90ed/docs/custom-operator-checklist.md), the takeWhile analysis/test plan, and sampled every/defaultIfEmpty analyses. This is **not** an audit of all 136 analyses claimed by its README.

Its sources are described as the 7.x tree at `e5351d02e225e275ac0e497c7b66eaa5f0c88791`. This repository instead pins **7.8.2**; those identifiers were not assumed equivalent. Reviewed discrepancies below are already visible within the sampled documents and were checked against the named 7.8.2 implementations.

## Adopted ideas

| Idea | Adoption here |
|---|---|
| Six named sections in a stable order | Every profile uses S, S0, Z, A, T, G |
| Plain language before formulas | Begin with values, triggers, policy, and scope |
| Empty and multi-letter output words | G produces A*, including [] and ordered final emissions |
| A separate artifact per operator | Profiles, test plans, generated views, and explicit evidence |
| Explicit source edge cases | Completion, error, unsubscription, callback indexes, and setup are reviewed |
| A custom-operator checklist before coding | Adapted using public RxJS APIs and an explicit execution contract |
| Tables and test plans derived from analysis | Shared rule IDs link each expected T/G result to checks and diagrams |

## Concrete sampled discrepancies: do not import unchanged

| Sample | What the reviewed document contains | Correct scoped reading and lesson |
|---|---|---|
| [every](https://github.com/hansschenker/rxjs-operator-mealy-analysis/blob/402f00708c3ddb40ca451775fe38f9d80b4b90ed/operators/conditional/every.md) | Its G section has passing input silent and failing input producing false then complete; its table reverses those two outputs. | Preserve the G/source behavior: pass emits nothing; first failure emits false then completes. Test guard-to-output pairing, not just the presence of rows. |
| [defaultIfEmpty](https://github.com/hansschenker/rxjs-operator-mealy-analysis/blob/402f00708c3ddb40ca451775fe38f9d80b4b90ed/operators/conditional/defaultIfEmpty.md) | Its table puts default emission plus completion on `seen × next`, and combines completion without retaining the empty/seen guard. | Ordinary values are forwarded; only completion in the empty state emits the default. Preserve guards when deriving tables. |
| [takeWhile](https://github.com/hansschenker/rxjs-operator-mealy-analysis/blob/402f00708c3ddb40ca451775fe38f9d80b4b90ed/operators/filtering/takeWhile.md) | Its source-complete table output is described as not named on a separate output row, while error/unsubscribe are absent from the listed active transition/output rules. The table also uses `finished` beside declared `stopped`. | Source completion must have an explicit Complete output, source error its Error output, and unsubscription disposal without Complete. Use declared states consistently; omission is not silence. |

Primary checks: [every.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/every.ts), [defaultIfEmpty.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/defaultIfEmpty.ts), [takeWhile.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/takeWhile.ts), [OperatorSubscriber.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/OperatorSubscriber.ts), and the inspected portion of [takeWhile upstream tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/takeWhile-spec.ts).

These findings justify targeted safeguards, not a conclusion that every other analysis is wrong. No changes were made to the companion repository.

## Method refinements

**A row is a test obligation, not necessarily one complete test.** Symbolic rows may need several guard/boundary cases and reachable histories. Public RxJS tests cannot simply set or read private memory; use observable prefixes, continuation probes, callback observations, and subscription assertions. Direct state assertions belong in reference-model tests.

**Absorption is scope-relative.** A settled downstream subscription can be terminal without making the shared coordinator permanently stopped. Keep Completed, Errored, Cancelled, and disposal distinct where the profile observes them.

**G is broader than sent downstream.** Control letters such as DisposeOwned do not travel through the consumer's next/error/complete channel. Time frames are test-clock positions, not automatic timer inputs.

**Prefer public APIs for external custom operators.** `operate` and `createOperatorSubscriber` are useful implementation evidence but are internal helpers, not this project's recommended public application API. Prefer composition of public operators; use the public Observable constructor when necessary, with correct teardown.

**Generate views, verify semantics independently.** The table and diagram here are rendered from reviewed descriptors with shared IDs. The trace is executed through a typed reference model. Independent fixtures and real RxJS comparisons are still needed: generation can reproduce a mistaken model perfectly.

## Attribution and result

ROB-SN supplies the rigorous execution/evidence discipline. The companion project supplies a directly usable six-tuple teaching and document structure. This project combines those lessons, adds a source-reviewed reference profile and explicit verification boundaries, and does **not** inherit either project's catalogue completion claims.
