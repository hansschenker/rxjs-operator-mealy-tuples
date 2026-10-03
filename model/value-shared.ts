/** F02 vocabulary only; no Observable runtime or generic operator interpreter. */
import type { Output as PrefixOutput } from './prefix-shared.ts';
export type { Input, Terminal, Rule } from './prefix-shared.ts';
export { unreachable } from './prefix-shared.ts';
export type Output<Y> = Exclude<PrefixOutput<Y>, Readonly<{ kind: 'SubscribeSource' }>>;
export type Reaction<S, Y, ID extends string> = Readonly<{
  ruleId: ID; T: S; G: readonly Output<Y>[];
}>;
