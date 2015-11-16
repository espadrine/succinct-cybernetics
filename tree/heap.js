// Binary Heap as a Priority Queue.
//
// 1. Each vertex is bigger than any descendent.
// 2. All levels of the tree must be filled but the bottom.

function BinaryHeap() {
  this.size = 0;
  this.array = [];
}

BinaryHeap.prototype = {
  // In this array, for each vertex at position n:
  // - the left child is at 2*n + 1,
  // - the right child is at 2*n + 2.
  array: [],

  // First, some obvious functions specific to the use of an array.
  swap: function(i, j) {
    var tmp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = tmp;
  },
  push: function(item) { this.size++; this.array.push(item); },
  pop: function() { this.size--; return this.array.pop(); },

  // Now, the real magic.
  // O(log n) worst-case.
  insert: function(priority, value) {
    this.push({key: priority, value: value});
    this.shiftUp(this.size - 1);
  },

  max: function() {
    return this.array[0];
  },

  removeMax: function() {
    // Swap the max with the min, push the min down.
    this.swap(0, this.size - 1);
    var max = this.pop();
    this.shiftDown(0);
    return max;
  },

  // Primitives required for balancing the tree.

  shiftUp: function(j) {
    for (;;) {
      // Is j's parent (i) bigger?
      // If yes, we have kept rule #1, we can exit.
      var i = Math.floor((j - 1) / 2);
      if (i < 0) { i = 0; }
      if (this.array[i].key >= this.array[j].key) {
        break;
      }
      this.swap(i, j);
      j = i;
    }
  },

  shiftDown: function(i) {
    var j;
    for (;;) {
      // j1 is the left child of i.
      // j2 is the right child of i.
      var j1 = 2*i + 1;
      var j2 = 2*i + 2;

      // We want to switch i with the biggest of its child,
      // to maintain rule #1.
      if (j1 >= this.size) { break; }
      if ((j2 < this.size) && (this.array[j1].key <= this.array[j2].key)) {
        j = j2;
      } else {
        j = j1;
      }

      // If we already follow rule #1, we're good to go.
      if (this.array[i].key >= this.array[j].key) { break; }

      // We don't follow rule #1. Swap and continue.
      this.swap(i, j);
      i = j;
    }
  },
};

var heap = new BinaryHeap();
heap.insert(2, 'two');
heap.insert(5, 'five');
heap.insert(3, 'three');
heap.insert(4, 'four');
heap.insert(1, 'one');
console.log('The top of the heap is ' + heap.max().key + ' (five).');
console.log('Reverse sorted items:');
var item;
while (item = heap.removeMax()) {
  console.log(item.key + '. ' + item.value);
}
