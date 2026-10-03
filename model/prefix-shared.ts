/** Shared vocabulary for F01 reference models, not a replacement Observable runtime. */
export type Terminal = Readonly<{ kind: 'Completed' | 'Errored' | 'Cancelled' }>;
export type Input<X> =
  | Readonly<{ kind: 'SourceNext'; value: X }>
  | Readonly<{ kind: 'SourceComplete' }>
  | Readonly<{ kind: 'SourceError'; error: unknown }>
  | Readonly<{ kind: 'Unsubscribe' }>;
export type Output<X> =
  | Readonly<{ kind: 'Next'; value: X }>
  | Readonly<{ kind: 'Complete' }>
  | Readonly<{ kind: 'Error'; error: unknown }>
  | Readonly<{ kind: 'DisposeOwned' }>
  | Readonly<{ kind: 'SubscribeSource' }>;
export type Reaction<S, X, ID extends string> = Readonly<{
  ruleId: ID; T: S; G: readonly Output<X>[];
}>;
export type Rule = Readonly<{
  id: string; state: string; input: string; guard: string; T: string; G: string;
  from: readonly string[]; to: string;
}>;
export function isTerminal(s: { readonly kind: string }): boolean {
  return s.kind === 'Completed' || s.kind === 'Errored' || s.kind === 'Cancelled';
}
/** Profile-domain validation, NOT a claim that RxJS rejects other numeric arguments. */
export function assertCount(count: number): void {
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new RangeError('F01 count profile requires a nonnegative safe integer');
  }
}
export function unreachable(value: never): never {
  throw new TypeError(`Unrecognized model input: ${JSON.stringify(value)}`);
}
