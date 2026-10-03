/** Scoped family conformance plus separately labeled execution-boundary observations. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Observable, Subject, Subscriber, of, takeWhile, skipWhile, take, skip, filter } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import * as SW from '../../model/skipWhile.ts';
import * as TK from '../../model/take.ts';
import * as SK from '../../model/skip.ts';
function belowFive(x) { return x < 5; }
function alwaysTrue() { return true; }
function alwaysFalse() { return false; }
function firstTwo(_x, i) { return i < 2; }
function positive(x) { return x > 0; }
function throwsOnZero(x) { if (x === 0) throw 'predicate-error'; return true; }
function throwing() { throw 'predicate-error'; }
function compare(a, b) { assert.deepEqual(a, b); }
const values = { a: 2, b: 4, c: 7, d: 1 };
// Each factory constructs an independent cold pipeline. No sharing is introduced.
const profiles = [
  { id: 'TW-default', make: () => takeWhile(belowFive), expected: '-a-b-|', sub: '^----!' },
  { id: 'TW-false', make: () => takeWhile(belowFive, false), expected: '-a-b-|', sub: '^----!' },
  { id: 'TW-true', make: () => takeWhile(belowFive, true), expected: '-a-b-(c|)', sub: '^----!' },
  { id: 'SW', make: () => skipWhile(belowFive), expected: '-----c-d-|', sub: '^--------!' },
  { id: 'TK', make: () => take(2), expected: '-a-(b|)', sub: '^--!' },
  { id: 'SK', make: () => skip(2), expected: '-----c-d-|', sub: '^--------!' },
  { id: 'FILTER-CONTRAST', make: () => filter(belowFive), expected: '-a-b---d-|', sub: '^--------!' },
];
for (const p of profiles) {
  test(`[F01-COMPARE ${p.id}] values, terminal time, and source lifetime`, () => {
    new TestScheduler(compare).run(({ cold, expectObservable, expectSubscriptions }) => {
      const source$ = cold('-a-b-c-d-|', values);
      expectObservable(source$.pipe(p.make())).toBe(p.expected, values);
      expectSubscriptions(source$.subscriptions).toBe(p.sub);
    });
  });
}
const boundary = [
  ['TW-first-false', () => takeWhile(alwaysFalse), '-a-b-|', '-|', '^!'],
  ['TW-first-false-inclusive', () => takeWhile(alwaysFalse, true), '-a-b-|', '-(a|)', '^!'],
  ['TW-always-true', () => takeWhile(alwaysTrue), '-a-b-|', '-a-b-|', '^----!'],
  ['SW-first-false', () => skipWhile(alwaysFalse), '-a-b-|', '-a-b-|', '^----!'],
  ['SW-always-true', () => skipWhile(alwaysTrue), '-a-b-|', '-----|', '^----!'],
  ['SW-index', () => skipWhile(firstTwo), '-a-b-c-d-|', '-----c-d-|', '^--------!'],
  ['SW-throw', () => skipWhile(throwing), '-a-b-|', '-#', '^!', undefined, 'predicate-error'],
  ['TK-zero', () => take(0), '-a-b-|', '|', []],
  ['TK-one', () => take(1), '-a-b-|', '-(a|)', '^!'],
  ['TK-short-source', () => take(5), '-a-b-|', '-a-b-|', '^----!'],
  ['SK-zero', () => skip(0), '-a-b-|', '-a-b-|', '^----!'],
  ['SK-one', () => skip(1), '-a-b-|', '---b-|', '^----!'],
  ['SK-equal-count', () => skip(2), '-a-b-|', '-----|', '^----!'],
  ['SK-short-source', () => skip(5), '-a-b-|', '-----|', '^----!'],
  ['SW-error-while-skipping', () => skipWhile(alwaysTrue), '-a-#', '---#', '^--!', undefined, 'source-error'],
  ['SW-error-while-forwarding', () => skipWhile(alwaysFalse), '-a-#', '-a-#', '^--!', undefined, 'source-error'],
  ['SK-error-before-boundary', () => skip(9), '-a-#', '---#', '^--!', undefined, 'source-error'],
  ['SK-error-after-boundary', () => skip(1), '-a-b-#', '---b-#', '^----!', undefined, 'source-error'],
  ['SW-cancel-while-skipping', () => skipWhile(alwaysTrue), '-a-b-c-|', '----', '^---!', '----!'],
  ['SW-cancel-while-forwarding', () => skipWhile(alwaysFalse), '-a-b-c-|', '-a-b', '^---!', '----!'],
  ['SK-cancel-after-boundary', () => skip(1), '-a-b-c-|', '---b', '^---!', '----!'],
];
for (const [id, make, source, expected, sub, unsub, error] of boundary) {
  test(`[F01-BOUNDARY ${id}]`, () => {
    new TestScheduler(compare).run(({ cold, expectObservable, expectSubscriptions }) => {
      const source$ = cold(source, values, 'source-error');
      expectObservable(source$.pipe(make()), unsub).toBe(expected, values, error);
      expectSubscriptions(source$.subscriptions).toBe(sub);
    });
  });
}
for (const [id, make] of [['TW', () => takeWhile(alwaysTrue)], ['SW', () => skipWhile(alwaysTrue)], ['TK', () => take(9)], ['SK', () => skip(9)]]) {
  for (const [mode, source, expected, sub, unsub, error] of [
    ['empty', '|', '|', '(^!)'],
    ['error', '#', '#', '(^!)', undefined, 'source-error'],
    ['never-cancel', '-------', '----', '^---!', '----!'],
  ]) {
    test(`[F01-LIFECYCLE ${id}-${mode}]`, () => {
      new TestScheduler(compare).run(({ cold, expectObservable, expectSubscriptions }) => {
        const source$ = cold(source, values, 'source-error');
        expectObservable(source$.pipe(make()), unsub).toBe(expected, values, error);
        expectSubscriptions(source$.subscriptions).toBe(sub);
      });
    });
  }
}
function collect(source$) {
  const word = [];
  const subscription = source$.subscribe({ next(value) { word.push(['N', value]); }, error(e) { word.push(['E', e]); }, complete() { word.push(['C']); } });
  return { word, subscription };
}
test('[F01-CALLS] skipWhile stops calling after boundary; independent subscriptions restart at zero', () => {
  const calls = [];
  function predicate(x, i) { calls.push([x, i]); if (x === 1) throw new Error('must not be called after boundary'); return x < 5; }
  const result$ = of(2, 4, 7, 1).pipe(skipWhile(predicate));
  const expected = [['N', 7], ['N', 1], ['C']];
  assert.deepEqual(collect(result$).word, expected); assert.deepEqual(collect(result$).word, expected);
  assert.deepEqual(calls, [[2,0], [4,1], [7,2], [2,0], [4,1], [7,2]]);
});
test('[F01-INDEPENDENT] count state restarts for independent subscriptions', () => {
  for (const [op, expected] of [[take(2), [['N',2], ['N',4], ['C']]], [skip(2), [['N',7], ['N',1], ['C']]]]) {
    const result$ = of(2,4,7,1).pipe(op);
    assert.deepEqual(collect(result$).word, expected); assert.deepEqual(collect(result$).word, expected);
  }
});
test('[F01-ACTIVATION] construction is lazy; take(0) never touches source, skip(0) does', () => {
  let starts = 0, disposals = 0;
  function source(destination) { starts++; destination.next(2); destination.complete(); return () => { disposals++; }; }
  const source$ = new Observable(source), zeroTake$ = source$.pipe(take(0)), zeroSkip$ = source$.pipe(skip(0));
  assert.equal(starts, 0);
  assert.deepEqual(collect(zeroTake$).word, [['C']]); assert.equal(starts, 0); assert.equal(disposals, 0);
  assert.deepEqual(collect(zeroSkip$).word, [['N',2], ['C']]); assert.equal(starts, 1); assert.equal(disposals, 1);
});
for (const [id, operators, expectedProduced, expectedValues] of [
  ['TW', [takeWhile(belowFive)], [2,4,7], [2,4]],
  ['TW-inclusive', [takeWhile(belowFive,true)], [2,4,7], [2,4,7]],
  ['TK', [take(2)], [2,4], [2,4]],
  ['SW-cancel-chain', [skipWhile(belowFive), take(1)], [2,4,7], [7]],
  ['SK-cancel-chain', [skip(2), take(1)], [2,4,7], [7]],
]) {
  test(`[F01-COOPERATIVE ${id}] cancellation stops synchronous production and disposes once`, () => {
    const produced = []; let disposals = 0;
    function source(destination) { for (const x of [2,4,7,1]) { if (destination.closed) break; produced.push(x); destination.next(x); } if (!destination.closed) destination.complete(); return () => { disposals++; }; }
    const { word } = collect(new Observable(source).pipe(...operators));
    assert.deepEqual(produced, expectedProduced); assert.deepEqual(word, [...expectedValues.map(x => ['N',x]), ['C']]); assert.equal(disposals, 1);
  });
}
test('[F01-PAYLOAD] values remain opaque references, including undefined and null', () => {
  const value = Object.freeze({ name: 'packet' });
  for (const op of [takeWhile(alwaysTrue), skipWhile(alwaysFalse), take(4), skip(0)]) {
    assert.deepEqual(collect(of(undefined, null, value).pipe(op)).word, [['N',undefined], ['N',null], ['N',value], ['C']]);
  }
});
function sequences(alphabet, limit) {
  const all = [[]]; let frontier = [[]];
  for (let i = 1; i <= limit; i++) { const next = []; for (const p of frontier) for (const x of alphabet) next.push([...p,x]); all.push(...next); frontier = next; }
  return all;
}
function modelTrace(m, input, ending, config) {
  const word = [], calls = []; let s = m.S0;
  function predicate(x,i) { calls.push([x,i]); return config.predicate(x,i); }
  const p = { ...config, predicate };
  if (m === TK) { const r = m.evaluate(s,{kind:'Start'},p); s = r.T; word.push(...r.G); }
  else word.push({kind:'SubscribeSource'}); // Declared separate initializer for SW/SK.
  const events = input.map(value => ({kind:'SourceNext',value}));
  events.push(ending === 'complete' ? {kind:'SourceComplete'} : ending === 'error' ? {kind:'SourceError',error:'source-error'} : {kind:'Unsubscribe'});
  for (const z of events) { const r = m.evaluate(s,z,p); s = r.T; word.push(...r.G); }
  return {word,calls};
}
function runtimeTrace(name, input, ending, config) {
  const word = [], calls = [];
  function predicate(x,i) { calls.push([x,i]); return config.predicate(x,i); }
  function source(destination) {
    word.push({kind:'SubscribeSource'});
    for (const value of input) { if (destination.closed) break; destination.next(value); }
    if (!destination.closed) { if (ending === 'complete') destination.complete(); else if (ending === 'error') destination.error('source-error'); }
    return () => word.push({kind:'DisposeOwned'});
  }
  const op = name === 'SW' ? skipWhile(predicate) : name === 'TK' ? take(config.count) : skip(config.count);
  const sub = new Observable(source).pipe(op).subscribe({ next(value) { word.push({kind:'Next',value}); }, error(error) { word.push({kind:'Error',error}); }, complete() { word.push({kind:'Complete'}); } });
  if (ending === 'cancel') sub.unsubscribe();
  return {word,calls};
}
test('[F01-DIFFERENTIAL] 5,082 new bounded model/RxJS comparisons', () => {
  let count = 0;
  for (const input of sequences([-1,0,1],4)) {
    for (const [name, m, configs] of [['SW',SW,[positive,firstTwo,alwaysFalse,throwsOnZero].map(predicate => ({predicate}))], ['TK',TK,[0,1,2,3,5].map(count => ({count}))], ['SK',SK,[0,1,2,3,5].map(count => ({count}))]]) {
      for (const config of configs) for (const ending of ['complete','error','cancel']) {
        assert.deepEqual(runtimeTrace(name,input,ending,config), modelTrace(m,input,ending,config), JSON.stringify({name,input,ending,count:config.count,predicate:config.predicate?.name})); count++;
      }
    }
  }
  assert.equal(count,5082);
});
// These observations are deliberately NOT run through the stable reaction evaluators.
test('[F01-EX01] cancelling during the inclusive boundary emission suppresses delivered complete', () => {
  const input = new Subject(), word = []; let disposals = 0;
  function source(destination) { const sub = input.subscribe(destination); return () => { sub.unsubscribe(); disposals++; }; }
  const sink = new Subscriber({ next(x) { word.push(['N',x]); sink.unsubscribe(); }, complete() { word.push(['C']); } });
  new Observable(source).pipe(takeWhile(alwaysFalse,true)).subscribe(sink);
  input.next(7); input.next(1);
  assert.deepEqual(word,[['N',7]]); assert.equal(sink.closed,true); assert.equal(disposals,1);
});
test('[F01-EX02] nested predicate input sees the already-incremented takeWhile index', () => {
  const input = new Subject(), calls = [];
  function predicate(x,i) { calls.push([x,i]); if (x === 7) input.next(1); return x < 5; }
  const result = collect(input.pipe(takeWhile(predicate,false)));
  input.next(7);
  assert.deepEqual(calls,[[7,0],[1,1]]); assert.deepEqual(result.word,[['N',1],['C']]);
});
test('[F01-EX03] bounded reentrant take completes after nested delivery without a third output', () => {
  const input = new Subject(), word = [], offered = [];
  function offer(x) { offered.push(x); input.next(x); }
  input.pipe(take(2)).subscribe({ next(x) { word.push(['N',x]); if (x < 3) offer(x+1); }, complete() { word.push(['C']); } });
  offer(1);
  assert.deepEqual(offered,[1,2,3]); assert.deepEqual(word,[['N',1],['N',2],['C']]);
});
test('[F01-EX04] reentrant skipWhile predicate can overwrite the nested forwarding latch', () => {
  const input = new Subject(), calls = [];
  function predicate(x,i) { calls.push([x,i]); if (x === 1) { input.next(2); return true; } return false; }
  const result = collect(input.pipe(skipWhile(predicate)));
  input.next(1); input.next(3); input.complete();
  assert.deepEqual(calls,[[1,0],[2,1],[3,2]]); assert.deepEqual(result.word,[['N',2],['N',3],['C']]);
});
