# F01 — Execution boundaries beyond stable reactions

**Baseline:** RxJS 7.8.2. **Scope:** four bounded, separately labeled runtime observations. These do not extend the stable reference evaluators' conformance claims. All four independently expected outcomes passed on the hosted runtime run in [F01 evidence](../evidence/F01-prefix-selection.md).

The six-tuple describes one chosen level. To model intermediate writes and resumption exactly, S/Z would need processing phases and callback/continuation events. No universal microstep interpreter is introduced in F01. The [runtime cases](../tests/families/F01-prefix-selection.test.mjs) named F01-EX01–EX04 run directly against RxJS, not through the macrostep models.

## EX01 — Cancellation during an inclusive boundary emission

Input 7 fails an always-false predicate with inclusive=true. The downstream next handler unsubscribes its Subscriber while receiving 7. The observer gets Next(7), no Complete, and owned-source disposal occurs once. The source's later value is not delivered.

The ordinary TW03 word requests Next then Complete. In this execution the first delivery closes the destination before the completion call can deliver. An output word is therefore not an uninterruptible transaction. Source: [takeWhile](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/takeWhile.ts), [Subscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts).

## EX02 — A nested input observes the advanced index

While evaluating predicate(7,0), the predicate synchronously submits 1 to the same Subject. The nested invocation sees index 1; it emits 1. The outer predicate then returns false, and exclusive takeWhile completes.

```text
predicate(7,0) enters
  predicate(1,1) enters and returns true
  Next(1)
predicate(7,0) returns false
Complete
```

The index is advanced by `index++` before the predicate invocation. A model that waits until the whole reaction returns to establish the new index would predict the wrong nested index. This is intentionally outside the pure/non-reentrant callback profile.

## EX03 — Reentrant take reads a counter changed by nested work

With take(2), receiving Next(1) submits 2; receiving Next(2) submits 3. Three source attempts occur, but only 1 and 2 are forwarded. The nested third attempt increments `seen` beyond count and does not emit. The resumed second handler uses count<=seen to complete. The first handler's later completion attempt produces no second delivered terminal notification.

This is source-derived from [take.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/take.ts), including its reentrancy comment, and aligns with the completed reentrant test in [take-spec.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/take-spec.ts). The upstream file also contains a skipped recursive-error case; this project does not treat that skipped case as passing evidence.

## EX04 — A nested skipWhile boundary can be overwritten on resumption

While predicate(1,0) runs, it submits 2. The nested predicate(2,1) returns false: the forwarding flag becomes true and 2 is emitted. The outer predicate then returns true; its pending assignment writes the flag back to false. A later input 3 invokes predicate(3,2), contrary to what an unconditional “predicate never runs after the boundary” statement would imply.

```text
predicate(1,0) enters
  predicate(2,1) returns false → forwarding=true → Next(2)
predicate(1,0) returns true  → forwarding=false
predicate(3,2) returns false → forwarding=true → Next(3)
SourceComplete → Complete
```

This follows the exact assignment/short-circuit expression in [skipWhile.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/skipWhile.ts). The stable model's absorbing Forwarding phase is correct only within its declared non-reentrant scope; these tests make that boundary explicit rather than weakening the model fixtures.

## Interpretation

Completion, cancellation, nested execution, and teardown cannot be inferred from final values alone. The main family is completed only for its specified stable profiles. These four examples are discriminating execution observations, not all possible reentrant traces, not a general conformance proof, and not evidence that every state-machine diagram represents JavaScript call order.
