# filter — Mealy six-tuple

**Baseline:** RxJS 7.8.2. **Identity:** P:filter. **Profile:** FL-BOOLEAN. **Family:** F02.  
**Evidence:** Source-reviewed; reference-model and selected RxJS runtime checks passed at the executable checkpoint. See [F02 evidence](../evidence/F02-value-selection.md) for final-package verification and exclusions.

## Explanation

Each source value meets the predicate. A true result forwards that same value; a false result sends nothing but keeps the source subscription active. The predicate is checked again for later inputs, unlike skipWhile's post-boundary forwarding phase. Filtering is a decision about whether an output exists, not a transformation into undefined.

Use this policy when a named domain function decides which packages may continue. The reference is [filter.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/filter.ts).

## Parameters

A fixed Boolean-returning predicate p(value,index), with normal return or throw and no thisArg. Non-Boolean coercions, type-guard narrowing, legacy thisArg overloads, external policy mutation, and arbitrary reentrancy are excluded. The modeled index stays within exact safe-integer arithmetic. No comparator/history cache or gate latch is present.

## Execution scope

One downstream subscription and its owned source participation; no introduced sharing. A separate initializer establishes S0 before subscribing upstream and produces no initial Next. Construction/argument evaluation is not subscription execution. Source/scheduler timing is external; this profile owns no timer and introduces no scheduling boundary.

T records the resulting stable state, not an instruction to commit it before interpreting G. Complete and Error are downstream notifications; DisposeOwned is control output for this subscription's resources. Unsubscribe produces no Complete. Cleanup registered after a synchronous source returns is covered by the ownership contract. A terminal self-loop models an attempted late input after settled disposal, not continued delivery from a disconnected source.

The main model assumes non-reentrant, protocol-respecting inputs, passive consumers and nonthrowing teardown. Parameters remain fixed; callbacks/property access terminate and do not reenter or alter future policy, although specified failures are allowed. Diagnostic call recording may not affect results. No monkey-patched built-ins, arbitrary external mutation, or consumer-handler exceptions are covered. Existing F01 execution-boundary tests and the separately labeled F02 delivery-interruption checks do not broaden these macrostep claims. See the [execution contract](../docs/EXECUTION-CONTRACT.md).
## 1. State space — S

$$
S=\{\operatorname{Active}(i)\mid i\in\mathbb N_0\}\uplus\{\operatorname{Completed},\operatorname{Errored},\operatorname{Cancelled}\},\qquad S_0=\operatorname{Active}(0).
$$
The index is the number of previously processed active SourceNext inputs, including rejected ones. It is not the number of emitted values.

## 2. Initial state — S0

Active(0), initialized separately for each subscription; no seed or initial Next.

## 3. Input alphabet — Z

`Z = {SourceNext(x), SourceComplete, SourceError(e), Unsubscribe}`, with tagged inputs, x in the declared value domain, and e any JavaScript error/thrown value. There are no timer, inner, or notifier inputs in this profile. Late attempts are included only at the settled boundary.
## 4. Output alphabet — A

`A = {Next(x), Complete, Error(e), DisposeOwned}`. G returns ordered words in A*, including `[]`. A Next carrying undefined or an empty container is not an empty word. DisposeOwned is not a fourth Observable notification.
## 5. Transition function — T

Both true and false predicate returns advance Active(i) to Active(i+1). A predicate throw moves to Errored. SourceComplete, SourceError, and Unsubscribe move to Completed, Errored, and Cancelled respectively. A settled terminal attempt preserves its state.

## 6. Output function — G

FL01: predicate true produces [Next(x)], preserving identity. FL02: predicate false produces []. FL03: predicate throw produces [Error(e), DisposeOwned]. FL04–FL06 respectively complete/dispose, fail/dispose, and dispose only. FL07 produces [] after settled termination. The single predicate outcome determines both T and G.

## Tables, tests, visualization, and evidence

The [guarded table](../generated/filter.transitions.md), [control-state diagram](../generated/filter.visualization.md), and [predicted trace](../generated/filter.trace.md) are generated from reviewed descriptors and the [reference evaluator](../model/filter.ts). Descriptors are not a universal executable rule language; generation alone does not prove semantics.

The [test obligations](../test-plans/filter.md) link rule IDs to independent model fixtures and actual RxJS observations. [F02 evidence](../evidence/F02-value-selection.md) records inspected sources, exact execution results, and limits. Direct model-state assertions do not expose private RxJS state; runtime checks observe notifications, calls, source lifetimes, and disposal.

## Invariants and classification

Every normal predicate result advances the index once. Rejection changes state without producing a Next. Acceptance does not clone or replace the payload. No rejected value is buffered for later release. Validity of individual states is not a proof of all traces. Each settled subscription permits at most one terminal notification, no later Next delivery, and only scope-owned disposal. No history buffer, inner-concurrency policy, own clock, or sharing coordinator is introduced.

Derived behavior: indexed, per-input selection with zero or one Next per normal input; ongoing participation on rejection. This is a scoped runtime behavior profile, not full overload/type-narrowing coverage or an exhaustive equivalence proof. Mermaid source and regeneration are checked; rendered layout is not claimed.
