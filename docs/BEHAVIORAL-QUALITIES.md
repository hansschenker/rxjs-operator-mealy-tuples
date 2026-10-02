# Observe behavior, then classify

Classification is the conclusion of analysis. An operator profile can belong to several families; family names need not partition all operators.

| Quality | Where the six-tuple exposes it | What to observe |
|---|---|---|
| Activation | S0, setup convention, Z | Starts independent work or joins existing work |
| Memory | S and T | Counter, latest value, buffer, queue; growth and release |
| Input roles | Z | Source, inner, notifier, timer, participant, cancellation |
| Value behavior | G and supplied functions | Transform, select, combine, forward, replay |
| Cardinality | G's word and destination | Number of requested notification letters per reaction |
| Time | Timed Z, deadline memory in S, control letters in A | Delay, silence window, periodic trigger, ties |
| Concurrency | Active work/queue in S; admission in T/G | Overlap, queue, replace, ignore while busy |
| Cancellation | Lifecycle Z and control outputs in G | Disconnection, pending-work eligibility, disposal |
| Termination | Distinct inputs, outcomes, and terminal letters | Flush, wait, complete, fail, continue, cancel |
| Ownership/sharing | Scope of S, participant inputs and resource letters | Membership, replay, reference counting, reset generations |
| Execution sensitivity | Contract and finer S/Z where needed | Callback order/indexes, reentrancy, aliases, teardown |

`G=[CancelInner(j), SubscribeInner(k)]` contains two control letters and no requested downstream value. `G=[Next(x), Next(x), Complete]` contains three letters but two requested values. Actual delivered values can differ under interruption or multicasting; state the observation boundary.

## State validity and valid histories

A validity predicate constrains one state: an active count is nonnegative, a buffer respects its stable bound, or a resource identity has a declared owner. A trace law constrains a history: at most one terminal notification per downstream subscription, no next after terminal delivery or cancellation to that subscription, correct final emission order, and justified subscription/disposal actions.

Validity of every state does not prove validity of the history. Disposal can continue after terminal delivery. An internal cleanup unsubscribe is not a second terminal outcome. See the [execution contract](EXECUTION-CONTRACT.md) and [Subscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts).

## Provisional family vocabulary

Useful study categories include value mapping/selection, taking/dropping prefixes, folding/unfolding, buffering/windowing, combining/coordination, time/gate control, inner-subscription policies, recovery/resubscription, and sharing/distribution. These organize investigation, not an exhaustive algebra or a proven minimal basis.

For higher-order policies, ask explicitly whether work may overlap, queue, replace active work, or be ignored while busy. An asynchronous domain function does not itself select one of these policies. The machine does.

For each final classification write the configuration, rule IDs, observed qualities, and excluded cases that justify it. The [takeWhile reference](../operators/takeWhile.md) is classified only after its T/G rules are stated.
