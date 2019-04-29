class Term {
  constructor(words) {
    this.type  = 'term';
    this.words = words;
  }
}

class And {
  constructor(left, right) {
    this.type  = 'and';
    this.left  = left;
    this.right = right;
  }
}

class AndNot {
  constructor(left, right) {
    this.type  = 'and-not';
    this.left  = left;
    this.right = right;
  }
}

class Any {}

module.exports = {
  Term,
  And,
  AndNot,
  Any,
};
