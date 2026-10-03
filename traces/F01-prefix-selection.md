# F01 — Comparison traces and source lifetimes

**Input schedule:** fresh independent cold subscriptions at frame 0. Values a=2,b=4,c=7,d=1 at frames 1,3,5,7; completion at frame 9. Predicate: value<5; count: 2. No shared source is introduced. The following independently authored source/model-derived fixtures were matched by the passing F01-COMPARE runtime tests, including their subscription assertions. This is a written fixture summary, not an automatically captured runtime visualization. The run is recorded in [evidence](../evidence/F01-prefix-selection.md).

```text
Source schedule       -a-b-c-d-|
takeWhile default     -a-b-|
source subscription   ^----!
takeWhile inclusive   -a-b-(c|)
source subscription   ^----!
skipWhile             -----c-d-|
source subscription   ^--------!
take(2)               -a-(b|)
source subscription   ^--!
skip(2)               -----c-d-|
source subscription   ^--------!
filter contrast       -a-b---d-|
source subscription   ^--------!
```

Parentheses indicate ordered notifications in one virtual frame, not separate delayed frames. The scheduled source lane is not the list of inputs each operator actually receives: after early disconnection, subsequent scheduled source values are not delivered to that subscription.

## Same values can hide different terminal times

TakeWhile(false) and take(2) both emit 2,4. take(2) completes with 4 at frame 3; takeWhile must encounter rejected 7 at frame 5 to decide. A values-only test would lose this distinction. The tests assert subscription intervals as well as notifications.

## Predicate invocation trace

For takeWhile, the calls are (2,0), (4,1), (7,2), including the rejecting value. For skipWhile they are the same three calls, but value 1 is then forwarded without a fourth predicate invocation. A later subscription repeats indexes from zero. The F01-CALLS case deliberately uses a predicate that would throw for 1, showing that it is not evaluated in Forwarding.

## Zero-count activation

```text
take(0):  activation → Complete
           source subscriptions = 0; owned-source disposals = 0
skip(0):  activation → subscribe source → forward source inputs
           source subscriptions = 1; owned-source disposal = 1 at termination
```

`DisposeOwned` does not mean all internal Subscriber cleanup, so no owned-source disposal is expected when no source was acquired. This is independently tested with counted source setup and teardown.

## Other discriminating histories

The runtime suite includes source completion before a boundary, empty and cancelled-never sources, source errors both before and after dropping ends, predicate throw, explicit cancellation in both skipWhile phases, counts zero/one/equal-to-source/greater-than-source, and cooperative synchronous production. Dropping itself does not cancel at the threshold; downstream take(1) is used in two explicitly composed cancellation-chain cases.

Each operator also has a generated state/step trace, linked from its profile. [Execution-boundary traces](../families/F01-execution-boundaries.md) separately cover cancellation during delivery and nested inputs. Neither a timer nor sharing is hidden in these examples.
