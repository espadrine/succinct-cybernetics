Graphs have vertices (entities holding data) and edges (from one vertex to
another, sometimes with a value).

# Implementation

- **Adjacency matrix**: n by n matrix. Each slot is 0 (no edge between i and j),
  1 (edge from i to j), potentially more for colored edges.
- **Adjacency list**: list of n items, each with their vertex data and a pointer
  to a list of indices of vertices it points to.
- **Pointers**: vertices with a list of pointers to vertices. Useful for trees
  or with a fixed maximum of adjacent vertices.

|             | Adjacency matrix | Adjacency list |
|-------------|------------------|----------------|
| Storage     | O(v^2)           | O(v + e)       |
| Add vertex  | O(v^2)           | O(1)           |
| Add edge    | O(1)             | O(1)           |
| Rm vertex   | O(v^2)           | O(e)           |
| Rm edge     | O(1)             | O(e)           |
| Is adjacent | O(1)             | O(v)           |

# Graph traversal

## Depth-first

```
Search(G, v):
  explored(v)
  ∀e∈edges(G, v):
    w = vertex(G, v, e)
    if unexplored(w):
      check w
      Search(G, w)
```

O(m) time, O(n) space (worst case).

## Breadth-first

```
Search(G, v):
  queue Q, set S
  enqueue(Q, v)
  add(S, v)
  while Q not empty:
    w = dequeue(Q)
    check w
    ∀e∈edges(G, w):
      u = vertex(G, w, e)
      if u not in S:
        add(S, u)
        enqueue(Q, u)
```

O(m) time, O(n) space (worst case).
