const fs = require('fs'),
      path = require('path'),
      Store = require('../../lib/storage/fs');

const STORE_PATH = path.resolve(__dirname, '..', '..', 'dr.syntax');

describe('filesystem store', () => {
  let store

  beforeEach(() => {
    store = new Store(STORE_PATH);
  })

  describe('list_recipes', () => {
    it('returns a list of recipe IDs', async () => {
      let recipes = await store.list_recipes();
      expect(recipes).toEqual([
          'bacon-hash',
          'cauliflower-fritter-lime-sauce',
          'chicken-chorizo-gumbo',
          'fish-chorizo-stew',
          'lemon-curd-tart',
          'rice-pudding'
        ]);
    })
  })
})
