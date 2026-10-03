# F01 — Prefix-family evidence

**Date:** 3 October 2026. **Starting revision:** f906d5f0c783c6f852b904f8f0c5d4c7339dfd7f.  
**Status:** Complete (declared scope). **Baseline:** RxJS 7.8.2.

The F00 source artifact for run 36969869624 was retrieved through the GitHub connector. Its ZIP SHA-256 matched fb702a8d0e88cb65f478a0a81cb70d79e0da97c97fa22d7127f57cb4e463f3f8; the reconstructed working Git tree matched 5b4eeb87bb5532f1f0207217a7cb6b0f5e7029b0. A fresh local clean installation failed with EAI_AGAIN resolving registry.npmjs.org. The existing read-only GitHub Actions workflow executed the runtime checks successfully; the completed job and downloaded output were inspected.

## Reviewed implementation and upstream evidence

All implementation links below are pinned to 7.8.2. New operator sources were read in full; helper ranges and upstream scope are explicit. The upstream suites were inspected, not run wholesale.

| Source | Inspected scope and purpose |
|---|---|
| [takeWhile](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/takeWhile.ts) | Executable section and parameters; index++ before predicate, default false, inclusive order |
| [skipWhile](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/skipWhile.ts) | Full file; taking/index short-circuit and assignment; false boundary |
| [take](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/take.ts) | Full file; zero-count EMPTY, pre-increment seen, reentrant completion check |
| [skip](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/skip.ts) | Full file; delegation to filter with count<=index |
| [filter](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/filter.ts) | Executable section; index per eligible source next; inherited terminal handling |
| [lift/operate](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/util/lift.ts) | Full file; subscription-time initialization and catch behavior |
| [OperatorSubscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/OperatorSubscriber.ts) | Handler/catch/finalization section; user predicate throw to destination error |
| [Subscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts) | Terminal methods, unsubscribe, notification delivery; stopped versus disposed |
| [Subscription](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscription.ts) | unsubscribe/add; ordered cleanup and late-added teardown |
| [Observable](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Observable.ts) | subscribe/_trySubscribe; setup and teardown registration |
| [EMPTY](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/observable/empty.ts) | Definition and associated empty function; complete at subscription |
| [takeWhile tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/takeWhile-spec.ts) | F00-reviewed initial cases plus F01 call/error/cancel/cooperative section; narrowing examples excluded from coverage |
| [skipWhile tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/skipWhile-spec.ts) | Full file: first-false/index/call limit/error/empty/never/cancellation |
| [take tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/take-spec.ts) | Full file; zero, one, boundary, teardown, reentrant test; skipped recursive-error case is not passing evidence |
| [skip tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/skip-spec.ts) | Full file; count boundaries, zero, source error, empty/never, cancellation chains |

Source-to-model mapping: skipWhile's taking/index becomes Skipping(i)/Forwarding (SW01–SW03); take's seen becomes remaining n-seen, with activation isolated in TK00/TK01; skip's filter index becomes Active(i) (SK01/SK02). Inherited complete/error/disposal produce the distinct terminal rules. Runtime state names are never equated literally with implementation fields. Fixed parameters and domains are documented in each profile.

## Work and local checks

Added three typed models, independent model fixtures, actual RxJS family cases, generated tables/diagrams/traces, per-operator profiles/test plans, family comparison, explicit execution boundaries, and a qualified coverage index. The existing takeWhile model, TW IDs, original test assertions, and three generated takeWhile files are unchanged. Direct dependency pins and lockfile remain unchanged; TypeScript allows the new explicit .ts imports because compilation is no-emit and Node strips types.

Local model/type checks passed: 45 model tests total (15 inherited + 30 new). All 12 generated artifacts matched; original takeWhile views had no diff. JavaScript syntax checks passed. No local RxJS execution or clean-install success is claimed. Hosted checks passed all 68 RxJS tests (14 inherited + 54 new), including 5,082 new bounded comparisons and four separate execution-boundary observations. The original 1,452 comparisons also passed: 6,534 bounded comparisons in total, inside two Node test cases rather than 6,534 additional test cases.

## Scope limits

Four declared stable profiles only; no negative/fractional/NaN/infinite counts, runtime predicate coercion, all-overload narrowing, arbitrary mutation, consumer/teardown exceptions, browser integration, own-clock behavior, or implicit sharing. EX01–EX04 are separately tested runtime observations, not a complete microstep model or a broadening of the stable claims. Model-state tests do not expose private RxJS state. Finite comparisons and rule coverage are not exhaustive equivalence proof. Mermaid source generation is checked; no rendered-layout verification is claimed.

## Actual hosted execution and permanent record

[Run 37120267342](https://github.com/hansschenker/rxjs-operator-mealy-tuples/actions/runs/37120267342), job 111194853044, completed successfully on code revision `9e30a4058201b17a35d6141fe9ebdf935bfae7f3`, tree `8bf8026e9194f2722675e399a900e8d4fb36bd01`. It used the unchanged committed lockfile and workflow. Environment: Node 22.16.0, npm 10.9.2, Python 3.12.3, TypeScript 5.8.3; GitHub Ubuntu 24.04 runner, Linux 6.17.0-1022-azure. Installed dependencies remain RxJS 7.8.2 and tslib 2.8.1.

| Command / observation | Actual result |
|---|---|
| npm ci --ignore-scripts --no-audit --no-fund | Passed from the committed lockfile |
| npm ls --all; dependency-file diff check | Passed; no dependency drift |
| npm run check:types | Passed |
| npm run test:model | 45 passed, 0 failed/skipped |
| npm run test:rxjs | 68 passed, 0 failed/skipped |
| Two bounded differential cases | All 1,452 inherited and 5,082 new comparisons passed |
| F01-EX01–EX04 | All four separate runtime observations passed |
| Regeneration, drift check, second aggregate run | Passed at the executable checkpoint |

Artifact 11273291841 was downloaded and its ZIP hash verified; it contains the actual environment and both aggregate outputs. [Checksums](F01/checksums.json) identify the full-output bytes. [Permanent selected output](F01/check-summary.txt) retains verbatim result lines so the result summary survives artifact expiration. It is labeled as an excerpt, not a full log. The first hosted checkpoint still had only the three original generated views and 25 Markdown files; the later family documentation/generator update adds the remaining nine views and is checked again on the saved revision. No test expectation or model needed repair to get a passing result.

## Completion and handoff

The final family documentation tree was checked locally for all 45 Markdown files, all 12 generated views, strict typing, and all 45 model tests; the original takeWhile views remained byte-identical. The same hosted workflow validates the complete saved revision, including the new generator and documentation; its exact commit/run conclusion is verified in the session response rather than inventing a self-referential hash here.

F01 delivers four canonical profiles, 30 rule IDs, four table/diagram/trace sets, four test plans, family comparison, separate execution-boundary observations, 146-identity coverage tracking, and scoped evidence. The current family count advances to 1/34 only for this declared scope. F02 — Mapping and per-value selection is next. The source repositories were not modified; no package was published. Historical F00 failures and successes remain unchanged.

No Mermaid renderer or vulnerability audit was run. Node's existing type-stripping warnings do not change the observed test outcome. Local networking remains unavailable; successful clean install and RxJS runtime execution are hosted, not claimed local.

