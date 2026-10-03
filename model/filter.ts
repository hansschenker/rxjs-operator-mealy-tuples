import { unreachable } from './value-shared.ts';
import type { Input, Reaction, Rule, Terminal } from './value-shared.ts';
export type State = Readonly<{ kind: 'Active'; index: number }> | Terminal;
export const S0: State = Object.freeze({ kind: 'Active', index: 0 });
export type Parameters<X> = Readonly<{ predicate: (value: X, index: number) => boolean }>;
export type RuleId = 'FL01' | 'FL02' | 'FL03' | 'FL04' | 'FL05' | 'FL06' | 'FL07';
/** Rejection still advances the index; callbacks are evaluated once, never once per function. */
export function evaluate<X>(s: State, z: Input<X>, p: Parameters<X>): Reaction<State,X,RuleId> {
  if (s.kind !== 'Active') return { ruleId: 'FL07', T: s, G: [] };
  switch (z.kind) {
    case 'SourceNext': {
      const { predicate } = p;
      try {
        const passes = predicate(z.value,s.index);
        return { ruleId: passes ? 'FL01' : 'FL02', T: { kind: 'Active', index: s.index+1 }, G: passes ? [{ kind: 'Next', value: z.value }] : [] };
      } catch (error: unknown) {
        return { ruleId: 'FL03', T: { kind: 'Errored' }, G: [{ kind: 'Error', error }, { kind: 'DisposeOwned' }] };
      }
    }
    case 'SourceComplete': return { ruleId: 'FL04', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceError': return { ruleId: 'FL05', T: { kind: 'Errored' }, G: [{ kind: 'Error', error: z.error }, { kind: 'DisposeOwned' }] };
    case 'Unsubscribe': return { ruleId: 'FL06', T: { kind: 'Cancelled' }, G: [{ kind: 'DisposeOwned' }] };
    default: return unreachable(z);
  }
}
export const rules = [
  {"id": "FL01", "state": "Active(i)", "input": "SourceNext(x)", "guard": "predicate(x,i) returns true", "T": "Active(i+1)", "G": "[Next(x)]", "from": ["Active"], "to": "Active"},
  {"id": "FL02", "state": "Active(i)", "input": "SourceNext(x)", "guard": "predicate(x,i) returns false", "T": "Active(i+1)", "G": "[]", "from": ["Active"], "to": "Active"},
  {"id": "FL03", "state": "Active(i)", "input": "SourceNext(x)", "guard": "predicate(x,i) throws e", "T": "Errored", "G": "[Error(e), DisposeOwned]", "from": ["Active"], "to": "Errored"},
  {"id": "FL04", "state": "Active(i)", "input": "SourceComplete", "guard": "active", "T": "Completed", "G": "[Complete, DisposeOwned]", "from": ["Active"], "to": "Completed"},
  {"id": "FL05", "state": "Active(i)", "input": "SourceError(e)", "guard": "active", "T": "Errored", "G": "[Error(e), DisposeOwned]", "from": ["Active"], "to": "Errored"},
  {"id": "FL06", "state": "Active(i)", "input": "Unsubscribe", "guard": "active", "T": "Cancelled", "G": "[DisposeOwned]", "from": ["Active"], "to": "Cancelled"},
  {"id": "FL07", "state": "terminal q", "input": "attempted ordinary input", "guard": "settled terminal scope", "T": "q", "G": "[]", "from": ["Completed", "Errored", "Cancelled"], "to": "same"},
] as const satisfies readonly Rule[];
