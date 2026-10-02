/** Actual RxJS checks. Requires npm install; see docs/VERIFICATION.md for run status. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Observable, EMPTY, of, takeWhile, every, defaultIfEmpty } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { S0, evaluate } from '../model/takeWhile.ts';

function belowThree(value) { return value < 3; }
function positive(value) { return value > 0; }
function firstTwo(_value, index) { return index < 2; }
function throwsOnTwo(value) { if (value === 2) throw 'predicate-error'; return true; }
function assertMarbles(actual, expected) { assert.deepEqual(actual, expected); }

const cases = [
  { name: '[TW01 TW02] exclusive boundary', source: '-a-b-c-d-|', expected: '-a-b-|', subscription: '^----!', predicate: belowThree, inclusive: false },
  { name: '[TW01 TW03] inclusive boundary', source: '-a-b-c-d-|', expected: '-a-b-(c|)', subscription: '^----!', predicate: belowThree, inclusive: true },
  { name: '[TW04] empty source', source: '|', expected: '|', subscription: '(^!)', predicate: belowThree, inclusive: false },
  { name: '[TW04] source completes while active', source: '-a-b-|', expected: '-a-b-|', subscription: '^----!', predicate: belowThree, inclusive: false },
  { name: '[TW05] source error', source: '-a-#', expected: '-a-#', subscription: '^--!', predicate: belowThree, inclusive: false, error: 'source-error' },
  { name: '[TW06] cancellation without completion', source: '-a-b-c-|', expected: '-a-b', subscription: '^---!', unsubscribe: '----!', predicate: belowThree, inclusive: false },
  { name: '[TW06] never source cancelled', source: '-------', expected: '----', subscription: '^---!', unsubscribe: '----!', predicate: belowThree, inclusive: false },
  { name: '[TW07] predicate throw', source: '-a-b-c-|', expected: '-a-#', subscription: '^--!', predicate: throwsOnTwo, inclusive: true, error: 'predicate-error' },
  { name: '[TW01 TW02] callback index controls the boundary', source: '-a-b-c-|', expected: '-a-b-|', subscription: '^----!', predicate: firstTwo, inclusive: false, values: { a: 10, b: 10, c: 10 } },
];

for (const fixture of cases) {
  test(fixture.name, () => {
    const scheduler = new TestScheduler(assertMarbles);
    scheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
      const values = fixture.values ?? { a: 1, b: 2, c: 3, d: 4 };
      const source$ = cold(fixture.source, values, 'source-error');
      const result$ = source$.pipe(takeWhile(fixture.predicate, fixture.inclusive));
      expectObservable(result$, fixture.unsubscribe).toBe(fixture.expected, values, fixture.error);
      expectSubscriptions(source$.subscriptions).toBe(fixture.subscription);
    });
  });
}

test('[TW01 TW02 TW08] predicate is called once per eligible input, including rejection', () => {
  const calls = [];
  function recordPredicate(value, index) { calls.push([value, index]); return value < 3; }
  new TestScheduler(assertMarbles).run(({ cold, expectObservable, expectSubscriptions, flush }) => {
    const source$ = cold('-a-b-c-d-|', { a: 1, b: 2, c: 3, d: 4 });
    const result$ = source$.pipe(takeWhile(recordPredicate, false));
    expectObservable(result$).toBe('-a-b-|', { a: 1, b: 2 });
    expectSubscriptions(source$.subscriptions).toBe('^----!');
    flush();
    assert.deepEqual(calls, [[1, 0], [2, 1], [3, 2]]);
  });
});

test('S0 and index state are independent across two subscriptions', () => {
  new TestScheduler(assertMarbles).run(({ cold, expectObservable, expectSubscriptions }) => {
    const source$ = cold('-a-b-c-|', { a: 10, b: 20, c: 30 });
    const result$ = source$.pipe(takeWhile(firstTwo, false));
    expectObservable(result$).toBe('-a-b-|', { a: 10, b: 20 });
    expectObservable(result$).toBe('-a-b-|', { a: 10, b: 20 });
    expectSubscriptions(source$.subscriptions).toBe(['^----!', '^----!']);
  });
});

function modelTrace(values, ending, predicate, inclusive) {
  const calls = [];
  const word = [];
  function recordPredicate(value, index) { calls.push([value, index]); return predicate(value, index); }
  const parameters = { predicate: recordPredicate, inclusive };
  let s = S0;
  const inputs = values.map(value => ({ kind: 'SourceNext', value }));
  inputs.push(ending === 'complete' ? { kind: 'SourceComplete' }
    : ending === 'error' ? { kind: 'SourceError', error: 'source-error' }
    : { kind: 'Unsubscribe' });
  for (const z of inputs) {
    const reaction = evaluate(s, z, parameters);
    s = reaction.T;
    word.push(...reaction.G);
  }
  return { word, calls };
}

function rxjsTrace(values, ending, predicate, inclusive) {
  const calls = [];
  const word = [];
  function recordPredicate(value, index) { calls.push([value, index]); return predicate(value, index); }
  function ownSource(destination) {
    for (const value of values) {
      if (destination.closed) break;
      destination.next(value);
    }
    if (!destination.closed) {
      if (ending === 'complete') destination.complete();
      else if (ending === 'error') destination.error('source-error');
    }
    return function disposeOwned() { word.push({ kind: 'DisposeOwned' }); };
  }
  const source$ = new Observable(ownSource);
  const result$ = source$.pipe(takeWhile(recordPredicate, inclusive));
  const subscription = result$.subscribe({
    next(value) { word.push({ kind: 'Next', value }); },
    complete() { word.push({ kind: 'Complete' }); },
    error(error) { word.push({ kind: 'Error', error }); },
  });
  if (ending === 'cancel') subscription.unsubscribe();
  return { word, calls };
}

function boundedSequences(alphabet, maxLength) {
  const all = [[]];
  let frontier = [[]];
  for (let length = 1; length <= maxLength; length++) {
    const next = [];
    for (const prefix of frontier) for (const value of alphabet) next.push([...prefix, value]);
    all.push(...next);
    frontier = next;
  }
  return all;
}

test('1,452 bounded non-reentrant model/RxJS comparisons include terminal and disposal words', () => {
  let comparisons = 0;
  for (const values of boundedSequences([-1, 0, 1], 4)) {
    for (const predicate of [positive, firstTwo]) {
      for (const inclusive of [false, true]) {
        for (const ending of ['complete', 'error', 'cancel']) {
          const expected = modelTrace(values, ending, predicate, inclusive);
          const actual = rxjsTrace(values, ending, predicate, inclusive);
          assert.deepEqual(actual, expected, JSON.stringify({ values, predicate: predicate.name, inclusive, ending }));
          comparisons++;
        }
      }
    }
  }
  assert.equal(comparisons, 1452);
});

function collect(source$) {
  const word = [];
  source$.subscribe({
    next(value) { word.push({ kind: 'Next', value }); },
    complete() { word.push({ kind: 'Complete' }); },
    error(error) { word.push({ kind: 'Error', error }); },
  });
  return word;
}

test('[REVIEW-EVERY] passing inputs do not emit false; first failure emits false then completes', () => {
  assert.deepEqual(collect(of(1, 2).pipe(every(belowThree))), [{ kind: 'Next', value: true }, { kind: 'Complete' }]);
  assert.deepEqual(collect(of(1, 3, 2).pipe(every(belowThree))), [{ kind: 'Next', value: false }, { kind: 'Complete' }]);
});

test('[REVIEW-DEFAULT] default belongs to empty completion, not a second source value', () => {
  assert.deepEqual(collect(EMPTY.pipe(defaultIfEmpty(0))), [{ kind: 'Next', value: 0 }, { kind: 'Complete' }]);
  assert.deepEqual(collect(of(1, 2).pipe(defaultIfEmpty(0))), [{ kind: 'Next', value: 1 }, { kind: 'Next', value: 2 }, { kind: 'Complete' }]);
});
