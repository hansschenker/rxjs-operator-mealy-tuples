# Contributing

Begin with a bounded operator/configuration and the [analysis template](templates/OPERATOR-ANALYSIS.md). Keep the canonical order S, S0, Z, A, T, G and pin implementation links to RxJS 7.8.2. Explain what flows before equations and code.

Add guarded rule IDs, independent expected fixtures, reachable RxJS cases, generated/hand-reviewed visualization scope, and an honest evidence record. State transition coverage is one metric, not proof of complete behavior coverage. Distinguish source inspection, model tests, runtime tests, and proofs.

Use the [execution contract](docs/EXECUTION-CONTRACT.md) for timing, callbacks, reentrancy, initialization, cancellation, sharing, and resource ownership. Extend the contract when required rather than silently assuming a universal synchronous or asynchronous machine.

Run `npm run check` after installing dependencies. Regenerate views with `npm run generate`. Record failure or unavailable checks in [verification](docs/VERIFICATION.md). Do not hand-edit generated tables to make a test pass.

Preserve the attribution and pinned provenance of both predecessor projects. The new project credits GPT-6 Astra as main contributor in collaboration with Hans Schenker; the companion analysis project credits SuperGrok. Commits for this adaptation use `Co-Authored-By: GPT-6 Astra <noreply@openai.com>`.

Do not add a license on behalf of the owner, change the source repositories, publish an npm package, or claim full operator/overload coverage without corresponding authorization and evidence.
