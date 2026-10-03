import { assertCount, unreachable } from './prefix-shared.ts';
import type { Input, Reaction, Rule, Terminal } from './prefix-shared.ts';
export type State = Readonly<{ kind: 'Active'; index: number }> | Terminal;
export type Parameters = Readonly<{ count: number }>;
export type RuleId = 'SK01' | 'SK02' | 'SK03' | 'SK04' | 'SK05' | 'SK06';
export const S0: State = Object.freeze({ kind: 'Active', index: 0 });
/** The index counts all eligible source next inputs, not just emitted values. */
export function evaluate<X>(s: State, z: Input<X>, p: Parameters): Reaction<State, X, RuleId> {
  assertCount(p.count);
  if (s.kind !== 'Active') return { ruleId: 'SK06', T: s, G: [] };
  switch (z.kind) {
    case 'SourceNext': return {
      ruleId: s.index < p.count ? 'SK01' : 'SK02',
      T: { kind: 'Active', index: s.index + 1 },
      G: s.index < p.count ? [] : [{ kind: 'Next', value: z.value }],
    };
    case 'SourceComplete': return { ruleId: 'SK03', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceError': return { ruleId: 'SK04', T: { kind: 'Errored' }, G: [{ kind: 'Error', error: z.error }, { kind: 'DisposeOwned' }] };
    case 'Unsubscribe': return { ruleId: 'SK05', T: { kind: 'Cancelled' }, G: [{ kind: 'DisposeOwned' }] };
    default: return unreachable(z);
  }
}
export const rules = [
  { id: 'SK01', state: 'Active(i)', input: 'SourceNext(x)', guard: 'i < count', T: 'Active(i+1)', G: '[]', from: ['Active'], to: 'Active' },
  { id: 'SK02', state: 'Active(i)', input: 'SourceNext(x)', guard: 'i >= count', T: 'Active(i+1)', G: '[Next(x)]', from: ['Active'], to: 'Active' },
  { id: 'SK03', state: 'Active(i)', input: 'SourceComplete', guard: 'active', T: 'Completed', G: '[Complete, DisposeOwned]', from: ['Active'], to: 'Completed' },
  { id: 'SK04', state: 'Active(i)', input: 'SourceError(e)', guard: 'active', T: 'Errored', G: '[Error(e), DisposeOwned]', from: ['Active'], to: 'Errored' },
  { id: 'SK05', state: 'Active(i)', input: 'Unsubscribe', guard: 'active', T: 'Cancelled', G: '[DisposeOwned]', from: ['Active'], to: 'Cancelled' },
  { id: 'SK06', state: 'terminal q', input: 'attempted ordinary input', guard: 'settled terminal scope', T: 'q', G: '[]', from: ['Completed', 'Errored', 'Cancelled'], to: 'same' },
] as const satisfies readonly Rule[];
