# F02 — Value-selection evidence

**Date:** 3 October 2026. **Status:** Complete (declared scope). **Baseline:** RxJS 7.8.2.  
**Starting main:** `1d700d2d6b93b0efbee256b03bd23934dea6f7dc`.  
**Executable checkpoint:** `95c8bdb7eaa73e1f6105b5145efe19a81305b4e9`, tree `920a67ea9830b0d2ed3e4838056201f354b86b40`.

## Provenance and scope

The F01 validated source artifact was read through the GitHub connector. Its archive SHA-256 matched `b0fca99aa39313479722dfdacb68ab5fdb7452783fb88121b56a98e7a5322bd6`; reconstructing the source Git tree reproduced `d8bcebbc9eab01364bdc69a4358132b394b5dd83`. Current main was checked before writes. No predecessor repository was modified.

The F02 profiles cover map, filter, ignoreElements, mapTo and pluck using S/S0/Z/A/T/G. map/filter keep their callback indexes. mapTo/pluck project away the delegated map index because their fixed projections do not observe it. pluck has a separate empty-path construction contract; property-read failure is a subscribed-input outcome. Scope assumptions and exclusions are declared in each profile and [family comparison](../families/F02-value-selection.md).

## Inspected primary sources

All links below are pinned to RxJS 7.8.2. New operator source files were read in full. The upstream tests were inspected in the stated ranges, not executed wholesale.

| Source | Inspected scope and purpose |
|---|---|
| [map](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/map.ts) | Full file: projection, index++, thisArg boundary, delegated subscription lifecycle |
| [filter](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/filter.ts) | Full file: predicate, rejection index, payload identity, overload scope |
| [ignoreElements](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/ignoreElements.ts) | Full file: no-op next handler, inherited terminal behavior |
| [mapTo](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/mapTo.ts) | Full file: configured constant, delegation to map, deprecated baseline entry |
| [pluck](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/pluck.ts) | Full file: empty-path construction throw, optional lookup loop, undefined stop, property keys |
| [map tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/map-spec.ts) | Lines 1–240: projection, errors, empty, cancellation, indexes, thisArg (excluded from main profile) |
| [filter tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/filter-spec.ts) | Lines 1–225: true/false, errors, index, callback-once, cancellation |
| [ignoreElements tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/ignoreElements-spec.ts) | Full file: silence, terminals, empty/never, cancellation chains |
| [mapTo tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/mapTo-spec.ts) | Full file: fixed result, source terminals, cancellation, cooperative production |
| [pluck tests](https://github.com/ReactiveX/rxjs/blob/7.8.2/spec/operators/pluck-spec.ts) | Full file: deep/missing/null/numeric/symbol paths, empty arguments, terminals and cancellation |

The F01-reviewed helper contract is reused for [lift/operate](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/util/lift.ts), [OperatorSubscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/OperatorSubscriber.ts), [Subscriber](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts), [Subscription](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscription.ts), and [Observable](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Observable.ts). This is not a claim that every helper line or overload was newly audited. The live public operator docs were consulted only as supplementary orientation; implementation claims use the pinned sources.

## Actual executable-checkpoint validation

A fresh local npm ci attempt failed with EAI_AGAIN resolving registry.npmjs.org; [output](F02/local-install.txt) is retained. It was not repeatedly retried or relabeled as success. The existing read-only hosted workflow performed clean installation and actual RxJS execution.

[Run 37122505531](https://github.com/hansschenker/rxjs-operator-mealy-tuples/actions/runs/37122505531), job `111201252531`, completed successfully on the executable checkpoint. The downloaded artifact `11273971653` matched SHA-256 `183b9e0bd0fb0c0b344a024c892610ec217332547b95f8c4203cc41132dc2f33`; its environment and aggregate outputs were inspected.

| Check | Observed result |
|---|---|
| Clean npm ci from the committed lock | Passed; no dependency-file changes |
| Strict TypeScript model check | Passed |
| Reference-model tests | **88 passed, 0 failed/skipped**: 45 existing + 43 F02 |
| Actual RxJS tests | **142 passed, 0 failed/skipped**: 68 existing + 74 F02 |
| F02 bounded comparisons | **7,050 passed** across five Node tests |
| Entire bounded sample | **13,584 passed**, including 6,534 retained comparisons |
| Existing generated views and docs at this checkpoint | All 12 F01 views and 45 Markdown files passed |
| Regeneration and repeated aggregate check | Passed; no drift at that checkpoint |

Recorded environment: Node 22.16.0, npm 10.9.2, TypeScript 5.8.3, Python 3.12.3, GitHub-hosted Ubuntu 24.04 runner with Linux 6.17.0-1022-azure. RxJS 7.8.2, tslib 2.8.1, the workflow and dependency lock are unchanged. The [raw environment](F02/environment.txt), [selected result lines](F02/check-summary.txt), and [checksums](F02/checksums.json) retain provenance. Selected output is explicitly an excerpt; full logs are in the named run/artifact subject to its retention policy.

No old assertion, prefix model, or generated prefix view was changed. No F02 model/test expectation required repair to get the passing runtime result. Reference fixtures independently check each of the 30 new symbolic rule IDs. Differential tests compare model words and callback observations to actual RxJS, including owned disposal. Property and identity fixtures independently cover cases outside the finite differential alphabet.

## Final family package and acceptance

The documentation/generator step adds five profiles, five test plans, fifteen generated views, a family comparison and cross-profile traces, this evidence, coverage/tracker updates, and an F03 handoff. It extends the existing generator/checker and never hand-edits generated text. The core has 30 F02 transition IDs plus PL-C00, not an asserted universal minimal rule basis.

Before saving, local strict typing, all 88 dependency-free model tests, all 27 generated views, and the full Markdown structural check were rerun. Final-revision hosted validation then uses the same unchanged workflow and complete aggregate command. The exact final commit/run result is verified in the session response, rather than inventing a self-referential commit identifier in this file. Code-checkpoint results above must not be misread as already checking the later fifteen views.

Coverage advances only for the five declared F02 API identities: nine scoped identities total, 137 Planned, and 2/34 completed families. Historical F00/F01 evidence remains dated history. F03 — Distinctness and adjacent-value memory is next; no F03 implementation is included.

## Limits

No thisArg or all-overload/type-narrowing proof, arbitrary non-Boolean predicate coercion, invalid callback/key-coercion generalization, externally mutable policy, monkey-patching, consumer/teardown exceptions, or general reentrant model is claimed. Four new downstream-take tests are separately labeled delivery-interruption observations; their completion is produced by downstream take. The pluck(undefined) compatibility observation is outside the typed key domain. These tests do not widen the stable profile silently.

No Mermaid renderer, browser/transport integration, package publication, vulnerability audit, or exhaustive equivalence proof was performed. Local successful checks are not described as local RxJS execution; the latter and the clean dependency installation were hosted. Node's type-stripping warnings did not fail the tests.
