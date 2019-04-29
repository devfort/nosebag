const fs = require('./promise_fs'),
      path = require('path');

const { Recipe, RecipeIngredient, Quantity, Ingredient } = require('../models');

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

  async get_recipe(id) {
    let recipe_path = path.join(this._root, id, RECIPE),
        data = await fs.readFile(recipe_path, 'utf8'),
        recipe = JSON.parse(data);

    let name = recipe.name,
        attrs = recipe.attributes,
        ingredients = recipe.ingredients.map((item) => this.ingredient(item));

    return new Recipe(recipe.name, attrs, ingredients);
  }

  ingredient({ name, quantity, prep }) {
    if (typeof quantity === 'number') quantity = { amount: quantity };
    let { amount, unit } = quantity;

    return new RecipeIngredient(
      new Ingredient(name),
      new Quantity(amount, unit),
      prep);
  }
}

module.exports = Store;
