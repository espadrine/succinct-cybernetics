Trees are connected graphs without cycles.

Most trees we use are **rooted**: one vertex is the entry point (the root);
it is the only vertex with no edge pointing to it, all other have exactly one.

Many trees are **ordered**: vertices order their children like a list.

The most common implementation of trees is as either null pointers or pointers
to a structure with a value and a list of children trees.

# Binary tree

Ordered trees with up to two children. Since they are ordered, we call them
"left" and "right".

## Tree traversal

We want to read each vertex exactly once.

### Depth-first

- **Pre-order**: read a vertex, then pre-order left, then pre-order right.
- **In-order**: in-order left, then read the vertex, then in-order right.
- **Post-order**: post-order left, then post-order right, then read the vertex.

In-order is probably called this because it is the correct order for binary
search trees.

### Breadth-first

1. Start with a list of `children` containing just the root.
2. Read a vertex from the start of the list and remove it.
3. Put its children at the end of `children`.
4. Go to 2 unless `children` is empty.

It requires O(n/2) worst-case space.

## Binary search tree

Great for maps that you can traverse in the key order, priority queues where you
care about the least prioritized element, and search when a hash table won't do.

- Each value stored in a vertex has total ordering.
- Left is smaller
- Right is bigger

Search, insertion and deletion is O(log n) average, O(n) worst-case (it can
reduce to a list).

If the tree is balanced (= minimal height), we get O(log n) worst-case.

### AVL tree

The first self-balanced binary search tree, and the one with the least costly
search. Use this if you only insert during initialization.

Height ≤ `logφ(√5·(n+2))-2`.

### Red-Black tree

Insertions are less costly than an AVL tree.

Height ≤ `2·log2(n+1)`.

### Splay tree

Rarer, it ensures that recently requested searches are faster to search for.

## Binary heap

Great for priority queues. Efficient to implement as an array.

- Complete binary tree: all levels of the tree must be filled but the bottom.
- Each value stored in a vertex is bigger than or equal to its children.

A nice thing to know: it can sort an array in-place, just by inserting all the
elements into the heap, and extracting the minimum n times.

# B-tree

Achieve O(log(n)) worst-case. Great for IO with large blocks of data: databases,
filesystems.

Each vertex can have 2 or 3 children, and 1 or 2 keys (pieces of ordered data).

- The left branch has keys smaller than the left key,
- The right branch has keys higher than the right key,
- The middle branch has keys in between.
