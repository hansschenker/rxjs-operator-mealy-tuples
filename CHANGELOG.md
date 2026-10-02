# Change log

## F00 completed — 2026-10-02

Validated the existing baseline without changing the operator model, rule descriptors, test assertions, generator, or generated views. A fresh local npm attempt failed DNS resolution; a read-only, commit-pinned GitHub Actions workflow then ran the unchanged harness successfully on a connected runner.

Committed the npm-generated lockfile (RxJS 7.8.2, TypeScript 5.8.3, tslib 2.8.1), removed the temporary bootstrap, and verified a clean locked run. All 15 model tests, 14 actual RxJS tests, and all 1,452 bounded comparisons inside the runtime suite passed, together with type/generated/document checks. Regeneration produced no drift.

Added permanent F00 evidence, raw check/environment/install logs, and checksums; preserved historical failures in VERIFICATION.md. Updated the live profile statuses and synchronized the family tracker, README, ROADMAP, AGENTS, and next-session handoff. F00 is Complete; F01 is next and remains In progress; completed operator families remain 0/34. Browser/reentrant/all-overload parity and Mermaid rendering remain outside this evidence.

## Family-roadmap adaptation — 2026-10-02

Adapted ROB-SN's complete revision-1.0 family plan to Mealy-tuples as revision 1.1. Preserved the 34 family IDs, eight phases, 146 planned API assignments, and inter-family dependencies; reformulated deliverables around S, S0, Z, A, T, G.

Added F00 to validate and lock the existing harness before completing F01. Retained the current takeWhile seed, rules, paths, generator, and tests; F01 is In progress and completed families remain 0/34. Added a bounded next-session brief and migration record, synchronized ROADMAP/README/AGENTS, and separated planned commands/paths from existing ones.

Planning checks covered table ownership/counts/dependencies, checkpoint consistency, and the seven changed Markdown files. No runtime tests, new model execution, or export audit were performed in this planning change. The initial verification record is retained unchanged, and neither source repository was modified.

## 0.1.0 — 2026-10-02

Established RxJS Operator Mealy Tuples as a new formulation of ROB-SN's philosophy using S, S0, Z, A, T, G consistently. Retained explicit execution contracts, ordered output/control words, validity and trace laws, evidence boundaries, and Model → Observe → Classify.

Reviewed the companion rxjs-operator-mealy-analysis snapshot. Adopted its readable six-section/per-operator structure and custom-operator preparation, preserved its SuperGrok attribution, and documented sampled table/prose mismatches rather than copying the catalogue wholesale.

Added a source-reviewed takeWhile profile, reusable templates, test obligations, a typed functional reference model, generated table/state diagram/trace, local model tests, and an authored RxJS validation suite. Fifteen reference-model tests passed. The model type-check and generated/document checks passed. RxJS runtime tests were not executed because dependency installation failed; no full conformance claim is made.

Both source repositories remain unchanged. The source snapshots and validation limits are recorded in the documentation.
