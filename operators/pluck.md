# pluck — Mealy six-tuple

**Baseline:** RxJS 7.8.2. **Identity:** P:pluck. **Profile:** PL-PROPERTY-PATH. **Family:** F02.  
**Evidence:** Source-reviewed; reference-model and selected RxJS runtime checks passed at the executable checkpoint. See [F02 evidence](../evidence/F02-value-selection.md) for final-package verification and exclusions.

## Explanation

Each source value is traversed along the configured property path. A resolved value is forwarded; an unresolved lookup produces Next(undefined), not silence. A null final property is preserved, while a null intermediate prevents deeper lookup and produces undefined. Ordinary property access can invoke getters and use inherited properties.

The pinned [pluck.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/pluck.ts) delegates to map after validating the path. It is deprecated in that source but remains a supported analysis target on our unchanged 7.8.2 baseline.

## Parameters, construction, and compatibility

A nonempty fixed sequence K of string, number, or symbol keys. The typed reference configure function copies/freezes the key list to enforce the profile's fixed configuration; freezing is a model safeguard, not a claim about RxJS. Payload references are not frozen or cloned.

**PL-C00:** pluck() throws `Error('list of properties cannot be empty.')` at operator construction, before a subscription exists. This is a construction contract, not G=Error and not an extra terminal machine state. No properties and one property whose value is undefined are different argument cases. A JavaScript-only undefined-key observation is tested separately; arbitrary non-PropertyKey coercions are outside the main profile.

For valid fixed keys, the corresponding map projection must perform the same optional property access, with the same getter order and final-value behavior. Plain direct access that throws on a missing intermediate is not that projection. Dynamic key coercion, reentrant or policy-mutating getters/proxies, and full TypeScript overload/narrowing equivalence are excluded. Deterministic non-reentrant property reads, including reads that throw, are included.

## Execution scope

One downstream subscription and its owned source participation; no introduced sharing. A separate initializer establishes S0 before subscribing upstream and produces no initial Next. Construction/argument evaluation is not subscription execution. Source/scheduler timing is external; this profile owns no timer and introduces no scheduling boundary.

T records the resulting stable state, not an instruction to commit it before interpreting G. Complete and Error are downstream notifications; DisposeOwned is control output for this subscription's resources. Unsubscribe produces no Complete. Cleanup registered after a synchronous source returns is covered by the ownership contract. A terminal self-loop models an attempted late input after settled disposal, not continued delivery from a disconnected source.

The main model assumes non-reentrant, protocol-respecting inputs, passive consumers and nonthrowing teardown. Parameters remain fixed; callbacks/property access terminate and do not reenter or alter future policy, although specified failures are allowed. Diagnostic call recording may not affect results. No monkey-patched built-ins, arbitrary external mutation, or consumer-handler exceptions are covered. Existing F01 execution-boundary tests and the separately labeled F02 delivery-interruption checks do not broaden these macrostep claims. See the [execution contract](../docs/EXECUTION-CONTRACT.md).
## 1. State space — S

$$
S=\{\operatorname{Active},\operatorname{Completed},\operatorname{Errored},\operatorname{Cancelled}\},\qquad S_0=\operatorname{Active}.
$$
The fixed path belongs to configuration; the traversal cursor and intermediate property are temporary within a reaction. The delegated map counter is unobserved by the path projection and omitted from this behavioral state.

## 2. Initial state — S0

Active, only after valid nonempty-path construction. Separate setup subscribes the source and sends no initial value. Invalid construction never reaches this running profile.

## 3. Input alphabet — Z

`Z = {SourceNext(x), SourceComplete, SourceError(e), Unsubscribe}`, with tagged inputs, x in the declared value domain, and e any JavaScript error/thrown value. There are no timer, inner, or notifier inputs in this profile. Late attempts are included only at the settled boundary.
## 4. Output alphabet — A

`A = {Next(y), Complete, Error(e), DisposeOwned}`. G returns ordered words in A*, including `[]`. A Next carrying undefined or an empty container is not an empty word. DisposeOwned is not a fourth Observable notification.
## 5. Transition function — T

A successfully resolved path or an unresolved/undefined lookup retains Active (PL01/PL02). A property-access throw moves to Errored (PL03). SourceComplete, SourceError, and Unsubscribe select the corresponding distinct terminal outcomes (PL04–PL06). Settled terminal attempts retain their state (PL07).

## 6. Output function — G

PL01 produces [Next(y)] for a defined final value, including null, false, zero, and empty string. PL02 produces [Next(undefined)] when any lookup returns undefined, including lookup from a nullish base. Traversal stops there. PL03 produces [Error(e), DisposeOwned]. PL04–PL06 complete/dispose, fail/dispose, or dispose only. PL07 produces []. Each reached property is read once using the normal JavaScript receiver; T/G do not traverse twice.

## Tables, tests, visualization, and evidence

The [guarded table](../generated/pluck.transitions.md), [control-state diagram](../generated/pluck.visualization.md), and [predicted trace](../generated/pluck.trace.md) are generated from reviewed descriptors and the [reference evaluator](../model/pluck.ts). Descriptors are not a universal executable rule language; generation alone does not prove semantics.

The [test obligations](../test-plans/pluck.md) link rule IDs to independent model fixtures and actual RxJS observations. [F02 evidence](../evidence/F02-value-selection.md) records inspected sources, exact execution results, and limits. Direct model-state assertions do not expose private RxJS state; runtime checks observe notifications, calls, source lifetimes, and disposal.

## Invariants and classification

With valid keys, every nonthrowing SourceNext produces exactly one Next, including unresolved paths. The final reference is passed without cloning. Property traversal is ordinary access, not own-property-only lookup or a dot-string parser. Validity of individual states is not a proof of all traces. Each settled subscription permits at most one terminal notification, no later Next delivery, and only scope-owned disposal. No history buffer, inner-concurrency policy, own clock, or sharing coordinator is introduced.

Derived behavior: configured, nullish-safe property-path mapping with access-failure termination and a separate construction-validation boundary. This is a scoped runtime behavior profile, not full overload/type-narrowing coverage or an exhaustive equivalence proof. Mermaid source and regeneration are checked; rendered layout is not claimed.
