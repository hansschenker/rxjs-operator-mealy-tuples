# takeWhile — derived test obligations

Reference: [six-tuple profile](../operators/takeWhile.md) and [guarded table](../generated/takeWhile.transitions.md).

| Rules | Reachable arrangement / input | Expected G or observation | Check |
|---|---|---|---|
| S0 | Subscribe before any source input | Index starts at zero; no initial value | Model initial-state test; RxJS empty/never cases |
| TW01 | Active prefix, accepted value | Next(value), next index; no termination | Independent model fixture; normal marbles |
| TW02 | Accepted prefix then first rejection; inclusive false | Complete and source disposal, no boundary value | Exclusive-boundary marble and subscription assertion |
| TW03 | Same boundary; inclusive true | Next then Complete in same frame, source disposal | Inclusive-boundary marble; independent model fixture |
| TW04 | Complete while active, including empty | Complete, owned disposal, no invented value | Source-complete and empty cases |
| TW05 | SourceError while active | Same error; no completion; owned disposal | Error marble and subscription assertion |
| TW06 | Cancel before source completion | No Complete; source disconnection | Explicit unsubscribe/never marbles |
| TW07 | Predicate throws while processing a value | Error and disposal; one callback invocation | Throw case; model fixture |
| TW08 | Attempt each input category after each settled outcome | Same model state and []; no extra predicate/disposal | Model boundary matrix; runtime continuation/disconnection observations |

Model tests may directly arrange Active(i). Real RxJS tests reach it through actual inputs. A later offered cold-source value that is prevented by unsubscription is not an input delivered to the closed operator.

## Additional discriminating checks

Two independent subscriptions to one description must each start at index zero. Count predicate calls, including the rejecting call, and verify that no subsequent source value invokes it. Compare source completion and consumer cancellation separately. Verify exact output ordering, not merely a bag of values.

The runtime suite also contains two source-review regression checks for every/defaultIfEmpty, motivated by the [companion review](../docs/COMPANION-REVIEW.md). They are not complete profiles for those operators.

## Bounded differential sample

The authored runtime suite enumerates all 121 sequences of length 0–4 over {-1,0,1}, two predicates (positive value and index below two), two inclusive choices, and three endings (complete, source error, external cancellation): **1,452 comparisons**. It compares the reference model's output word and callback calls with actual RxJS observations, including one owned teardown.

This is a finite discriminating sample, not exhaustive operator equivalence. Synchronous, non-reentrant sources and passive observers deliberately match the reference profile. Runtime execution of this sample is **not yet verified** at the initial checkpoint.

## Status

Model suite: **15 passed** locally. RxJS suite: authored and syntax-checked, not executed. See [verification](../docs/VERIFICATION.md). No per-row test obligation should be reported as runtime-passing solely because it appears in this plan.
