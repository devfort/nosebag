const fs = require('./promise_fs'),
      path = require('path');

const { Recipe, RecipeIngredient, Ingredient } = require('../models');

const RECIPE = 'recipe.json';


class Store {
  constructor(root) {
    this._root = root;
  }

  async list_recipes() {
    let entries = await fs.readdir(this._root);

    let is_recipe = await Promise.all(
      entries.map((entry) => this.is_recipe(entry))
    );

    return entries.filter((_, i) => is_recipe[i]);
  }

  async is_recipe(entry) {
    let full_path = path.join(this._root, entry),
        stats = await fs.stat(full_path);

    if (!stats.isDirectory()) return false;

    stats = await fs.stat(path.join(full_path, RECIPE));
    return stats.isFile();
  }
}

module.exports = Store;
