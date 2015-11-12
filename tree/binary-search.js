// A binary search tree is a binary tree (a rooted tree with vertices with up to
// 2 children) where every vertex on the left branch holds keys lower than that
// of the current vertex, and every vertex on the right branch holds keys
// higher.

function BinarySearchTree() {}

BinarySearchTree.prototype = {
  key: null,
  // Not having a value can make this work like a set
  // with a findMin over the keys.
  value: null,
  left: null,
  right: null,

  // Ensure that search(key) returns the value for that key.
  // O(log n) with random input, O(n) worst-case.
  insert: function(key, value) {
    if (this.key == null) {
      // This is below a leaf or the tree is empty.
      this.key = key;
      this.value = value;
    } else if (key < this.key) {
      this.leftInsert(key, value);
    } else if (key > this.key) {
      this.rightInsert(key, value);
    } else {
      // this.key == key; the key was already there.
    }
  },

  leftInsert: function(key, value) {
    if (this.left == null) {
      this.left = new BinarySearchTree();
    }
    this.left.insert(key, value);
  },

  rightInsert: function(key, value) {
    if (this.right == null) {
      this.right = new BinarySearchTree();
    }
    this.right.insert(key, value);
  },

  // Return the value that was inserted.
  // O(log n) with random input, O(n) worst-case.
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

  // Ensure that search(key) returns null.
  // O(log n) with random input, O(n) worst-case.
  delete: function(key) {
    if (this.key == null) {
      return;
    } else if (key < this.key) {
      if (this.left != null) {
        this.left.delete(key);
      }
    } else if (key > this.key) {
      if (this.right != null) {
        this.right.delete(key);
      }
    } else {
      // We found the key to delete.

      if (this.left == null && this.right == null) {
        // We have no children, we just disappear.
        this.key = this.value = null;
      } else if (this.left == null) {
        // We have one child, we switch place with it.
        this.replaceWith(this.right);
      } else if (this.right == null) {
        this.replaceWith(this.left);
      } else {
        // We have two children. Replace with the biggest vertex on the left,
        // and delete that biggest vertex downward.
        var max = this.left.findMax();
        // It cannot be null here.
        this.key = max.key;
        this.value = max.value;
        this.left.delete(max.key);
      }
    }
  },

  replaceWith: function(tree) {
    this.key = tree.key;
    this.value = tree.value;
    this.left = tree.left;
    this.right = tree.right;
  },

  // Return the biggest vertex.
  findMax: function() {
    if (this.right == null) {
      return this;
    } else {
      return this.right.findMax();
    }
  },

  // In-order walk. O(n).
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

var tree = new BinarySearchTree();
tree.insert("orange", "A citrus fruit with a slightly sour flavour.");
tree.insert("banana", "An elongated curved tropic fruit with a creamy flesh.");
tree.insert("strawberry", "A sweet fruit of a plant of the genus Fragaria.");
console.log("An orange is " + tree.search("orange"));
tree.delete("orange");
console.log("Once deleted, an orange is " + tree.search("orange") + ".");
tree.walk(function(key, value) { console.log("- " + key + ": " + value); });
