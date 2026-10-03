import { unreachable } from './value-shared.ts';
import type { Input, Reaction, Rule, Terminal } from './value-shared.ts';
export type State = Readonly<{ kind: 'Active'; index: number }> | Terminal;
export const S0: State = Object.freeze({ kind: 'Active', index: 0 });
export type Parameters<X,Y> = Readonly<{ project: (value: X, index: number) => Y }>;
export type RuleId = 'MP01' | 'MP02' | 'MP03' | 'MP04' | 'MP05' | 'MP06';
/** One evaluation supplies T and G. The main profile excludes thisArg/reentrancy. */
export function evaluate<X,Y>(s: State, z: Input<X>, p: Parameters<X,Y>): Reaction<State,Y,RuleId> {
  if (s.kind !== 'Active') return { ruleId: 'MP06', T: s, G: [] };
  switch (z.kind) {
    case 'SourceNext': {
      const { project } = p;
      try {
        const value = project(z.value, s.index);
        return { ruleId: 'MP01', T: { kind: 'Active', index: s.index+1 }, G: [{ kind: 'Next', value }] };
      } catch (error: unknown) {
        return { ruleId: 'MP02', T: { kind: 'Errored' }, G: [{ kind: 'Error', error }, { kind: 'DisposeOwned' }] };
      }
    }
    case 'SourceComplete': return { ruleId: 'MP03', T: { kind: 'Completed' }, G: [{ kind: 'Complete' }, { kind: 'DisposeOwned' }] };
    case 'SourceError': return { ruleId: 'MP04', T: { kind: 'Errored' }, G: [{ kind: 'Error', error: z.error }, { kind: 'DisposeOwned' }] };
    case 'Unsubscribe': return { ruleId: 'MP05', T: { kind: 'Cancelled' }, G: [{ kind: 'DisposeOwned' }] };
    default: return unreachable(z);
  }
}
export const rules = [
  {"id": "MP01", "state": "Active(i)", "input": "SourceNext(x)", "guard": "project(x,i) returns y", "T": "Active(i+1)", "G": "[Next(y)]", "from": ["Active"], "to": "Active"},
  {"id": "MP02", "state": "Active(i)", "input": "SourceNext(x)", "guard": "project(x,i) throws e", "T": "Errored", "G": "[Error(e), DisposeOwned]", "from": ["Active"], "to": "Errored"},
  {"id": "MP03", "state": "Active(i)", "input": "SourceComplete", "guard": "active", "T": "Completed", "G": "[Complete, DisposeOwned]", "from": ["Active"], "to": "Completed"},
  {"id": "MP04", "state": "Active(i)", "input": "SourceError(e)", "guard": "active", "T": "Errored", "G": "[Error(e), DisposeOwned]", "from": ["Active"], "to": "Errored"},
  {"id": "MP05", "state": "Active(i)", "input": "Unsubscribe", "guard": "active", "T": "Cancelled", "G": "[DisposeOwned]", "from": ["Active"], "to": "Cancelled"},
  {"id": "MP06", "state": "terminal q", "input": "attempted ordinary input", "guard": "settled terminal scope", "T": "q", "G": "[]", "from": ["Completed", "Errored", "Cancelled"], "to": "same"},
] as const satisfies readonly Rule[];
