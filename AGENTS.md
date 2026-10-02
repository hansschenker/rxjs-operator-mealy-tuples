# Working rules for this repository

Use RxJS 7.8.2 as the fixed baseline. The canonical six components are S, S0, Z, A, T, G. T returns the next state; G returns an ordered finite output word. Preserve the six names throughout new profiles, tables, tests, and visualizations. Use the combined ROB-SN notation only in the migration crosswalk.

Read README.md, docs/FOUNDATION.md, docs/EXECUTION-CONTRACT.md, and docs/VERIFICATION.md before extending the model. Use templates/OPERATOR-ANALYSIS.md. Analyze before classifying. Name exact configurations, owners, callback assumptions, and excluded cases.

Keep completion, error, cancellation, and disposal distinct. Define output/control letters explicitly. No universal all-system absorbing state, implicit shared execution, fake asynchronous queue, or callback evaluation once for T and again for G.

Do not edit generated artifacts by hand. Update model/takeWhile.ts or scripts/generate.mjs and run npm run generate. Descriptors are not an executable generic rule DSL; inspect semantic consistency and independent fixtures.

Run available checks and state which actually ran. A failed dependency installation is not a passing runtime suite. Never inherit predecessor catalogue counts or mark planned tests as executed. Preserve source attribution, including SuperGrok for ideas adapted from the companion project.

Prefer pure functions and named domain predicates; do not add a replacement RxJS implementation or publish the private package. Do not modify either source repository as a side effect of work here. Keep commits focused and include the project contributor credit.

## Family roadmap and handoff

Read docs/FAMILY-IMPLEMENTATION-PLAN.md and docs/NEXT-SESSION.md from current main before selecting work. The family plan is the authoritative tracker; docs/ROADMAP.md is its summary. The imported 146 entries are planned assignments, not inherited conformance or completed profiles.

F00 is complete as recorded in evidence/F00-baseline-validation.md; the next task is the partial F01 prefix family. Reuse operators/takeWhile.md, TW01–TW08, model/tests/generator, committed package-lock.json, and actual script names. Use npm ci --ignore-scripts and npm run check. The read-only GitHub Actions workflow is available when local networking is blocked; inspect completed job results. Do not rebuild F00, recreate the old proposed harness, or claim test:family exists. Keep F00 outside the 34-family denominator; only evidence advances status.

Update the tracker, next-session brief, summary, relevant evidence, README, and CHANGELOG together when advancing. Save coherent work to main without force, preserve unrelated edits, and verify the saved revision. Retain historical verification failures when adding new successful runs. Do not implement an unrelated family as part of a plan-only change.
