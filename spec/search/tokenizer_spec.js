let { tokenize } = require('../../lib/search/tokenizer');

describe('tokenizer', () => {
  it('returns empty array for empty string', () => {
    expect(tokenize('')).toEqual([])
  })
  
  it('returns empty array for blank string', () => {
    expect(tokenize(' ')).toEqual([]);
    expect(tokenize('   ')).toEqual([]);
    expect(tokenize(' \n ')).toEqual([]);
  })

  it('returns a single token for lamb', () => {
    expect(tokenize('lamb')).toEqual([{'type': 'word', 'token': 'lamb'}]);
  })

  it('returns several tokens for several words', () => {
    expect(tokenize('lamb  mince')).toEqual([
      {'type': 'word', 'token': 'lamb'},
      {'type': 'word', 'token': 'mince'}
    ]);
  })

  it('returns non-word tokens', () => {
    expect(tokenize('lamb!mince')).toEqual([
      {'type': 'word', 'token': 'lamb'},
      {'type': 'non-word', 'token': '!'},
      {'type': 'word', 'token': 'mince'}
    ])
    expect(tokenize('lamb!!mince')).toEqual([
      {'type': 'word', 'token': 'lamb'},
      {'type': 'non-word', 'token': '!!'},
      {'type': 'word', 'token': 'mince'}
    ])
  })

  it('returns word-like things', () => {
    expect(tokenize('crème brûlée')).toEqual([
      {'type': 'word', 'token': 'crème'},
      {'type': 'word', 'token': 'brûlée'}
    ])
  })

  it('treats and specially', () => {
    expect(tokenize('lamb and mince')).toEqual([
      {'type': 'word', 'token': 'lamb'},
      {'type': 'and', 'token': 'and'},
      {'type': 'word', 'token': 'mince'}
    ])

    expect(tokenize('lamb AND mince')).toEqual([
      {'type': 'word', 'token': 'lamb'},
      {'type': 'and', 'token': 'AND'},
      {'type': 'word', 'token': 'mince'}
    ])
  })

  it('treats not/no specially', () => {
    expect(tokenize('lamb not mince')).toEqual([
      {'type': 'word', 'token': 'lamb'},
      {'type': 'not', 'token': 'not'},
      {'type': 'word', 'token': 'mince'}
    ])

    expect(tokenize('lamb NOT mince')).toEqual([
      {'type': 'word', 'token': 'lamb'},
      {'type': 'not', 'token': 'NOT'},
      {'type': 'word', 'token': 'mince'}
    ])

    expect(tokenize('lamb no mince')).toEqual([
      {'type': 'word', 'token': 'lamb'},
      {'type': 'not', 'token': 'no'},
      {'type': 'word', 'token': 'mince'}
    ])

    expect(tokenize('lamb NO mince')).toEqual([
      {'type': 'word', 'token': 'lamb'},
      {'type': 'not', 'token': 'NO'},
      {'type': 'word', 'token': 'mince'}
    ])
  })

  it('binds numeric quantities to the following word token', () => {
    expect(tokenize('3 eggs')).toEqual([
      {'type': 'quantity', 'token': '3'},
      {'type': 'word', 'token': 'eggs'}
    ])

    expect(tokenize('300ml milk')).toEqual([
      {'type': 'quantity', 'token': '300ml'},
      {'type': 'word', 'token': 'milk'}
    ])
  })
})
