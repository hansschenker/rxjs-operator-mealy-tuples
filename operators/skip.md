# skip — Mealy six-tuple

**Qualified entry:** P:skip; F01. **Baseline:** RxJS 7.8.2.  
**Profile ID:** SK-NATURAL. **Status:** source-reviewed, model-tested, and selectively RxJS-tested; see F01 evidence.  
**Parameter:** count n, a nonnegative safe integer, including zero and one.

## Explanation

Suppress the first n source values and forward all later ones. Reaching the count does not complete or disconnect the output. If the source finishes before n values, the result simply completes without next values. A source error is not converted into successful completion.

The [implementation](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/skip.ts) delegates to [filter](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/filter.ts) with the test count<=index. The index is the zero-based position of every source next processed, including suppressed values. [Upstream tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/skip-spec.ts) distinguish normal completion, errors, zero count, and cancellation.

## 1. State space — S

$$
S=\{\operatorname{Active}(i)\mid i\in\mathbb N_0\}\uplus\{\operatorname{Completed},\operatorname{Errored},\operatorname{Cancelled}\}.
$$

The retained i is the next input index, not an emission count. The model intentionally preserves that counter after the threshold, matching filter's bookkeeping at this observation level. Executable histories are restricted to exact safe-integer arithmetic. No payload is retained.

## 2. Initial state — S0

$$S_0=\operatorname{Active}(0).$$

A separate initializer establishes S0 and subscribes the source, even for n=0. Setup emits no Next or Complete on its own. There is no Start input in this profile. Reusing the operator description does not share its index.

## 3. Input alphabet — Z

SourceNext(x), SourceComplete, SourceError(e), Unsubscribe, with explicit no-op ordinary attempts at a settled terminal boundary. No supplied callback, timer, or inner source is added to this API profile.

## 4. Output alphabet — A

Next(x), Complete, Error(e), DisposeOwned; G returns an ordered finite word. Setup's source subscription is described by the initializer, not an output invented on the first input.

## 5. Transition function — T

$$T(\operatorname{Active}(i),\operatorname{SourceNext}(x))=\operatorname{Active}(i+1).$$

This holds whether the input is suppressed or forwarded. Source completion/error/cancellation sets the corresponding distinct terminal outcome; terminal attempts preserve it. Count n is fixed configuration, not mutable state.

## 6. Output function — G

$$
G(\operatorname{Active}(i),\operatorname{SourceNext}(x))=
\begin{cases}[]&i<n,\\[\operatorname{Next}(x)]&i\geq n.\end{cases}
$$

SourceComplete gives [Complete, DisposeOwned]; SourceError gives [Error(e), DisposeOwned]; Unsubscribe gives [DisposeOwned]; settled terminal attempts give []. There is no boundary flush and no completion triggered by the count.

## Table, tests, and visualization

[Guarded table SK01–SK06](../generated/skip.transitions.md), [diagram](../generated/skip.visualization.md), [predicted trace](../generated/skip.trace.md), [test plan](../test-plans/skip.md), and [reference evaluator](../model/skip.ts) link the results to stable IDs.

## Invariants and trace laws

The active index grows once for every eligible source next. Suppressing a value is [], not Next(undefined). The first forwarded input has index n. Source termination is forwarded independently of how many values were suppressed. There is no independent operator-induced completion. Source disposal occurs once at termination/cancellation, not at the threshold.

Reference count validation rejects out-of-profile values, not as an emulation of RxJS's runtime coercion behavior. Underlying filter's internal predicate is fixed machinery, not a user-supplied failure path.

## Evidence and classification

See [F01 evidence](../evidence/F01-prefix-selection.md). The resulting policy is count-controlled prefix dropping with continuing source participation and source-triggered termination. For n=0 it forwards every value but still subscribes upstream, unlike take(0).

## Shared execution assumptions

One subscription owns its source participation; no sharing is introduced. Values are opaque to the operator except through an explicitly supplied domain predicate. Source next/complete/error are notification inputs; Unsubscribe is a lifecycle input. Source setup is separate from pipeline construction. The profile has no own clock, timer, notifier, or inner input. Qualifying outputs are not intentionally delayed.

Completed, Errored, and Cancelled are distinct settled outcomes. DisposeOwned denotes disposal of the one owned source participation, not a fourth Observable notification. A settled terminal attempt produces no new notification or disposal; this does not erase outstanding cleanup in a finer execution model. It does not claim late source inputs are still delivered after disconnection.

Assume non-reentrant source handling, passive consumer handlers, nonthrowing teardown, no external policy mutation, and exact safe-integer bookkeeping. Full overload narrowing, invalid runtime argument forms, diagnostics, arbitrary reentry, and cancellation during a delivery are excluded. See the [family boundaries](../families/F01-execution-boundaries.md) and [execution contract](../docs/EXECUTION-CONTRACT.md). Reference models are specifications, not replacement RxJS operators.
