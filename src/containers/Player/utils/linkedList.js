class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(val) {
    let newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
    return this.length;
  }

  pop() {
    if (!this.head) return null;
    let current = this.head;
    let newTail = current;
    while (current.next) {
      newTail = current;
      current = current.next;
    }
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = newTail;
      this.tail.next = null;
    }
    this.length--;

    return current;
  }

  shift() {
    if (!this.head) return null;
    let temp = this.head;
    this.head = this.head.next;
    temp.next = null;
    this.length--;
    if (this.length === 0) this.tail = null;
    return temp;
  }

  unshift(val) {
    let newNode = new Node(val);
    if (!this.head) this.tail = newNode;
    else newNode.next = this.head;
    this.head = newNode;
    this.length++;
    return this;
  }

  get(idx) {
    if (idx < 0 || idx >= this.length) return null;
    let current = this.head;
    for (let i = 0; i <= idx; i++) {
      if (i === idx) return current;
      current = current.next;
    }
  }

  set(idx, val) {
    let temp = this.get(idx);
    if (temp) {
      temp.val = val;
      return true;
    } else return false;
  }

  insert(idx, val) {
    if (idx < 0 || idx > this.length) return false;
    if (idx === 0) return !!this.unshift(val);
    if (idx === this.length) return !!this.push(val);
    let newNode = new Node(val);
    let current = this.get(idx - 1);
    newNode.next = current.next;
    current.next = newNode;
    this.length++;
    return true;
  }

  remove(idx) {
    if (idx < 0 || idx >= this.length) return false;
    if (idx === 0) return !!this.shift();
    if (idx === this.length - 1) return !!this.pop();
    let current = this.get(idx - 1);
    current.next = current.next.next;
    this.length--;
    return true;
  }

  reverse(pre = null, current = this.head) {
    if (this.length <= 1) return this;
    let nextNode = current.next;
    if (!pre) {
      this.tail = this.head ;
      this.tail.next = null;
    }
    current.next = pre;
    pre = current;
    if (nextNode.next === null) {
      this.head = nextNode;
      this.head.next = pre;
      return this;
    }
    return this.reverse(pre, nextNode);
  }
}
