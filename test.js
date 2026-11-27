const F = require('./calc.js'), assert = require('assert');
const S = s => [...s].sort().join(' ');
const sets = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, S(v)]));
// Textbook expression grammar (left recursion removed)
let g = F.parse("E -> T E'\nE' -> + T E' | eps\nT -> F T'\nT' -> * F T' | eps\nF -> ( E ) | id");
let r = F.analyse(g);
const fs = sets(r.first), fo = sets(r.follow);
assert.strictEqual(fs['E'], S(['(', 'id'])); assert.strictEqual(fs['T'], S(['(', 'id'])); assert.strictEqual(fs['F'], S(['(', 'id']));
assert.strictEqual(fs["E'"], S(['+', 'eps'])); assert.strictEqual(fs["T'"], S(['*', 'eps']));
assert.strictEqual(fo['E'], S(['$', ')'])); assert.strictEqual(fo["E'"], S(['$', ')']));
assert.strictEqual(fo['T'], S(['+', '$', ')'])); assert.strictEqual(fo["T'"], S(['+', '$', ')']));
assert.strictEqual(fo['F'], S(['*', '+', '$', ')']));
assert.ok(r.ll1); assert.deepStrictEqual(r.table["E',+"], ["E' -> + T E'"]); assert.deepStrictEqual(r.table["T',)"], ["T' -> eps"]);
// Dangling else style: not LL(1)
g = F.parse('S -> i E t S S1 | a\nS1 -> e S | eps\nE -> b');
r = F.analyse(g);
assert.strictEqual(S(r.first['S1']), S(['e', 'eps'])); assert.strictEqual(S(r.follow['S1']), S(['$', 'e']));
assert.ok(!r.ll1); assert.ok(r.conflicts.some(c => c.startsWith('M[S1,e]')));
// Nullable chain: S -> A B, A -> a | eps, B -> b | eps
g = F.parse('S -> A B\nA -> a | eps\nB -> b | eps');
r = F.analyse(g);
assert.strictEqual(S(r.first['S']), S(['a', 'b', 'eps'])); assert.strictEqual(S(r.follow['A']), S(['b', '$'])); assert.strictEqual(S(r.follow['B']), S(['$']));
// Left recursion makes a grammar non LL(1)
r = F.analyse(F.parse('E -> E + T | T\nT -> id'));
assert.ok(!r.ll1);
assert.throws(() => F.parse('E = nothing'));
console.log('All checks passed');
