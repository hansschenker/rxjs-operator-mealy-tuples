# F00 — Baseline validation evidence

**Date:** 2 October 2026. **Outcome:** Complete for the declared F00 scope.  
**Starting main:** `322b6397f43367c032f5a50bf3fe9059af6518f4`.  
**Validated locked revision:** `776bca758e19b72e4887e448a0443ee536df1533`.  
**Validated Git tree:** `7b325ffb5c2b803e75ebef3997988e7dcef66d8d`.  
**Next work:** F01 — Taking and dropping prefixes. Completed operator families remain **0/34**.

## Execution route and provenance

A fresh local `npm install --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=12000` failed with `EAI_AGAIN` resolving registry.npmjs.org. Direct GitHub cloning also failed DNS resolution. These local failures were not treated as successful validation and were not repeatedly retried. The [local install output](F00/local-install.txt) is retained.

To execute the required checks in a connected environment, a small [GitHub Actions workflow](../.github/workflows/validation.yml) was added. It reuses the existing package scripts, model, test fixtures, and generator; it is not a second harness. Workflow permissions are read-only, checkout does not persist credentials, third-party actions are pinned to reviewed commit IDs, and the job does not push changes or publish packages.

The [bootstrap run](https://github.com/hansschenker/rxjs-operator-mealy-tuples/actions/runs/36968450298) on `0566faa8c616d63b8c261e4b50a8e501808a8ca5` succeeded. It used npm to generate the previously missing lockfile, performed a clean npm ci, ran all checks, regenerated the views without drift, and reran all checks.

The npm-generated lockfile was recovered from that job's log and verified byte-for-byte against its printed SHA-256 before being committed. The temporary bootstrap was removed. The [locked validation run](https://github.com/hansschenker/rxjs-operator-mealy-tuples/actions/runs/36968623943), job `110717712268`, then succeeded on `776bca758e19b72e4887e448a0443ee536df1533`, starting directly with npm ci from the committed lockfile. Missing or inconsistent lockfiles now fail; no install/update fallback remains.

## Recorded environment and dependencies

| Item | Observed version / value |
|---|---|
| Test host | GitHub-hosted Ubuntu 24.04 runner; Linux 6.17.0-1022-azure |
| Node used for tests | 22.16.0 |
| npm | 10.9.2 |
| TypeScript | 5.8.3 |
| Python on the runner | 3.12.3 |
| RxJS | 7.8.2 |
| Transitive tslib | 2.8.1 |
| Lockfile format | npm lockfileVersion 3 |
| Lockfile SHA-256 | `15ab0afc6515e59299ca197482219b4faa3a6e15f357e8e220c0d757a5982b53` |

The [environment output](F00/locked-environment.txt) and [committed lockfile](../package-lock.json) preserve these observations. Both direct dependency pins in package.json are unchanged. The lock contains only the two declared direct packages and tslib; all resolved package URLs use the npm registry and include SHA-512 integrity fields. This is a reproducibility review, not a security audit.

## Actual commands and outcomes

| Command / observation | Result |
|---|---|
| Bootstrap: `npm install --ignore-scripts --no-audit --no-fund` | Passed on the connected runner; generated the lockfile |
| `npm ci --ignore-scripts --no-audit --no-fund` | Passed from the committed lockfile on a fresh runner |
| `npm ls --all` | RxJS 7.8.2, tslib 2.8.1, TypeScript 5.8.3; no dependency errors |
| `git diff --exit-code -- package.json package-lock.json` | Passed; install did not alter dependency declarations or lock |
| `npm run check:types` | Passed with TypeScript 5.8.3 |
| `npm run test:model` | **15 passed, 0 failed, 0 skipped** |
| `npm run test:rxjs` | **14 passed, 0 failed, 0 skipped** |
| Bounded differential case inside the RxJS suite | **All 1,452 comparisons passed** |
| `npm run check:generated` | All three generated artifacts matched |
| `npm run check:docs` | Passed for the 24 Markdown files present at the locked validation revision |
| `npm run generate` and `git diff --exit-code -- generated` | Passed; no generated-file drift |
| Second `npm run check` after regeneration | Passed in full |

The 1,452 comparisons are inside one of the 14 RxJS tests; they are not 1,452 additional Node test cases. They enumerate 121 value sequences, two predicates, two inclusive settings, and three endings. The assertions compare output/control words and predicate calls, including disposal. The other tests include inclusive/exclusive boundaries, empty/never, source errors, predicate throws, cancellation without completion, indexes, independent subscriptions, and the two companion-review regressions.

The [raw aggregate output](F00/locked-check.txt) is retained in Git so the evidence does not depend solely on expiring Actions artifacts. No model, rule descriptor, test assertion, generator, package.json, or generated view was changed to obtain the passing result. F01's additional cases and neighboring operator profiles were not implemented by F00.

## Source snapshot and save verification

Actions artifact `11210568102` contains the environment, check logs, and a source archive without node_modules or Git metadata. Its ZIP SHA-256 was verified as `af659789c8bb7aad2aa9f8379cce9e1a831acf315945cb3e5fc8cda3c4574eee` after connector download. Reconstructing Git object hashes from the extracted 34 files reproduced the validated tree `7b325ffb5c2b803e75ebef3997988e7dcef66d8d` exactly. The artifact's retention is 14 days; the checked-in text evidence remains available independently.

[Checksums](F00/checksums.json) identify the saved logs, lockfile, and original validation revision. Finalization changes documentation/evidence only and triggers the same CI again; the final commit and its actual check conclusion are verified in the session handoff rather than writing a self-referential commit hash here.

## Local metadata checks

After restoring the exact validated source snapshot, the documentation/evidence finalization was checked locally: the existing documentation checker passed for 25 Markdown files, the reference model type-check passed with global TypeScript 5.8.3, all 15 dependency-free model tests passed again, and all three generated artifacts matched. This does not claim a local npm ci or local RxJS execution; those remain hosted checks. The hosted workflow reruns the aggregate check for the saved metadata revision as well.

## Limits and warnings

This closes the declared baseline gate, not F01 or all RxJS conformance. The takeWhile profile remains a stable, non-reentrant, single-subscription model with its existing exclusions. No all-overload proof, browser/transport integration, reentrant execution proof, or Mermaid renderer run was performed. The diagram source and regeneration were checked, not rendered layout.

Node's type-stripping experimental warning and action-runtime deprecation warnings were present; they did not fail the checks. The Node runtime selected for tests was 22.16.0, distinct from the JavaScript runtime used internally by Actions. Audit was explicitly disabled; no vulnerability-audit outcome is claimed. Local npm connectivity remains unavailable; the successful install and runtime checks were performed on GitHub-hosted runners.

## Handoff

F00 is complete. Reuse `npm ci --ignore-scripts` and `npm run check` for subsequent sessions in a connected environment, or use the committed validation workflow and inspect its actual result. Resume F01 with the existing takeWhile model and TW01–TW08; add skipWhile, take, and skip under the saved family plan. Do not rebuild the harness, silently broaden the model scope, or advance to F02 before F01 passes its own gate.
