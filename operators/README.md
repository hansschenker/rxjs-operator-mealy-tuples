# Operator profiles

**Baseline:** RxJS 7.8.2. **Completed family:** [F01 — Prefix selection](../families/F01-prefix-selection.md), declared scope. **Next:** F02.

| Profile | Configuration / scope | Recorded evidence |
|---|---|---|
| [takeWhile](takeWhile.md) | Indexed Boolean predicate, inclusive omitted/false/true, stable non-reentrant reactions | Source-reviewed; model and actual RxJS tests passed |
| [skipWhile](skipWhile.md) | Indexed Boolean predicate, Skipping/Forwarding, ordinary return/throw | Source-reviewed; model and actual RxJS tests passed |
| [take](take.md) | Nonnegative safe-integer count; explicit zero/positive activation | Source-reviewed; model and actual RxJS tests passed |
| [skip](skip.md) | Nonnegative safe-integer count; continued source participation | Source-reviewed; model and actual RxJS tests passed |

[Family evidence](../evidence/F01-prefix-selection.md) records exact commands, revisions, and limits. [Coverage](../docs/OPERATOR-COVERAGE.md) retains all 146 planning identities and distinguishes the 142 still-planned entries. Four execution-boundary cases do not turn the stable profiles into complete reentrant models. Use the [analysis template](../templates/OPERATOR-ANALYSIS.md) for the next family.
