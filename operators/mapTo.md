# mapTo — Mealy six-tuple

**Baseline:** RxJS 7.8.2. **Identity:** P:mapTo. **Profile:** MT-CONSTANT. **Family:** F02.  
**Evidence:** Source-reviewed; reference-model and selected RxJS runtime checks passed at the executable checkpoint. See [F02 evidence](../evidence/F02-value-selection.md) for final-package verification and exclusions.

## Explanation

Every source Next acts as a trigger to emit the configured constant c. Incoming payloads do not affect c. There is no initial emission: the source must emit first. A function or Observable supplied as c remains data; it is not invoked or subscribed.

The pinned [mapTo.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/mapTo.ts) delegates to map with a constant-returning projection. It is marked deprecated in the 7.8.2 source but remains a subject of this fixed baseline; this profile performs no migration.

## Parameters and compatibility

A fixed configured value c, including undefined, null, functions, or object references. If an application writes mapTo(makeValue()), JavaScript evaluates makeValue once while assembling that expression; mapTo does not turn it into a per-input factory. That argument-expression behavior is outside the subscribed machine.

For the declared scope, mapTo(c) and map(fixed) agree when fixed returns the same c for every input. They are not identical full TypeScript APIs. All overload inference/narrowing claims are excluded. A shared captured reference is not shared source execution.

## Execution scope

One downstream subscription and its owned source participation; no introduced sharing. A separate initializer establishes S0 before subscribing upstream and produces no initial Next. Construction/argument evaluation is not subscription execution. Source/scheduler timing is external; this profile owns no timer and introduces no scheduling boundary.

T records the resulting stable state, not an instruction to commit it before interpreting G. Complete and Error are downstream notifications; DisposeOwned is control output for this subscription's resources. Unsubscribe produces no Complete. Cleanup registered after a synchronous source returns is covered by the ownership contract. A terminal self-loop models an attempted late input after settled disposal, not continued delivery from a disconnected source.

The main model assumes non-reentrant, protocol-respecting inputs, passive consumers and nonthrowing teardown. Parameters remain fixed; callbacks/property access terminate and do not reenter or alter future policy, although specified failures are allowed. Diagnostic call recording may not affect results. No monkey-patched built-ins, arbitrary external mutation, or consumer-handler exceptions are covered. Existing F01 execution-boundary tests and the separately labeled F02 delivery-interruption checks do not broaden these macrostep claims. See the [execution contract](../docs/EXECUTION-CONTRACT.md).
## 1. State space — S

$$
S=\{\operatorname{Active},\operatorname{Completed},\operatorname{Errored},\operatorname{Cancelled}\},\qquad S_0=\operatorname{Active}.
$$
The delegated map implementation has an internal counter; the constant projection never observes it. This profile projects that unobserved counter away, rather than claiming no counter exists in the implementation. The parameter c is fixed configuration, not changing memory.

## 2. Initial state — S0

Active; setup does not emit c. Separate subscriptions have independent lifetimes but may emit the same captured object reference.

## 3. Input alphabet — Z

`Z = {SourceNext(x), SourceComplete, SourceError(e), Unsubscribe}`, with tagged inputs, x in the declared value domain, and e any JavaScript error/thrown value. There are no timer, inner, or notifier inputs in this profile. Late attempts are included only at the settled boundary.
## 4. Output alphabet — A

`A = {Next(c), Complete, Error(e), DisposeOwned}`. G returns ordered words in A*, including `[]`. A Next carrying undefined or an empty container is not an empty word. DisposeOwned is not a fourth Observable notification.
## 5. Transition function — T

SourceNext retains Active (MT01). SourceComplete, SourceError, and Unsubscribe select the three distinct terminal states (MT02–MT04). Settled terminal attempts preserve the outcome (MT05).

## 6. Output function — G

MT01 produces [Next(c)], not a cloned c and not the result of invoking c. MT02 produces [Complete, DisposeOwned]; MT03 [Error(e), DisposeOwned]; MT04 [DisposeOwned]; MT05 []. There is no domain-callback failure branch for this fixed-value profile.

## Tables, tests, visualization, and evidence

The [guarded table](../generated/mapTo.transitions.md), [control-state diagram](../generated/mapTo.visualization.md), and [predicted trace](../generated/mapTo.trace.md) are generated from reviewed descriptors and the [reference evaluator](../model/mapTo.ts). Descriptors are not a universal executable rule language; generation alone does not prove semantics.

The [test obligations](../test-plans/mapTo.md) link rule IDs to independent model fixtures and actual RxJS observations. [F02 evidence](../evidence/F02-value-selection.md) records inspected sources, exact execution results, and limits. Direct model-state assertions do not expose private RxJS state; runtime checks observe notifications, calls, source lifetimes, and disposal.

## Invariants and classification

Each eligible source Next produces exactly the configured reference/value. Zero source values produce zero constant emissions. Identity persists across outputs/subscriptions when c is a reference. Validity of individual states is not a proof of all traces. Each settled subscription permits at most one terminal notification, no later Next delivery, and only scope-owned disposal. No history buffer, inner-concurrency policy, own clock, or sharing coordinator is introduced.

Derived behavior: constant-value mapping driven by source input occurrences, with a memoryless value core and explicit subscription lifecycle. This is a scoped runtime behavior profile, not full overload/type-narrowing coverage or an exhaustive equivalence proof. Mermaid source and regeneration are checked; rendered layout is not claimed.
