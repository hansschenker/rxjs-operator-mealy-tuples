# Operator profiles

| Profile | Scope | Model evidence | RxJS runtime evidence |
|---|---|---|---|
| [takeWhile](takeWhile.md) | RxJS 7.8.2; indexed Boolean predicate; inclusive false/true; stable non-reentrant reactions | Source-reviewed; 15 model tests passed | Selectively RxJS-tested in F00; project suite 14/14 and 1,452 bounded comparisons passed; see [evidence](../evidence/F00-baseline-validation.md) |

One profile is not coverage of all overloads or a completed family. Use the [operator-analysis template](../templates/OPERATOR-ANALYSIS.md) and check the [verification record](../docs/VERIFICATION.md).
