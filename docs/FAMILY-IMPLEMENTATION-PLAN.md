# Mealy-Tuples Operator-Family Implementation Plan

**Revision:** 1.1 — Mealy adaptation, 2 October 2026.  
**Baseline:** RxJS **7.8.2**; no major-version migration.  
**Repository:** `hansschenker/rxjs-operator-mealy-tuples`.  
**Delivery:** One bounded work package per user-initiated session; save and verify on `main`.  
**Attribution:** GPT-6 Astra, main contributor, in collaboration with Hans Schenker.

> Retain the familywise study plan. Use S, S0, Z, A, T, G throughout. Derive tests and visualizations from the model, and classification from evidence.

**Authoritative family tracker:** this document. [ROADMAP.md](ROADMAP.md) is its navigation summary; [NEXT-SESSION.md](NEXT-SESSION.md) is the bounded next-task handoff. Update these together when the checkpoint changes.

## 1. Origin and migration decisions

Adapted from the complete [ROB-SN plan, revision 1.0](https://github.com/hansschenker/rxjs-operator-behavior-set-notation/blob/69d32fdff0a368989ff76505c4884aedc49bfb33/docs/FAMILY-IMPLEMENTATION-PLAN.md), source commit `69d32fdff0a368989ff76505c4884aedc49bfb33`, file blob `ec0159bf33471c3bbd66776217c570c3a50ec5b3`.

The destination baseline inspected for this adaptation is [c2bbd1c](https://github.com/hansschenker/rxjs-operator-mealy-tuples/tree/c2bbd1c780be4e0aff63a0a7027a80c0b44ce7ea). Neither predecessor repository is changed. This imports **planning scope**, not their implemented profiles, tests, or completion claims.

| Original plan | Adaptation to the current repository |
|---|---|
| 34 packages F01–F34 in eight phases | Preserve IDs, order, references, ownership, and inter-family dependencies |
| Combined ROB-SN reaction language | Use the six-tuple and paired T/G results; retain the execution contract |
| New verification harness to be introduced in F01 | Reuse the existing model, generator, tests, package configuration, and command names |
| Start family work from scratch | Resume the existing takeWhile profile; F01 is partially started, not complete |
| No executed runtime baseline | Add F00: verify the existing baseline and dependency reproducibility before family completion |
| Tests/traces as deliverables | Make guarded tables, test obligations, diagrams, and timed/resource traces explicit sibling views |
| Future coverage index | Initialize it in F01 from the preserved inventory; no claim that 146 names already have profiles |
| Old paths for take/count examples | Keep existing Mealy paths; use pinned predecessor examples only as additional references |

The [migration record](PLAN-MIGRATION-2026-10-02.md) records planning checks and evidence boundaries. The [ROB-SN crosswalk](ROB-SN-CROSSWALK.md) records the notation correspondence; do not duplicate the old primary notation in new profiles.

## 2. What implementing a family means

Implement a source-backed **behavioral specification package**, not a replacement RxJS library. Define:

$$
\mathcal M_\theta=(S,S_0,Z,A,T_\theta,G_\theta),\qquad S_0\in S.
$$

$$
T:S\times Z\to S,\qquad G:S\times Z\to A^*.
$$

| Component | Required answer |
|---|---|
| S — State space | What can this scoped execution remember, including outcome and resource bookkeeping? |
| S0 — Initial state | What exists before the first input? Which activation convention applies? |
| Z — Input alphabet | Which tagged source, inner, notifier, timer, lifecycle, or internal inputs can arrive? |
| A — Output alphabet | Which notification or control letters can be produced, with which destinations? |
| T — Transition function | What is the resulting state for the current state and input? |
| G — Output function | For that same pre-input state and input, what ordered finite word is produced? |

Parameters, invariants, trace laws, execution contracts, and evidence accompany the six-tuple; they are not additional tuple components. T/G are mathematical views of one reaction, not two separate callback invocations. A finite guarded table may represent an infinite state space. An output word is not an atomic transaction.

Use the current [foundation](FOUNDATION.md), [execution contract](EXECUTION-CONTRACT.md), [operator template](../templates/OPERATOR-ANALYSIS.md), [derivation workflow](DERIVATION-WORKFLOW.md), and [behavioral qualities](BEHAVIORAL-QUALITIES.md). Retain lessons and attribution from the [companion review](COMPANION-REVIEW.md).

Out of scope: an RxJS replacement, general six-tuple interpreter/compiler, arbitrary generated operators, bulk import of unreviewed analyses, npm publication, and RxJS 8/9 migration. Small reference evaluators and generators remain development-time verification/teaching tools.

## 3. Current checkpoint — F00 completed on 2 October 2026

| Field | State after F00 validation |
|---|---|
| Foundation and template | Existing six-tuple framework; retain rather than rebuild |
| Existing reference | `operators/takeWhile.md`, rules TW01–TW08, typed model, test plan, generated table/diagram/trace |
| Recorded model evidence | 15 model tests passed again, together with type/generated/document checks, in the recorded hosted runs |
| Recorded actual RxJS evidence | 14 actual RxJS tests passed, including all 1,452 bounded comparisons; [F00 evidence](../evidence/F00-baseline-validation.md) |
| Dependency reproducibility | npm-generated lockfile committed; clean npm ci passed with RxJS 7.8.2, TypeScript 5.8.3, and tslib 2.8.1 |
| F00 validation gate | **Complete (declared scope)**; locked run 36968623943 succeeded |
| Next work package | **F01 — Taking and dropping prefixes** |
| First family to resume | **F01 — Taking and dropping prefixes** |
| Family completion | **0 / 34 complete; F01 In progress; F02–F34 Planned** |
| Scope of this checkpoint | F00 infrastructure, reproducibility, and actual baseline validation; no new operator profiles or completed family claims |

See [VERIFICATION.md](VERIFICATION.md) for the original evidence. Preserve it as dated history when appending later runs. A reference-model pass is not an RxJS pass. Tests for every/defaultIfEmpty inside the current suite are review regression fixtures, not completed F06 profiles.

F00 is a prerequisite work package, **not a 35th operator family**. It is now complete: local DNS failure was overcome by executing the existing harness on GitHub-hosted runners. Historical failures remain in VERIFICATION.md. The read-only validation workflow runs on pushes to main and on manual dispatch; no operator-family work is automatically scheduled.

## 4. F00 — Validate and lock the existing baseline

**Goal:** establish a reproducible, actually executed RxJS 7.8.2 baseline before extending the family corpus. **Status:** Complete on 2 October 2026; see [F00 evidence](../evidence/F00-baseline-validation.md). The procedure below is retained as the acceptance/revalidation contract, not unfinished setup work.

### Reuse, do not replace

Read `package.json`, `tsconfig.json`, `model/takeWhile.ts`, both files in `tests/`, `scripts/generate.mjs`, and `scripts/check_docs.py`. Keep existing TW rule IDs, the `evaluate` result fields T/G, and all current source/execution exclusions. Do not introduce a second harness merely because the old plan proposed different script names.

### Tasks and commands

First inspect current `main` and its evidence; another session may already have resolved this gate. Use the declared Node support and record actual Node/npm/TypeScript versions. Preserve direct dependency pins `rxjs: 7.8.2` and `typescript: 5.8.3` unless a demonstrated tooling issue requires an explicitly documented adjustment; do not change the RxJS baseline.

When no lockfile exists, run `npm install --ignore-scripts` in a connected working environment. Review and retain the generated lockfile. Then verify a clean installation using `npm ci --ignore-scripts` and run `npm run check`. npm ci requires an existing consistent lockfile ([npm documentation](https://docs.npmjs.com/cli/v10/commands/npm-ci/)); it was not the first command for the originally unlocked checkpoint. With an already committed valid lockfile, start with npm ci instead.

The **existing** script interface is:

```sh
npm run check:types
npm run test:model
npm run test:rxjs
npm run generate
npm run check:generated
npm run check:docs
npm run check
```

Run actual RxJS notification/subscription tests and all 1,452 bounded comparisons currently authored. Compare callback observations and disposal, not just final values. Inspect the two companion-review regression checks as well. Do not weaken fixtures merely to get a green run; resolve discrepancies against pinned source and the declared model.

Regenerate the three reference views and verify there is no unexplained drift. Run the complete check after a clean installation. Any corrections to tests, the model, descriptors, or documentation require a new complete run on the resulting tree.

### F00 completion gate

A reviewed lockfile, successful clean install, passing aggregate check, recorded run environment/commands/outcomes, reconciled discrepancies, and a verified GitHub checkpoint must exist. Add `evidence/F00-baseline-validation.md` when performed, append to VERIFICATION.md, and update README, this tracker, ROADMAP, NEXT-SESSION, and CHANGELOG together.

If installation or a required check is unavailable/failing, mark F00 Blocked with the actual reason. Preserve useful source/documentation preparation, but do not mark F00 or a family complete, claim the comparisons ran, or advance to F02. Do not repeatedly retry an unavailable registry without new information. Successful F00 completes infrastructure validation only, **not F01**.

## 5. Scope, inventory, and dependencies

Preserve the source plan's **146 named bookkeeping entries**: **113 P entries**, **30 C entries**, and **3 X targets**. The inventory is a plan, not 146 verified machines or all-overload coverage.

The source plan records reconciliation against the pinned [operators export index](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/operators/index.ts), blob `5b190197e57d8cf63ceb33e4a99a66876253af07`, and [root export index](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/index.ts), blob `1805341dfb6861b5aed6a04517705eac51173ba5`. This migration preserves that provenance; it does not claim a newly executed export audit. Recheck entries, helpers, aliases, and transport subpath exports when their families are implemented and at the closing audit.

`P:name` means a normalized pipeable implementation/API entry; `C:name` means creation, source constant, or connection creation; `X:name` means a transport target. Prefixes are planning identities, not import syntax. Preserve same-name creation/pipeable identities, such as C:zip versus P:zip. Ordinary re-exports of the same implementation are counted once. The operator export named onErrorResumeNext is tracked as P:onErrorResumeNextWith; C:onErrorResumeNext is separate.

Legacy/deprecated entries stay in scope. Inspect delegation and document aliases/compatibility, argument shapes, types, and runtime limits rather than assuming equality from names. A profile appendix can discharge an alias only with explicit evidence. Core classes/interfaces, errors, schedulers, helpers such as pipe/identity/noop/isObservable, global configuration, testing utilities, and firstValueFrom/lastValueFrom are supporting or out-of-corpus APIs. Their relevant behavior still needs to be declared when used by a profile.

One owning family per entry is bookkeeping; multiple behavioral classifications remain possible. Study groups organize investigation, not final classification. F00 is an implicit gate for completing every family. Explicit dependencies below are inherited inter-family dependencies; fixture sources or internal helper behavior may be used earlier if their assumed behavior is pinned and declared.

## 6. Family sequence and progress tracker

F01 is **In progress** because only its reference seed exists. Do not label the whole family Source reviewed or Model tested. All other families start Planned. The normal sequence remains F01 → F34 after F00. Complete unfinished work under its existing ID before starting an unrelated family. Large packages may be checkpointed over several user-initiated sessions without renumbering or silently dropping entries.

### A. Single-source behavior

| Family / status | Study package and reference | Assigned entries | Required distinctions / dependencies |
|---|---|---|---|
| **F01** — In progress | **Taking and dropping prefixes**; reference: `takeWhile` | `P:takeWhile`, `P:skipWhile`, `P:take`, `P:skip` | Count versus predicate boundary; inclusive output; callback indexes; early completion versus continued participation. Dependencies: existing foundation; F00 gate. |
| **F02** — Planned | **Mapping and per-value selection**; reference: `map` | `P:map`, `P:filter`, `P:ignoreElements`, `P:mapTo`, `P:pluck` | Transformation versus selection; indexes and callback throws; payload identity; compatibility forms. Dependencies: F01. |
| **F03** — Planned | **Distinctness and adjacent-value memory**; reference: `distinctUntilChanged` | `P:distinctUntilChanged`, `P:distinctUntilKeyChanged`, `P:distinct`, `P:pairwise` | Last emitted key versus all remembered keys versus previous input; comparator/key failures; reset notifier. Dependencies: F02. |
| **F04** — Planned | **Search and cardinality constraints**; reference: `first` | `P:first`, `P:last`, `P:elementAt`, `P:find`, `P:findIndex`, `P:single` | Early versus completion-dependent answers; empty/default/error policies; zero, one, or multiple matches. Dependencies: F02. |
| **F05** — Planned | **Folding and aggregation**; reference: `scan` | `P:scan`, `P:reduce`, `P:count`, `P:min`, `P:max`, `P:toArray` | Seeded/seedless S0; accumulation in T versus emission in G; empty input and completion. Dependencies: F02. |
| **F06** — Planned | **Boolean queries and empty-input policies**; reference: `every` | `P:every`, `P:isEmpty`, `P:defaultIfEmpty`, `P:throwIfEmpty` | Early versus completion-time decisions; predicate failure, defaults, and empty-sequence errors. Dependencies: F04, F05. |
| **F07** — Planned | **Sequence boundaries and retained tails**; reference: `takeLast` | `P:takeLast`, `P:skipLast`, `P:startWith`, `P:endWith` | Retained suffix versus delayed forwarding; prepend/append order; activation and completion boundaries. Dependencies: F01, F05. |

### B. Activation, sources, and clocks

| Family / status | Study package and reference | Assigned entries | Required distinctions / dependencies |
|---|---|---|---|
| **F08** — Planned | **Finite and terminal source creation**; reference: `of` | `C:of`, `C:range`, `C:EMPTY`, `C:NEVER`, `C:throwError`, `C:pairs`, `C:empty`, `C:never` | Construction versus activation; synchronous progression/interruption; empty, never, error; legacy entries. Dependencies: F01. |
| **F09** — Planned | **Input adaptation and scheduled conversion**; reference: `from` | `C:from`, `C:scheduled` | Array-like, Iterable, Promise-like, Observable/interop, AsyncIterable, ReadableStream profiles; pull/push, identity, teardown, scheduling. Dependencies: F08. |
| **F10** — Planned | **Deferred selection and callback adaptation**; reference: `defer` | `C:defer`, `C:iif`, `C:bindCallback`, `C:bindNodeCallback` | Factory timing; callback invocation/reuse; error-first callbacks; repeated subscriptions; captured versus fresh work. Dependencies: F08, F09. |
| **F11** — Planned | **External-event source adaptation**; reference: `fromEvent` | `C:fromEvent`, `C:fromEventPattern` | Listener identities; registration/removal; argument packaging; construction failures; producer ownership. Dependencies: F08. |
| **F12** — Planned | **Clock sources, scheduling and temporal metadata**; reference: `timer` | `C:timer`, `C:interval`, `C:animationFrames`, `P:observeOn`, `P:subscribeOn`, `P:timestamp`, `P:timeInterval` | Driver inputs and schedulers; subscription versus notification scheduling; timestamps versus processing order; cancellation. Dependencies: F08, F09. |

### C. Notifiers and temporal controls

| Family / status | Study package and reference | Assigned entries | Required distinctions / dependencies |
|---|---|---|---|
| **F13** — Planned | **Notifier-controlled participation**; reference: `takeUntil` | `P:takeUntil`, `P:skipUntil` | Notifier next/complete/error; subscription order; synchronous notifier; opening versus closing participation. Dependencies: F01, F11. |
| **F14** — Planned | **Silence and lockout selection**; reference: `debounce` | `P:debounce`, `P:debounceTime`, `P:throttle`, `P:throttleTime` | Duration-selected versus fixed-time control; leading/trailing; boundary replacement; completion/error/cancellation. Dependencies: F12, F13. |
| **F15** — Planned | **Window-end selection and sampling**; reference: `audit` | `P:audit`, `P:auditTime`, `P:sample`, `P:sampleTime` | Duration-end versus sampling trigger; retained-value readiness; notifier termination; synchronous boundaries. Dependencies: F12, F13. |
| **F16** — Planned | **Delivery delays and deadlines**; reference: `delayWhen` | `P:delay`, `P:delayWhen`, `P:timeout`, `P:timeoutWith` | Per-value release versus deadline failure/fallback; pending work; subscriptionDelay; first/each deadlines. Dependencies: F09, F12, F13. |

### D. Batches and streaming segments

| Family / status | Study package and reference | Assigned entries | Required distinctions / dependencies |
|---|---|---|---|
| **F17** — Planned | **Buffered batches**; reference: `bufferCount` | `P:bufferCount`, `P:buffer`, `P:bufferTime`, `P:bufferToggle`, `P:bufferWhen` | Count/time/notifier/open-close boundaries; overlap; empty batches; partial flush; boundary failures and disposal. Dependencies: F05, F12, F13. |
| **F18** — Planned | **Streaming windows**; reference: `windowCount` | `P:windowCount`, `P:window`, `P:windowTime`, `P:windowToggle`, `P:windowWhen` | Observable output identities/lifetimes versus snapshots; overlap; cancellation and completion scopes. Dependencies: F17. |

### E. Coordination, inner streams, and feedback

| Family / status | Study package and reference | Assigned entries | Required distinctions / dependencies |
|---|---|---|---|
| **F19** — Planned | **Multi-source value joins**; reference: `combineLatest` | `C:combineLatest`, `P:combineLatestWith`, `P:combineLatest`, `C:zip`, `P:zipWith`, `P:zip`, `C:forkJoin`, `P:withLatestFrom`, `P:sequenceEqual` | Port readiness; queues versus latest slots; missing first values; source completion; final joins; subscription order. Dependencies: F05, F09. |
| **F20** — Planned | **Stream assembly and competition**; reference: `concat` | `C:concat`, `P:concatWith`, `P:concat`, `C:merge`, `P:mergeWith`, `P:merge`, `C:race`, `P:raceWith`, `P:race` | Sequential activation versus overlap versus winner selection; synchronous termination; losing-source cancellation. Dependencies: F19. |
| **F21** — Planned | **Inner-stream admission policies**; reference: `mergeAll` | `P:mergeAll`, `P:concatAll`, `P:switchAll`, `P:exhaustAll`, `P:exhaust` | Allow overlap, queue, latest only, ignore while busy; capacity; outer completion with active/pending inners; aliases. Dependencies: F20. |
| **F22** — Planned | **Projected inner-stream admission**; reference: `mergeMap` | `P:mergeMap`, `P:concatMap`, `P:switchMap`, `P:exhaustMap`, `P:flatMap`, `P:mergeMapTo`, `P:concatMapTo`, `P:switchMapTo` | Projection timing versus admission; cancellation before replacement; queued payloads; capacity/indexes; legacy forms. Dependencies: F02, F21. |
| **F23** — Planned | **Higher-order value joins**; reference: `combineLatestAll` | `P:combineLatestAll`, `P:zipAll`, `P:combineAll` | Collection of Observable inputs versus later subscription; outer completion dependency; inner lifetimes; alias. Dependencies: F19, F21. |
| **F24** — Planned | **Generation, recursion and higher-order accumulation**; reference: `expand` | `C:generate`, `P:expand`, `P:mergeScan`, `P:switchScan` | Fold versus unfold; feedback; seed/current state; recursion scheduling; concurrent updates; latest-only cancellation. Dependencies: F05, F12, F22. |
| **F25** — Planned | **Keyed groups and predicate splitting**; reference: `groupBy` | `P:groupBy`, `C:partition`, `P:partition` | Keyed output lifetimes; duration closure/reappearance; ownership; filtered branches versus implicit sharing. Dependencies: F02, F18. |

### F. Recovery, repetition, and lifecycle

| Family / status | Study package and reference | Assigned entries | Required distinctions / dependencies |
|---|---|---|---|
| **F26** — Planned | **Error recovery and error-driven resubscription**; reference: `catchError` | `P:catchError`, `P:retry`, `P:retryWhen`, `C:onErrorResumeNext`, `P:onErrorResumeNextWith` | Replacement versus resubscription; retry count/delay/reset; notifier termination; error origin; continuing without terminal downstream delivery. Dependencies: F10, F12, F21. |
| **F27** — Planned | **Completion-driven resubscription**; reference: `repeat` | `P:repeat`, `P:repeatWhen` | Completion versus error triggers; finite/infinite repetitions; delay/notifier semantics; synchronous loops; cancellation. Dependencies: F26. |
| **F28** — Planned | **Notifications as stream values**; reference: `materialize` | `P:materialize`, `P:dematerialize` | Notification values versus actual next/error/complete delivery; terminal order; invalid notification profiles. Dependencies: F02, F08. |
| **F29** — Planned | **Lifecycle observation and resource scoping**; reference: `finalize` | `P:finalize`, `P:tap`, `C:using` | Terminal notification versus finalization; source/handler/teardown error origins; resource acquisition/release. Dependencies: F10, F26, F28. |

### G. Connections, sharing, and replay

| Family / status | Study package and reference | Assigned entries | Required distinctions / dependencies |
|---|---|---|---|
| **F30** — Planned | **Connection ownership and multicast primitives**; reference: `connect` | `P:connect`, `C:connectable`, `P:multicast`, `P:refCount` | Subscriber versus coordinator; manual connections; selectors; connection generations; reference counting; legacy signatures. Dependencies: F21, F29. |
| **F31** — Planned | **Sharing and reset policies**; reference: `share` | `P:share` | Membership; upstream ownership; error/complete/refCount-zero resets; reset notifier identities and interruption. Dependencies: F30. |
| **F32** — Planned | **Replay and publication policies**; reference: `shareReplay` | `P:shareReplay`, `P:publish`, `P:publishBehavior`, `P:publishLast`, `P:publishReplay` | Replay size/time; refCount/reset; cached completion/error; seed/last-value publication; compatibility. Dependencies: F12, F30, F31. |

### H. Transport boundaries

| Family / status | Study package and reference | Assigned entries | Required distinctions / dependencies |
|---|---|---|---|
| **F33** — Planned | **HTTP transport sources**; reference: `fromFetch` | `X:fromFetch`, `X:ajax` | Request creation versus subscription; response/body-selection; cancellation/abort ownership; adapter versus transport failures. Dependencies: F09, F29. |
| **F34** — Planned | **WebSocket channels**; reference: `webSocket` | `X:webSocket` | Shared socket/input/output ownership; open/close/error; outgoing buffers; multiplex participation; reconnection boundaries. Dependencies: F11, F30, F31, F32. |

## 7. Repeatable family workflow

### A. Resume and freeze scope

Read this tracker, AGENTS.md, relevant evidence, prerequisite family comparisons, and the execution contract from current main. Record the inspected commit, selected family, qualified entries, exact configurations, and exclusions. Do not rely on remembered conversation status. Resume an unfinished prerequisite or the current unfinished family before advancing; F00 is already complete at this checkpoint.

### B. Read the pinned implementation, then formulate the six components

Inspect RxJS 7.8.2 sources, delegated helpers, and relevant upstream tests. Separate source review from tests executed. Explain values/inputs, policy, cancellation, timing, and sharing in ordinary language first. Map initialization to S0, retained state/resources to S, inputs to Z, output letters to A, and each guarded reaction to T/G. Temporary callback results need not become permanent state unless execution requires it.

Callbacks contain domain calculations; transitions contain stream policy. State callback indexes, purity/throws, external reads, mutation, and reentrancy assumptions. Use the existing template; do not reintroduce competing slot or combined-function notation.

### C. One reference profile, then neighboring policies

Finish the reference within a declared observation scope, then compare neighbors using the same inputs where useful. Reuse rules only when guards, output order, callback timing, lifecycle, and ownership remain valid. Supply a comparison matrix for memory, input triggers, T/G, time, concurrency, cancellation, termination, and sharing. An unexplained “same as X” is not a complete profile.

### D. Derive the table, test obligations, and visualizations

Every row carries a stable operator-qualified ID:

| Rule ID | Current state s | Input z | Guard | T(s,z) | G(s,z) | Evidence |
|---|---|---|---|---|---|---|
| Example ID | Declared state | Tagged input | Exact condition | State in S | Ordered word in A* | Pinned source / case ID |

Both results must refer to the same guard, input, and pre-input state. Empty output is explicit; omission is not silence. Cover the declared domain with unambiguous guards or explicit precedence. Retain TW01–TW08 for the existing reference; name new rules SWxx, TKxx, SKxx or equally explicit noncolliding IDs.

Tables and diagrams are sibling views, not a serial chain after tests. Include a rule-labeled state diagram, a step trace, and a time/value trace with declared clock and processing order; add subscription/resource lanes when relevant. Label finite control-state projections and model-predicted versus runtime-observed traces. A later scheduled source value after unsubscription is not an input received by the closed operator.

Extend the existing generator incrementally in F01 to select profiles without changing the meaning of its existing takeWhile outputs. Do not hand-edit generated files. Text descriptors are not yet an executable general specification; shared IDs and generation prevent drift but do not prove semantic correctness. Validate diagram syntax/rendering when tools permit; otherwise state that limit.

### E. Test predictions against independent expectations and RxJS

A row creates a test obligation, not a guarantee that one case suffices. Cover symbolic guard boundaries, parameters, reachable histories, consecutive reactions, terminal paths, and execution interactions. Directly arrange/assert S in reference-model tests. In real RxJS tests reach the situation by subscription and input history; observe output words, callback arguments, lifetimes, and teardown without pretending to access private state.

Use TestScheduler for virtualizable timing and direct synchronous tests for ordering/lifecycle. For later transports use deterministic fakes and distinguish them from real-browser/network integration. No sleep-based default tests. Keep expected fixtures independent of the evaluator used as the actual result; finite differential samples are evidence, not proof.

### F. Observe, classify, and hand off

Only after model and evidence are recorded, derive behavioral qualities and classification. Update profiles, family comparison, test plans, views, evidence, coverage index, this tracker, summaries, and change log. Run the available full regression checks, save to main, and verify the saved tree. Finish with exact completed scope, remaining gaps, checks/outcomes, commit SHA, and the next work package.

## 8. Repository layout: existing versus planned

**Existing paths to preserve:** `operators/takeWhile.md`, `test-plans/takeWhile.md`, `model/takeWhile.ts`, `tests/model.test.mjs`, `tests/rxjs.test.mjs`, `scripts/generate.mjs`, `scripts/check_docs.py`, and the three `generated/takeWhile.*.md` views. Existing root-level operator pages remain canonical for pipeable entries; do not create a duplicate `operators/pipeable/takeWhile.md`. F00 also established `package-lock.json`, `.github/workflows/validation.yml`, and `evidence/F00-baseline-validation.md` with retained text logs/checksums.

The following are **future conventions, not files claimed to exist now**:

```text
families/F01-prefix-selection.md        comparison and family-wide acceptance
operators/skipWhile.md                 new pipeable profile
operators/take.md
operators/skip.md
operators/creation/<name>.md           creation API identities
operators/transport/<name>.md          transport targets
test-plans/<name>.md                   rule-linked obligations
model/<name>.ts                        bounded typed reference evaluator
generated/<name>.transitions.md        guarded table
generated/<name>.visualization.md      state/control diagram
generated/<name>.trace.md              model-predicted trace
traces/F01-prefix-selection.md         cross-operator discriminating traces
tests/families/F01-prefix-selection.test.mjs
                                       real RxJS family checks
tests/support/                        shared fixtures when justified
evidence/F01-prefix-selection.md       family source/trace/check evidence
docs/OPERATOR-COVERAGE.md               qualified entries and profile statuses
```

The runtime harness currently uses Node `.mjs` tests importing typed reference models with the existing type-stripping flag. Keep that working arrangement; the old roadmap's new TypeScript test harness is no longer a prerequisite. No gratuitous framework migration is needed. Reuse the present files before extracting common helpers or splitting tests, and retain a full regression command.

In F01, initialize OPERATOR-COVERAGE.md from this inventory: qualified name, owning family, named configurations/profile IDs, source/model/runtime evidence separately, rule/test references, exclusions, and canonical path. Planned rows must not link to nonexistent profile pages as though implemented. A name with a profile is not automatically a validated API.

**Actual commands now** are listed in F00. The old proposed `npm run typecheck` is replaced by existing `npm run check:types`. The old `npm run test:family -- F01` does not exist; do not document it as runnable. Initially a new family file can be invoked explicitly with Node's current flag, and F01 must wire all new tests into npm test before completion. Add a family selector only if useful, implement it first, and record its tested contract. Verify new models fall within the existing TypeScript include scope and new generated views are covered by check:generated.

## 9. F01 — Exact family continuation brief

**Reference:** takeWhile, already started. **Other entries:** skipWhile, take, skip. **Prerequisite:** F00 completed. **Default scope:** one independent subscription, no introduced sharing, RxJS 7.8.2; deterministic/declared callback behavior.

| Entry | Starting state | Initial profile to establish |
|---|---|---|
| P:takeWhile | Existing profile/model/views; selectively RxJS-tested in F00 | Preserve indexed Boolean predicate, explicit inclusive false/true, throws, terminal outcomes, and TW rule IDs; add the omitted-default-argument equivalence check |
| P:skipWhile | No profile under this plan | Indexed predicate; initial skipping then forwarding; failing boundary forwarded; predicate no longer called after boundary |
| P:take | No local profile under this plan | Nonnegative integer count; 0, 1, parameterized positive count; activation and early source-disconnection behavior |
| P:skip | No profile under this plan | Nonnegative integer count; 0, 1, parameterized positive count; prefix suppression and continued source participation |

Treat negative/fractional/NaN/Infinity counts, non-Boolean runtime predicates, overload-specific narrowing, mutation, consumer exceptions, and arbitrary reentrancy as explicit extensions or exclusions. Read the four implementations, the lift/operate machinery, OperatorSubscriber, Subscriber, Subscription, source setup, and relevant upstream tests. The pinned [ROB-SN take(3) example](https://github.com/hansschenker/rxjs-operator-behavior-set-notation/blob/69d32fdff0a368989ff76505c4884aedc49bfb33/examples/TAKE-3.md) may inform review; it is not a migrated or already validated local profile.

### Required family distinctions and traces

Use fresh independent subscriptions to source values 2, 4, 7, 1 followed by completion; predicate `value < 5`. The planned baseline expectations below are to be checked against the model and runtime, not reported as new measured results:

| Profile | Expected values | Expected completion boundary |
|---|---|---|
| takeWhile, default/false | 2, 4 | First failing input 7 |
| takeWhile, true | 2, 4, 7 | Immediately after forwarding boundary input 7 |
| skipWhile | 7, 1 | Source completion |
| take(2) | 2, 4 | Immediately after second input 4 |
| skip(2) | 7, 1 | Source completion |

Pair output assertions with input subscription intervals. Compare filter as a narrowly scoped contrast fixture only; it does not complete F02. Add first-input failure, always-true predicate, empty/never, source error, predicate throw, callback call counts/indexes, take(0) versus skip(0), count boundaries, explicit cancellation, and a cooperative synchronous source that stops producing when closed.

The current takeWhile macrostep model excludes cancellation during emission and reentrant callbacks. Preserve that honest boundary. Add an **execution-boundary note** and discriminating tests demonstrating cancellation during inclusive emission and bounded reentry, labeled outside the current macrostep claim; either develop a separately named finer execution profile or retain the exclusions. Do not force those executions through an atomically committed final-state evaluator. Test requested versus actually delivered completion separately. Inspect the index write before the predicate call when observing nested execution.

### Deliverables and acceptance

Four canonical six-tuple profiles; eight-rule takeWhile continuity; complete guarded tables and test obligations; generated/state and time/resource views; family comparison and discriminating traces; model and actual RxJS tests; initialized coverage index; source-to-model evidence; updated checkpoint; successful aggregate regression; verified save. Rule counts for new operators follow the actual analysis rather than a forced eight-rule template.

A working reference alone does not complete F01. Once this family passes the completion gate, the next family is **F02 — Mapping and per-value selection**.

## 10. Completion gates and evidence vocabulary

Family progress: `Planned` → `In progress` → `Source reviewed` → `Model tested` → `RxJS tested` → `Complete (declared scope)`. Use `Blocked` with a concrete blocker and the retained achieved evidence stage. Source review/model/runtime evidence should also be stored per profile; mixed readiness in a family remains In progress. A status transition is not automatically earned by a generated document.

A family is Complete only when:

1. Every assigned identity has a canonical source-backed profile or verified alias/compatibility disposition, with visible configuration and environment exclusions.
2. Every profile defines all six components, parameters, initialization, validity, tagged inputs, ordered output letters, guarded T/G, and execution/ownership assumptions. Guards cover the declared domain without silently defaulting omissions to [].
3. Distinct completion, error, cancellation, and cleanup paths are addressed. Input completion is not universally output completion; a settled subscriber is not an eternally stopped shared coordinator. Creation activation and physical resource cancellation are explicit.
4. Rule-linked tables, test obligations, state diagrams, and discriminating traces exist. Clocks, event order, control-state projections, and model versus observed traces are labeled. Missing renderer availability is a stated limitation, not a fabricated render check.
5. Model fixtures and actual RxJS checks for the selected core profiles were executed successfully. Relevant boundary/parameter cases, lifetimes, callback order/indexes, and disposal are checked; unsupported execution cases are explicitly excluded with reasons. Row coverage is not complete behavioral coverage.
6. Type, documentation, generated-view checks, new tests, and all previous runtime regressions pass on the final tree. An unavailable core check blocks completion; optional environment-specific extensions retain explicit limits.
7. The comparison and derived classification are justified by the rules/evidence, rather than operator names or predetermined taxonomic boxes.
8. Coverage, evidence, tracker, next-session handoff, and change log are updated; the work is committed to main and the saved revision verified.

Complete means this gate holds for the declared scope, not all overloads, all environments, every reentrant execution, or an exhaustive equivalence proof. Keep a failing model/runtime mismatch visible until reconciled; do not hide it by changing expected values without analysis.

## 11. Creation, compatibility, and closing audit

Creation APIs stay with the family where their behavior is studied: primitive sources F08–F12; joins/assembly F19–F20; generation F24; resources F29; connections F30; transports F33–F34. They can receive activation, driver, timer, callback, and lifecycle inputs; they are not universally machines with no input.

Distinguish function call/construction, subscription activation, incoming driver events, and ownership. A new subscription can join an already-running producer. Compare creation/pipeable variants on argument shape, input/subscription order, scheduler/result-selector overloads, termination, and types. Qualify physical abort/disposal claims by source and resource ownership. Replay/sharing models need participant and coordinator scopes plus reset generations.

After F34, run a separate cross-family audit, not another operator family. Reconcile the 146 planned entries plus explicit later changes against pinned exports, all alias dispositions, profile exclusions, and residual conformance gaps. Run the available full regression suite and selected source/cancellation/time/inner/recovery/sharing compositions. Report named-entry coverage, configuration coverage, selectively checked traces, and actual proofs separately. Document-count completion is not implementation-equivalence proof.

## 12. GitHub checkpoint and next-session instruction

Read current main and file/blob identities before replacement. Preserve unrelated changes and attribution. Commit one coherent work package where possible; never force-push or rewrite history. If main changes during work, reconcile it before publishing. Read back the final reference, commit/tree, and key changed files before reporting success. If saving fails, report what remains local or uncommitted.

Commit messages may use `docs(mealy-tuples): ...` or an appropriate test/fix prefix, with:

```text
Co-Authored-By: GPT-6 Astra <noreply@openai.com>
```

Record inspected baseline SHAs in evidence and report the newly created SHA after saving; do not invent a self-referential final hash inside its own commit.

**Next session:**

> Read AGENTS.md, docs/FAMILY-IMPLEMENTATION-PLAN.md, docs/NEXT-SESSION.md, and F00 evidence from main. Resume F01 — Taking and dropping prefixes. Reuse the validated takeWhile reference, TW01–TW08, committed lockfile, existing tests, and generator; add skipWhile, take, and skip under section 9. Keep RxJS 7.8.2, run the baseline and new checks, record evidence, update coverage/progress, save, and verify. F00 is complete; do not rebuild its harness or jump to F02.

**Following sessions:** resume unfinished work under its existing ID, otherwise take the next planned family with satisfied dependencies, establish scoped profiles and evidence, update the tracker, save, and verify. Session boundaries are work scopes, not promised durations or scheduled background work.
