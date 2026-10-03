/** Runtime checks for the scoped F02 profiles; not private-state assertions. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Observable, of, map, filter, ignoreElements, mapTo, pluck, take } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import * as mp from '../../model/map.ts';
import * as fl from '../../model/filter.ts';
import * as ig from '../../model/ignoreElements.ts';
import * as mt from '../../model/mapTo.ts';
import * as pl from '../../model/pluck.ts';

function twice(x) {return x*2;}
function positive(x) {return x>0;}
function indexed(x,i) {return [x,i];}
function oddIndex(_x,i) {return i%2===1;}
function missing() {return undefined;}
function reject() {return false;}
function accept() {return true;}
function identity(x) {return x;}
function throwOnNegative(x) {if(x<0) throw 'callback-error';return x;}
function predicateThrow(x) {if(x<0) throw 'callback-error';return x>0;}
function bad() {throw 'access-error';}
function twiceScore(x) {return x.score*2;}
function selected(x) {return x.score<5;}
function assertMarbles(actual,expected) {assert.deepEqual(actual,expected);}
const C={kind:'Complete'}, D={kind:'DisposeOwned'};
const N=value=>({kind:'Next',value});

function collect(source$) {
 const word=[];
 source$.subscribe({next(value){word.push(N(value));},error(error){word.push({kind:'Error',error});},complete(){word.push(C);}});
 return word;
}
const commonValues={a:{score:2},b:{score:4},c:{score:7},d:{score:1}};
const common=[
 {name:'map',make:()=>map(twiceScore),expected:'-w-x-y-z-|',values:{w:4,x:8,y:14,z:2}},
 {name:'filter',make:()=>filter(selected),expected:'-a-b---d-|',values:commonValues},
 {name:'ignoreElements',make:ignoreElements,expected:'---------|',values:{}},
 {name:'mapTo',make:()=>mapTo('ready'),expected:'-r-r-r-r-|',values:{r:'ready'}},
 {name:'pluck',make:()=>pluck('score'),expected:'-w-x-y-z-|',values:{w:2,x:4,y:7,z:1}},
];
for(const p of common) {
 test(`[F02 ${p.name}] common trace: values, frame order and full subscription`,()=>{
  new TestScheduler(assertMarbles).run(({cold,expectObservable,expectSubscriptions})=>{
   const s=cold('-a-b-c-d-|',commonValues);expectObservable(s.pipe(p.make())).toBe(p.expected,p.values);
   expectSubscriptions(s.subscriptions).toBe('^--------!');
  });
 });
 for(const [scenario,source,expected,sub,unsub] of [
  ['empty','|','|','(^!)',undefined],['source-error','#','#','(^!)',undefined],
  ['never cancelled','------','----','^---!','----!'],
 ]) test(`[F02 ${p.name}] ${scenario}`,()=>{
  new TestScheduler(assertMarbles).run(({cold,expectObservable,expectSubscriptions})=>{
   const s=cold(source,{},'source-error');expectObservable(s.pipe(p.make()),unsub).toBe(expected,{},'source-error');
   expectSubscriptions(s.subscriptions).toBe(sub);
  });
 });
 test(`[F02 ${p.name}] external cancellation after two values does not complete`,()=>{
  new TestScheduler(assertMarbles).run(({cold,expectObservable,expectSubscriptions})=>{
   const s=cold('-a-b-c-d-|',commonValues);
   expectObservable(s.pipe(p.make()),'----!').toBe(p.expected.slice(0,4),p.values);
   expectSubscriptions(s.subscriptions).toBe('^---!');
  });
 });
 test(`[F02 ${p.name}] error after values is forwarded without completion`,()=>{
  new TestScheduler(assertMarbles).run(({cold,expectObservable,expectSubscriptions})=>{
   const s=cold('-a-b-#',commonValues,'source-error');
   expectObservable(s.pipe(p.make())).toBe(p.expected.slice(0,5)+'#',p.values,'source-error');
   expectSubscriptions(s.subscriptions).toBe('^----!');
  });
 });
 test(`[F02 ${p.name}] construction is lazy; each subscription attaches and disposes independently`,()=>{
  let starts=0,disposes=0;
  const source$=new Observable(function own(s){starts++;s.next({score:2});s.complete();return function release(){disposes++;};});
  const result$=source$.pipe(p.make());assert.equal(starts,0);
  collect(result$);collect(result$);assert.equal(starts,2);assert.equal(disposes,2);
 });
}
for(const [name,operator,expected] of [
 ['map',map(twice),'-x-#'],['filter',filter(predicateThrow),'-a-#'],
]) test(`[F02 ${name}] callback failure disposes source at that input`,()=>{
 const op=name==='map'?map(throwOnNegative):operator;
 new TestScheduler(assertMarbles).run(({cold,expectObservable,expectSubscriptions})=>{
  const s=cold('-a-b-c-|',{a:1,b:-1,c:2});
  expectObservable(s.pipe(op)).toBe(expected,{a:1,x:1},'callback-error');
  expectSubscriptions(s.subscriptions).toBe('^--!');
 });
});
for(const name of ['map','filter']) test(`[F02 ${name}] callback once, indexes include suppressed values and restart per subscription`,()=>{
 const calls=[];
 function record(x,i) {calls.push([x,i]);return i%2===1;}
 const op=name==='map'?map(record):filter(record);
 const source$=of(8,8,8).pipe(op);
 const first=collect(source$),second=collect(source$);
 assert.deepEqual(calls,[[8,0],[8,1],[8,2],[8,0],[8,1],[8,2]]);
 assert.deepEqual(first,name==='map'?[N(false),N(true),N(false),C]:[N(8),C]);assert.deepEqual(second,first);
});
test('[F02] Next(undefined) is a real notification, not filter or ignore silence',()=>{
 assert.deepEqual(collect(of(1,2).pipe(map(missing))),[N(undefined),N(undefined),C]);
 assert.deepEqual(collect(of(1,2).pipe(filter(reject))),[C]);
 assert.deepEqual(collect(of({},null).pipe(pluck('absent'))),[N(undefined),N(undefined),C]);
 assert.deepEqual(collect(of(1,2).pipe(ignoreElements())),[C]);
});
test('[F02] unchanged payload, mapped result, and plucked reference preserve identity',()=>{
 const obj={x:1};
 for(const result$ of [of(obj).pipe(map(identity)),of(obj).pipe(filter(accept)),of({a:obj}).pipe(pluck('a'))]) {
  assert.equal(collect(result$)[0].value,obj);
 }
});
test('[F02 mapTo] constant object is neither cloned nor re-created across subscriptions',()=>{
 const obj={x:1},result$=of(1,2).pipe(mapTo(obj));
 const a=collect(result$),b=collect(result$);
 for(const word of [a,b]) for(const letter of word.filter(x=>x.kind==='Next')) assert.equal(letter.value,obj);
});
test('[F02 mapTo] evaluated configuration is not a per-input factory; functions stay data',()=>{
 let calls=0;function configure(){calls++;return {ready:true};}
 const result$=of(1,2).pipe(mapTo(configure()));assert.equal(calls,1);
 collect(result$);collect(result$);assert.equal(calls,1);
 assert.equal(collect(of(1).pipe(mapTo(bad)))[0].value,bad);
});
test('[F02 map] Observable-valued projection is emitted, never flattened',()=>{
 let starts=0;const inner$=new Observable(function own(){starts++;});
 function inner(){return inner$;}
 assert.equal(collect(of(1).pipe(map(inner)))[0].value,inner$);assert.equal(starts,0);
});
test('[F02 pluck PL-C00] empty path throws before any subscription; undefined key is not empty path',()=>{
 let starts=0;const source$=new Observable(function own(s){starts++;s.complete();});
 assert.throws(()=>source$.pipe(pluck()),{name:'Error',message:'list of properties cannot be empty.'});assert.equal(starts,0);
 // JavaScript compatibility observation outside the typed fixed-PropertyKey profile.
 assert.deepEqual(collect(of({undefined:7}).pipe(pluck(undefined))),[N(7),C]);
});
const sym=Symbol('score');
const propertyCases=[
 ['final null',{a:null},['a'],null],['null intermediate',{a:null},['a','b'],undefined],
 ['null root',null,['a'],undefined],['undefined root',undefined,['a'],undefined],
 ['missing',{},['a'],undefined],['explicit undefined',{a:undefined},['a'],undefined],
 ['false',{a:false},['a'],false],['zero',{a:0},['a'],0],['empty string',{a:''},['a'],''],
 ['numeric array',['ok'],[0],'ok'],['symbol',{[sym]:7},[sym],7],
 ['primitive boxing','abc',['length'],3],['inherited',Object.create({a:9}),['a'],9],
 ['literal dotted key',{'a.b':4},['a.b'],4],['nested',{a:{b:5}},['a','b'],5],
];
for(const [name,value,keys,expected] of propertyCases) test(`[F02 pluck] ${name}`,()=>{
 assert.deepEqual(collect(of(value).pipe(pluck(...keys))),[N(expected),C]);
});
test('[F02 pluck] read each getter once with its real receiver; stop at undefined',()=>{
 let first=0,second=0;
 const object={stored:7,get a(){first++;assert.equal(this,object);return {get b(){second++;return 9;}};}};
 assert.deepEqual(collect(of(object).pipe(pluck('a','b'))),[N(9),C]);assert.equal(first,1);assert.equal(second,1);
 const absent={get a(){first++;return undefined;}};
 assert.deepEqual(collect(of(absent).pipe(pluck('a','b'))),[N(undefined),C]);assert.equal(first,2);assert.equal(second,1);
});
test('[F02 pluck] throwing getter fails and stops cooperative source production',()=>{
 const good={a:1},broken={get a(){throw 'access-error';}};const produced=[];let disposed=0;
 const source$=new Observable(function own(s){for(const value of [good,broken,good]){if(s.closed)break;produced.push(value);s.next(value);}if(!s.closed)s.complete();return function release(){disposed++;};});
 assert.deepEqual(collect(source$.pipe(pluck('a'))),[N(1),{kind:'Error',error:'access-error'}]);
 assert.equal(produced.length,2);assert.equal(disposed,1);
});
test('[F02 ignoreElements] no payload access, but all source work still participates',()=>{
 let reads=0,produced=0,disposed=0;const object={get a(){reads++;throw 'must-not-read';}};
 const source$=new Observable(function own(s){for(let i=0;i<3;i++){produced++;s.next(object);}s.complete();return function release(){disposed++;};});
 assert.deepEqual(collect(source$.pipe(ignoreElements())),[C]);assert.equal(reads,0);assert.equal(produced,3);assert.equal(disposed,1);
});
for(const [name,op] of [['map',map(identity)],['filter',filter(accept)],['mapTo',mapTo('x')],['pluck',pluck('score')]]) {
 test(`[F02 ${name}] downstream take stops cooperative production during delivery`,()=>{
  // Separate delivery-interruption observation; the stable model does not commit T before G.
  let produced=0,disposed=0;
  const source$=new Observable(function own(s){for(let i=0;i<5&&!s.closed;i++){produced++;s.next({score:i});}return function release(){disposed++;};});
  const word=collect(source$.pipe(op,take(2)));assert.equal(word.length,3);assert.equal(produced,2);assert.equal(disposed,1);
 });
}
test('[F02 compatibility] mapTo agrees with map of the same constant under the declared scope',()=>{
 const value={ready:true};function fixed(){return value;}
 assert.deepEqual(collect(of(1,2).pipe(mapTo(value))),collect(of(1,2).pipe(map(fixed))));
});
test('[F02 compatibility] pluck agrees with the matching optional property traversal',()=>{
 const values=[{a:{b:2}},{},null,{a:null},{a:{b:null}},{a:{b:0}}];
 function optional(x){return x?.a?.b;}
 assert.deepEqual(collect(of(...values).pipe(pluck('a','b'))),collect(of(...values).pipe(map(optional))));
});

function sequences(alphabet,max) {const all=[[]];let layer=[[]];for(let i=0;i<max;i++){layer=layer.flatMap(p=>alphabet.map(v=>[...p,v]));all.push(...layer);}return all;}
function prepare(p,calls) {
 function record(x,i){calls.push([x,i]);return p.fn(x,i);}
 if(p.name==='map') return {model:mp,params:{project:record},operator:()=>map(record)};
 if(p.name==='filter') return {model:fl,params:{predicate:record},operator:()=>filter(record)};
 if(p.name==='mapTo') return {model:mt,params:{value:p.value},operator:()=>mapTo(p.value)};
 if(p.name==='pluck') return {model:pl,params:pl.configure(...p.keys),operator:()=>pluck(...p.keys)};
 return {model:ig,params:undefined,operator:ignoreElements};
}
function modelTrace(values,ending,p) {
 const calls=[],word=[];const f=prepare(p,calls);let s=f.model.S0;
 const inputs=values.map(value=>({kind:'SourceNext',value}));
 inputs.push(ending==='complete'?{kind:'SourceComplete'}:ending==='error'?{kind:'SourceError',error:'source-error'}:{kind:'Unsubscribe'});
 for(const z of inputs){const r=f.model.evaluate(s,z,f.params);s=r.T;word.push(...r.G);}
 return {word,calls};
}
function actualTrace(values,ending,p) {
 const calls=[],word=[];const f=prepare(p,calls);
 const source$=new Observable(function own(s){
  for(const value of values){if(s.closed)break;s.next(value);}
  if(!s.closed){if(ending==='complete')s.complete();else if(ending==='error')s.error('source-error');}
  return function dispose(){word.push(D);};
 });
 const sub=source$.pipe(f.operator()).subscribe({next(value){word.push(N(value));},error(error){word.push({kind:'Error',error});},complete(){word.push(C);}});
 if(ending==='cancel')sub.unsubscribe();return {word,calls};
}
const numeric=sequences([-1,0,1],4),constant={fixed:true};
const propertySequences=sequences([null,{}, {payload:null}, {payload:{score:2}}, {payload:{score:undefined}}, {payload:{score:0}}],3);
const differential=[
 ['map',numeric,[twice,indexed,missing,throwOnNegative].map(fn=>({name:'map',fn})),1452],
 ['filter',numeric,[positive,oddIndex,reject,predicateThrow].map(fn=>({name:'filter',fn})),1452],
 ['ignoreElements',numeric,[{name:'ignoreElements'}],363],
 ['mapTo',numeric,[undefined,null,constant,bad].map(value=>({name:'mapTo',value})),1452],
 ['pluck',propertySequences,[['payload','score'],['payload'],['missing']].map(keys=>({name:'pluck',keys})),2331],
];
for(const [name,inputs,settings,total] of differential) test(`[F02 ${name}] ${total} bounded model/RxJS comparisons`,()=>{
 let count=0;
 for(const values of inputs) for(const p of settings) for(const ending of ['complete','error','cancel']) {
  assert.deepEqual(actualTrace(values,ending,p),modelTrace(values,ending,p),`${name} case ${count} (${ending})`);count++;
 }
 assert.equal(count,total);
});
