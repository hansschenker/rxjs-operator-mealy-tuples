# F02 — Mapping and per-value selection

**Baseline:** RxJS 7.8.2. **Status:** Complete (declared scope), 3 October 2026.  
**Owning identities:** P:map, P:filter, P:ignoreElements, P:mapTo, P:pluck.  
**Prerequisite:** F01 completed. **Evidence:** [F02 validation](../evidence/F02-value-selection.md).

## Intuition: change a value, select it, or suppress it

The same source occurrences can drive different output policies. map changes the payload using a supplied function. filter decides whether the original payload continues. ignoreElements sends no values but still waits for the source's terminal outcome. mapTo supplies a fixed payload for every occurrence. pluck supplies a configured property-path projection.

All five use S, S0, Z, A, T, G. Domain decisions belong in supplied functions or the selected property-access calculation; the stream mechanism controls forwarding, failure, and subscription lifetime. These are behavioral specifications and reference evaluators, not a replacement RxJS library.

## Five related machines

| Profile | Active state | Normal SourceNext reaction | Callback / access failure | Source participation |
|---|---|---|---|---|
| [map](../operators/map.md) | Active(i) | Advance i; Next(project(x,i)) | Error then owned disposal | Continues until source termination or cancellation |
| [filter](../operators/filter.md) | Active(i) | Advance i even on false; Next(x) only on true | Error then owned disposal | A rejected value does not end participation |
| [ignoreElements](../operators/ignoreElements.md) | Active | No value memory change; [] | No domain callback or payload reads | Suppression does not stop source work |
| [mapTo](../operators/mapTo.md) | Active | Next(c), same configured value/reference | No domain callback in this fixed-value profile | No initial constant emission; source-triggered only |
| [pluck](../operators/pluck.md) | Active | Next(path result), including undefined | Property-read error then disposal | Unresolved properties do not end participation |

map/filter indexes are per subscription, not output counts or graph-global event positions. mapTo/pluck delegate to map internally, but their projections do not observe its index; their behavioral models project it away. A finite control diagram does not imply that every implementation has no counter. Sources: [map](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/map.ts), [filter](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/filter.ts), [ignoreElements](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/ignoreElements.ts), [mapTo](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/mapTo.ts), [pluck](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/pluck.ts).

## Same schedule, different G

Independent cold subscriptions receive objects `{score:2}`, `{score:4}`, `{score:7}`, `{score:1}` at frames 1,3,5,7, followed by completion at 9.

| Configuration | Values produced, in order | Complete frame | Source interval |
|---|---|---|---|
| map(score * 2) | 4, 8, 14, 2 | 9 | [0,9] |
| filter(score < 5) | The original objects with scores 2, 4, 1 | 9 | [0,9] |
| ignoreElements() | None | 9 | [0,9] |
| mapTo('ready') | ready, ready, ready, ready | 9 | [0,9] |
| pluck('score') | 2, 4, 7, 1 | 9 | [0,9] |

Here every profile stays attached until source completion. A value changed by map or suppressed by filter does not reschedule the source. The source/scheduler supplies time; these profiles own no clock. Notification and subscription marbles are independently authored in [the runtime suite](../tests/families/F02-value-selection.test.mjs). [Cross-profile trace lanes](../traces/F02-value-selection.md) expose the same distinction.

## Three distinctions worth remembering

**Silence versus undefined.** G=[] means no output letter. G=[Next(undefined)] means one actual value notification. Missing pluck properties and a projection returning undefined belong to the latter, not to filtering.

**Captured value versus shared execution.** mapTo(c) retains c as fixed configuration. An object or function is forwarded by identity, not cloned or called. Separate source subscriptions remain independent even when their results refer to the same captured object. Likewise, map can return an Observable as a value without subscribing to it.

**Construction failure versus stream failure.** pluck() rejects an empty path synchronously while the operator is being constructed. There is no running subscription to fail. PL-C00 records that boundary outside the subscription tuple. A getter that throws while processing a subscribed value instead follows PL03, delivering Error and disposing source participation. A final null property is forwarded; a null intermediate yields undefined on the next lookup. A dotted string key is literal, not parsed as multiple keys.

These statements are grounded in the pinned implementations and the named source/property/identity fixtures; their actual run status is in evidence.

## Exact scope and compatibility

Core profiles use fixed parameters, normal JavaScript property keys, Boolean predicates, terminating non-reentrant callbacks/property access, passive consumers, nonthrowing teardown, and protocol-respecting sources. Normal returns may preserve or create references; arbitrary external mutation and monkey-patched built-ins are excluded. map/filter index arithmetic is bounded to safe integers. thisArg overloads, all type-narrowing proofs, arbitrary coercions of invalid keys/noncallable callbacks, and complete reentrant execution semantics are not covered.

mapTo and pluck remain named dispositions despite deprecation in the pinned baseline. Their delegation is inspected; compatible map forms are checked under the declared domain. This is not identical full-API/type behavior, nor a request to migrate versions. Invalid pluck construction is explicitly documented instead of silently treated as a valid tuple instance.

Four additional tests compose map/filter/mapTo/pluck with downstream take(2) and confirm cooperative source production stops during delivery. The completion in those composed observations belongs to downstream take, not an extra F02 G rule. They are delivery-interruption observations outside the passive-consumer macrostep claim. One JavaScript-only pluck(undefined) key observation is likewise labeled outside the typed key domain. Neither extends the declared scope implicitly.

## Derived artifacts and tests

There are **30 F02 transition rule IDs**: MP01–MP06, FL01–FL07, IG01–IG05, MT01–MT05, PL01–PL07, plus the separate PL-C00 construction contract. Five operator profiles and five test plans link those rules to **15 new generated views** (table, state diagram, trace per operator). The original twelve F01 views and all prefix models/assertions remain unchanged.

Independent model fixtures cover all 30 symbolic rules, identity, index progression, terminal attempts, and property boundaries. Black-box RxJS checks compare notifications, source intervals, callback/getter observations, construction timing, and disposal. There are 43 new model tests and 74 new RxJS tests at the executable checkpoint.

| Bounded sample | Comparisons |
|---|---:|
| map: 121 numeric sequences × 4 projections × 3 endings | 1,452 |
| filter: 121 sequences × 4 predicates × 3 endings | 1,452 |
| ignoreElements: 121 sequences × 3 endings | 363 |
| mapTo: 121 sequences × 4 configured values × 3 endings | 1,452 |
| pluck: 259 object/nullish sequences × 3 paths × 3 endings | 2,331 |
| New F02 total | **7,050** |

Numeric sequences have length 0–4 over {-1,0,1}; property sequences have length 0–3 over six declared fixtures. Endings are complete, source error, and external cancellation. These are five Node tests containing bounded comparisons, not 7,050 separate test cases. Combined with F00/F01, the validated harness has **88 model tests, 142 RxJS tests, and 13,584 bounded comparisons**. Row coverage and finite samples are not universal equivalence proofs.

## Classification and handoff

Derived qualities distinguish indexed transformation, ongoing value selection, unconditional suppression, constant mapping, and property-path mapping. None of these scoped profiles adds buffering, an inner concurrency policy, an own timer, or shared connection coordination. The classification follows the T/G rules and observations, not the operator names alone.

F02 completion advances the corpus to **2/34 families** and **9 scoped API identities**, with 137 still planned. F03 — Distinctness and adjacent-value memory is next. Exact hosted revisions and final-package validation boundaries are retained in evidence; no rendered Mermaid layout, vulnerability audit, or exhaustive proof is claimed.
