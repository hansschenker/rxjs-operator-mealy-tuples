# Roadmap and current checkpoint

**Revision:** 1.3 — 3 October 2026. **Baseline:** RxJS 7.8.2.  
**Authoritative tracker:** [Family Implementation Plan](FAMILY-IMPLEMENTATION-PLAN.md). **Next:** [F03 handoff](NEXT-SESSION.md).

| Work | Status |
|---|---|
| F00 baseline | Complete; locked installation and hosted validation retained |
| F01 — Taking/dropping prefixes | Complete for declared scope: four profiles |
| F02 — Mapping/per-value selection | Complete for declared scope: five profiles |
| F03 — Distinctness and adjacent-value memory | Next; Planned |
| F04–F34 | Planned |
| Completed families | **2 / 34**; F00 is not an extra family |

[F02 evidence](../evidence/F02-value-selection.md) records 88 model and 142 actual RxJS tests passed, including 13,584 bounded comparisons. There are nine scoped profiles, 60 transition rule IDs plus PL-C00 construction, and 27 generated table/diagram/trace views. [Coverage](OPERATOR-COVERAGE.md) distinguishes nine scoped identities from 137 planned identities; it is not all-API proof. F00/F01 evidence remains dated history.

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

The original 34-family IDs, dependencies, and 146 inventory assignments are retained. Resume unfinished work; otherwise implement the next family with satisfied dependencies. Every family requires explicit S/S0/Z/A/T/G, guarded tables, tests, visualization, comparison, execution assumptions, actual scoped runtime checks, and a verified save. Do not convert source review or a document count into runtime evidence.
