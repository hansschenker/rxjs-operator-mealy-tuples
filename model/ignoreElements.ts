import { unreachable } from './value-shared.ts';
import type { Input, Reaction, Rule, Terminal } from './value-shared.ts';
export type State = Readonly<{ kind: 'Active' }> | Terminal;
export const S0: State = Object.freeze({ kind: 'Active' });
export type RuleId = 'IG01' | 'IG02' | 'IG03' | 'IG04' | 'IG05';
/** No domain callback, no payload reads, and no next letters in this profile. */
export function evaluate<X>(s: State, z: Input<X>): Reaction<State,never,RuleId> {
  if (s.kind !== 'Active') return { ruleId: 'IG05', T: s, G: [] };
  switch (z.kind) {
    case 'SourceNext': return { ruleId: 'IG01', T: s, G: [] };
    case 'SourceComplete': return { ruleId: 'IG02', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceError': return { ruleId: 'IG03', T: { kind: 'Errored' }, G: [{ kind: 'Error', error: z.error }, { kind: 'DisposeOwned' }] };
    case 'Unsubscribe': return { ruleId: 'IG04', T: { kind: 'Cancelled' }, G: [{ kind: 'DisposeOwned' }] };
    default: return unreachable(z);
  }
}
export const rules = [
  {"id": "IG01", "state": "Active", "input": "SourceNext(x)", "guard": "active", "T": "Active", "G": "[]", "from": ["Active"], "to": "Active"},
  {"id": "IG02", "state": "Active", "input": "SourceComplete", "guard": "active", "T": "Completed", "G": "[Complete, DisposeOwned]", "from": ["Active"], "to": "Completed"},
  {"id": "IG03", "state": "Active", "input": "SourceError(e)", "guard": "active", "T": "Errored", "G": "[Error(e), DisposeOwned]", "from": ["Active"], "to": "Errored"},
  {"id": "IG04", "state": "Active", "input": "Unsubscribe", "guard": "active", "T": "Cancelled", "G": "[DisposeOwned]", "from": ["Active"], "to": "Cancelled"},
  {"id": "IG05", "state": "terminal q", "input": "attempted ordinary input", "guard": "settled terminal scope", "T": "q", "G": "[]", "from": ["Completed", "Errored", "Cancelled"], "to": "same"},
] as const satisfies readonly Rule[];
