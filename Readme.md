# Succinct Cybernetics

All decidable problems can be solved with algorithms. For all we know, humans
are Turing machines.

Most problems can be structured into a **graph**. [Graphs](/graph/Readme.md) have vertices (entities
holding data) and edges (from one vertex to another, sometimes with a value).

Many problems can be structured into a **tree**. [Trees](/tree/Readme.md) are connected graphs
without cycles. Most trees we use are rooted: one vertex is the entry point (the
root); it is the only vertex with no edge pointing to it, all other have exactly
one. Many trees are ordered: vertices order their children like a list.

Some problems can be structured into a **list**. [Lists](/list/Readme.md) are rooted trees where a
maximum of one child is allowed.

A few problems can be structured into a **map**. Maps are directed graphs where
every vertex has either a single edge coming from them (keys) or at least one
edge coming from a key (values).

(An uncommon variation of maps are multimaps, where keys can have more than a
single edge coming from them.)

Another structure is a **set**. Sets are graphs with no edges.

## Index

1. [Complexity](/Complexity.md)
2. [Graphs](/graph/Readme.md)
3. [Trees](/tree/Readme.md)
4. [Lists](/list/Readme.md)
5. Misc:
    - [Time](/misc/time.md)
    - [Statistics](/misc/statistics.md)
    - [Network](/misc/network.md)
    - [Memory](/misc/memory.md)
    - [Distributed Systems](/misc/distributed-systems.md)
