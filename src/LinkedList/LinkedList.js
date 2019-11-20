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
    for (let i = 0; i <= pos; i++) {
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

  remove(item) {
    if (!this.head) {
      return null;
    }
    console.log("THIS IS THE ITEM")
    console.log(item)
    console.log(this.head.value)
    if (this.head.value.id === item.value.id) {
      console.log('THIS IS HEAD.NEXT IN LL INSIDE IF STATEMENT')
      console.log(this.head.next)
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      return;
    }
    previousNode.next = currNode.next;
  }
}

// function main() {
//   const list = new LinkedList();
//   list.insertFirst('1');
//   list.insertLast('2');
//   list.insertLast('3');
//   list.insertLast('4');
//   list.insertLast('5');
//   list.insertLast('6');

  // let before = findBefore(list, 3);
  // console.log(before);
  // updateHead(list);
  // display(list);
// }

// function findBefore(list, num) {
//   let before = list.head;

//   for (let i = 1; i < num; i++) {
//     before = before.next;
//   }
//   return before;
// }

// function updateHead(list) {
//   list.head = list.head.next;
// }

//Make a first and last pointer
//
//node first = head
//node last = head
//
//make a loop to point to the node you want to insert after
//
//change head pointer to point to second node in the list
//
//set the next of first as null (first is captured)
//
//
//SO...
//
//might have something like first = head
//
//noide last (aka the node before where we need to insert)== end of loop
//
//set head to 2.
//
//set first.next to last.next
//set last.next to first
// main();

// function moveHead(list, num) {
//   let node = list.head;
//   let count = 0;
//   let tempNode = new _Node();
//   let newHead = list.head.next;

//   while (count <= num) {
//     console.log('current node');
//     console.log(node);
//     node = node.next;
//     console.log('next node');
//     console.log(node);
//     count++;
//   }
//   list.head = newHead;
//   list.head.next = tempNode; //connected to temp node
//   tempNode.next = node.next; //tempnode next = 4
//   node.next = this.head; //3 ===head
//   // list.head.next = tempNode.next; //old head next ==4
// }

function display(list) {
  let currNode = list.head;

  while (currNode !== null) {
    console.log(currNode.value);
    currNode = currNode.next;
  }
}

function size(list) {
  let currNode = list.head;
  let size = 0;
  while (currNode !== null) {
    currNode = currNode.next;
    size++;
  }

  return size;
}

function isEmpty(list) {
  if (list.head === null) return 'is empty';
  return 'is not empty';
}

function findPrevious(list, item) {
  let currNode = list.head;
  while (currNode.next.value !== item) {
    currNode = currNode.next;
  }
  if (!currNode) return null;
  return JSON.stringify(currNode);
}

function findLast(list) {
  let currNode = list.head;
  if (!currNode) return null;
  while (currNode.next !== null) {
    currNode = currNode.next;
  }
  return JSON.stringify(currNode);
}

module.exports = LinkedList;
