# skipWhile — F01 test obligations

[Profile](../operators/skipWhile.md) · [guarded table](../generated/skipWhile.transitions.md) · [evidence](../evidence/F01-prefix-selection.md).

| Rules | Reachable arrangement and input | Expected T/G consequence | Cases |
|---|---|---|---|
| SW01 | Reach Skipping(i) with i true results, then another true | [] and i+1 | Independent model fixture; always-true and index cases |
| SW02 | First false after zero or more true results | Next(boundary), Forwarding | First-false/COMPARE/CALLS |
| SW03 | Forwarding, next value which predicate would reject or throw on | Next(value), no call | CALLS and direct model fixture |
| SW04–SW06 | Source complete/error/cancel in both phases | Correct terminal word and owned disposal | Both-phase fixtures; lifecycle and boundary cases |
| SW07 | Predicate throws while Skipping | Same Error, disposal | Throw fixture and bounded comparisons |
| SW08 | Attempt ordinary input after each outcome | Same terminal state, [] | Model terminal matrix; runtime disconnection consequences |

Direct state assertions run only against the reference model. Black-box RxJS tests use source history, continuation, callback observations where applicable, subscriptions, and teardown. A table row is a test obligation, not a completeness proof.

The [model suite](../tests/families/F01-model.test.mjs) supplies independent expected T/G results and checks declared rule IDs. The [runtime suite](../tests/families/F01-prefix-selection.test.mjs) includes fixed expected marbles, setup/teardown probes, independent subscriptions, payload identity, and bounded differential cases. The two suites test different claims and do not read private RxJS state.

Normal return/throw, source error, completion, and external cancellation are distinct cases. Counts outside nonnegative safe integers and non-Boolean/effect-dependent predicates are not included. Reentry and cancellation during delivery are separately labeled execution observations rather than passing traces of these stable models.

Status: model fixtures and real RxJS family cases passed on the hosted run recorded in evidence. No unsupported test:family command is assumed. All tests are included by the existing npm test scripts.
