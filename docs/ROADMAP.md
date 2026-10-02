# Roadmap and current checkpoint

**Planning revision:** 1.1 — 2 October 2026. **Runtime baseline:** RxJS 7.8.2.  
**Authoritative plan:** [Operator-Family Implementation Plan](FAMILY-IMPLEMENTATION-PLAN.md).  
**Next-task brief:** [F00 baseline validation](NEXT-SESSION.md).

The complete ROB-SN plan has been adapted to the current six-tuple repository. Its **34 family IDs, eight phases, and 146 planned API identities** are retained. These are planned assignments, not imported implementation or completion claims. The [migration record](PLAN-MIGRATION-2026-10-02.md) records provenance and validation limits.

## Current state

| Work | Status |
|---|---|
| Six-tuple foundation and templates | Already established; retained |
| takeWhile reference profile, model, TW01–TW08, and three views | Already present; source-reviewed and model-tested according to the initial verification record |
| Actual RxJS baseline and lockfile | F00 Pending; the initial installation attempt was blocked and runtime suite was not executed |
| F01 prefix family | In progress: existing takeWhile seed; three neighboring profiles remain to be implemented |
| F02–F34 | Planned |
| Completed families | **0 / 34** |

The initial record reports 15 model tests passed and 1,452 bounded runtime comparisons authored but unexecuted. That is historical evidence, not a new run by this roadmap change. See [VERIFICATION.md](VERIFICATION.md). F00 is a validation gate, not an extra operator family.

## Sequence

```text
F00  Validate and lock the existing baseline
  ↓
F01  Complete the prefix family: takeWhile, skipWhile, take, skip
  ↓
F02  Mapping and per-value selection
  ↓
F03–F34  Continue the preserved dependency-ordered family plan
  ↓
Closing cross-family coverage and conformance audit
```

| Phase | Families | Study area |
|---|---|---|
| A | F01–F07 | Single-source behavior |
| B | F08–F12 | Activation, sources, and clocks |
| C | F13–F16 | Notifiers and temporal controls |
| D | F17–F18 | Batches and streaming segments |
| E | F19–F25 | Coordination, inner streams, and feedback |
| F | F26–F29 | Recovery, repetition, and lifecycle |
| G | F30–F32 | Connections, sharing, and replay |
| H | F33–F34 | Transport boundaries |

## Rules for advancing

Use S, S0, Z, A, T, G consistently. Every family requires guarded tables, test obligations, visualizations, a comparison, explicit execution assumptions, actual scoped RxJS checks, and a verified GitHub save. Model/notification/resource observations are separate from intended outputs and classification.

Resume unfinished work; do not mark a family complete from a single reference or a count of documents. After F00 succeeds, update the plan and next-task brief to F01. After the four-operator family passes its gate, advance to F02. Preserve current paths, script names, historical evidence, and source-project attribution.
