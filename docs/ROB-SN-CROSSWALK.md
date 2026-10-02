# ROB-SN → Mealy six-tuple crosswalk

This is a reformulation of the behavioral philosophy, not a new claim of computational power. The source snapshot is [ROB-SN at 69d32fd](https://github.com/hansschenker/rxjs-operator-behavior-set-notation/tree/69d32fdff0a368989ff76505c4884aedc49bfb33).

## What remains unchanged

Retain **Model → Observe → Classify**, ordered actions, explicit value domains, tagged identities, source-reviewed behavior, state validity, trace laws, and honest scope. Retain the distinction between a behavioral reaction and exact synchronous execution. Time, cancellation, sharing, callback behavior, and ownership remain explicit.

The human reading remains: what is remembered together with what arrived determines what is remembered next and what must happen. Classification follows analysis rather than determining it.

## What changes

| ROB-SN vocabulary | Canonical vocabulary here |
|---|---|
| State space S | State space S |
| Initial state s0 | Initial state S0 |
| Event space E; event e | Input alphabet Z; input z |
| Action alphabet A; ordered actions | Output alphabet A; ordered output word in A* |
| Combined transition function | Separate Transition function T and Output function G |
| Five-slot explanatory view | Six analytical components; status/resources/memory can decompose S |
| Execution contract and invariants | Required surrounding profile, not extra tuple components |

ROB-SN's [foundation](https://github.com/hansschenker/rxjs-operator-behavior-set-notation/blob/69d32fdff0a368989ff76505c4884aedc49bfb33/docs/FOUNDATION.md) defines:

$$
\delta(s,e)=(s',\alpha).
$$

Under identical domains, parameters, and execution assumptions, the crosswalk is:

$$
\delta(s,z)=\bigl(T(s,z),G(s,z)\bigr).
$$

Conversely, project the first and second components of the combined result to obtain $T$ and $G$. Combining or separating them neither loses information nor resolves reentrancy. This is the only document where the combined notation is used as a migration aid; new operator profiles use the six-tuple language directly.

## Translate concepts, not labels mechanically

ROB-SN's Event slot maps to Z. Its Next Actions slot maps to the words produced by G over A. Its Memory, Lifecycle, and Execution Status slots describe possible components of S. S0 establishes the selected initial configuration. T changes those components; G produces the associated outputs.

Do not carry the old rule-family prefix `T` into prose as if it meant the Transition function when it actually meant time. New profile rule IDs are operator-qualified, such as `TW01`; clocks use lowercase t.

A source subscription, an inner subscription, and a shared coordinator can each require their own six-tuple scope. The old five-slot view is not an additional canonical tuple.

## Migration policy

The original repository remains unchanged. Do not import its roadmap completion claims, operator counts, examples, or tests as newly completed work. Each migrated operator needs its own pinned baseline, explicit assumptions, guarded table, matching test obligations, and evidence record.

[The companion review](COMPANION-REVIEW.md) supplies a second input to this formulation. Both predecessors are acknowledged; neither is treated as unquestionable runtime ground truth.
