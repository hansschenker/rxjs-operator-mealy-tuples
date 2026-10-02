# RxJS Operator Mealy Tuples

**GPT-6 Astra is the main contributor of this project.** Developed with Hans Schenker.

**Baseline:** RxJS **7.8.2**. **Edition:** 0.1.0 — 2 October 2026.  
**Status:** Proposed specification framework, one worked reference profile, and a small validation scaffold. Not an official RxJS standard, replacement runtime, or exhaustive operator catalogue.

> The six-tuple is a semantic microscope: represent operator behavior, derive transition tables, test the predictions, visualize the reactions, and make classification the conclusion.

## One language throughout

$$
\boxed{\mathcal M_\theta=(S,S_0,Z,A,T_\theta,G_\theta)}
$$

| Component | Name | Analytical question |
|---|---|---|
| $S$ | State space | What can this execution remember? |
| $S_0\in S$ | Initial state | What is established before its first input? |
| $Z$ | Input alphabet | Which events can make it react? |
| $A$ | Output alphabet | Which notification or control letters can it produce? |
| $T:S\times Z\to S$ | Transition function | What is the next state? |
| $G:S\times Z\to A^*$ | Output function | What ordered output word is produced? |

For one current state $s$ and input $z$:

$$
s'=T(s,z),\qquad \alpha=G(s,z).
$$

Both functions use the same **pre-input state**. Their separation is mathematical, not a request to evaluate a predicate or accumulator twice. Fixed parameters are represented by $\theta$; they do not add a seventh tuple component.

This is an **extended Mealy-style transducer**: the state and payload alphabets need not be finite, and one reaction can produce zero or more letters. A classical Mealy machine has finite sets and one output symbol per input. See [the foundation](docs/FOUNDATION.md) and its primary reference.

## One model, several derived views

```text
Pinned source + exact configuration + declared execution scope
                              |
                       Six-tuple analysis
                              |
                   Guarded State Transition Table
                       /                  \
            Test obligations        State diagram
                   |                      |
        Model checks + RxJS checks   Model-predicted traces
                       \                  /
                    Compare observations
                              |
                    Behavioral classification
```

Visualizations and tests are sibling products of the model, not a mandatory serial chain. A prediction is not an observed runtime fact. Row coverage is not exhaustive behavioral coverage.

## Family implementation plan and next step

The [complete family plan](docs/FAMILY-IMPLEMENTATION-PLAN.md), revision 1.1, adapts ROB-SN's **34 families across eight phases** to this repository. Its **146 planned API identities** retain their owning families and dependencies; those assignments are not a claim of implemented or verified coverage.

**Current checkpoint:** 0/34 families complete. F01 is In progress because the takeWhile reference already exists; F02–F34 remain Planned. The immediate work package is **F00 — Validate and lock the existing baseline**, followed by completing F01 with takeWhile, skipWhile, take, and skip. F00 is a validation gate, not another operator family.

The [next-session brief](docs/NEXT-SESSION.md) specifies how to reuse the existing tests/generator, create and verify a dependency lockfile, run the actual RxJS suite, record evidence, and save the result. The [roadmap summary](docs/ROADMAP.md) provides navigation; the family plan is the authoritative tracker. The [migration record](docs/PLAN-MIGRATION-2026-10-02.md) separates planning checks from runtime validation. No new model or RxJS test run is claimed by this roadmap change.

## Reading path

| Document | Purpose |
|---|---|
| [Foundation](docs/FOUNDATION.md) | The six components, their types, initialization, and modeling limits |
| [ROB-SN crosswalk](docs/ROB-SN-CROSSWALK.md) | Preserve ROB-SN philosophy while changing the primary vocabulary |
| [Companion-repository review](docs/COMPANION-REVIEW.md) | Adopted lessons, source attribution, and verified sample inconsistencies |
| [Execution contract](docs/EXECUTION-CONTRACT.md) | Time, cancellation, reentrancy, resource ownership, and sharing |
| [Derivation workflow](docs/DERIVATION-WORKFLOW.md) | Model → table → tests/visualization → observations → classification |
| [Behavioral qualities](docs/BEHAVIORAL-QUALITIES.md) | What to extract from the model and measured traces |
| [Operator template](templates/OPERATOR-ANALYSIS.md) | Reusable six-section analysis with rule/test/diagram traceability |
| [Custom-operator checklist](templates/CUSTOM-OPERATOR-CHECKLIST.md) | Specify a new policy before implementing it |
| [takeWhile profile](operators/takeWhile.md) | A scoped, indexed, inclusive/exclusive reference example |
| [takeWhile test plan](test-plans/takeWhile.md) | Reachability, expected words, termination, and resource assertions |
| [Generated table](generated/takeWhile.transitions.md) | Reviewed rules in tabular form |
| [Generated state diagram](generated/takeWhile.visualization.md) | Finite control-state projection with transition labels |
| [Generated trace](generated/takeWhile.trace.md) | Model-predicted values, order, and subscription boundary |
| [Verification record](docs/VERIFICATION.md) | Checks actually completed and checks not completed |
| [Family implementation plan](docs/FAMILY-IMPLEMENTATION-PLAN.md) | All 34 families, planned inventory, dependencies, completion gates, and checkpoint |
| [Next-session brief](docs/NEXT-SESSION.md) | Execute F00, then resume F01 without rebuilding the reference |
| [Roadmap](docs/ROADMAP.md) | Synchronized summary of the authoritative family plan |
| [Plan migration record](docs/PLAN-MIGRATION-2026-10-02.md) | Source snapshots, changes, and planning-only checks |
| [References](docs/REFERENCES.md) | Pinned provenance and primary sources |

## Relationship to the existing repositories

This is a new formulation, not a rename, destructive migration, or automatic bulk import.

From [ROB-SN](https://github.com/hansschenker/rxjs-operator-behavior-set-notation), retain explicit state/event/action spaces, ordered actions, execution contracts, invariants, evidence, and **Model → Observe → Classify**.

From [RxJS Operator Mealy Analysis](https://github.com/hansschenker/rxjs-operator-mealy-analysis), adopt the six named components, plain-language-first profiles, per-operator tables/test plans, and custom-operator preparation. That repository credits **SuperGrok** as its main contributor. The [review](docs/COMPANION-REVIEW.md) records what was examined and why its catalogue was not copied wholesale.

The new primary vocabulary is **State space, Initial state, Input alphabet, Output alphabet, Transition function, Output function**. ROB-SN's combined function appears only in the migration crosswalk, not as a competing canonical model.

## Local checks

Node 22.16 or later in the Node 22 line and Python 3 are used by the scaffold. TypeScript is pinned to 5.8.3; RxJS is pinned to 7.8.2. Node's type-stripping flag is used only to run the reference-model scaffold and can emit an experimental warning.

```sh
npm install --ignore-scripts
npm run check
```

The complete command includes the RxJS runtime suite. Dependency-free model and generated-document checks can be run separately:

```sh
npm run test:model
npm run generate
npm run check:generated
npm run check:docs
```

**Initial implementation checkpoint (historical record):** 15 reference-model tests passed, the TypeScript model type-check passed, and generated-artifact/document checks passed. The RxJS tests were authored and syntax-checked but **not executed**: dependency installation failed with a network/DNS error. No package lock or all-checks-passing claim is supplied. See [verification](docs/VERIFICATION.md).

## Foundational commitments

Completion, error, cancellation, and cleanup are not interchangeable. Output words preserve order and repetition. Time comes from sources and schedulers. Shared state needs a named owner and reset policy. Business meaning belongs in supplied functions, not in the stream-processing mechanism. A state graph is not necessarily a timing diagram or an implementation-level execution model.

**Language for teaching; precise semantics for specification; independent evidence for conformance.**
