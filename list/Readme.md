# Sort

Sorted lists are easier to search through / extract data, but maintaining that
property requires either care or full-list sorting (as below).

|           | Average       | Worst         | Stable | Memory         | Note   |
|-----------|---------------|---------------|--------|----------------|--------|
|Merge sort | O(n log n)    | O(n log n)    | yes    | O(n)           |        |
|" in-place | O(n log(n)^2) | O(n log(n)^2) | yes    | O(1)           |        |
|Quicksort  | O(n log n)    | O(n^2)        | no     | O(log n) / O(n)|The pivot technique is used elsewhere|
|Heapsort   | O(n log n)    | O(n log n)    | no     | O(1)           |In-place|
|Insertion  | O(n^2)        | O(n^2)        | yes    | O(1)           |Booklike|

## Radix sort

Famous for being "linear". O(wn) worst-case, with n the size of the list, and w
the size of the items (eg, for 64 bit integers, 64). If the list has no
duplicates, w will be ≥log(n), so it is not really linear. Use this only if you
have mostly duplicates (this sort is stable).

# Shuffle

Fisher–Yates shuffle is O(n) and can be in-place (O(1) memory).

# Search

## Binary search

O(log n) search for a key with no index in a sorted list.

You know the index is between a lower bound and an upper bound (initially
including all of the list), and you reduce their span by checking if the item is
on the left or on the right half of the span.

If you don't know how big the list is, you can do **exponential search**: first
exponentially try to find an index whose item is bigger than the searched item,
then do binary search.

## Interpolation search

Better average complexity. Instead of halving the span, cut the span in
proportion to where the item should be. For instance, in the dictionary, the
word "zebra" would be around the end. It only works if items are uniformly
distributed (O(log log n)).
