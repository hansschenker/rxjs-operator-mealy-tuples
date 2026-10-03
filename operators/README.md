# Operator profiles

**Baseline:** RxJS 7.8.2. **Completed families:** [F01](../families/F01-prefix-selection.md) and [F02](../families/F02-value-selection.md), declared scopes. **Next:** F03.

| Profile | Configuration / scope | Recorded evidence |
|---|---|---|
| [takeWhile](takeWhile.md) | Indexed Boolean predicate, inclusive omitted/false/true | Source-reviewed; model and RxJS checks passed |
| [skipWhile](skipWhile.md) | Indexed predicate, Skipping/Forwarding, normal/throw | Source-reviewed; model and RxJS checks passed |
| [take](take.md) | Nonnegative safe-integer count, explicit zero/positive activation | Source-reviewed; model and RxJS checks passed |
| [skip](skip.md) | Nonnegative safe-integer count, ongoing source participation | Source-reviewed; model and RxJS checks passed |
| [map](map.md) | Indexed projection, return/throw, no thisArg | Source-reviewed; model and RxJS checks passed |
| [filter](filter.md) | Indexed Boolean selection; rejected-input index | Source-reviewed; model and RxJS checks passed |
| [ignoreElements](ignoreElements.md) | Next suppression, terminal and resource forwarding | Source-reviewed; model and RxJS checks passed |
| [mapTo](mapTo.md) | Configured constant/reference; scoped map compatibility | Source-reviewed; model and RxJS checks passed |
| [pluck](pluck.md) | Fixed nonempty property path; missing/nullish/access error; construction boundary | Source-reviewed; model and RxJS checks passed |

[Coverage](../docs/OPERATOR-COVERAGE.md) keeps all 146 planning identities distinct: nine scoped profiles and 137 still planned. [F01 evidence](../evidence/F01-prefix-selection.md) and [F02 evidence](../evidence/F02-value-selection.md) preserve exact revisions and limitations. Stable profiles and separately tested execution-boundary observations are not complete reentrant models or all-overload proofs. Use the [template](../templates/OPERATOR-ANALYSIS.md) for F03.
