# F02 — Discriminating traces

**Baseline:** RxJS 7.8.2. These lanes are independently specified expected traces; their matching runtime checks are recorded in [F02 evidence](../evidence/F02-value-selection.md). Generated per-operator traces are model predictions, not captured runtime recordings.

## Common input schedule

Every line uses a fresh, independent cold subscription; no sharing is introduced. Input a={score:2}, b={score:4}, c={score:7}, d={score:1}. Source time is in virtual frames; order within a frame remains significant.

```text
Frame:           0123456789
Source:          -a-b-c-d-|
map(score*2):    -w-x-y-z-|   w=4 x=8 y=14 z=2
filter(score<5): -a-b---d-|   accepted references unchanged
ignoreElements:  ---------|
mapTo('ready'):  -r-r-r-r-|   r='ready'
pluck('score'):  -u-v-q-p-|   u=2 v=4 q=7 p=1
All source subs: ^--------!
```

All five complete in frame 9 and dispose their owned source participation. Changing or suppressing a Next does not change this source interval. By contrast, the F01 takeWhile contrast terminates at its first rejection; the F02 filter checks later inputs again.

## Same result payload, different notification existence

For one active SourceNext({}) and valid configurations:

| Profile/configuration | G |
|---|---|
| map returning undefined | [Next(undefined)] |
| filter returning false | [] |
| ignoreElements | [] |
| mapTo(undefined) | [Next(undefined)] |
| pluck('absent') | [Next(undefined)] |

No clock delay is hidden in []. It is an empty output word, not an empty-valued package. map and pluck still advance the stream through one value notification in the indicated cases.

## Property and construction boundaries

For pluck('a'), SourceNext({a:null}) produces Next(null). For pluck('a','b'), that same payload produces Next(undefined). A missing intermediate stops traversal; no later getter is read. A property-access throw yields Error and owned disposal, with no value at that event. These normal/error cases are tested separately from pluck(), which throws before subscription and has no stream trace.

## Cancellation lane

For the common schedule above, external unsubscription at frame 4 disconnects upstream after a and b. No Complete is sent by unsubscription:

```text
Source schedule: -a-b-c-d-|
Cancellation:    ----!
Source interval: ^---!
```

Each profile's values up to that boundary follow its own G. ignoreElements remains silent throughout yet still has the same owned source interval. The runtime suite includes never-ending sources with this cancellation boundary.

## Index and identity observations

A predicate tested on three equal values sees indexes 0,1,2 even if only index 1 is accepted. A second independent subscription starts again at 0. mapTo emits its exact captured object reference across both subscriptions; this is shared data identity, not a shared producer. Printed object contents in a trace cannot verify that identity; strict-reference assertions do.

Four separately labeled downstream-take checks observe cancellation during delivery. They are not executions of an atomic stable-state interpreter and do not add an early-completion policy to F02. Refer to [the family scope](../families/F02-value-selection.md).
