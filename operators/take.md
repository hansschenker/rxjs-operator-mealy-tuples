# take — Mealy six-tuple

**Qualified entry:** P:take; F01. **Baseline:** RxJS 7.8.2.  
**Profile ID:** TK-NATURAL. **Status:** source-reviewed, model-tested, and selectively RxJS-tested; see F01 evidence.  
**Parameter:** count n, a nonnegative safe integer; n=0, n=1, and positive n are included.

## Explanation

Forward at most n source values. When the nth arrives, forward it and complete without waiting for source completion. If the source completes earlier, forward that completion. When n=0, complete on activation without subscribing to the source. That difference is visible in both the initial transition and the subscription assertions. See [take.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/take.ts), [EMPTY](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/observable/empty.ts), and [upstream tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/take-spec.ts).

## 1. State space — S

$$
S=\{\operatorname{NotStarted}\}\uplus\{\operatorname{Active}(r)\mid 1\leq r\leq n\}\uplus\{\operatorname{Completed},\operatorname{Errored},\operatorname{Cancelled}\}.
$$

r is remaining capacity; the source implementation instead retains seen. For stable eligible states, r=n-seen. At n=0 the active subset is empty, not the whole state space. Fixed n belongs to the machine configuration.

## 2. Initial state — S0

$$S_0=\operatorname{NotStarted}.$$

This profile deliberately uses explicit activation: Start appears in Z exactly once. Do not also run a separate initializer that subscribes the source. Start is the activation boundary, not a model of the whole synchronous subscribe call: T establishes Active(n) before SubscribeSource may notify. A synchronous source can complete during that action; Active(n) is not necessarily the state when subscribe eventually returns.

## 3. Input alphabet — Z

Start plus SourceNext(x), SourceComplete, SourceError(e), Unsubscribe. The admitted domain D permits only Start from NotStarted and only ordinary inputs from active/settled terminal states. Thus T:D→S and G:D→A*. A repeated Start or an ordinary input before Start is invalid, not silently ignored. Runtime argument coercions and already-cancelled-before-activation subscriptions are outside this profile.

## 4. Output alphabet — A

Next(x), Complete, Error(e), SubscribeSource, DisposeOwned. SubscribeSource establishes one owned source participation; DisposeOwned releases it. These are model control letters, not consumer notifications. count=0 produces no owned-source resource and therefore no DisposeOwned letter.

## 5. Transition function — T

Start with n=0 gives Completed; Start with n>0 gives Active(n). Active(r) with SourceNext gives Active(r-1) when r>1, or Completed when r=1. Active source completion/error/cancellation produces Completed/Errored/Cancelled respectively. Ordinary terminal attempts preserve the terminal state.

## 6. Output function — G

On Start: [Complete] for n=0, [SubscribeSource] for n>0. An ordinary value with r>1 gives [Next(x)]; r=1 gives [Next(x), Complete, DisposeOwned]. SourceComplete gives [Complete, DisposeOwned]; SourceError gives [Error(e), DisposeOwned]; Unsubscribe gives [DisposeOwned]. Terminal attempts give []. No user predicate is involved.

T is a resulting-state specification, not an instruction to suppress its own final Next by closing the destination first. Actual `seen` writes and nested delivery are outside the stable value-reaction model; separate observations document them.

## Table, tests, and visualization

[Guarded table TK00–TK07](../generated/take.transitions.md), [diagram](../generated/take.visualization.md), [trace including zero-count activation](../generated/take.trace.md), [test plan](../test-plans/take.md), and [reference evaluator](../model/take.ts).

## Invariants and trace laws

Stable active capacity lies in [1,n]. No more than n Next outputs are requested in an uninterrupted ordinary run. The final eligible Next precedes Complete. Only positive counts acquire source participation. At most one owned-source disposal occurs; early source completion is legal and emits no invented values. Cancelled is not Completed.

The reference evaluator rejects counts outside its declared profile with RangeError. This is model-use validation only: it must not be presented as RxJS behavior for negative, fractional, NaN, infinite, or coerced arguments.

## Evidence and classification

[F01 evidence](../evidence/F01-prefix-selection.md) records source/helper review and actual checks. The derived policy is count-controlled prefix taking, input-triggered early completion, and owned-source cancellation; count zero is an activation-time special case. Time is source supplied, not a duration parameter.

## Shared execution assumptions

One subscription owns its source participation; no sharing is introduced. Values are opaque to the operator except through an explicitly supplied domain predicate. Source next/complete/error are notification inputs; Unsubscribe is a lifecycle input. Source setup is separate from pipeline construction. The profile has no own clock, timer, notifier, or inner input. Qualifying outputs are not intentionally delayed.

Completed, Errored, and Cancelled are distinct settled outcomes. DisposeOwned denotes disposal of the one owned source participation, not a fourth Observable notification. A settled terminal attempt produces no new notification or disposal; this does not erase outstanding cleanup in a finer execution model. It does not claim late source inputs are still delivered after disconnection.

Assume non-reentrant source handling, passive consumer handlers, nonthrowing teardown, no external policy mutation, and exact safe-integer bookkeeping. Full overload narrowing, invalid runtime argument forms, diagnostics, arbitrary reentry, and cancellation during a delivery are excluded. See the [family boundaries](../families/F01-execution-boundaries.md) and [execution contract](../docs/EXECUTION-CONTRACT.md). Reference models are specifications, not replacement RxJS operators.
