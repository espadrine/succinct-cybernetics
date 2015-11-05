// Classic divide-and-conquer algorithm.
// This implementation is not in-place.

function sort(list) {
  // Cut the list in a left piece (which we sort) and a right piece (which we
  // sort).
  var n = list.length;
  var target = new Array(n);
  // The smallest case is sublists of 1 item (which are then sorted).
  // Then we use sublists that double in size every time.
  for (var width = 1; width < n; width *= 2) {
    // Go from sublist to sublist.
    for (var i = 0; i < n; i += (2 * width)) {
      // Merge the sorted sublists from the last run.
      merge(list, i, Math.min(i + width, n), Math.min(i + 2*width, n), target);
    }
    // The target contains the better data, we'll use list as the new buffer.
    var tmp = target;
    target = list;
    list = tmp;
  }
  return list;
}

// Items from ileft to iright-1 are sorted on their own,
// items from iright to iend are sorted on their own.
function merge(list, ileft, iright, iend, target) {
  // |------|------|
  // ileft  iright iend
  var imiddle = iright;

  // We will cover each item eventually, by increasing ileft and iright.
  for (var j = ileft; j < iend; j++) {
    if (ileft < imiddle  // We still have a left item.
      // We don't have a right item or it is larger.
      && ((iright >= iend) || (list[ileft] <= list[iright]))) {
      // Put the left item.
      target[j] = list[ileft];
      ileft += 1;
    } else {
      // Put the right item.
      target[j] = list[iright];
      iright += 1;
    }
  }
}

console.log(sort([2, 5, 4, 1, 3]));
