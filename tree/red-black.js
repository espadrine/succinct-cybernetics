// A Red-Black tree has four properties:
//
// 1. Each vertex is either red or black.
// 2. The root is black.
// 3. A red vertex cannot have a red child.
// 4. All paths from root to leaf must have the same number of black vertices.

function RedBlackTree() {}

var color = {red: 0, black: 1};
RedBlackTree.prototype = {
  key: null,
  value: null,
  left: null,
  right: null,
  parent: null,
  color: color.black,

  // O(log n) worst-case.
  // We choose to implement it procedurally instead of recursively to separate
  // all steps.
  insert: function(key, value) {
    var v = this;

    // First, find the insertion position as with a normal binary search tree.
    for (;;) {
      if (v.key == null) {
        // This is below a leaf or the tree is empty.
        v.key = key;
        v.value = value;
        v.color = color.red;  // ← Every inserted vertex starts out red.
        break;
      } else if (key < v.key) {
        v = this.produceLeft(v);
      } else if (key > v.key) {
        v = this.produceRight(v);
      } else {
        // v.key == key; the key was already there.
      }
    }

    // Second, compare it to its parent.
    for (;;) {
      if (v.parent == null) {
        // Case 1. We are inserting the root: paint it black for rule #2.
        v.color = color.black;
        return;
      }
      if (v.parent.color === color.black) {
        // Case 2. Black parent, Red child, we are not breaking any rule.
        return;
      }
      // Red parent, Red child, we are breaking rule #3.
      // We know we have a black grandparent, since the root cannot be red,
      // but our parent is.
      var grandparent = v.parent.parent;
      var uncle = v.uncle();
      if (uncle != null && uncle.color === color.red) {
        // Case 3.
        //      (G)          [G]
        //    [P] [U]  →   (P) (U)
        //  [V]          [V]
        //
        // G = grandparent, P = parent, U = uncle; [Red], (Black).
        //
        // This keeps the number of blacks equal whatever the path.
        v.parent.color = color.black;
        uncle.color = color.black;
        grandparent.color = color.red;  // Red is the new black. ☺
        // What about the grandparent?
        // Did we make it break rule #2 (black root) or #3 (two red vertices)?
        v = grandparent;
        // Back to Case 1.
        // Case 3 is the only looping case, which is why insert() is O(log n).
        continue;
      }
      if (v.parent.right === v && v.parent === grandparent.left) {
        // Case 4.
        //     (G)             (G)
        //  [P]   (U)   →   [V]   (U)
        //    [V]         [P]
        this.leftRotation(v.parent);
        // We still have two red vertices breaking rule #3.
        // We will fix that with case 5.
        v = v.left;
      } else if (v.parent.left === v && v.parent === grandparent.right) {
        // Case 4 cont.
        //     (G)             (G)
        //  (U)   [P]   →   (U)   [V]
        //      [V]                 [P]
        this.rightRotation(v.parent);
        // We still have two red vertices breaking rule #3.
        // We will fix that with case 5.
        v = v.right;
      }
      if (v.parent.left === v && v.parent === grandparent.left) {
        // Case 5.
        //       (G)             (P)
        //    [P]   (U)   →   [V]   [G]
        //  [V]                       (U)
        this.rightRotation(grandparent);
        v.parent.color = color.black;
        grandparent.color = color.red;
        // All is safe now.
        return;
      } else if (v.parent.right === v && v.parent === grandparent.right) {
        // Case 5 cont.
        //     (G)              (P)
        //  (U)   [P]   →    [G]   [V]
        //          [V]    (U)
        this.leftRotation(grandparent);
        v.parent.color = color.black;
        grandparent.color = color.red;
        // All is safe now.
        return;
      }
    }
  },

  //    G
  //  P   U ← uncle
  // V ← vertex (this)
  uncle: function() {
    if (this.parent == null || this.parent.parent == null) {
      return null;
    }
    var grandparent = this.parent.parent;
    if (grandparent.right === this.parent) {
      return grandparent.left;
    } else {
      return grandparent.right;
    }
  },

  // Tree rotations preserve the properties of binary search trees.

  //    P         V
  //  V   C  →  A   P
  // A B           B C
  rightRotation: function(parent) {
    var v = parent.left;
    var b = v.right;
    var grandparent = parent.parent;
    if (grandparent != null) {
      var parentIsLeft = (grandparent.left === parent);
      v.right = parent;
      parent.left = b;
      v.parent = grandparent;
      if (parentIsLeft) {
        grandparent.left = v;
      } else {
        grandparent.right = v;
      }
    } else {
      // parent (which is root) becomes v.
      //    P         P
      //  V   C  →  A   V
      // A B           B C
      v.switchData(parent);
      var a = v.left;
      v.left = b;
      v.right = parent.right;
      parent.left = a;
      parent.right = v;
      parent.parent = null;
      v.parent = parent;
    }
  },

  //   P           V
  // A   V   →   P   C
  //    B C     A B
  leftRotation: function(parent) {
    var v = parent.right;
    var b = v.left;
    var grandparent = parent.parent;
    if (grandparent != null) {
      var parentIsLeft = (grandparent.left === parent);
      v.left = parent;
      parent.right = b;
      v.parent = grandparent;
      if (parentIsLeft) {
        grandparent.left = v;
      } else {
        grandparent.right = v;
      }
    } else {
      // parent (which is root) becomes v.
      //   P           P
      // A   V   →   V   C
      //    B C     A B
      v.switchData(parent);
      var c = v.right;
      v.right = b;
      v.left = parent.left;
      parent.right = c;
      parent.left = v;
      parent.parent = null;
      v.parent = parent;
    }
  },

  switchData: function(vertex) {
    var key = this.key;
    var value = this.value;
    var color = this.color;

    this.key = vertex.key;
    this.value = vertex.value;
    this.color = vertex.color;

    vertex.key = key;
    vertex.value = value;
    vertex.color = color;
  },

  produceLeft: function(vertex) {
    var left = vertex.left;
    if (left == null) {
      left = vertex.left = new RedBlackTree();
      left.parent = vertex;
    }
    return left;
  },

  produceRight: function(vertex) {
    var right = vertex.right;
    if (right == null) {
      right = vertex.right = new RedBlackTree();
      right.parent = vertex;
    }
    return right;
  },

  // Return the value that was inserted.
  // O(log n) worst-case.
  // Same implementation as a binary search.
  search: function(key) {
    if (this.key == null) {
      // We reached a leaf without success; that key was never inserted.
      return null;
    } else if (key < this.key) {
      if (this.left != null) {
        return this.left.search(key);
      } else { return null; }
    } else if (key > this.key) {
      if (this.right != null) {
        return this.right.search(key);
      } else { return null; }
    } else {
      return this.value;
    }
  },

  // In-order walk. O(n).
  // Same implementation as a binary search.
  walk: function(f) {
    if (this.left != null) {
      this.left.walk(f);
    }
    if (this.key != null) {
      f(this.key, this.value);
    }
    if (this.right != null) {
      this.right.walk(f);
    }
  },
};

// Usage.
var tree = new RedBlackTree();
// Note that those insertions would create a linked list with a naive
// binary search tree.
tree.insert("banana", "An elongated curved tropic fruit with a creamy flesh.");
tree.insert("orange", "A citrus fruit with a slightly sour flavour.");
tree.insert("strawberry", "A sweet fruit of a plant of the genus Fragaria.");
console.log("An orange is " + tree.search("orange"));
tree.walk(function(key, value) { console.log("- " + key + ": " + value); });
