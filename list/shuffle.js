function shuffle(list) {
  for (var i = list.length - 1; i > 0; i--) {
    // i goes left:
    //        j  i
    //      --x--x---
    // unshuffled shuffled
    var j = Math.floor(Math.random() * (i + 1));
    // i+1 because it should be able to stay in place.
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

console.log(shuffle([1, 2, 3, 4, 5]));
