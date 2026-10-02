# Provenance and primary references

## Project sources

[ROB-SN](https://github.com/hansschenker/rxjs-operator-behavior-set-notation/tree/69d32fdff0a368989ff76505c4884aedc49bfb33), pinned to commit `69d32fdff0a368989ff76505c4884aedc49bfb33`. Its README, project guide, foundation, execution contract, behavioral qualities, transition-rule catalogue, and operator-analysis template inform the reformulation. Attribution in that project: GPT-6 Astra, with Hans Schenker.

[RxJS Operator Mealy Analysis](https://github.com/hansschenker/rxjs-operator-mealy-analysis/tree/402f00708c3ddb40ca451775fe38f9d80b4b90ed), pinned to commit `402f00708c3ddb40ca451775fe38f9d80b4b90ed`. Its README, methodology, test-plan method, custom checklist, takeWhile analysis/test plan, and sampled every/defaultIfEmpty profiles were reviewed. Attribution in that project: SuperGrok, with Hans Schenker. See the [review record](COMPANION-REVIEW.md) for precise findings and limits.

Both repositories were read without changing them. This repository is a new adaptation, not a copied history or complete catalogue import.

## Classical Mealy definition

[Mealy machines — Universitat d'Alacant course text](https://www.dlsi.ua.es/~mlf/nnafmc/pbook/node13.html): finite states and alphabets, one output symbol per input, separate next-state and output functions. Our richer state domains and finite output words are explicitly identified extensions; the symbol choices S,S0,Z,A,T,G are the project's chosen vocabulary.

## RxJS 7.8.2 implementation anchors

| Source | Relevance |
|---|---|
| [takeWhile.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/takeWhile.ts) | Predicate index, inclusive output order, completion |
| [OperatorSubscriber.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/OperatorSubscriber.ts) | Delegated handlers and operator-callback errors |
| [Subscriber.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts) | Notification protocol, stop/unsubscribe, terminal delivery |
| [Subscription.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscription.ts) | Resource disposal and finalizers |
| [Observable.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Observable.ts) | Subscription activation and delegation |
| [every.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/every.ts) | Pass/fail correction in sampled companion table |
| [defaultIfEmpty.ts](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/defaultIfEmpty.ts) | Empty-completion guard and default emission |
| [takeWhile tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/takeWhile-spec.ts) | Inspected examples of marbles, inclusivity, indexes, empty/error behavior |
| [Marble testing guide](https://rxjs.dev/guide/testing/marble-testing) | TestScheduler concepts; live guide, not version-pinned implementation evidence |

Additional pinned sources are linked beside claims in the foundation and execution contract. A reference link is not a claim that every line or every upstream test was examined. Source inspection, model execution, and real RxJS execution are separately reported in [verification](VERIFICATION.md).
