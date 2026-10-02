/**
 * Reference model, not an RxJS operator implementation.
 * Scope: one subscription, Boolean predicate, stable non-reentrant reactions,
 * no consumer-handler or teardown exceptions. See operators/takeWhile.md.
 */
export type State =
  | Readonly<{ kind: 'Active'; index: number }>
  | Readonly<{ kind: 'Completed' }>
  | Readonly<{ kind: 'Errored' }>
  | Readonly<{ kind: 'Cancelled' }>;

export type Input<X> =
  | Readonly<{ kind: 'SourceNext'; value: X }>
  | Readonly<{ kind: 'SourceComplete' }>
  | Readonly<{ kind: 'SourceError'; error: unknown }>
  | Readonly<{ kind: 'Unsubscribe' }>;

export type Output<X> =
  | Readonly<{ kind: 'Next'; value: X }>
  | Readonly<{ kind: 'Complete' }>
  | Readonly<{ kind: 'Error'; error: unknown }>
  | Readonly<{ kind: 'DisposeOwned' }>;

export type Parameters<X> = Readonly<{
  predicate: (value: X, index: number) => boolean;
  inclusive: boolean;
}>;

export type RuleId = 'TW01' | 'TW02' | 'TW03' | 'TW04' | 'TW05' | 'TW06' | 'TW07' | 'TW08';

export type Reaction<X> = Readonly<{
  ruleId: RuleId;
  /** T(s,z): the resulting stable state, not a pre-delivery state write. */
  T: State;
  /** G(s,z): a finite ordered word over the declared output alphabet. */
  G: readonly Output<X>[];
}>;

export const S0: State = Object.freeze({ kind: 'Active', index: 0 });

function unreachable(value: never): never {
  throw new TypeError(`Unrecognized input: ${JSON.stringify(value)}`);
}

/** Evaluate one reaction once; do not call a domain predicate separately for T and G. */
export function evaluate<X>(s: State, z: Input<X>, parameters: Parameters<X>): Reaction<X> {
  if (s.kind !== 'Active') {
    return { ruleId: 'TW08', T: s, G: [] };
  }
  switch (z.kind) {
    case 'SourceNext': {
      let passes: boolean;
      try {
        passes = parameters.predicate(z.value, s.index);
      } catch (error: unknown) {
        return {
          ruleId: 'TW07', T: { kind: 'Errored' },
          G: [{ kind: 'Error', error }, { kind: 'DisposeOwned' }],
        };
      }
      if (passes) {
        return {
          ruleId: 'TW01', T: { kind: 'Active', index: s.index + 1 },
          G: [{ kind: 'Next', value: z.value }],
        };
      }
      return {
        ruleId: parameters.inclusive ? 'TW03' : 'TW02', T: { kind: 'Completed' },
        G: parameters.inclusive
          ? [{ kind: 'Next', value: z.value }, { kind: 'Complete' }, { kind: 'DisposeOwned' }]
          : [{ kind: 'Complete' }, { kind: 'DisposeOwned' }],
      };
    }
    case 'SourceComplete':
      return { ruleId: 'TW04', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceError':
      return { ruleId: 'TW05', T: { kind: 'Errored' }, G: [{ kind: 'Error', error: z.error }, { kind: 'DisposeOwned' }] };
    case 'Unsubscribe':
      return { ruleId: 'TW06', T: { kind: 'Cancelled' }, G: [{ kind: 'DisposeOwned' }] };
    default:
      return unreachable(z);
  }
}

/** Reviewed symbolic descriptors: text for rendering, not a general-purpose rule DSL. */
export const rules = [
  { id: 'TW01', state: 'Active(i)', input: 'SourceNext(x)', guard: 'predicate(x,i) returns true', T: 'Active(i+1)', G: '[Next(x)]', from: 'Active', to: 'Active' },
  { id: 'TW02', state: 'Active(i)', input: 'SourceNext(x)', guard: 'predicate returns false; inclusive=false', T: 'Completed', G: '[Complete, DisposeOwned]', from: 'Active', to: 'Completed' },
  { id: 'TW03', state: 'Active(i)', input: 'SourceNext(x)', guard: 'predicate returns false; inclusive=true', T: 'Completed', G: '[Next(x), Complete, DisposeOwned]', from: 'Active', to: 'Completed' },
  { id: 'TW04', state: 'Active(i)', input: 'SourceComplete', guard: 'always', T: 'Completed', G: '[Complete, DisposeOwned]', from: 'Active', to: 'Completed' },
  { id: 'TW05', state: 'Active(i)', input: 'SourceError(error)', guard: 'always', T: 'Errored', G: '[Error(error), DisposeOwned]', from: 'Active', to: 'Errored' },
  { id: 'TW06', state: 'Active(i)', input: 'Unsubscribe', guard: 'always', T: 'Cancelled', G: '[DisposeOwned]', from: 'Active', to: 'Cancelled' },
  { id: 'TW07', state: 'Active(i)', input: 'SourceNext(x)', guard: 'predicate throws error', T: 'Errored', G: '[Error(error), DisposeOwned]', from: 'Active', to: 'Errored' },
  { id: 'TW08', state: 'q in {Completed, Errored, Cancelled}', input: 'any attempted input z', guard: 'settled terminal scope', T: 'q', G: '[]', from: 'Terminal', to: 'Terminal' },
] as const;
