# map — F02 test obligations

[Profile](../operators/map.md) · [Guarded table](../generated/map.transitions.md) · [Evidence](../evidence/F02-value-selection.md).

| Rule / contract | Reachable arrangement and input | Obligation |
|---|---|---|
| MP01 | Projection return, including undefined, references and Observable data | Active(i+1); exactly Next(result); no flattening |
| MP02 | Projection throws after an accepted prefix | Errored; Error then DisposeOwned; no later projection |
| MP03 / MP04 / MP05 | Empty/complete, source error, explicit unsubscribe | Distinct outcome and correct terminal/disposal word |
| MP06 | Every ordinary input after each settled outcome | State retained; []; no further calls |

S0 is checked separately. The [model suite](../tests/families/F02-model.test.mjs) directly arranges states and compares independently written expected T/G words. The [RxJS suite](../tests/families/F02-value-selection.test.mjs) reaches situations by source history; test names beginning `[F02 map]` identify this profile. Shared `[F02]` tests cover cross-profile distinctions, identity, and construction/compatibility. Expected words are not obtained by calling the evaluator under test twice.

Every profile has a common timed trace, empty and immediate-error cases, never with cancellation, error/cancellation after values, and independent lazy subscriptions. Each case asserts the relevant source interval or teardown. Symbolic row coverage is not exhaustive parameter/history coverage. Terminal model attempts are not claims that real disconnected inputs arrive.

Bounded differential cases are additional evidence: map 1,452; filter 1,452; ignoreElements 363; mapTo 1,452; pluck 2,331. All five run within distinct Node tests, not thousands of additional test cases. Main profiles exclude arbitrary reentrancy, mutation, thisArg/type-narrowing proofs, and teardown/consumer exceptions. Four named downstream-take checks are separate delivery-interruption observations, not an extension of the stable T/G semantics.

Recorded status: independent model and selected RxJS checks passed at the executable checkpoint; the final-package check is recorded in the family evidence/handoff. A planned test obligation alone is not passing evidence.
