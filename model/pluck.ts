import { unreachable } from './value-shared.ts';
import type { Input, Reaction, Rule, Terminal } from './value-shared.ts';
export type State = Readonly<{ kind: 'Active' }> | Terminal;
export const S0: State = Object.freeze({ kind: 'Active' });
export type Keys = readonly [PropertyKey, ...PropertyKey[]];
export type Parameters = Readonly<{ properties: Keys }>;
export type RuleId = 'PL01' | 'PL02' | 'PL03' | 'PL04' | 'PL05' | 'PL06' | 'PL07';
/** Construction contract PL-C00: failure here is not an Observable Error letter. */
export function configure(...properties: PropertyKey[]): Parameters {
  if (!properties.length) throw new Error('list of properties cannot be empty.');
  return Object.freeze({ properties: Object.freeze(properties) as Keys });
}
/** Fixed string/number/symbol keys; deterministic, non-reentrant property reads may throw. */
export function evaluate<X>(s: State, z: Input<X>, p: Parameters): Reaction<State,unknown,RuleId> {
  if (s.kind !== 'Active') return { ruleId: 'PL07', T: s, G: [] };
  switch (z.kind) {
    case 'SourceNext': {
      try {
        let value: unknown = z.value;
        for (const key of p.properties) {
          // This type assertion does not change JS boxing, prototype lookup, or getter receiver.
          value = (value as Record<PropertyKey,unknown> | null | undefined)?.[key];
          if (value === undefined) return { ruleId: 'PL02', T: s, G: [{ kind: 'Next', value: undefined }] };
        }
        return { ruleId: 'PL01', T: s, G: [{ kind: 'Next', value }] };
      } catch (error: unknown) {
        return { ruleId: 'PL03', T: { kind: 'Errored' }, G: [{ kind: 'Error', error }, { kind: 'DisposeOwned' }] };
      }
    }
    case 'SourceComplete': return { ruleId: 'PL04', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceError': return { ruleId: 'PL05', T: { kind: 'Errored' }, G: [{ kind: 'Error', error: z.error }, { kind: 'DisposeOwned' }] };
    case 'Unsubscribe': return { ruleId: 'PL06', T: { kind: 'Cancelled' }, G: [{ kind: 'DisposeOwned' }] };
    default: return unreachable(z);
  }
}
export const rules = [
  {"id": "PL01", "state": "Active", "input": "SourceNext(x)", "guard": "every lookup defined; final y can be null", "T": "Active", "G": "[Next(y)]", "from": ["Active"], "to": "Active"},
  {"id": "PL02", "state": "Active", "input": "SourceNext(x)", "guard": "a lookup yields undefined (including nullish base)", "T": "Active", "G": "[Next(undefined)]", "from": ["Active"], "to": "Active"},
  {"id": "PL03", "state": "Active", "input": "SourceNext(x)", "guard": "a property read throws e", "T": "Errored", "G": "[Error(e), DisposeOwned]", "from": ["Active"], "to": "Errored"},
  {"id": "PL04", "state": "Active", "input": "SourceComplete", "guard": "active", "T": "Completed", "G": "[Complete, DisposeOwned]", "from": ["Active"], "to": "Completed"},
  {"id": "PL05", "state": "Active", "input": "SourceError(e)", "guard": "active", "T": "Errored", "G": "[Error(e), DisposeOwned]", "from": ["Active"], "to": "Errored"},
  {"id": "PL06", "state": "Active", "input": "Unsubscribe", "guard": "active", "T": "Cancelled", "G": "[DisposeOwned]", "from": ["Active"], "to": "Cancelled"},
  {"id": "PL07", "state": "terminal q", "input": "attempted ordinary input", "guard": "settled terminal scope", "T": "q", "G": "[]", "from": ["Completed", "Errored", "Cancelled"], "to": "same"},
] as const satisfies readonly Rule[];
