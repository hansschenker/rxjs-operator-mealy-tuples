# ignoreElements — Mealy six-tuple

**Baseline:** RxJS 7.8.2. **Identity:** P:ignoreElements. **Profile:** IG-NOTIFICATIONS. **Family:** F02.  
**Evidence:** Source-reviewed; reference-model and selected RxJS runtime checks passed at the executable checkpoint. See [F02 evidence](../evidence/F02-value-selection.md) for final-package verification and exclusions.

## Explanation

Source values continue to arrive, but no Next notification is delivered downstream. Source completion and source error still pass through. This is not EMPTY: it does not complete at subscription, and it does not avoid the source's work.

Use this policy when the consumer needs the terminal outcome but not the values. No supplied function examines the payload. The reference is [ignoreElements.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/ignoreElements.ts), which supplies a no-op next handler through OperatorSubscriber.

## Parameters

None. Suppression is unconditional. Sources, ownership, and lifecycle are still explicit; lack of value output does not imply lack of participation or cleanup.

## Execution scope

One downstream subscription and its owned source participation; no introduced sharing. A separate initializer establishes S0 before subscribing upstream and produces no initial Next. Construction/argument evaluation is not subscription execution. Source/scheduler timing is external; this profile owns no timer and introduces no scheduling boundary.

T records the resulting stable state, not an instruction to commit it before interpreting G. Complete and Error are downstream notifications; DisposeOwned is control output for this subscription's resources. Unsubscribe produces no Complete. Cleanup registered after a synchronous source returns is covered by the ownership contract. A terminal self-loop models an attempted late input after settled disposal, not continued delivery from a disconnected source.

The main model assumes non-reentrant, protocol-respecting inputs, passive consumers and nonthrowing teardown. Parameters remain fixed; callbacks/property access terminate and do not reenter or alter future policy, although specified failures are allowed. Diagnostic call recording may not affect results. No monkey-patched built-ins, arbitrary external mutation, or consumer-handler exceptions are covered. Existing F01 execution-boundary tests and the separately labeled F02 delivery-interruption checks do not broaden these macrostep claims. See the [execution contract](../docs/EXECUTION-CONTRACT.md).
## 1. State space — S

$$
S=\{\operatorname{Active},\operatorname{Completed},\operatorname{Errored},\operatorname{Cancelled}\},\qquad S_0=\operatorname{Active}.
$$
There is no processing counter or retained payload. The active value-processing core is memoryless; lifecycle outcomes still matter.

## 2. Initial state — S0

Active. Separate setup attaches upstream and sends no notification. A never-ending source leaves this state active until cancellation.

## 3. Input alphabet — Z

`Z = {SourceNext(x), SourceComplete, SourceError(e), Unsubscribe}`, with tagged inputs, x in the declared value domain, and e any JavaScript error/thrown value. There are no timer, inner, or notifier inputs in this profile. Late attempts are included only at the settled boundary.
## 4. Output alphabet — A

`A = {Complete, Error(e), DisposeOwned}`. Next is absent from this profile's output alphabet. G still returns ordered finite words, including [].

## 5. Transition function — T

SourceNext keeps Active (IG01). SourceComplete, SourceError, and Unsubscribe move to Completed, Errored, and Cancelled (IG02–IG04). A settled terminal attempt retains its state (IG05).

## 6. Output function — G

IG01 produces [], without inspecting the payload. IG02 produces [Complete, DisposeOwned]. IG03 produces [Error(e), DisposeOwned]. IG04 produces [DisposeOwned]. IG05 produces []. No final value is invented on completion, error, or cancellation.

## Tables, tests, visualization, and evidence

The [guarded table](../generated/ignoreElements.transitions.md), [control-state diagram](../generated/ignoreElements.visualization.md), and [predicted trace](../generated/ignoreElements.trace.md) are generated from reviewed descriptors and the [reference evaluator](../model/ignoreElements.ts). Descriptors are not a universal executable rule language; generation alone does not prove semantics.

The [test obligations](../test-plans/ignoreElements.md) link rule IDs to independent model fixtures and actual RxJS observations. [F02 evidence](../evidence/F02-value-selection.md) records inspected sources, exact execution results, and limits. Direct model-state assertions do not expose private RxJS state; runtime checks observe notifications, calls, source lifetimes, and disposal.

## Invariants and classification

No reachable G word contains Next. Ignoring values does not shorten the source lifetime; completion and error cause the same scoped terminal delivery and disposal described by the contract. Validity of individual states is not a proof of all traces. Each settled subscription permits at most one terminal notification, no later Next delivery, and only scope-owned disposal. No history buffer, inner-concurrency policy, own clock, or sharing coordinator is introduced.

Derived behavior: unconditional next-suppression with terminal-notification forwarding. It is not source cancellation, buffering, or early empty completion. This is a scoped runtime behavior profile, not full overload/type-narrowing coverage or an exhaustive equivalence proof. Mermaid source and regeneration are checked; rendered layout is not claimed.
