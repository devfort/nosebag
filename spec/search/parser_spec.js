const { parse, Term, And, AndNot, Any } = require('../../lib/search/parser');


function word(token) {
  return { type: 'word', token }
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
  it('parses a word as a term', () => {
    let tokens = [word('lamb')];
    expect(parse(tokens)).toEqual(new Term(tokens));
  })

  it('parses multiple words as a term', () => {
    let tokens = [word('lamb'), word('eggs')];
    expect(parse(tokens)).toEqual(new Term(tokens));
  })

  it('parses an and-expression', () => {
    let tokens = [word('lamb'), AND, word('eggs')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term([word('lamb')]),
        new Term([word('eggs')]),
      ))
  })

  it('parses an and-expression with non-words', () => {
    let tokens = [word('lamb'), COMMA, word('eggs')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term([word('lamb')]),
        new Term([word('eggs')]),
      ))
  })

  it('parses an and-expression with multiple left-words', () => {
    let tokens = [word('lamb'), word('mince'), AND, word('eggs')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term([word('lamb'), word('mince')]),
        new Term([word('eggs')]),
      ))
  })

  it('parses an and-expression with multiple right-words', () => {
    let tokens = [word('lamb'), AND, word('boiled'), word('eggs')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term([word('lamb')]),
        new Term([word('boiled'), word('eggs')]),
      ))
  })

  it('parses a chained and-expression', () => {
    let tokens = [word('lamb'), COMMA,
                  word('potato'), COMMA,
                  word('mint'), word('sauce'), AND,
                  word('rosemary')];

    expect(parse(tokens)).toEqual(
      new And(
        new Term([word('lamb')]),
        new And(
          new Term([word('potato')]),
          new And(
            new Term([word('mint'), word('sauce')]),
            new Term([word('rosemary')])))))
  })

  it('parses ", and" as a single operator', () => {
    let tokens = [word('fish'), COMMA, AND, word('chips')];
    expect(parse(tokens)).toEqual(
      new And(
        new Term([word('fish')]),
        new Term([word('chips')])))
  })

  it('parses an and-not-expression', () => {
    let tokens = [word('meat'), AND, NOT, word('dairy')];
    expect(parse(tokens)).toEqual(
      new AndNot(
        new Term([word('meat')]),
        new Term([word('dairy')])))
  })

  it('parses a not-expression', () => {
    let tokens = [NOT, word('dairy')];
    expect(parse(tokens)).toEqual(
      new AndNot(
        new Any(),
        new Term([word('dairy')])))
  })

  it('parses and-not with and on both sides', () => {
    let tokens = [word('meat'), COMMA, word('fish'), NOT, word('dairy'), COMMA, word('gluten')];
    expect(parse(tokens)).toEqual(
      new AndNot(
        new And(new Term([word('meat')]), new Term([word('fish')])),
        new And(new Term([word('dairy')]), new Term([word('gluten')]))))
  })
})
