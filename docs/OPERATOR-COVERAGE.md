# Qualified operator coverage

**Baseline:** RxJS 7.8.2. **Owning plan:** [34-family tracker](FAMILY-IMPLEMENTATION-PLAN.md). The inventory contains 146 planning identities (113 P, 30 C, 3 X), not 146 proved or implemented machines. A document does not imply complete API coverage.

## F01 dispositions

Model and runtime evidence are separate. All four profiles use independent subscription scope, stable non-reentrant reactions, and the explicit exclusions in their pages. [Evidence and inspected source/helper links](../evidence/F01-prefix-selection.md) and [family tests](../tests/families/F01-prefix-selection.test.mjs) supply verification detail.

| Identity | Owner | Canonical profile / configurations | Rules | Recorded evidence |
|---|---|---|---|---|
| P:takeWhile | F01 | [TW-BOOLEAN](../operators/takeWhile.md): indexed Boolean predicate, default/false/true inclusive, throws | TW01–TW08 | Source-reviewed; model and selected F01 RxJS checks passed |
| P:skipWhile | F01 | [SW-BOOLEAN](../operators/skipWhile.md): indexed Boolean predicate, normal/throw, skipping/forwarding | SW01–SW08 | Source-reviewed; model and selected RxJS checks passed |
| P:take | F01 | [TK-NATURAL](../operators/take.md): nonnegative safe integer, zero/one/positive, explicit Start | TK00–TK07 | Source-reviewed; model and selected RxJS checks passed |
| P:skip | F01 | [SK-NATURAL](../operators/skip.md): nonnegative safe integer, zero/one/positive | SK01–SK06 | Source-reviewed; model and selected RxJS checks passed |

No assigned F01 identity is omitted. Type-guard narrowing, unsupported runtime arguments, exact microstep parity, and arbitrarily reentrant programs remain excluded. F01-EX01–EX04 are separately labeled execution observations. A filter contrast does not cover F02; two every/defaultIfEmpty regression fixtures do not cover F06.

## Planned identities

For **every row below**, disposition is Planned; profile IDs, local profile path, source/helper review, model/runtime evidence, and verification cases are **not yet established**. Configurations and exclusions must be declared when its owning family is implemented. These identities are inherited planning assignments, not a fresh export audit or silent alias-equivalence claim.

| Qualified identity | Owning family |
|---|---|
| `P:map` | F02 |
| `P:filter` | F02 |
| `P:ignoreElements` | F02 |
| `P:mapTo` | F02 |
| `P:pluck` | F02 |
| `P:distinctUntilChanged` | F03 |
| `P:distinctUntilKeyChanged` | F03 |
| `P:distinct` | F03 |
| `P:pairwise` | F03 |
| `P:first` | F04 |
| `P:last` | F04 |
| `P:elementAt` | F04 |
| `P:find` | F04 |
| `P:findIndex` | F04 |
| `P:single` | F04 |
| `P:scan` | F05 |
| `P:reduce` | F05 |
| `P:count` | F05 |
| `P:min` | F05 |
| `P:max` | F05 |
| `P:toArray` | F05 |
| `P:every` | F06 |
| `P:isEmpty` | F06 |
| `P:defaultIfEmpty` | F06 |
| `P:throwIfEmpty` | F06 |
| `P:takeLast` | F07 |
| `P:skipLast` | F07 |
| `P:startWith` | F07 |
| `P:endWith` | F07 |
| `C:of` | F08 |
| `C:range` | F08 |
| `C:EMPTY` | F08 |
| `C:NEVER` | F08 |
| `C:throwError` | F08 |
| `C:pairs` | F08 |
| `C:empty` | F08 |
| `C:never` | F08 |
| `C:from` | F09 |
| `C:scheduled` | F09 |
| `C:defer` | F10 |
| `C:iif` | F10 |
| `C:bindCallback` | F10 |
| `C:bindNodeCallback` | F10 |
| `C:fromEvent` | F11 |
| `C:fromEventPattern` | F11 |
| `C:timer` | F12 |
| `C:interval` | F12 |
| `C:animationFrames` | F12 |
| `P:observeOn` | F12 |
| `P:subscribeOn` | F12 |
| `P:timestamp` | F12 |
| `P:timeInterval` | F12 |
| `P:takeUntil` | F13 |
| `P:skipUntil` | F13 |
| `P:debounce` | F14 |
| `P:debounceTime` | F14 |
| `P:throttle` | F14 |
| `P:throttleTime` | F14 |
| `P:audit` | F15 |
| `P:auditTime` | F15 |
| `P:sample` | F15 |
| `P:sampleTime` | F15 |
| `P:delay` | F16 |
| `P:delayWhen` | F16 |
| `P:timeout` | F16 |
| `P:timeoutWith` | F16 |
| `P:bufferCount` | F17 |
| `P:buffer` | F17 |
| `P:bufferTime` | F17 |
| `P:bufferToggle` | F17 |
| `P:bufferWhen` | F17 |
| `P:windowCount` | F18 |
| `P:window` | F18 |
| `P:windowTime` | F18 |
| `P:windowToggle` | F18 |
| `P:windowWhen` | F18 |
| `C:combineLatest` | F19 |
| `P:combineLatestWith` | F19 |
| `P:combineLatest` | F19 |
| `C:zip` | F19 |
| `P:zipWith` | F19 |
| `P:zip` | F19 |
| `C:forkJoin` | F19 |
| `P:withLatestFrom` | F19 |
| `P:sequenceEqual` | F19 |
| `C:concat` | F20 |
| `P:concatWith` | F20 |
| `P:concat` | F20 |
| `C:merge` | F20 |
| `P:mergeWith` | F20 |
| `P:merge` | F20 |
| `C:race` | F20 |
| `P:raceWith` | F20 |
| `P:race` | F20 |
| `P:mergeAll` | F21 |
| `P:concatAll` | F21 |
| `P:switchAll` | F21 |
| `P:exhaustAll` | F21 |
| `P:exhaust` | F21 |
| `P:mergeMap` | F22 |
| `P:concatMap` | F22 |
| `P:switchMap` | F22 |
| `P:exhaustMap` | F22 |
| `P:flatMap` | F22 |
| `P:mergeMapTo` | F22 |
| `P:concatMapTo` | F22 |
| `P:switchMapTo` | F22 |
| `P:combineLatestAll` | F23 |
| `P:zipAll` | F23 |
| `P:combineAll` | F23 |
| `C:generate` | F24 |
| `P:expand` | F24 |
| `P:mergeScan` | F24 |
| `P:switchScan` | F24 |
| `P:groupBy` | F25 |
| `C:partition` | F25 |
| `P:partition` | F25 |
| `P:catchError` | F26 |
| `P:retry` | F26 |
| `P:retryWhen` | F26 |
| `C:onErrorResumeNext` | F26 |
| `P:onErrorResumeNextWith` | F26 |
| `P:repeat` | F27 |
| `P:repeatWhen` | F27 |
| `P:materialize` | F28 |
| `P:dematerialize` | F28 |
| `P:finalize` | F29 |
| `P:tap` | F29 |
| `C:using` | F29 |
| `P:connect` | F30 |
| `C:connectable` | F30 |
| `P:multicast` | F30 |
| `P:refCount` | F30 |
| `P:share` | F31 |
| `P:shareReplay` | F32 |
| `P:publish` | F32 |
| `P:publishBehavior` | F32 |
| `P:publishLast` | F32 |
| `P:publishReplay` | F32 |
| `X:fromFetch` | F33 |
| `X:ajax` | F33 |
| `X:webSocket` | F34 |

P/C/X distinguish pipeable, creation, and transport identities. Same-spelled creation and pipeable APIs remain separate. Root re-exports of the same implementation are normalized by the plan. F01 is Complete for its declared scope: 1/34 family packages. Four of the 146 named identities have scoped profiles; this is not 4/146 of all possible RxJS behavior.
