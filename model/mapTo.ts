import { unreachable } from './value-shared.ts';
import type { Input, Reaction, Rule, Terminal } from './value-shared.ts';
export type State = Readonly<{ kind: 'Active' }> | Terminal;
export const S0: State = Object.freeze({ kind: 'Active' });
export type Parameters<Y> = Readonly<{ value: Y }>;
export type RuleId = 'MT01' | 'MT02' | 'MT03' | 'MT04' | 'MT05';
/** map's hidden index is projected away: the fixed result never observes it. */
export function evaluate<X,Y>(s: State, z: Input<X>, p: Parameters<Y>): Reaction<State,Y,RuleId> {
  if (s.kind !== 'Active') return { ruleId: 'MT05', T: s, G: [] };
  switch (z.kind) {
    case 'SourceNext': return { ruleId: 'MT01', T: s, G: [{ kind: 'Next', value: p.value }] };
    case 'SourceComplete': return { ruleId: 'MT02', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceError': return { ruleId: 'MT03', T: { kind: 'Errored' }, G: [{ kind: 'Error', error: z.error }, { kind: 'DisposeOwned' }] };
    case 'Unsubscribe': return { ruleId: 'MT04', T: { kind: 'Cancelled' }, G: [{ kind: 'DisposeOwned' }] };
    default: return unreachable(z);
  }
}
export const rules = [
  {"id": "MT01", "state": "Active", "input": "SourceNext(x)", "guard": "fixed configured value c", "T": "Active", "G": "[Next(c)]", "from": ["Active"], "to": "Active"},
  {"id": "MT02", "state": "Active", "input": "SourceComplete", "guard": "active", "T": "Completed", "G": "[Complete, DisposeOwned]", "from": ["Active"], "to": "Completed"},
  {"id": "MT03", "state": "Active", "input": "SourceError(e)", "guard": "active", "T": "Errored", "G": "[Error(e), DisposeOwned]", "from": ["Active"], "to": "Errored"},
  {"id": "MT04", "state": "Active", "input": "Unsubscribe", "guard": "active", "T": "Cancelled", "G": "[DisposeOwned]", "from": ["Active"], "to": "Cancelled"},
  {"id": "MT05", "state": "terminal q", "input": "attempted ordinary input", "guard": "settled terminal scope", "T": "q", "G": "[]", "from": ["Completed", "Errored", "Cancelled"], "to": "same"},
] as const satisfies readonly Rule[];
