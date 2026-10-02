# From six-tuple analysis to tables, tests, and visualizations

The semantic source is an exact six-tuple **plus its declared execution profile**. A tuple signature without concrete rules is not enough to generate behavior.

## 1. Scope and analyze

Pin RxJS, select an overload/configuration, identify the execution owner, and describe what flows. Define S, S0, Z, A, T, G in that order. Inspect the operator plus delegated helpers and relevant upstream tests. Distinguish examined code from tests actually executed.

A symbolic state space may be infinite. Define admissible inputs, terminal behavior, callback outcomes, and initialization. Record omitted features rather than silently inheriting defaults.

## 2. Tabulate the paired results

| Rule ID | Current state s | Input z | Guard | T(s,z) | G(s,z) | Evidence |
|---|---|---|---|---|---|---|
| operator-qualified ID | symbolic state | tagged event | exact condition | resulting state | ordered output word | pinned source / test |

A row is one guarded relation between the **same input and pre-input state** and both results. Do not zip a list of T cases and a differently ordered list of G cases. That operation can reverse guards, as demonstrated by the [companion review](COMPANION-REVIEW.md).

Check that every resulting state is in S, every output letter is in A, and guards cover the declared domain without ambiguity. S0 defines the starting point; parameter cases and activation can affect which rows are reachable.

## 3. Derive test obligations

Each obligation names a rule ID, parameter values, a reachable input prefix, the next input, expected output word, expected resulting-state consequences, and relevant clock/resource observations.

**Reference-model tests** may arrange S directly and assert T/G. **Black-box RxJS tests** instead reach a corresponding situation through subscription and input history. They compare observable notifications, callback arguments, subscription lifetimes, and teardown. A continuation can distinguish states that produce the same immediate output.

Row coverage, guard-boundary coverage, parameter coverage, reachability, sequences of rows, and execution-interaction coverage are different metrics. Covering every symbolic row is not exhaustive behavior coverage. An unbounded state space cannot be enumerated by a finite table of concrete rows.

A generated test that calls the same evaluator for both actual and expected results proves little. Use independent expected fixtures and compare the model with the actual pinned RxJS implementation. Property-based/bounded-trace testing adds evidence, not a universal equivalence proof.

For time-dependent profiles use [TestScheduler](https://rxjs.dev/guide/testing/marble-testing) where the relevant scheduling is virtualizable. Assert subscription marbles as well as notification marbles. Test empty, never, source error, callback throws, early cancellation, and synchronous input as applicable. Same-frame Next then Complete must preserve that order, for example `(c|)`.

## 4. Derive visualizations as parallel views

| View | Derived content | Boundary |
|---|---|---|
| State transition diagram | S0 start marker; guarded edges labeled input / G; T supplies target | Can be a projection of S, not full state enumeration |
| Step trace | One chosen input sequence walked through T/G | State snapshots and processing positions are model predictions |
| Time/value timeline | A trace interpreted under a clock/scheduler | Time and event ties do not follow from the tuple alone |
| Subscription/resource lanes | Subscribe, cancel, dispose, ownership | Required to explain higher-order or shared executions |

Every rendered edge/step should identify its rule. Distinguish model-predicted and runtime-observed traces. A scheduled source value after disconnection must not be drawn as actually received by the closed operator. A Mermaid source file is not proof that every renderer displays it correctly.

## 5. Observe, compare, and classify

Derive qualities from the rules, then compare with measured traces. Explain any mismatch before broadening the profile. Only then assign families and behavior-control policies. A study family organizes work; it is not proof of the classification.

## Scaffold in this edition

The [typed reference model](../model/takeWhile.ts) returns T and G together from one evaluation. Its reviewed descriptors identify eight symbolic rules. The [generator](../scripts/generate.mjs) renders a [table](../generated/takeWhile.transitions.md), a [control-state diagram](../generated/takeWhile.visualization.md), and a [predicted trace](../generated/takeWhile.trace.md).

Descriptors are explanatory text, **not an executable universal rule language**. The implementation and descriptors share IDs but their semantic consistency still needs review and tests. `check:generated` detects stale generated files; it does not prove descriptor correctness. The [model fixtures](../tests/model.test.mjs) provide independent expected results; the [RxJS suite](../tests/rxjs.test.mjs) supplies independently written runtime checks and bounded model/runtime comparisons. Its execution status is stated in [verification](VERIFICATION.md).

No arbitrary six-tuple-to-code compiler or fully automatic operator-test generator is claimed.
