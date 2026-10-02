# Specify a custom operator before implementation

Adapted from the [companion project's checklist](https://github.com/hansschenker/rxjs-operator-mealy-analysis/blob/402f00708c3ddb40ca451775fe38f9d80b4b90ed/docs/custom-operator-checklist.md), credited there to SuperGrok. Use the [full template](OPERATOR-ANALYSIS.md) for the resulting specification.

## First identify the policy

Describe the required behavior and why composition of existing public operators does not already express it. A custom queue limit, boundary rule, or resource policy must be explicit, not an accidental variation hidden in implementation.

## Answer the six questions

| Component | Decision |
|---|---|
| S | What can it remember? Who owns it? Which terminal outcomes matter? |
| S0 | What exists at activation? Does setup also emit or subscribe? |
| Z | Which exact tagged inputs can arrive, including cancellation? |
| A | Which notification and control letters can be produced? |
| T | How does each admitted state/input case change the state? |
| G | For that same case, which ordered word is produced? |

## Resolve the behavioral boundaries

Completion, error, and cancellation may require different pending-state policies. Define each. State whether new work overlaps, queues, replaces, or is ignored while busy. Name inner and timer identities, callback failures, input subscription order, resource ownership, and shared reset rules.

Walk a short trace through T and G before writing code. Add a discriminating trace against the nearest alternative policy. A closed gate that drops incoming values is not equivalent to a closed gate that remembers the latest and flushes on opening.

## Implement through public APIs

Prefer composing public RxJS operators. When a new source/subscription boundary is necessary, use the public Observable constructor with explicit teardown. Do not make application code depend on RxJS's internal `operate` or `createOperatorSubscriber` helpers; inspecting them is different from treating them as supported imports.

A mathematical specification can be functional even when the library implementation uses classes. This project introduces no custom classes in its reference model. Do not create a fake asynchronous queue to simplify synchronous execution semantics.

## Validate before claiming the policy works

Give every rule a stable ID. Write model-state tests where a reference evaluator exists, and independent RxJS tests for public observations. Include callback counts/indexes, no-output cases, same-frame final emissions, subscription lifetimes, and cleanup as appropriate. Tests and diagrams share the same specification but need independent correctness evidence.
