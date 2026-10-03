import { assertCount, isTerminal, unreachable } from './prefix-shared.ts';
import type { Input as OrdinaryInput, Reaction, Rule, Terminal } from './prefix-shared.ts';
export type State = Readonly<{ kind: 'NotStarted' }> | Readonly<{ kind: 'Active'; remaining: number }> | Terminal;
export type Input<X> = OrdinaryInput<X> | Readonly<{ kind: 'Start' }>;
export type Parameters = Readonly<{ count: number }>;
export type RuleId = 'TK00' | 'TK01' | 'TK02' | 'TK03' | 'TK04' | 'TK05' | 'TK06' | 'TK07';
export const S0: State = Object.freeze({ kind: 'NotStarted' });
/** Start is explicit to expose take(0)'s no-upstream-subscription behavior. */
export function evaluate<X>(s: State, z: Input<X>, p: Parameters): Reaction<State, X, RuleId> {
  assertCount(p.count);
  if (s.kind === 'NotStarted') {
    if (z.kind !== 'Start') throw new TypeError('take model requires Start before ordinary inputs');
    return p.count === 0
      ? { ruleId: 'TK00', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }] }
      : { ruleId: 'TK01', T: { kind: 'Active', remaining: p.count }, G: [{ kind: 'SubscribeSource' }] };
  }
  if (z.kind === 'Start') throw new TypeError('Start is admitted exactly once');
  if (isTerminal(s)) return { ruleId: 'TK07', T: s, G: [] };
  if (s.kind !== 'Active') throw new TypeError('Invalid take state');
  switch (z.kind) {
    case 'SourceNext': return s.remaining > 1
      ? { ruleId: 'TK02', T: { kind: 'Active', remaining: s.remaining - 1 }, G: [{ kind: 'Next', value: z.value }] }
      : { ruleId: 'TK03', T: { kind: 'Completed' }, G: [{ kind: 'Next', value: z.value }, { kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceComplete': return { ruleId: 'TK04', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceError': return { ruleId: 'TK05', T: { kind: 'Errored' }, G: [{ kind: 'Error', error: z.error }, { kind: 'DisposeOwned' }] };
    case 'Unsubscribe': return { ruleId: 'TK06', T: { kind: 'Cancelled' }, G: [{ kind: 'DisposeOwned' }] };
    default: return unreachable(z);
  }
}
export const rules = [
  { id: 'TK00', state: 'NotStarted', input: 'Start', guard: 'count = 0', T: 'Completed', G: '[Complete]', from: ['NotStarted'], to: 'Completed' },
  { id: 'TK01', state: 'NotStarted', input: 'Start', guard: 'count > 0', T: 'Active(count)', G: '[SubscribeSource]', from: ['NotStarted'], to: 'Active' },
  { id: 'TK02', state: 'Active(r)', input: 'SourceNext(x)', guard: 'r > 1', T: 'Active(r-1)', G: '[Next(x)]', from: ['Active'], to: 'Active' },
  { id: 'TK03', state: 'Active(r)', input: 'SourceNext(x)', guard: 'r = 1', T: 'Completed', G: '[Next(x), Complete, DisposeOwned]', from: ['Active'], to: 'Completed' },
  { id: 'TK04', state: 'Active(r)', input: 'SourceComplete', guard: 'active', T: 'Completed', G: '[Complete, DisposeOwned]', from: ['Active'], to: 'Completed' },
  { id: 'TK05', state: 'Active(r)', input: 'SourceError(e)', guard: 'active', T: 'Errored', G: '[Error(e), DisposeOwned]', from: ['Active'], to: 'Errored' },
  { id: 'TK06', state: 'Active(r)', input: 'Unsubscribe', guard: 'active', T: 'Cancelled', G: '[DisposeOwned]', from: ['Active'], to: 'Cancelled' },
  { id: 'TK07', state: 'terminal q', input: 'attempted ordinary input', guard: 'settled terminal scope', T: 'q', G: '[]', from: ['Completed', 'Errored', 'Cancelled'], to: 'same' },
] as const satisfies readonly Rule[];
