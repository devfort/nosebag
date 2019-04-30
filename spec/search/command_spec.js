let { Search } = require('../../lib/search/command');
let { tokenize } = require('../../lib/search/tokenizer');
let { parse } = require('../../lib/search/parser');

let log_spy = jasmine.createSpy('log spy');

describe('search command', () => {
  let searcher = new Search("dr.syntax", log_spy);

  it('finds nothing when there is nothing', async () => {
    let query = parse(tokenize("archeopteryx"));
    let results = await searcher.search(query);
    expect(results).toEqual([]);
  })

  it('finds things when there are things', async () => {
    let query = parse(tokenize("bacon"));
    let results = await searcher.search(query);
    expect(results.length).toEqual(1);
  })
});
