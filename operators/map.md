# map — Mealy six-tuple

**Baseline:** RxJS 7.8.2. **Identity:** P:map. **Profile:** MP-INDEXED. **Family:** F02.  
**Evidence:** Source-reviewed; reference-model and selected RxJS runtime checks passed at the executable checkpoint. See [F02 evidence](../evidence/F02-value-selection.md) for final-package verification and exclusions.

## Explanation

Each source value is supplied to the projection with its zero-based source index. Its returned value flows downstream at that input's handling time. The stream machinery does not decide what the value means: the projection does. Returning undefined is still a value; returning an Observable does not subscribe to it or flatten it.

Use this policy to change payloads while preserving one output per successfully projected input. A throwing projection fails the result and ends source participation. The reference is [map.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/map.ts).

## Parameters

A fixed function f: (value, index) → result; no thisArg. Normal returns may be any JavaScript value, including references; throws are modeled separately. Deprecated thisArg overloads, noncallable arguments, all type-inference/overload proofs, and reentrancy are excluded. Index arithmetic is interpreted only within the safe-integer range. Supplied functions are evaluated once per active input, not once for T and again for G.

## Execution scope

One downstream subscription and its owned source participation; no introduced sharing. A separate initializer establishes S0 before subscribing upstream and produces no initial Next. Construction/argument evaluation is not subscription execution. Source/scheduler timing is external; this profile owns no timer and introduces no scheduling boundary.

T records the resulting stable state, not an instruction to commit it before interpreting G. Complete and Error are downstream notifications; DisposeOwned is control output for this subscription's resources. Unsubscribe produces no Complete. Cleanup registered after a synchronous source returns is covered by the ownership contract. A terminal self-loop models an attempted late input after settled disposal, not continued delivery from a disconnected source.

The main model assumes non-reentrant, protocol-respecting inputs, passive consumers and nonthrowing teardown. Parameters remain fixed; callbacks/property access terminate and do not reenter or alter future policy, although specified failures are allowed. Diagnostic call recording may not affect results. No monkey-patched built-ins, arbitrary external mutation, or consumer-handler exceptions are covered. Existing F01 execution-boundary tests and the separately labeled F02 delivery-interruption checks do not broaden these macrostep claims. See the [execution contract](../docs/EXECUTION-CONTRACT.md).
## 1. State space — S

$$
S=\{\operatorname{Active}(i)\mid i\in\mathbb N_0\}\uplus\{\operatorname{Completed},\operatorname{Errored},\operatorname{Cancelled}\},\qquad S_0=\operatorname{Active}(0).
$$
The retained index counts inputs offered to the projection, not a global pipeline index. Terminal states abstract away the no-longer-relevant counter; they are not literal Subscriber fields.

## 2. Initial state — S0

Active(0) belongs to S. Every independent subscription starts its own bookkeeping at zero; no initial result is emitted.

## 3. Input alphabet — Z

`Z = {SourceNext(x), SourceComplete, SourceError(e), Unsubscribe}`, with tagged inputs, x in the declared value domain, and e any JavaScript error/thrown value. There are no timer, inner, or notifier inputs in this profile. Late attempts are included only at the settled boundary.
## 4. Output alphabet — A

`A = {Next(y), Complete, Error(e), DisposeOwned}`. G returns ordered words in A*, including `[]`. A Next carrying undefined or an empty container is not an empty word. DisposeOwned is not a fourth Observable notification.
## 5. Transition function — T

For SourceNext(x), obtain the projection outcome once. A return advances Active(i) to Active(i+1); a throw moves to Errored. SourceComplete moves to Completed; SourceError to Errored; Unsubscribe to Cancelled. Settled terminal states retain their outcome for any attempted ordinary input.

## 6. Output function — G

MP01 produces [Next(f(x,i))] on return; MP02 produces [Error(e), DisposeOwned] on throw. MP03 forwards completion then disposes; MP04 forwards source error then disposes; MP05 disposes without completion; MP06 produces []. The index used by G is the same pre-input index used by T.

## Tables, tests, visualization, and evidence

The [guarded table](../generated/map.transitions.md), [control-state diagram](../generated/map.visualization.md), and [predicted trace](../generated/map.trace.md) are generated from reviewed descriptors and the [reference evaluator](../model/map.ts). Descriptors are not a universal executable rule language; generation alone does not prove semantics.

The [test obligations](../test-plans/map.md) link rule IDs to independent model fixtures and actual RxJS observations. [F02 evidence](../evidence/F02-value-selection.md) records inspected sources, exact execution results, and limits. Direct model-state assertions do not expose private RxJS state; runtime checks observe notifications, calls, source lifetimes, and disposal.

## Invariants and classification

The index advances once per successful projection reaction; a failure terminates the profile, so no terminal index claim is needed. Output reference identity is exactly the reference returned by the projection; copying is not added by the machine. Validity of individual states is not a proof of all traces. Each settled subscription permits at most one terminal notification, no later Next delivery, and only scope-owned disposal. No history buffer, inner-concurrency policy, own clock, or sharing coordinator is introduced.

Derived behavior: indexed per-value transformation with callback-failure termination. The value-only core can be memoryless, but the indexed subscription profile is not stateless. This is a scoped runtime behavior profile, not full overload/type-narrowing coverage or an exhaustive equivalence proof. Mermaid source and regeneration are checked; rendered layout is not claimed.
