const fs = require('./promise_fs'),
      path = require('path');

const { Recipe, RecipeIngredient, Quantity, Ingredient } = require('../models');

const RECIPE = 'recipe.json';
const ONTOLOGY = 'ontology.json';


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
        ingredients = data.ingredients.map((item) => this._build_ingredient(item));

    ingredients = await Promise.all(ingredients);
    let recipe = new Recipe(data.name, attrs, ingredients);

    ingredients.forEach((ingredient) => ingredient.recipe = recipe);
    recipe.id = id;

    return recipe;
  }

  async _build_ingredient({ name, quantity, prep }) {
    quantity = this._build_quantity(quantity);

    let ontology = await this._load_ontology(),
        entry = ontology.ingredients.find((entry) => entry.name === name),
        { attributes, group } = entry || {};

    return new RecipeIngredient(
      new Ingredient(name, attributes || [], group),
      quantity,
      prep);
  }

  _build_quantity(quantity) {
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

  _load_ontology() {
    let full_path = path.join(this._root, ONTOLOGY);

    return this._ontology = this._ontology
        || fs.readFile(full_path, 'utf8').then(JSON.parse);
  }
}

module.exports = Store;
