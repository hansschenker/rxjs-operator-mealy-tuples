import { unreachable } from './prefix-shared.ts';
import type { Input, Reaction, Rule, Terminal } from './prefix-shared.ts';
export type State = Readonly<{ kind: 'Skipping'; index: number }> | Readonly<{ kind: 'Forwarding' }> | Terminal;
export type Parameters<X> = Readonly<{ predicate: (value: X, index: number) => boolean }>;
export type RuleId = 'SW01' | 'SW02' | 'SW03' | 'SW04' | 'SW05' | 'SW06' | 'SW07' | 'SW08';
export const S0: State = Object.freeze({ kind: 'Skipping', index: 0 });
/** Stable non-reentrant reactions. Forwarding deliberately never calls the predicate. */
export function evaluate<X>(s: State, z: Input<X>, p: Parameters<X>): Reaction<State, X, RuleId> {
  if (s.kind !== 'Skipping' && s.kind !== 'Forwarding') return { ruleId: 'SW08', T: s, G: [] };
  switch (z.kind) {
    case 'SourceNext': {
      if (s.kind === 'Forwarding') return { ruleId: 'SW03', T: s, G: [{ kind: 'Next', value: z.value }] };
      let skip: boolean;
      try { skip = p.predicate(z.value, s.index); }
      catch (error: unknown) {
        return { ruleId: 'SW07', T: { kind: 'Errored' }, G: [{ kind: 'Error', error }, { kind: 'DisposeOwned' }] };
      }
      return skip
        ? { ruleId: 'SW01', T: { kind: 'Skipping', index: s.index + 1 }, G: [] }
        : { ruleId: 'SW02', T: { kind: 'Forwarding' }, G: [{ kind: 'Next', value: z.value }] };
    }
    case 'SourceComplete': return { ruleId: 'SW04', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceError': return { ruleId: 'SW05', T: { kind: 'Errored' }, G: [{ kind: 'Error', error: z.error }, { kind: 'DisposeOwned' }] };
    case 'Unsubscribe': return { ruleId: 'SW06', T: { kind: 'Cancelled' }, G: [{ kind: 'DisposeOwned' }] };
    default: return unreachable(z);
  }
}
export const rules = [
  { id: 'SW01', state: 'Skipping(i)', input: 'SourceNext(x)', guard: 'predicate(x,i) returns true', T: 'Skipping(i+1)', G: '[]', from: ['Skipping'], to: 'Skipping' },
  { id: 'SW02', state: 'Skipping(i)', input: 'SourceNext(x)', guard: 'predicate(x,i) returns false', T: 'Forwarding', G: '[Next(x)]', from: ['Skipping'], to: 'Forwarding' },
  { id: 'SW03', state: 'Forwarding', input: 'SourceNext(x)', guard: 'no predicate call', T: 'Forwarding', G: '[Next(x)]', from: ['Forwarding'], to: 'Forwarding' },
  { id: 'SW04', state: 'Skipping(i) or Forwarding', input: 'SourceComplete', guard: 'active', T: 'Completed', G: '[Complete, DisposeOwned]', from: ['Skipping', 'Forwarding'], to: 'Completed' },
  { id: 'SW05', state: 'Skipping(i) or Forwarding', input: 'SourceError(e)', guard: 'active', T: 'Errored', G: '[Error(e), DisposeOwned]', from: ['Skipping', 'Forwarding'], to: 'Errored' },
  { id: 'SW06', state: 'Skipping(i) or Forwarding', input: 'Unsubscribe', guard: 'active', T: 'Cancelled', G: '[DisposeOwned]', from: ['Skipping', 'Forwarding'], to: 'Cancelled' },
  { id: 'SW07', state: 'Skipping(i)', input: 'SourceNext(x)', guard: 'predicate throws e', T: 'Errored', G: '[Error(e), DisposeOwned]', from: ['Skipping'], to: 'Errored' },
  { id: 'SW08', state: 'terminal q', input: 'attempted ordinary input', guard: 'settled terminal scope', T: 'q', G: '[]', from: ['Completed', 'Errored', 'Cancelled'], to: 'same' },
] as const satisfies readonly Rule[];
