// GTU Compiler Design: FIRST, FOLLOW and LL(1) check for a context free grammar. MIT licence.
const EPS = 'eps';
const F = {
  EPS,
  parse(text) {
    const rules = [], order = [];
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      const m = line.match(/^(\S+)\s*(?:->|::=|=>)\s*(.*)$/);
      if (!m) throw new Error('line needs the form A -> alpha | beta: ' + line);
      const lhs = m[1];
      if (!order.includes(lhs)) order.push(lhs);
      for (const alt of m[2].split('|')) {
        let syms = alt.trim().split(/\s+/).filter(Boolean);
        if (syms.length === 0 || (syms.length === 1 && (syms[0] === EPS || syms[0] === 'ε'))) syms = [];
        rules.push({ lhs, rhs: syms });
      }
    }
    if (!order.length) throw new Error('empty grammar');
    return { rules, nts: order, start: order[0] };
  },
  firstOfSeq(seq, first, nts) {
    const out = new Set();
    let allNullable = true;
    for (const s of seq) {
      if (!nts.includes(s)) { out.add(s); allNullable = false; break; }
      for (const x of first[s]) if (x !== EPS) out.add(x);
      if (!first[s].has(EPS)) { allNullable = false; break; }
    }
    if (allNullable) out.add(EPS);
    return out;
  },
  analyse(g) {
    const first = {}, follow = {};
    for (const n of g.nts) { first[n] = new Set(); follow[n] = new Set(); }
    let changed = true;
    while (changed) {
      changed = false;
      for (const r of g.rules) {
        for (const x of F.firstOfSeq(r.rhs, first, g.nts)) if (!first[r.lhs].has(x)) { first[r.lhs].add(x); changed = true; }
      }
    }
    follow[g.start].add('$');
    changed = true;
    while (changed) {
      changed = false;
      for (const r of g.rules) {
        r.rhs.forEach((s, i) => {
          if (!g.nts.includes(s)) return;
          const rest = F.firstOfSeq(r.rhs.slice(i + 1), first, g.nts);
          for (const x of rest) if (x !== EPS && !follow[s].has(x)) { follow[s].add(x); changed = true; }
          if (rest.has(EPS)) for (const x of follow[r.lhs]) if (!follow[s].has(x)) { follow[s].add(x); changed = true; }
        });
      }
    }
    // LL(1) table and conflicts
    const table = {}, conflicts = [];
    for (const r of g.rules) {
      const f = F.firstOfSeq(r.rhs, first, g.nts), cols = new Set([...f].filter(x => x !== EPS));
      if (f.has(EPS)) for (const x of follow[r.lhs]) cols.add(x);
      const label = r.lhs + ' -> ' + (r.rhs.join(' ') || EPS);
      for (const t of cols) {
        const k = r.lhs + ',' + t;
        (table[k] = table[k] || []).push(label);
      }
    }
    for (const k of Object.keys(table)) if (table[k].length > 1) conflicts.push('M[' + k + '] has ' + table[k].join(' and '));
    return { first, follow, table, conflicts, ll1: conflicts.length === 0 };
  },
  fmt(set) {
    const a = [...set].sort((x, y) => (x === EPS) - (y === EPS) || (x === '$') - (y === '$') || (x < y ? -1 : x > y ? 1 : 0));
    return '{ ' + a.join(', ') + ' }';
  }
};
if (typeof module !== 'undefined') module.exports = F;
