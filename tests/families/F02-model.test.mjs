import test from 'node:test';
import assert from 'node:assert/strict';
import * as mp from '../../model/map.ts';
import * as fl from '../../model/filter.ts';
import * as ig from '../../model/ignoreElements.ts';
import * as mt from '../../model/mapTo.ts';
import * as pl from '../../model/pluck.ts';

function twice(x) { return x*2; }
function yes() { return true; }
function no() { return false; }
function fail() { throw 'callback-error'; }
function identity(x) { return x; }
const dispose = { kind:'DisposeOwned' }, complete = { kind:'Complete' };
const indexed = { kind:'Active', index:0 }, active = { kind:'Active' };
const broken = Object.defineProperty({},'key',{get:fail});
const profiles = [
  {name:'map', m:mp, p:{project:twice}, s:indexed, ids:['MP03','MP04','MP05','MP06']},
  {name:'filter', m:fl, p:{predicate:yes}, s:indexed, ids:['FL04','FL05','FL06','FL07']},
  {name:'ignoreElements', m:ig, p:undefined, s:active, ids:['IG02','IG03','IG04','IG05']},
  {name:'mapTo', m:mt, p:{value:'fixed'}, s:active, ids:['MT02','MT03','MT04','MT05']},
  {name:'pluck', m:pl, p:pl.configure('key'), s:active, ids:['PL04','PL05','PL06','PL07']},
];
const vectors = [
  [mp,'MP01',indexed,{kind:'SourceNext',value:3},{project:twice},{kind:'Active',index:1},[{kind:'Next',value:6}]],
  [mp,'MP02',indexed,{kind:'SourceNext',value:3},{project:fail},{kind:'Errored'},[{kind:'Error',error:'callback-error'},dispose]],
  [fl,'FL01',indexed,{kind:'SourceNext',value:3},{predicate:yes},{kind:'Active',index:1},[{kind:'Next',value:3}]],
  [fl,'FL02',indexed,{kind:'SourceNext',value:3},{predicate:no},{kind:'Active',index:1},[]],
  [fl,'FL03',indexed,{kind:'SourceNext',value:3},{predicate:fail},{kind:'Errored'},[{kind:'Error',error:'callback-error'},dispose]],
  [ig,'IG01',active,{kind:'SourceNext',value:broken},undefined,active,[]],
  [mt,'MT01',active,{kind:'SourceNext',value:3},{value:'fixed'},active,[{kind:'Next',value:'fixed'}]],
  [pl,'PL01',active,{kind:'SourceNext',value:{key:null}},pl.configure('key'),active,[{kind:'Next',value:null}]],
  [pl,'PL02',active,{kind:'SourceNext',value:null},pl.configure('key'),active,[{kind:'Next',value:undefined}]],
  [pl,'PL03',active,{kind:'SourceNext',value:broken},pl.configure('key'),{kind:'Errored'},[{kind:'Error',error:'callback-error'},dispose]],
];
for (const {m,p,s,ids} of profiles) {
  vectors.push([m,ids[0],s,{kind:'SourceComplete'},p,{kind:'Completed'},[complete,dispose]],
    [m,ids[1],s,{kind:'SourceError',error:'source-error'},p,{kind:'Errored'},[{kind:'Error',error:'source-error'},dispose]],
    [m,ids[2],s,{kind:'Unsubscribe'},p,{kind:'Cancelled'},[dispose]],
    [m,ids[3],{kind:'Completed'},{kind:'SourceNext',value:1},p,{kind:'Completed'},[]]);
}
for (const [m,id,s,z,p,T,G] of vectors) {
  test(`[F02 ${id}] independent T/G fixture`,()=>assert.deepEqual(m.evaluate(s,z,p),{ruleId:id,T,G}));
}
for (const {name,m,p,s,ids} of profiles) {
  test(`[F02 ${name}] S0 and settled terminal boundaries`,()=>{
    assert.deepEqual(m.S0,s);
    const inputs=[{kind:'SourceNext',value:broken},{kind:'SourceComplete'},{kind:'SourceError',error:null},{kind:'Unsubscribe'}];
    for (const kind of ['Completed','Errored','Cancelled']) for (const z of inputs) {
      assert.deepEqual(m.evaluate({kind},z,p),{ruleId:ids[3],T:{kind},G:[]});
    }
  });
}
test('[F02] descriptors have unique IDs and every one has an independent vector',()=>{
  const ids=profiles.flatMap(p=>p.m.rules.map(r=>r.id));
  assert.equal(ids.length,30);assert.equal(new Set(ids).size,30);
  assert.deepEqual(ids.sort(),vectors.map(v=>v[1]).sort());
});
test('[F02 map/filter] evaluate callback once and advance indexes on suppressed inputs',()=>{
  for(const m of [mp,fl]) {
    const calls=[];
    function record(x,i) { calls.push([x,i]);return i%2===1; }
    const p=m===mp?{project:record}:{predicate:record};let s=m.S0;
    for(const value of [8,8,8]) s=m.evaluate(s,{kind:'SourceNext',value},p).T;
    assert.deepEqual(calls,[[8,0],[8,1],[8,2]]);assert.deepEqual(s,{kind:'Active',index:3});
    assert.deepEqual(m.S0,indexed);
  }
});
test('[F02] intentional silence differs from Next(undefined)',()=>{
  function missing() { return undefined; }
  assert.deepEqual(mp.evaluate(mp.S0,{kind:'SourceNext',value:1},{project:missing}).G,[{kind:'Next',value:undefined}]);
  assert.deepEqual(fl.evaluate(fl.S0,{kind:'SourceNext',value:1},{predicate:no}).G,[]);
  assert.deepEqual(pl.evaluate(pl.S0,{kind:'SourceNext',value:{}},pl.configure('absent')).G,[{kind:'Next',value:undefined}]);
});
test('[F02] preserve payload/result/constant identity rather than clone',()=>{
  const object={n:1};
  const results=[mp.evaluate(mp.S0,{kind:'SourceNext',value:object},{project:identity}),
    fl.evaluate(fl.S0,{kind:'SourceNext',value:object},{predicate:yes}),
    mt.evaluate(mt.S0,{kind:'SourceNext',value:0},{value:object}),
    pl.evaluate(pl.S0,{kind:'SourceNext',value:{key:object}},pl.configure('key'))];
  for(const r of results) assert.equal(r.G[0].value,object);
});
test('[F02 PL-C00] empty path throws at construction, not as G',()=>{
  assert.throws(()=>pl.configure(),{name:'Error',message:'list of properties cannot be empty.'});
});
test('[F02 pluck] final null, nullish intermediate, primitive boxing and inherited keys',()=>{
  const fixtures=[
    [{a:null},['a'],null,'PL01'],[{a:null},['a','b'],undefined,'PL02'],
    [undefined,['a'],undefined,'PL02'],[{a:undefined},['a'],undefined,'PL02'],
    ['abc',['length'],3,'PL01'],[Object.create({a:7}),['a'],7,'PL01'],
    [{a:{b:0}},['a','b'],0,'PL01'],[{a:false},['a'],false,'PL01'],
  ];
  for(const [value,keys,expected,id] of fixtures) {
    const r=pl.evaluate(pl.S0,{kind:'SourceNext',value},pl.configure(...keys));
    assert.equal(r.ruleId,id);assert.deepEqual(r.G,[{kind:'Next',value:expected}]);
  }
});
test('[F02 pluck] numeric/symbol keys and one read per traversed segment',()=>{
  const key=Symbol('key');let reads=0;
  const base={get a() {reads++;return {[key]:[9]};}};
  const r=pl.evaluate(pl.S0,{kind:'SourceNext',value:base},pl.configure('a',key,0));
  assert.deepEqual(r.G,[{kind:'Next',value:9}]);assert.equal(reads,1);
});
test('[F02 mapTo] a function is constant data, not a callback',()=>{
  const r=mt.evaluate(mt.S0,{kind:'SourceNext',value:1},{value:fail});
  assert.equal(r.G[0].value,fail);
});
