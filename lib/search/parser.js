const { Term, And, AndNot, Any } = require('./nodes');

class Parser {
  constructor(tokens) {
    this._tokens = tokens;
    this._offset = 0;
    this._cache  = {};
  }

  parse_tree() {
    return this.parse_query();
  }

  parse_query() {
    return this.parse_not()
        || this.parse_and_not()
        || this.parse_and_expr();
  }

  parse_not() {
    if (!this.parse_and_not_op()) return null;

    let query = this.parse_and_expr();
    if (!query) return null;

    return new AndNot(new Any(), query);
  }

  parse_and_expr() {
    return this.parse_and()
        || this.parse_term();
  }

  parse_and_not() {
    return this.binary_op('and-not', AndNot,
      'parse_and_expr',
      'parse_and_not_op',
      'parse_and_expr');
  }

  parse_and_not_op() {
    while (this.parse_and_op());
    return this.read('not');
  }

  parse_and() {
    return this.binary_op('and', And,
      'parse_term',
      'parse_and_op',
      'parse_and_expr');
  }

  parse_and_op() {
    return this.read('and') || this.read('non-word');
  }

  binary_op(type, node_class, left_method, op_method, right_method) {
    return this.capture(type, () => {
      let left = this[left_method]();
      if (!left) return null;

      let ops = 0;
      while (this[op_method]()) ops += 1
      if (ops === 0) return null;

      let right = this[right_method]();
      if (!right) return null;

      return new node_class(left, right);
    });
  }

  parse_term() {
    return this.capture('term', () => {
      let words = [];

      while (true) {
        let word = this.read('word');
        if (!word) break;
        words.push(word);
      }

      if (words.length === 0) return null;
      return new Term(words.map(w => w.token).join(' '));
    });
  }

  read(type) {
    let token = this._tokens[this._offset];
    if (!token || token.type !== type) return null;

    this._offset += 1;
    return token;
  }

  capture(type, action) {
    let cached = this._cache[type] = this._cache[type] || {},
        record = cached[this._offset];

    if (record) {
      this._offset = record.offset;
      return record.node;
    }

    let start = this._offset,
        node  = action();

    if (!node) this._offset = start;
    cached[start] = { offset: this._offset, node };

    return node;
  }
}

function parse(tokens) {
  let parser = new Parser(tokens);
  return parser.parse_tree();
}

module.exports = {
  parse,
  Term, And, AndNot, Any
};
