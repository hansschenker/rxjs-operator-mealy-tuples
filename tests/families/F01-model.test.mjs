import test from 'node:test';
import assert from 'node:assert/strict';
import * as sw from '../../model/skipWhile.ts';
import * as tk from '../../model/take.ts';
import * as sk from '../../model/skip.ts';
function belowFive(x) { return x < 5; }
function throwError() { throw 'predicate-error'; }
const N = value => ({ kind: 'Next', value });
const C = { kind: 'Complete' }, D = { kind: 'DisposeOwned' };
const X = value => ({ kind: 'SourceNext', value });
const start = { kind: 'Start' };
const cases = [
  [sw, 'SW01', sw.S0, X(2), { predicate: belowFive }, { kind: 'Skipping', index: 1 }, []],
  [sw, 'SW02', { kind: 'Skipping', index: 2 }, X(7), { predicate: belowFive }, { kind: 'Forwarding' }, [N(7)]],
  [sw, 'SW03', { kind: 'Forwarding' }, X(1), { predicate: throwError }, { kind: 'Forwarding' }, [N(1)]],
  ...['Skipping', 'Forwarding'].flatMap(kind => {
    const s = kind === 'Skipping' ? { kind, index: 3 } : { kind };
    return [
      [sw, 'SW04', s, { kind: 'SourceComplete' }, { predicate: throwError }, { kind: 'Completed' }, [C, D]],
      [sw, 'SW05', s, { kind: 'SourceError', error: 'err' }, { predicate: throwError }, { kind: 'Errored' }, [{ kind: 'Error', error: 'err' }, D]],
      [sw, 'SW06', s, { kind: 'Unsubscribe' }, { predicate: throwError }, { kind: 'Cancelled' }, [D]],
    ];
  }),
  [sw, 'SW07', sw.S0, X(2), { predicate: throwError }, { kind: 'Errored' }, [{ kind: 'Error', error: 'predicate-error' }, D]],
  [tk, 'TK00', tk.S0, start, { count: 0 }, { kind: 'Completed' }, [C]],
  [tk, 'TK01', tk.S0, start, { count: 2 }, { kind: 'Active', remaining: 2 }, [{ kind: 'SubscribeSource' }]],
  [tk, 'TK02', { kind: 'Active', remaining: 2 }, X(2), { count: 2 }, { kind: 'Active', remaining: 1 }, [N(2)]],
  [tk, 'TK03', { kind: 'Active', remaining: 1 }, X(4), { count: 2 }, { kind: 'Completed' }, [N(4), C, D]],
  [tk, 'TK04', { kind: 'Active', remaining: 1 }, { kind: 'SourceComplete' }, { count: 2 }, { kind: 'Completed' }, [C, D]],
  [tk, 'TK05', { kind: 'Active', remaining: 1 }, { kind: 'SourceError', error: 'err' }, { count: 2 }, { kind: 'Errored' }, [{ kind: 'Error', error: 'err' }, D]],
  [tk, 'TK06', { kind: 'Active', remaining: 1 }, { kind: 'Unsubscribe' }, { count: 2 }, { kind: 'Cancelled' }, [D]],
  [sk, 'SK01', { kind: 'Active', index: 1 }, X(4), { count: 2 }, { kind: 'Active', index: 2 }, []],
  [sk, 'SK02', { kind: 'Active', index: 2 }, X(7), { count: 2 }, { kind: 'Active', index: 3 }, [N(7)]],
  [sk, 'SK02', sk.S0, X(2), { count: 0 }, { kind: 'Active', index: 1 }, [N(2)]],
  [sk, 'SK03', sk.S0, { kind: 'SourceComplete' }, { count: 2 }, { kind: 'Completed' }, [C, D]],
  [sk, 'SK04', sk.S0, { kind: 'SourceError', error: 'err' }, { count: 2 }, { kind: 'Errored' }, [{ kind: 'Error', error: 'err' }, D]],
  [sk, 'SK05', sk.S0, { kind: 'Unsubscribe' }, { count: 2 }, { kind: 'Cancelled' }, [D]],
];
for (const [m, id, s, z, p, T, G] of cases) {
  test(`[${id}] ${JSON.stringify(s)} + ${z.kind}`, () => {
    Object.freeze(s);
    assert.deepEqual(m.evaluate(s, z, p), { ruleId: id, T, G });
  });
}
const closedCases = [[sw, 'SW08', { predicate: throwError }], [tk, 'TK07', { count: 2 }], [sk, 'SK06', { count: 2 }]];
for (const [m, id, p] of closedCases) {
  test(`[${id}] all ordinary inputs after all three terminal outcomes`, () => {
    for (const kind of ['Completed', 'Errored', 'Cancelled']) {
      for (const z of [X(7), { kind: 'SourceComplete' }, { kind: 'SourceError', error: 'late' }, { kind: 'Unsubscribe' }]) {
        assert.deepEqual(m.evaluate({ kind }, z, p), { ruleId: id, T: { kind }, G: [] });
      }
    }
  });
}
test('every new rule ID has an independent expected fixture or explicit terminal matrix', () => {
  const covered = new Set([...cases.map(c => c[1]), ...closedCases.map(c => c[1])]);
  const ids = [sw, tk, sk].flatMap(m => m.rules.map(r => r.id));
  assert.equal(ids.length, new Set(ids).size);
  assert.deepEqual([...covered].sort(), ids.sort());
});
test('skipWhile evaluates the boundary once and discards the no-longer-relevant index', () => {
  const calls = []; let s = sw.S0; const word = [];
  function predicate(x, i) { calls.push([x, i]); return x < 5; }
  for (const x of [2, 4, 7, 1]) { const r = sw.evaluate(s, X(x), { predicate }); s = r.T; word.push(...r.G); }
  assert.deepEqual(calls, [[2, 0], [4, 1], [7, 2]]);
  assert.deepEqual(word, [N(7), N(1)]); assert.deepEqual(s, { kind: 'Forwarding' });
});
test('take activation has a declared input domain; model validation is not RxJS input validation', () => {
  assert.throws(() => tk.evaluate(tk.S0, X(1), { count: 1 }), TypeError);
  assert.throws(() => tk.evaluate({ kind: 'Active', remaining: 1 }, start, { count: 1 }), TypeError);
  for (const count of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => tk.evaluate(tk.S0, start, { count }), RangeError);
    assert.throws(() => sk.evaluate(sk.S0, X(1), { count }), RangeError);
  }
  const count = Number.MAX_SAFE_INTEGER;
  assert.equal(tk.evaluate(tk.S0, start, { count }).T.remaining, count);
});
test('models preserve opaque payload identity including undefined', () => {
  const payload = Object.freeze({ task: 'opaque' });
  const r = sk.evaluate(sk.S0, X(payload), { count: 0 });
  assert.equal(r.G[0].value, payload);
  assert.deepEqual(tk.evaluate({ kind: 'Active', remaining: 1 }, X(undefined), { count: 1 }).G, [N(undefined), C, D]);
});
