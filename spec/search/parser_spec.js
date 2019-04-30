const {
  parse,
  QuantityTerm, Term,
  And, AndNot, Any } = require('../../lib/search/parser');


function word(token) {
  return { type: 'word', token }
}

function quantity(token) {
    return { type: 'quantity', token }
}

function non_word(token) {
  return { type: 'non-word', token }
}

function op(type) {
  return { type }
}

const COMMA = non_word(',');
const AND   = op('and');
const NOT   = op('not');


describe('parser', () => {
  it('returns an empty token list as null', () => {
    expect(parse([])).toEqual(null);
  })

  it('parses a word as a term', () => {
    let tokens = [word('lamb')];
    expect(parse(tokens)).toEqual(new Term('lamb'));
  })

  it('parses multiple words as a term', () => {
    let tokens = [word('lamb'), word('eggs')];
    expect(parse(tokens)).toEqual(new Term('lamb eggs'));
  })

  it('parses a unitless quantity term', () => {
    let tokens = [quantity('3'), word('egg')];
    expect(parse(tokens)).toEqual(new QuantityTerm(3, null, 'egg'));
  })

  it('parses a unit quantity term', () => {
    let tokens = [quantity('300ml'), word('milk')];
    expect(parse(tokens)).toEqual(new QuantityTerm(300, 'ml', 'milk'));
  })

  it('parses an and-expression', () => {
    let tokens = [word('lamb'), AND, word('eggs')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term('lamb'),
        new Term('eggs'),
      ))
  })

  it('parses an and-expression with non-words', () => {
    let tokens = [word('lamb'), COMMA, word('eggs')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term('lamb'),
        new Term('eggs'),
      ))
  })

  it('parses an and-expression with multiple left-words', () => {
    let tokens = [word('lamb'), word('mince'), AND, word('eggs')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term('lamb mince'),
        new Term('eggs'),
      ))
  })

  it('parses an and-expression with multiple right-words', () => {
    let tokens = [word('lamb'), AND, word('boiled'), word('eggs')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term('lamb'),
        new Term('boiled eggs'),
      ))
  })

  it('parses a chained and-expression', () => {
    let tokens = [word('lamb'), COMMA,
                  word('potato'), COMMA,
                  word('mint'), word('sauce'), AND,
                  word('rosemary')];

    expect(parse(tokens)).toEqual(
      new And(
        new Term('lamb'),
        new And(
          new Term('potato'),
          new And(
            new Term('mint sauce'),
            new Term('rosemary')))))
  })

  it('parses ", and" as a single operator', () => {
    let tokens = [word('fish'), COMMA, AND, word('chips')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term('fish'),
        new Term('chips')))
  })

  it('parses an and-not-expression', () => {
    let tokens = [word('meat'), AND, NOT, word('dairy')];
    expect(parse(tokens)).toEqual(
      new AndNot(
        new Term('meat'),
        new Term('dairy')))
  })

  it('parses a not-expression', () => {
    let tokens = [NOT, word('dairy')];
    expect(parse(tokens)).toEqual(
      new AndNot(
        new Any(),
        new Term('dairy')))
  })

  it('parses and-not with and on both sides', () => {
    let tokens = [word('meat'), COMMA, word('fish'), NOT, word('dairy'), COMMA, word('gluten')];
    expect(parse(tokens)).toEqual(
      new AndNot(
        new And(new Term('meat'), new Term('fish')),
        new And(new Term('dairy'), new Term('gluten'))))
  })
})
