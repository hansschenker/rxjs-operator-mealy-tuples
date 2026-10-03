# skipWhile — Mealy six-tuple

**Qualified entry:** P:skipWhile; F01. **Baseline:** RxJS 7.8.2.  
**Profile ID:** SW-BOOLEAN. **Status:** source-reviewed, model-tested, and selectively RxJS-tested; see F01 evidence.  
**Parameters:** a terminating Boolean-valued indexed predicate p(x,i), with normal return or throw.

## Explanation

Drop the initial source values while the predicate is true. Forward the first false value, then every later value without testing again. The initial question is whether to keep skipping, not whether each value should be retained forever. A source completion still completes; cancellation still disposes without completion.

The [implementation](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/skipWhile.ts) uses a `taking` flag and an index. Its short-circuit expression stops invoking the predicate once taking is true in an ordinary non-reentrant execution. The source comment saying “once the predicate is true” is not used as the specification; the executable condition and [tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/skipWhile-spec.ts) establish the false boundary.

## 1. State space — S

$$
S=\{\operatorname{Skipping}(i)\mid i\in\mathbb N_0\}\uplus\{\operatorname{Forwarding},\operatorname{Completed},\operatorname{Errored},\operatorname{Cancelled}\}.
$$

Skipping(i) remembers the next predicate index. Forwarding forgets the index: the implementation retains its variable but never reads it again in this scope. This is an observational abstraction, not a claim that the variable is physically deleted. Index growth is unbounded in the mathematical domain and safe-integer-bounded in executable checks.

## 2. Initial state — S0

$$S_0=\operatorname{Skipping}(0).$$

A separate initializer creates this state before subscribing to the source. There is no Start in this profile's Z and no initial Next output. Independent subscriptions initialize independent counters.

## 3. Input alphabet — Z

SourceNext(x), SourceComplete, SourceError(e), Unsubscribe. The predicate outcome is obtained during an active SourceNext reaction, not another source notification. Ordinary input attempts after settled termination are defined as boundary no-ops.

## 4. Output alphabet — A

Next(x), Complete, Error(e), DisposeOwned. G produces a finite ordered word, possibly []. Source subscription is interpreted by the separate initializer, not a hidden G output on the first value.

## 5. Transition function — T

Let b=p(x,i), evaluated once. A successful true result sends Skipping(i) to Skipping(i+1); false sends it to Forwarding. Forwarding remains Forwarding on every SourceNext without invoking p. SourceComplete maps either participating state to Completed; SourceError or a predicate throw maps to Errored; Unsubscribe maps to Cancelled. Terminal states retain their outcomes.

## 6. Output function — G

For that same b, true produces []; false produces [Next(x)]. Forwarding produces [Next(x)] without a predicate call. SourceComplete produces [Complete, DisposeOwned]. SourceError or predicate throw produces [Error(e), DisposeOwned]. Unsubscribe produces [DisposeOwned]. Settled terminal attempts produce []. The boundary input is not thrown away and there is no flush buffer.

## Table, tests, and visualization

[Guarded table SW01–SW08](../generated/skipWhile.transitions.md), [control-state diagram](../generated/skipWhile.visualization.md), [predicted trace](../generated/skipWhile.trace.md), [test obligations](../test-plans/skipWhile.md), and [reference evaluator](../model/skipWhile.ts) describe this same scope. Both T/G outcomes are computed with at most one predicate evaluation per eligible input.

## Invariants and trace laws

Skipping indexes advance once per true input. In this non-reentrant profile Forwarding is never left except through termination/cancellation. No subsequent predicate call occurs after crossing the boundary. Source termination does not invent a value. At most one terminal notification is delivered; cancellation does not require one. Subscriptions and disposal remain owned and independent.

## Evidence and classification

Source/helper provenance and actual test status are in [F01 evidence](../evidence/F01-prefix-selection.md). The resulting classification is predicate-controlled prefix dropping with a forwarding phase, not continuous predicate filtering. For input 2,4,7,1 under value<5, predicted output is 7,1 then source completion, with calls only for 2,4,7.

## Shared execution assumptions

One subscription owns its source participation; no sharing is introduced. Values are opaque to the operator except through an explicitly supplied domain predicate. Source next/complete/error are notification inputs; Unsubscribe is a lifecycle input. Source setup is separate from pipeline construction. The profile has no own clock, timer, notifier, or inner input. Qualifying outputs are not intentionally delayed.

Completed, Errored, and Cancelled are distinct settled outcomes. DisposeOwned denotes disposal of the one owned source participation, not a fourth Observable notification. A settled terminal attempt produces no new notification or disposal; this does not erase outstanding cleanup in a finer execution model. It does not claim late source inputs are still delivered after disconnection.

Assume non-reentrant source handling, passive consumer handlers, nonthrowing teardown, no external policy mutation, and exact safe-integer bookkeeping. Full overload narrowing, invalid runtime argument forms, diagnostics, arbitrary reentry, and cancellation during a delivery are excluded. See the [family boundaries](../families/F01-execution-boundaries.md) and [execution contract](../docs/EXECUTION-CONTRACT.md). Reference models are specifications, not replacement RxJS operators.
