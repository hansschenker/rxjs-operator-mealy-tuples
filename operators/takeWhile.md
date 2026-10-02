# takeWhile — Mealy six-tuple

**Baseline:** RxJS 7.8.2. **API:** pipeable `takeWhile(predicate, inclusive)`.  
**Scope:** one downstream subscription and its owned source subscription; no sharing.  
**Level:** stable behavioral reactions, not exact reentrant execution.  
**Evidence:** source-reviewed, reference-model tested, and selectively RxJS-tested during [F00](../evidence/F00-baseline-validation.md). The existing execution scope and exclusions remain unchanged.

## Explanation

Source values flow while the predicate accepts them. The first rejected value ends the result immediately. Inclusive false suppresses that boundary value; inclusive true forwards it before completion. Both profiles stop their source participation at that boundary.

The predicate receives a zero-based index for each source next processed while active. Completion before a rejection completes the result; a source error or predicate throw fails it. Consumer unsubscription disposes the source participation without a completion notification. Sources: [takeWhile](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/takeWhile.ts), [OperatorSubscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/OperatorSubscriber.ts), [Subscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts).

## Parameters and assumptions

The fixed parameters are a Boolean-valued predicate `p(value,index)` and an explicit Boolean inclusive setting. Predicates terminate, do not reenter the stream or mutate shared domain state, and may throw. Diagnostic call recording is allowed in tests but must not alter the predicate result. Consumer handlers and resource teardown do not throw or reenter. The reference model's numeric indexes are used within JavaScript's exact safe-integer range.

Separate activation initializes S0 before the source can notify, then subscribes the source. There is no Start in Z for this profile. Setup produces no downstream value. DisposeOwned abstracts the eventual teardown of the one owned source participation, including teardown registered after a synchronous source returns.

Excluded: reentrant callbacks/teardown, consumer cancellation during an emission, stopped-notification diagnostics, exact intermediate index writes after termination, aliasing mutations, and TypeScript overload/type-guard proof. `inclusive` changes G for a false predicate; it does not create another memory component or change this profile's T.

## 1. State space — S

$$
S=\{\operatorname{Active}(i)\mid i\in\mathbb N_0\}\uplus\{\operatorname{Completed},\operatorname{Errored},\operatorname{Cancelled}\}.
$$

The index belongs to this subscription. Terminal states record distinct outcomes; they do not claim that RxJS physically rewrites a variable to those literal strings. The error payload need not remain in S because the modeled future behavior is independent of it; G carries it.

## 2. Initial state — S0

$$
S_0=\operatorname{Active}(0).
$$

No initial Next is implied. Another independent subscription starts again at index zero.

## 3. Input alphabet — Z

```text
SourceNext(value)
SourceComplete
SourceError(error)
Unsubscribe
```

The model also defines these as attempted inputs after a settled terminal state for boundary tests. This does not claim that real disconnected source notifications continue reaching the operator.

## 4. Output alphabet — A

```text
Next(value)       Complete       Error(error)       DisposeOwned
```

G returns a finite ordered word. The first three letters describe downstream notifications. DisposeOwned is a resource-control output, never a fourth Observable notification.

## 5. Transition function — T

While Active(i), an accepted SourceNext moves to Active(i+1). A rejected SourceNext or SourceComplete moves to Completed. A source error or predicate throw moves to Errored. Unsubscribe moves to Cancelled. A settled terminal state retains its outcome on attempted later inputs.

These are post-reaction stable states, not instructions to close the destination before interpreting G.

## 6. Output function — G

An accepted value produces `[Next(value)]`. A rejected value produces `[Complete, DisposeOwned]`, or `[Next(value), Complete, DisposeOwned]` when inclusive. SourceComplete produces `[Complete, DisposeOwned]`. SourceError or a predicate throw produces `[Error(error), DisposeOwned]`. Unsubscribe produces `[DisposeOwned]`. A settled terminal attempt produces `[]`.

The predicate is evaluated once for each active SourceNext. Both T and G use that same outcome. The [typed evaluator](../model/takeWhile.ts) returns both fields in one result.

## State Transition Table

The [generated guarded table](../generated/takeWhile.transitions.md) supplies the eight rule IDs TW01–TW08. Its text is rendered from reviewed descriptors in the reference model; no independent hand-edited table is maintained here.

## Test derivation and visualization

The [test plan](../test-plans/takeWhile.md) links rules to model and black-box checks. The [model suite](../tests/model.test.mjs) directly asserts state/output pairs. The [RxJS suite](../tests/rxjs.test.mjs) observes notifications, callback calls, subscriptions, and disposal without reading private operator state.

The [state diagram](../generated/takeWhile.visualization.md) projects away the index. The [example trace](../generated/takeWhile.trace.md) walks values 1,2,3 through the inclusive profile. At the boundary, Next(3) precedes Complete in the same frame. A later scheduled source value 4 is not processed after disconnection.

## Invariants and trace laws

Active indexes start at zero and increase once after an accepted input. No input after a settled terminal boundary invokes the predicate. At most one downstream terminal notification is delivered in the declared execution. Cancellation need not deliver any terminal notification. Required boundary Next precedes Complete; owned disposal occurs once in this scope.

The table includes callback failure as a SourceNext reaction outcome. A detailed callback-call/return machine would refine this into smaller steps without changing the six component names.

## Derived classification

A predicate-controlled prefix-taking policy with per-subscription index memory, input-triggered output, optional inclusive boundary forwarding, and early completion/source disconnection. It has no operator-owned timer or overlapping inner subscriptions. It is not ordinary filter: after the first rejection, a later acceptable value is no longer eligible.

## Evidence limits

The upstream [takeWhile test file](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/takeWhile-spec.ts) was inspected in part; that upstream suite was not run. Our F00 hosted validation passed 15 reference-model tests and all 14 project RxJS tests, including 1,452 bounded comparisons. See [F00 evidence](../evidence/F00-baseline-validation.md) for exact revisions, raw output, and the distinction between project tests and upstream tests. Full reentrant or all-overload equivalence is not claimed; [verification history](../docs/VERIFICATION.md) retains the initial installation failure.
