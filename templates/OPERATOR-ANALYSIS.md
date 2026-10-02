# <operator> — Mealy six-tuple analysis

**Baseline:** RxJS 7.8.2.  
**Qualified API / overload / parameters:** <exact scope>.  
**Execution owner:** <one subscription / shared coordinator / named generation>.  
**Model level:** <stable behavioral reactions / execution microsteps>.  
**Evidence status:** <proposed / source-reviewed / model-tested / selectively RxJS-tested / proved under stated assumptions>.  
**Exclusions:** <explicit list, including callback/reentrancy/timing/overload limits>.

## Explanation

What values flow over time? What happens when a new input arrives? Why is this policy required? Keep domain calculations in named supplied functions. State activation, cancellation, and sharing before code.

## Parameters and execution assumptions

Define fixed parameters, callback types/indexes, returned outcomes and throws, external reads, mutation, clock/scheduler, initialization convention, state ownership, and observable evidence. Read the [execution contract](../docs/EXECUTION-CONTRACT.md).

## 1. State space — S

Define the exact state domain. Explain memory, lifecycle outcome, resource ownership, growth/reset bounds, and validity conditions. Include execution phases only when needed. A finite diagram may project this space.

## 2. Initial state — S0

State S0 in S. Choose separate setup or Start in Z. Specify initial output, if any, separately from stored memory. Explain fresh state versus captured references.

## 3. Input alphabet — Z

Name tagged notification, control, timer, inner/notifier, and callback-outcome events as applicable. State admissible event protocols and identities. Omitted categories require reasons.

## 4. Output alphabet — A

Declare individual notification and control letters, their targets, and operational interpretation. G returns an ordered finite word in A*, including []. Do not conflate silence with an empty-valued emission.

## 5. Transition function — T

$$
T:S\times Z\to S.
$$

Specify next-state rules. Alternatively declare the admissible domain shared with G. Guards must be exhaustive/nonoverlapping or explicitly prioritized.

## 6. Output function — G

$$
G:S\times Z\to A^*.
$$

Specify the output for the same pre-input state and input used by T. Share evaluated domain results; do not invoke callbacks twice to populate the two sections.

## State Transition Table

| Rule ID | Current state s | Input z | Guard | T(s,z) | G(s,z) | Evidence |
|---|---|---|---|---|---|---|
| <ID> | <state> | <event> | <condition> | <next state> | <ordered word> | <source/test> |

Include active source completion/error, cancellation, operator-induced termination, relevant inner/notifier/timer inputs, callback outcomes, and scoped post-terminal behavior. Omitted behavior is not automatically [].

## Derived test obligations

| Rule IDs | Reachable prefix / arrangement | Next input | Expected notifications | State consequence / resource observation | Test ID / status |
|---|---|---|---|---|---|
| <IDs> | <prefix> | <input> | <word> | <probe / lifetime / disposal> | <ID and evidence> |

Direct state assertions are for model tests. For black-box RxJS, use observable histories and probes. Add parameter boundaries, traces, timing ties, cancellation during delivery, and shared/independent subscriptions as needed. Row coverage is not full coverage.

## Derived visualization

Provide a rule-labeled state diagram with its projection explained, a model-predicted trace with explicit clock/order, and subscription/resource lanes where relevant. Label observed traces separately. Verify generated views against the same rule IDs.

## Invariants and trace laws

State initial validity, preservation, terminal exclusivity, output ordering, cleanup, and ownership. Distinguish stable-state validity from intermediate execution state.

## Verification record

Record exact source paths/version, helpers inspected, upstream test cases read, commands executed, outcomes, and untested cases. A test plan is not a passing suite. A generated picture is not a runtime observation.

## Behavioral qualities and classification

Derive memory, trigger, value, time, cardinality, concurrency, cancellation, termination, and sharing qualities. Justify the concluding family/policy labels with rule IDs. Do not inherit them solely from the operator name.
