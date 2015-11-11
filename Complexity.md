```
f(n) = O(g(n))  ⇔  |f(n)| ≤ |g(n)|·k           "grows less than"
f(n) = Ω(g(n))  ⇔  f(n) ≥ g(n)·k               "grows more than"
f(n) = Θ(g(n))  ⇔  g(n)·k1 ≤ f(n) ≤ g(n)·k2    "bounded by"
```

(Insert "∃k>0: ∃n0: ∀n>n0" where needed.)

# Master theorem

An algorithm has complexity `T(n) = a T(n/b) + f(n)`.

1. `f(n) = Θ(n^(<logb(a)))` → `T(n) = Θ(n^(logb(a)))`
2. `f(n) = Θ(n^(logb(a)) log(n)^k)` → `T(n) = Θ(n^(logb(a)) log(n)^(k+1))`
3. `f(n) = Θ(n^(>logb(a)))` → `T(n) = Θ(f(n))`

# Typical complexities

| Complexity | Description |
|------------|-------------|
| O(1)       | Getting an element from an array |
| O(m α(m,n))| Best minimum spanning tree (α = inverse Ackermann) |
| O(log n)   | Binary search |
| O(n)       | Maximum of an unsorted array |
| O(n log n) | Best comparison sort |
| O(n^2)     | Naive vector cross product |
| O(n^3)     | Naive matrix multiplication |
| 2^O(log n) | P; Karmarkar (Linear programming); AKS (Primes) |
| 2^o(n)     | Integer factorization |
| 2^O(n)     | E; TSP, 3-SAT, Graph-coloring |

- SAT: can a given expression with variables, AND, OR, NOT and nesting be true?
- TSP: minimum distance for a traveling saleswoman which must go through a set
  of cities.
- Graph coloring: give each vertex a different color than its neighbors, with a
  fixed number of colors (2 is O(n), 3 is O(1.3289^n), k is O(2.445^n)).
- Knapsack: keep a maximal value out of a set of elements with a value and a
  mass, given a limit to how much mass you can keep.
  It has a known O(n Mass) dynamic programming solution, but is NP-complete.
- Exact cover: given a bunch of subsets (tetris piece locations) of a set
  (board), select the subsets that cover the whole set with no overlap.
  Pentomino tilings, Sudoku and N queens are of that form.
  Donald Knuth implements it using "Dancing Links".

# Complexity classes

- P: solved on a deterministic Turing machine in polynomial time.
- NP: solved on a non-deterministic Turing machine in polynomial time (has
  overlapping parallel universes). A solution is verified by a deterministic
  Turing machine in polynomial time. (The non-deterministic solution generates
  all candidates and checks them in parallel.)
- NP-hard: if that problem was O(1), all problems in NP would be in P.
- NP-complete: NP-hard and NP.

P could be equal to NP, but for all practical purposes, it is not (which may be
proved in the future).
