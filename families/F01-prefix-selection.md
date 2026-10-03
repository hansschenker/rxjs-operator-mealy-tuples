# F01 — Taking and dropping prefixes

**Baseline:** RxJS 7.8.2. **Status:** Complete (declared scope), 3 October 2026.  
**Owning identities:** P:takeWhile, P:skipWhile, P:take, P:skip.  
**Evidence:** [F01 record](../evidence/F01-prefix-selection.md). **Prerequisite:** F00 completed.

## Intuition: the same boundary, a different policy

Values arrive over time. A prefix is the beginning of that sequence. A taking policy forwards the prefix and disconnects at its boundary; a skipping policy suppresses the prefix and stays connected for the remainder. Predicate-controlled boundaries depend on the supplied domain function. Count-controlled boundaries depend on positions, not payload meaning.

The four profiles use **S, S0, Z, A, T, G**, not four different modeling languages. T describes the resulting state; G describes an ordered word of notifications and resource-control outputs. No new Observable implementation is introduced.

## Profile inventory and comparison

| Profile | Memory S while participating | Boundary input | T at boundary | G at boundary | Participation afterward |
|---|---|---|---|---|---|
| [takeWhile](../operators/takeWhile.md), false/default | Active(i) | First predicate false | Completed | Complete, DisposeOwned | Disconnected |
| takeWhile, true | Active(i) | First predicate false | Completed | Next(x), Complete, DisposeOwned | Disconnected |
| [skipWhile](../operators/skipWhile.md) | Skipping(i), then Forwarding | First predicate false | Forwarding | Next(x) | Continues without further predicate calls |
| [take](../operators/take.md), n>0 | Active(r), remaining count | r=1 | Completed | Next(x), Complete, DisposeOwned | Disconnected |
| [skip](../operators/skip.md) | Active(i), all input positions | First i>=n | Active(i+1) | Next(x) | Continues until source termination/cancellation |

The predicate belongs to the configuration, not the stream mechanism. `skipWhile` does not test every future value like `filter`: once its ordinary non-reentrant boundary is crossed, later values are forwarded regardless of their predicate result. In `skip`, the zero-based source index advances even for suppressed values. See [skipWhile.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/skipWhile.ts), [skip.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/skip.ts), and delegated [filter.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/filter.ts).

### Activation is observable

`take(0)` delivers Complete at activation without subscribing to the supplied source. There is consequently no owned source participation to dispose. `skip(0)` subscribes and forwards all source values. Merely constructing either pipeline does not start its subscribed work. The `take` profile exposes this with Start in Z and NotStarted as S0; the other profiles use the declared separate-initializer convention. See [take.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/take.ts) and [EMPTY](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/observable/empty.ts).

### Time, cancellation, and sharing

These profiles do not own a timer or defer notifications. The source/scheduler supplies timestamps; qualifying outputs occur within the handling of their input. T/G alone do not select a clock or equal-time order. The tests use independent cold subscriptions, never implicit sharing.

Early completion ends the modeled source subscription, not every independent producer or remote effect. External Unsubscribe produces no Complete notification. DisposeOwned refers only to this profile's owned source participation; teardown may be registered after a synchronous source returns. See [Subscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts), [Subscription](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscription.ts), and the [execution contract](../docs/EXECUTION-CONTRACT.md).

## Common discriminating trace

Fresh subscriptions receive 2,4,7,1 at frames 1,3,5,7, then source completion at frame 9. Predicate: value < 5. Counts: two. These are independently authored expected results; their runtime status is in evidence.

| Configuration | Values | Complete frame | Upstream interval |
|---|---|---|---|
| takeWhile false/default | 2,4 | 5 | [0,5] |
| takeWhile true | 2,4,7 | 5, after Next(7) | [0,5] |
| skipWhile | 7,1 | 9 | [0,9] |
| take(2) | 2,4 | 3, after Next(4) | [0,3] |
| skip(2) | 7,1 | 9 | [0,9] |
| filter contrast only | 2,4,1 | 9 | [0,9] |

The filter fixture is not an F02 profile. Matching values between takeWhile(false) and take(2) do not imply equal termination times. Matching values between skipWhile and skip(2) in this one history do not establish operator equivalence. [Trace lanes](../traces/F01-prefix-selection.md) make those distinctions visible.

## Models, tables, and independent tests

TW01–TW08 are unchanged. New rules are SW01–SW08, TK00–TK07, and SK01–SK06: **30 family rule IDs in total**. Each has a generated guarded row and diagram edge(s); a symbolic row can represent many concrete states. Model fixtures test T/G directly; RxJS tests reach corresponding situations via source history, callback observations, subscription intervals, and owned teardown.

The generator preserves all three preexisting takeWhile views and adds nine views for the three new profiles. Textual descriptors share IDs with evaluators but are not a universal executable specification. Generated consistency is not semantic proof. The [new model suite](../tests/families/F01-model.test.mjs), [runtime suite](../tests/families/F01-prefix-selection.test.mjs), and original tests all run through the existing npm test command.

New bounded comparisons enumerate 121 sequences of length 0–4 over {-1,0,1}. skipWhile uses four predicates and three endings (1,452 cases); take and skip each use counts 0,1,2,3,5 and three endings (1,815 each). Thus **5,082 new comparisons**, in addition to the existing 1,452 takeWhile comparisons. These check notification/control words and predicate calls; their actual execution is reported separately.

## Scope and execution boundaries

Main profiles assume stable non-reentrant reactions, passive consumers, nonthrowing teardown, protocol-respecting sources, Boolean-valued terminating predicates (which may throw), and no externally mutable predicate policy. Counts are nonnegative safe integers. Index arithmetic is interpreted only within JavaScript's exact safe-integer range. Unsupported negative/fractional/NaN/infinite counts and runtime predicate coercions are not silently claimed covered; model-domain validation is not RxJS validation behavior. Overload/type-guard narrowing is excluded.

[Four execution-boundary cases](F01-execution-boundaries.md) deliberately operate outside the macrostep profiles: cancellation during inclusive emission, nested predicate indexes, reentrant take, and reentrant skipWhile latch writes. They demonstrate why output words are not atomic transactions. They are runtime observations, not a proof or a replacement microstep model.

## Derived classification

The justified family is prefix selection: predicate/count boundary, taking/dropping policy, optional inclusive termination, per-subscription bookkeeping, and synchronous input-triggered forwarding. There is no inner-work concurrency policy, own clock, or sharing coordinator in these profiles. These conclusions follow from the modeled reactions and bounded evidence, not from suffixes alone.

The executable checkpoint passed 45 model tests and 68 RxJS tests, including 6,534 bounded comparisons and the four execution-boundary cases. The complete family package is saved with its source-scoped evidence; final-revision CI is verified in the session handoff. F02 — Mapping and per-value selection is next; its profiles remain Planned.
