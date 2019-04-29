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
})
