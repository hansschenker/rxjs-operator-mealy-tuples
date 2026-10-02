# Roadmap and current checkpoint

**Planning revision:** 1.1. **Checkpoint:** F00 completed, 2 October 2026. **Runtime baseline:** RxJS 7.8.2.  
**Authoritative plan:** [Operator-Family Implementation Plan](FAMILY-IMPLEMENTATION-PLAN.md).  
**Next-task brief:** [F01 prefix-family continuation](NEXT-SESSION.md).

The adapted ROB-SN plan retains **34 family IDs, eight phases, and 146 planned API identities**. These are assignments, not automatically completed or verified profiles. The [migration record](PLAN-MIGRATION-2026-10-02.md) remains the history of plan adoption.

## Current state

| Work | Status |
|---|---|
| Six-tuple foundation and templates | Established; unchanged by F00 |
| F00 baseline validation | **Complete**: reviewed lockfile, clean hosted installation, actual aggregate validation |
| takeWhile reference, model, TW01–TW08, and three views | Source-reviewed, model-tested, and selectively RxJS-tested in the declared non-reentrant scope |
| F01 prefix family | **In progress — next task**; complete the reference package and add skipWhile, take, skip |
| F02–F34 | Planned |
| Completed operator families | **0 / 34** |

[F00 evidence](../evidence/F00-baseline-validation.md) records **15 model tests passed**, **14 RxJS tests passed**, and **all 1,452 bounded comparisons passed inside the RxJS suite**. The earlier local network failures remain in [verification history](VERIFICATION.md); successful runtime checks were performed on GitHub-hosted runners, not in the network-isolated local container. F00 is a prerequisite gate, not an extra family.

## Sequence

```text
F00  Complete: locked dependencies and validated existing baseline
  ↓
F01  NEXT: complete takeWhile, skipWhile, take, and skip
  ↓
F02  Mapping and per-value selection
  ↓
F03–F34  Preserve the dependency-ordered family plan
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

Use S, S0, Z, A, T, G consistently. Each family needs guarded tables, test obligations, visualizations, comparison, execution assumptions, actual scoped RxJS checks, and a verified save. Preserve the existing takeWhile model exclusions and distinguish requested output words from delivered observations.

Use `npm ci --ignore-scripts` and `npm run check`. The read-only [validation workflow](../.github/workflows/validation.yml) also runs the existing checks on main pushes and manual dispatch. A queued or merely started job is not a passed check. Preserve actual evidence for every completed package.

F00 did not add neighboring operator profiles or complete F01. Resume F01; advance to F02 only after the full four-operator package passes its own completion gate.
