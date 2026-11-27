# GTU Compiler Design 3174801 FIRST, FOLLOW and LL(1) table checker

FIRST and FOLLOW sets are a guaranteed question in Compiler Design, and one wrong set kills the whole LL(1) table. Grammar paste karo (one rule per line, eps for epsilon), the page prints FIRST and FOLLOW for every non terminal, the parsing table entries and any LL(1) conflict. Use it to check your hand answer. Practice grammars are my own.

Live page: https://princeadvant.github.io/gtu-cd-first-follow-ll1-checker/

## Facts used

- FIRST(X) is the set of terminals that can start a string derived from X. If X can derive epsilon, eps is also in FIRST(X).
- FOLLOW(A) is the set of terminals that can appear right after A in some sentential form. FOLLOW of the start symbol always contains $.
- For A -> alpha B beta: add FIRST(beta) minus eps to FOLLOW(B). If beta can vanish (or is empty), add FOLLOW(A) to FOLLOW(B) as well.
- FOLLOW never contains eps. FIRST can.
- LL(1) table: for each rule A -> alpha put it in M[A, t] for every t in FIRST(alpha), and if alpha can derive eps also for every t in FOLLOW(A). Two rules in one cell means the grammar is not LL(1).
- Default grammar: E -> T E', E' -> + T E' | eps, T -> F T', T' -> * F T' | eps, F -> ( E ) | id. FIRST(E) = { (, id } and FOLLOW(E) = { $, ) }.

## Test

`node test.js` checks FIRST and FOLLOW of the expression grammar, the dangling else conflict, a nullable chain and a left recursive grammar, and prints `All checks passed`.

## Tips

- Do FIRST for all non terminals first, then FOLLOW. FOLLOW needs the FIRST sets of what comes after.
- Write $ in FOLLOW of the start symbol before anything else. Examiners check that line.
- Left recursion (E -> E + T) always breaks LL(1). Remove it first, as in the default grammar.
- A common trap: the dangling else grammar S -> i E t S S' | a, S' -> e S | eps has M[S', e] with two rules, so it is not LL(1).

## Practice with the real paper

GTU Hero has the Winter 2025 Compiler Design (3174801) paper page: 70 marks and 25 questions extracted. Open it here: [GTU Hero](https://gtuhero.com/gtu-papers/gujarat-technological-university-3174801-compiler-design-winter-2025) (GTU Hero is my project).

## Licence

MIT
