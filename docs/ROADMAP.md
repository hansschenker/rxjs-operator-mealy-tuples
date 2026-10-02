# Roadmap and checkpoint

**Checkpoint:** 0.1.0, 2 October 2026. This repository contains one worked takeWhile profile. It does not claim that ROB-SN's family roadmap or the companion repository's operator catalogue has been migrated or validated.

| Stage | Deliverable | Status |
|---|---|---|
| Foundation | Canonical six-tuple vocabulary, ROB-SN crosswalk, execution/evidence discipline | Written and documentation-checked |
| Reference profile | takeWhile parameters, indexed state, guarded rules, generated views | Source-reviewed; 15 reference-model tests passed |
| Runtime validation | Actual RxJS marble/lifetime checks and bounded model comparison | Authored; blocked locally by dependency-installation network failure |
| Prefix family | Compare takeWhile, skipWhile, take, and skip under bounded profiles | Planned; do not mark complete from a reference example |
| Retained-state family | scan/reduce, pairwise, buffers; completion versus error/cancel | Planned |
| Coordination/time | combineLatest/zip, timer/notifier policies, explicit clocks and ties | Planned |
| Inner policies | mergeMap/concatMap/switchMap/exhaustMap, resource lanes, reentrancy scope | Planned |
| Sharing/recovery | Coordinator generations, reset/replay, retry/repeat/recovery boundaries | Planned |
| Broader generation | Validated rule schema and richer diagram/test derivation | Planned, not a compiler claim |

Next concrete gate: install pinned dependencies in a connected environment, run the complete check command, reconcile any mismatches, and update the verification record with the actual result. Then use the operator template for the prefix family.

Every added profile needs explicit version/overload scope, source/helper inspection, six components, a guarded table, test obligations, a visualization, evidence, and derived classification. Complete profiles one bounded configuration at a time rather than bulk-generating unverified completeness claims.
