# skip — F01 test obligations

[Profile](../operators/skip.md) · [guarded table](../generated/skip.transitions.md) · [evidence](../evidence/F01-prefix-selection.md).

| Rules | Reachable arrangement and input | Expected T/G consequence | Cases |
|---|---|---|---|
| SK01 | Input index below count | [], increment index | Suppressed-value model fixture; count-equal/short cases |
| SK02 | Input index at/above count, including zero-count first input | Next(value), increment index, remain active | COMPARE; zero/one cases; independent fixtures |
| SK03–SK05 | Source complete/error/cancel before or after threshold | Correct terminal notification/disposal | Lifecycle and boundary cases; bounded comparisons |
| SK06 | Attempt ordinary input after each outcome | Same outcome, [] | Terminal model matrix; cancellation-chain observations |

Direct state assertions run only against the reference model. Black-box RxJS tests use source history, continuation, callback observations where applicable, subscriptions, and teardown. A table row is a test obligation, not a completeness proof.

The [model suite](../tests/families/F01-model.test.mjs) supplies independent expected T/G results and checks declared rule IDs. The [runtime suite](../tests/families/F01-prefix-selection.test.mjs) includes fixed expected marbles, setup/teardown probes, independent subscriptions, payload identity, and bounded differential cases. The two suites test different claims and do not read private RxJS state.

Normal return/throw, source error, completion, and external cancellation are distinct cases. Counts outside nonnegative safe integers and non-Boolean/effect-dependent predicates are not included. Reentry and cancellation during delivery are separately labeled execution observations rather than passing traces of these stable models.

Status: model fixtures and real RxJS family cases passed on the hosted run recorded in evidence. No unsupported test:family command is assumed. All tests are included by the existing npm test scripts.
