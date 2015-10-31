// A list and an item that may be in that list.
// Returns -1 if it is not there, or the index of that item if it is.
function search(list, item) {
  return binarySearch(list, item, 0, list.length - 1);
}

function binarySearch(list, item, imin, imax) {
  while (imin < imax) {
    // Idea: average of imin and imax, (imin + imax) / 2.
    // If imin and imax are too large, their sum could trigger an integer
    // overflow (go past the largest integer representable).
    // (imin + imin - imin + imax) / 2 = (imax - imin) / 2 + imin
    var imid = Math.floor((imax - imin) / 2) + imin;

    // 0 <= imin <= imid < imax

    if (list[imid] < item) {
      // |----|--x-|
      imin = imid + 1;
    } else {
      // |--x-|----|
      imax = imid;
    }
  }

  // Now, imin >= imax.
  // imin > imax if the list is empty.
  if ((imax === imin) && (list[imin] === item)) {
    return imin;
  } else {
    return -1;
  }
}

// 3
console.log(search([2, 34, 321, 834, 854, 856], 834));
