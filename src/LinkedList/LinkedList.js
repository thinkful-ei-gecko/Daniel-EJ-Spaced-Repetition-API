/* eslint-disable strict */
//Create a linked list class with all the things.

class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertBefore(item, key) {
    let currNode = this.head;
    while (currNode.next.value !== key) {
      currNode = currNode.next;
    }
    if (!currNode) {
      return null;
    } else {
      let newNode = new _Node(item, currNode.next);
      currNode.next = newNode;
    }
  }

  insertAt(item, pos) {
    let currNode = this.head;
    for (let i = 1; i < pos; i++) {
      if (currNode.next === null) {
        break;
      }
      currNode = currNode.next;
    }
    if (!currNode) {
      return null;
    }
    let newNode = new _Node(item, currNode.next);
    currNode.next = newNode;
  }

  insertAfter(item, key) {
    let target = this.find(key);
    if (!target) {
      return null;
    }
    let newNode = new _Node(item, target.next);
    target.next = newNode;
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      }
      currNode = currNode.next;
    }
    return currNode;
  }

  removeHead() {
    this.head = this.head.next;
  }

  remove(item) {
    if (!this.head) {
      return null;
    }

    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value.id !== item.value.id) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      return;
    }
    previousNode.next = currNode.next;
  }
}

module.exports = LinkedList;
