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
        contents = await fs.readFile(recipe_path, 'utf8'),
        data = JSON.parse(contents);

    let name = data.name,
        attrs = data.attributes,
        ingredients = data.ingredients.map((item) => this.ingredient(item)),
        recipe = new Recipe(data.name, attrs, ingredients);

    ingredients.forEach((ingredient) => ingredient.recipe = recipe);

    return recipe;
  }

  ingredient({ name, quantity, prep }) {
    quantity = this.quantity(quantity);

    return new RecipeIngredient(
      new Ingredient(name),
      quantity,
      prep);
  }

  quantity(quantity) {
    switch (typeof quantity) {
      case 'number':
        return new Quantity(quantity);
      case 'object':
        let { amount, unit } = quantity;
        return new Quantity(amount, unit);
      case 'undefined':
        return undefined;
    }
  }
}

module.exports = Store;
