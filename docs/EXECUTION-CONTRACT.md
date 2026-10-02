# Execution contract for a six-tuple profile

T predicts the next state. G predicts an ordered output word. The execution contract explains **how that word interacts with real subscriptions and time**. It is required profile metadata, not a seventh Mealy component.

This document adapts the obligations of [ROB-SN's execution contract](https://github.com/hansschenker/rxjs-operator-behavior-set-notation/blob/69d32fdff0a368989ff76505c4884aedc49bfb33/docs/EXECUTION-CONTRACT.md).

## Activation and state ownership

Choose a separate initializer or a Start input. Declare what exists before setup can synchronously notify. Name the owner of every state/resource component: one downstream subscription, a connection generation, shared coordinator, or independent producer.

The reference takeWhile profile has one independently subscribed source and no sharing. Reusing the same operator description does not share its index. Sharing must be introduced and analyzed explicitly. Captured payload/seed references can still be shared even when bookkeeping is fresh ([Observable](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Observable.ts), [share](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/share.ts)).

## State commits and output interpretation

A macrostep records the **resulting stable state** and output word. It is not an instruction to commit every component of T before executing G. In particular, a result of Completed with `[Next(x), Complete]` does not close the destination before Next(x).

For every output letter specify its destination, resource scope, and interruption points. Next may synchronously invoke a consumer; Subscribe may synchronously produce inner inputs; Cancel may run teardown. An output word is not an uninterruptible transaction.

An exact model may need intermediate phases, callback-result inputs, and suspended frames in S. T and G retain their names and types at that finer granularity. Do not insert an artificial asynchronous queue between every pair of operators.

## Callback evaluation and errors

Projection, predicate, accumulator, and key selection are supplied functions. Declare arguments, callback indexes, truthiness/type assumptions, return behavior, exceptions, mutation, and external reads. Evaluate each at the point specified by the implementation, not independently once for T and once for G.

A pure, terminating callback can be treated as a mathematical function. Reentrant/effectful callbacks need a broader execution model. Source errors, predicate throws, consumer-handler exceptions, and teardown exceptions are not automatically the same input or output rule ([OperatorSubscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/OperatorSubscriber.ts), [Subscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts), [Subscription](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscription.ts)).

For example, [switchMap](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/switchMap.ts) cancels the previous inner before evaluating the new projection. Abstractly saying replace cannot erase that order or the code that teardown can run.

## Time and ordering

Sources and schedulers supply time. Operators declare policies that use them. State a clock domain, scheduler, scheduled identities, cancellation rules, and relevant equal-time ordering. Not all asynchronous facilities are virtualized by TestScheduler; its frame is not automatically an operator-visible TimerFired input ([testing guide](https://rxjs.dev/guide/testing/marble-testing)).

Distinguish a timestamp t, processing position k, callback index i, and nested call/resumption order. Two equal timestamps do not specify a universal source-before-timer priority. A timeline alone cannot show all intermediate-state visibility.

## Completion, error, cancellation, and disposal

Source completion is not universally output completion; an operator may flush, wait for an inner, or continue with another source. Consumer unsubscription delivers no completion notification. Error recovery must avoid terminating a downstream subscriber that is intended to continue; it does not resurrect an already terminal subscriber ([Subscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts), [switchMap](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/switchMap.ts)).

DisposeOwned is scope-relative. A subscriber leaving shared work need not disconnect every participant. Disconnecting an inner does not guarantee that unrelated promises, remote effects, or independently owned producers physically stop.

A settled terminal notification model may return no further output for attempted inputs. This boundary does not erase outstanding finalization, diagnostic callbacks, or resource failures in a broader model. Cleanup after completion is not a new Cancelled outcome.

## Snapshot and delivery policy

Declare whether output containers are snapshots, which payload references remain shared, and whether mutation is excluded. A fresh container does not imply a deep clone. For multi-output reactions, distinguish requested output letters from actual delivered notifications if cancellation can interrupt delivery.

## Conformance scope

List which observations are compared: payloads, order, time, callback calls/indexes, input subscription intervals, terminal cause, resource disposal, and sharing behavior. A model-state unit test does not expose a private RxJS state variable. A matching final value does not establish timing or lifetime equivalence.

The [verification record](VERIFICATION.md) distinguishes local reference-model checks from real RxJS runtime checks.
