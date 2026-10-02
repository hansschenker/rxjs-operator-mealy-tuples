# Next session — F00 baseline validation

**Checkpoint:** 2 October 2026; plan revision 1.1.  
**Repository:** `hansschenker/rxjs-operator-mealy-tuples`, branch `main`.  
**Current task:** F00 — Validate and lock the existing baseline.  
**After F00:** resume F01 — Taking and dropping prefixes. F02 is not next yet.

Read the authoritative [family plan](FAMILY-IMPLEMENTATION-PLAN.md), [roadmap summary](ROADMAP.md), [AGENTS.md](../AGENTS.md), and current [verification record](VERIFICATION.md). This handoff is a requested-session instruction, not an automation or background promise.

## Why this is the next step

At the inspected baseline `c2bbd1c780be4e0aff63a0a7027a80c0b44ce7ea`, the six-tuple framework, a takeWhile reference evaluator, TW01–TW08, generated views, and tests already exist. The verification record reports 15 model tests passed but no executed real-RxJS suite because npm installation failed. The package pins RxJS 7.8.2 and TypeScript 5.8.3 but has no lockfile.

Do not rebuild that work or assume it is already runtime-validated. F00 verifies the existing machine before more operator profiles depend on it. This planning commit does not perform F00.

## Scope and procedure

1. **Read current main and evidence.** Check whether the gate has already been resolved by another session. Inspect package.json, tsconfig.json, the takeWhile profile/model, both test files, the generator, and documentation checker. Record the actual starting commit and run environment.
2. **Install reproducibly.** Without a lockfile, use `npm install --ignore-scripts`, review and retain the lockfile, then run `npm ci --ignore-scripts`. With a valid committed lockfile, start with npm ci. Keep the direct dependency pins and private package; do not publish or migrate RxJS.
3. **Run actual checks.** Use `npm run check`. It includes `check:types`, model tests, real RxJS tests, generated-view checks, and documentation checks. Run `npm run generate` and review any drift; after necessary fixes repeat the aggregate check on the final tree. All 1,452 bounded comparisons and the notification/subscription/callback/disposal fixtures must actually execute. A model pass or syntax check is insufficient.
4. **Record, save, verify.** Create `evidence/F00-baseline-validation.md` with source/test scope, versions, commands, real outcomes, limitations, and any repairs. Append the new run to VERIFICATION.md rather than deleting the historical failure. Update the family-plan checkpoint, README, ROADMAP, this handoff, and CHANGELOG; commit the lockfile and coherent changes to main without forcing; verify the saved revision.

A source/model/test disagreement must be investigated, not hidden by changing expectations to fit the actual implementation. Preserve six-tuple names and evaluate supplied functions only once per modeled reaction.

## Acceptance and stop rule

F00 is Complete only after a reviewed lockfile, clean installation, passing full aggregate check, accurate evidence, and a verified repository checkpoint. Record diagram-rendering limits separately; do not claim a renderer run from generated Markdown alone.

If installation or a required check fails, retain the achieved work and mark F00 Blocked with the actual error. Do not claim the runtime suite passed or advance to another family. Source-only preparation may be retained with its lower evidence status; it does not satisfy the gate. Do not spend repeated attempts retrying the same unavailable network without new information.

## Following bounded session — F01

After F00 succeeds, set this handoff to F01. Keep the existing takeWhile profile/model/rule IDs and extend the package with skipWhile, take, and skip. Use the exact F01 brief in the family plan.

The F01 deliverable is four canonical six-tuple profiles, guarded transition tables, rule-linked test plans, state diagrams and time/resource traces, a family comparison, actual model/RxJS evidence, an initialized qualified coverage index, regression checks, and a verified save. Make new family tests part of the existing aggregate test command; do not claim the old proposed `test:family` command exists.

The common comparison uses values 2, 4, 7, 1, predicate `value < 5`, and counts of two, followed by source completion. Test terminal timing and subscription lifetimes as well as value sequences. Preserve the existing macrostep exclusions; put cancellation-during-delivery and bounded reentry observations in an explicitly separate execution-boundary note or finer profile.

After complete F01 evidence is saved, advance to F02 — Mapping and per-value selection. Completing F00 alone leaves family completion at 0/34.

## Session-start instruction

> Execute F00 from docs/NEXT-SESSION.md using the current main branch. Reuse the existing six-tuple model, tests, and generators; keep RxJS 7.8.2. Establish dependency reproducibility, run actual checks, record evidence, save the coherent changes, and verify the commit. If blocked, record the blocker without claiming validation. The next family continuation is F01, not F02.
