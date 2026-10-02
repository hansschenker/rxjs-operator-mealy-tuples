import test from 'node:test';
import assert from 'node:assert/strict';
import { S0, evaluate, rules } from '../model/takeWhile.ts';

function belowThree(value) { return value < 3; }
function throwsSentinel() { throw 'predicate-error'; }
const active = { kind: 'Active', index: 0 };
const complete = { kind: 'Complete' };
const dispose = { kind: 'DisposeOwned' };
const vectors = [
  ['TW01', active, { kind: 'SourceNext', value: 1 }, false, belowThree, { kind: 'Active', index: 1 }, [{ kind: 'Next', value: 1 }]],
  ['TW02', active, { kind: 'SourceNext', value: 3 }, false, belowThree, { kind: 'Completed' }, [complete, dispose]],
  ['TW03', active, { kind: 'SourceNext', value: 3 }, true, belowThree, { kind: 'Completed' }, [{ kind: 'Next', value: 3 }, complete, dispose]],
  ['TW04', active, { kind: 'SourceComplete' }, false, belowThree, { kind: 'Completed' }, [complete, dispose]],
  ['TW05', active, { kind: 'SourceError', error: 'source-error' }, false, belowThree, { kind: 'Errored' }, [{ kind: 'Error', error: 'source-error' }, dispose]],
  ['TW06', active, { kind: 'Unsubscribe' }, false, belowThree, { kind: 'Cancelled' }, [dispose]],
  ['TW07', active, { kind: 'SourceNext', value: 1 }, false, throwsSentinel, { kind: 'Errored' }, [{ kind: 'Error', error: 'predicate-error' }, dispose]],
  ...['Completed', 'Errored', 'Cancelled'].map(kind => ['TW08', { kind }, { kind: 'SourceNext', value: 1 }, false, throwsSentinel, { kind }, []]),
];

for (const [id, s, z, inclusive, predicate, expectedT, expectedG] of vectors) {
  test(`[${id}] ${s.kind} with ${z.kind}`, () => {
    const reaction = evaluate(s, z, { predicate, inclusive });
    assert.equal(reaction.ruleId, id);
    assert.deepEqual(reaction.T, expectedT);
    assert.deepEqual(reaction.G, expectedG);
  });
}

test('S0 is Active(0); initialization does not emit', () => {
  assert.deepEqual(S0, active);
  assert.equal(Object.isFrozen(S0), true);
});

test('every descriptor has a unique rule ID and an independent test vector', () => {
  const declared = rules.map(row => row.id);
  assert.equal(new Set(declared).size, declared.length);
  assert.deepEqual([...new Set(vectors.map(row => row[0]))].sort(), [...declared].sort());
});

test('T and G are obtained with one predicate invocation per active SourceNext', () => {
  const calls = [];
  function recordPredicate(value, index) { calls.push([value, index]); return value < 3; }
  let s = S0;
  const word = [];
  for (const value of [1, 2, 3, 4]) {
    const reaction = evaluate(s, { kind: 'SourceNext', value }, { predicate: recordPredicate, inclusive: true });
    s = reaction.T;
    word.push(...reaction.G);
  }
  assert.deepEqual(calls, [[1, 0], [2, 1], [3, 2]]);
  assert.deepEqual(word, [{ kind: 'Next', value: 1 }, { kind: 'Next', value: 2 }, { kind: 'Next', value: 3 }, complete, dispose]);
  assert.deepEqual(s, { kind: 'Completed' });
});

test('all attempted input categories preserve each settled terminal state', () => {
  const inputs = [{ kind: 'SourceNext', value: 1 }, { kind: 'SourceComplete' }, { kind: 'SourceError', error: 0 }, { kind: 'Unsubscribe' }];
  for (const kind of ['Completed', 'Errored', 'Cancelled']) {
    for (const z of inputs) {
      assert.deepEqual(evaluate({ kind }, z, { predicate: throwsSentinel, inclusive: false }), { ruleId: 'TW08', T: { kind }, G: [] });
    }
  }
});

test('predicate and inclusive are parameters, not shared execution memory', () => {
  const parameters = { predicate: belowThree, inclusive: false };
  const first = evaluate(S0, { kind: 'SourceNext', value: 1 }, parameters);
  const second = evaluate(S0, { kind: 'SourceNext', value: 1 }, parameters);
  assert.deepEqual(first, second);
  assert.deepEqual(S0, active);
});
