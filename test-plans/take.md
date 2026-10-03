# take — F01 test obligations

[Profile](../operators/take.md) · [guarded table](../generated/take.transitions.md) · [evidence](../evidence/F01-prefix-selection.md).

| Rules | Reachable arrangement and input | Expected T/G consequence | Cases |
|---|---|---|---|
| TK00 | NotStarted, Start, count=0 | Complete; no source acquisition/disposal | Zero-count marble and counted activation test |
| TK01 | NotStarted, Start, count>0 | Active(count), SubscribeSource | Model fixture; every positive-count runtime subscription |
| TK02 | Active(r>1), next | Next(value), r-1 | COMPARE; independent state fixture |
| TK03 | Active(1), next | Next then Complete then owned disposal | Count-one/count-two and subscription marbles |
| TK04–TK06 | Complete/error/cancel before capacity exhausted | Corresponding terminal outcome and word | Lifecycle tests and bounded comparisons |
| TK07 | Attempt ordinary input after each terminal outcome | Same outcome and [] | Model terminal matrix; cooperative source checks |

Direct state assertions run only against the reference model. Black-box RxJS tests use source history, continuation, callback observations where applicable, subscriptions, and teardown. A table row is a test obligation, not a completeness proof.

The [model suite](../tests/families/F01-model.test.mjs) supplies independent expected T/G results and checks declared rule IDs. The [runtime suite](../tests/families/F01-prefix-selection.test.mjs) includes fixed expected marbles, setup/teardown probes, independent subscriptions, payload identity, and bounded differential cases. The two suites test different claims and do not read private RxJS state.

Normal return/throw, source error, completion, and external cancellation are distinct cases. Counts outside nonnegative safe integers and non-Boolean/effect-dependent predicates are not included. Reentry and cancellation during delivery are separately labeled execution observations rather than passing traces of these stable models.

Status: model fixtures and real RxJS family cases passed on the hosted run recorded in evidence. No unsupported test:family command is assumed. All tests are included by the existing npm test scripts.
