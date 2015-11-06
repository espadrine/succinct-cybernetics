// Classic recursive algorithm.

function sort(list) {
  return quicksort(list, 0, list.length - 1);
}

function quicksort(list, lo, hi) {
  if (lo < hi) {
    // Find a pivot in the middle (can be random, here, it's at the end).
    // Things smaller than the pivot will all accumulate on the left.
    var pivot = list[hi];
    var i = lo;
    for (var j = lo; j < hi; j++) {
      // Put all the items smaller than the pivot on the left.
      // |--------|------|---p
      // lo  <=p  i  >p  j   hi
      if (list[j] <= pivot) {
        // Swap i and j.
        var tmp = list[j];
        list[j] = list[i];
        list[i] = tmp;
        i += 1;
      }
    }
    // i has now all items <=p on the left, and >p on the right.
    // Put p (which is still on hi) between them.
    var tmp = list[hi];
    list[hi] = list[i];
    list[i] = tmp;

    // Sort the left side and the right side of the pivot.
    quicksort(list, lo, i - 1);
    quicksort(list, i + 1, hi);
  }
  return list;
}

console.log(sort([2, 5, 4, 1, 3]));
