# Foundation: the Mealy six-tuple semantic microscope

**Canonical language:** $S,S_0,Z,A,T,G$. **Baseline:** RxJS 7.8.2.

The aim is to explain what flows, what a new input changes, and which output policy is required before presenting implementation code. A model describes a selected execution scope, not an operator name in isolation.

## The semantic formulation

$$
\mathcal M_\theta=(S,S_0,Z,A,T_\theta,G_\theta),\qquad S_0\in S.
$$

$$
T_\theta:S\times Z\to S,\qquad G_\theta:S\times Z\to A^*.
$$

Fix an overload and configuration $\theta$. A reaction to $z\in Z$ while in $s\in S$ has resulting state $T_\theta(s,z)$ and output word $G_\theta(s,z)$. Write $T,G$ when the fixed configuration is clear.

This extends the [classical Mealy formulation](https://www.dlsi.ua.es/~mlf/nnafmc/pbook/node13.html): classical sets are finite and output is one symbol per input; our domains may be infinite and our output function returns finite words. We retain Mealy's dependence on both current state and arriving input. It is a modeling choice, not a claim that Moore-style encodings are impossible or less computationally expressive.

## 1. State space — S

$S$ is a set of possible states. A current state $s$ and a next state $s'$ are **members of the same set**, not different state spaces.

An execution can remember a counter, accumulator, queue, optional latest value, input-readiness mask, active inner identities, resources, or shared participants. Distinguish processing memory, outcome/status, and resource bookkeeping. These may be components of $S$; they are not replacements for the six tuple components.

| Requirement | Suitable representation |
|---|---|
| Memoryless value-processing core | A singleton $\{\star\}$, never the empty set |
| Optional payload | Tagged `None` or `Some(value)`; not a valid payload used as a sentinel |
| Ordered buffer | Finite sequence $X^*$, preserving duplicates |
| Multiple latest-value slots | A product of tagged optional payload spaces |
| Live inner subscriptions | Identified records with ownership and eligibility |
| Exact nested execution | Processing phases, suspended frames, and intermediate resource state |

State spaces can be infinite. A diagram with a few named control nodes may project away unbounded counters, payloads, or queues. Do not call that projection an enumeration of all concrete states.

An indexed `map` or `filter` model remembers an index even if its value-only processing core is memoryless; their implementations show these counters ([map](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/map.ts), [filter](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/filter.ts)). State ownership and observation level must qualify the word stateless.

## 2. Initial state — S0

$S_0$ is one state in $S$. It is not a subset or an output. A stored seed does not imply an initial emission; see [scan](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/scan.ts).

Choose one activation convention in the execution contract. A separate initializer establishes $S_0$ and interprets any declared setup outputs before ordinary inputs. Alternatively, include a `Start` input, choose a not-started $S_0$, and specify its first transition. Do not silently use both conventions or make an ordinary event do undocumented initialization.

An Observable description does not, by itself, start its subscribed dataflow. Subscription can start independent work or join an already-existing producer. It does not necessarily start that producer. Fresh bookkeeping also does not deep-clone captured seed objects ([Observable](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Observable.ts), [share](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/share.ts)).

## 3. Input alphabet — Z

$Z$ is the set of tagged events admitted by the profile. For example:

```text
SourceNext(sourceId, value)       SourceComplete(sourceId)
SourceError(sourceId, error)     Unsubscribe(participantId)
InnerNext(innerId, value)        InnerComplete(innerId)
InnerError(innerId, error)       TimerFired(timerId)
NotifierNext(notifierId, value)  Start
```

Declare only the categories actually needed. Identities distinguish source ports, notifier roles, inner instances, timer generations, and participants. Equal payloads do not make different input roles interchangeable.

`Unsubscribe` is a lifecycle input, not a fourth Observable notification. For fine-grained execution, callback-return/failure and operation-resumption events may also be needed.

An alphabet is not an arrival schedule. Timed records may have the shape $(t,k,z)$: source/scheduler time $t$, processing position $k$, and input $z$. Equal timestamps need an execution-order rule. A callback index $i$ is a separate counter. Reserve uppercase $T$ for the Transition function, not a clock domain.

## 4. Output alphabet — A

$A$ contains individual **output letters**. In a notification-only profile these may be `Next(value)`, `Complete`, and `Error(error)`. A control-aware profile may also declare `SubscribeInner`, `CancelInner`, `Schedule`, `CancelTimer`, or `DisposeOwned`.

Control letters are model instructions. They are not additional Observable notification types or literal RxJS APIs. Give each letter a precise interpretation and destination.

$$
A^*=\bigcup_{n\geq0} A^n.
$$

The empty word is $\varepsilon=[]$. The word `[Next(x), Complete]` contains two ordered letters. `[Next(x), Next(x)]` contains two emissions. `[]` and `[Next([])]` are different. An infinite execution can be made of finite reactions; it must not be hidden inside a single infinite output word.

Output words may be interrupted during execution. Requested letters and actually delivered notifications coincide only under the declared execution assumptions.

## 5. Transition function — T

$$
s'=T(s,z).
$$

$T$ determines the resulting state. It does not by itself deliver an output or specify when intermediate writes become visible. A finite guarded table can describe infinitely many concrete states with symbolic rows such as `Active(i)`.

Either define every pair in $S\times Z$, or declare an admissible domain $D\subseteq S\times Z$ and use $T:D\to S$. Use the same domain for $G$. Guards must be nonoverlapping and exhaustive on that domain, or have an explicit priority policy.

An omitted row is unspecified, not automatically a no-op. An invalid event and a deliberately suppressed event are different cases.

## 6. Output function — G

$$
\alpha=G(s,z).
$$

$G$ uses the same **pre-input state** as $T$, even when the output payload is a newly computed accumulator. For a pure accumulator $f$, let $b=f(a,x)$ once; $T(a,\operatorname{SourceNext}(x))=b$ and $G(a,\operatorname{SourceNext}(x))=[\operatorname{Next}(b)]$ are compatible definitions.

Separating these mathematical functions does not authorize two executions of $f$. The reference scaffold returns fields named `T` and `G` from one evaluation. When a callback may throw, be reentrant, read external state, or not terminate, model those outcomes or exclude them explicitly. A signature alone does not make an impure callback deterministic.

## Traces and boundaries

For stable non-reentrant reactions, use:

$$
s_0=S_0,\qquad s_{k+1}=T(s_k,z_k),\qquad \alpha_k=G(s_k,z_k).
$$

Concatenating the words gives the model-predicted output word for that input trace under this convention. This recurrence alone does not define synchronous nested execution, physical clock time, or resource ownership. Those belong in the [execution contract](EXECUTION-CONTRACT.md).

Keep `Completed`, `Errored`, and `Cancelled` distinguishable when outcome matters. An absorbing state applies to a settled downstream execution in a declared scope. A shared coordinator may later reset and serve a new generation; cleanup can continue after a terminal notification. Do not impose a universal absorbing state on the whole system.

## Keep the tuple at six components

Operator parameters, validity predicates, trace laws, observation scope, evidence, and the execution contract accompany the tuple as a **specification profile**. They do not change the six component names or quietly replace $G$ with an interpreter.

A profile is complete only relative to its stated domain and observation level. An attractive table, diagram, or passing finite test suite does not establish equivalence for every RxJS overload or execution.
