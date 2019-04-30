let { tokenize } = require('./tokenizer'),
    { parse } = require('./parser'),
    Store = require('../storage/store'),
    FSAdapter = require('../storage/fs_adapter');

class Search {
  constructor(storage_dir, log) {
    this.storage_dir = storage_dir;
    this.log = log;
  }

  async run(args) {
    var query = parse(tokenize(args.join(' ')));
    if (query === null) {
      this.log('Please provide some search terms.');
      process.exitCode = 1;
    } else {
      for (let result of await this.search(query)) {
        this.log('Found:', result.toString());
      }
    }
  }

  async search(query) {
    let store = new Store(new FSAdapter(this.storage_dir));
    let results = []
    for (let recipe_id of await store.list_recipes()) {
      let recipe = await store.get_recipe(recipe_id);
      if (query.matches(recipe)) {
        results.push(recipe);
      }
    }
    return results;
  }
}

module.exports = { Search };
