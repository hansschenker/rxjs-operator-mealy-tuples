# Roadmap and current checkpoint

**Revision:** 1.2 — 3 October 2026. **Baseline:** RxJS 7.8.2.  
**Authoritative tracker:** [Family Implementation Plan](FAMILY-IMPLEMENTATION-PLAN.md). **Next:** [F02 handoff](NEXT-SESSION.md).

| Work | Status |
|---|---|
| F00 — Baseline validation | Complete; pinned dependencies and successful hosted clean install |
| F01 — Taking/dropping prefixes | **Complete (declared scope)**: takeWhile, skipWhile, take, skip |
| F02 — Mapping and per-value selection | **Next; Planned** |
| F03–F34 | Planned; original assignments/dependencies retained |
| Completed families | **1 / 34**; F00 is not an extra family |

[F01 evidence](../evidence/F01-prefix-selection.md) records 45 model and 68 actual RxJS tests passed, including 6,534 bounded comparisons. The family has 30 rule IDs and twelve generated table/diagram/trace views. [Coverage](OPERATOR-COVERAGE.md) distinguishes four scoped profiles from 142 planned identities; it is not an all-API proof.

## Preserved phases

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

Reuse the validated baseline; do not rebuild F00/F01. Each new family needs six-tuple profiles, guarded rules, test obligations, views, explicit execution assumptions, source review, actual runtime evidence, and a verified save. Classification remains the conclusion. Preserve historical failures and bounded evidence instead of relabeling them as universal conformance.
