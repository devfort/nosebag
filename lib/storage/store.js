const {
    Recipe,
    RecipeIngredient,
    RecipeStep,
    Quantity,
    Ingredient,
} = require('../models');

const INDEX    = 'recipes.json';
const RECIPE   = 'recipe.json';
const ONTOLOGY = 'ontology.json';


class Store {
  constructor(adapter) {
    this._adapter = adapter;
  }

  async list_recipes() {
    return this._adapter.read_file(INDEX)
           .then(JSON.parse)
           .then((data) => data.recipes);
  }

  async get_recipe(id) {
    let recipe_path = [id, RECIPE].join('/'),
        contents = await this._adapter.read_file(recipe_path),
        data = JSON.parse(contents);

    let name = data.name,
        attrs = data.attributes,
        steps = data.steps.map((item) => this._build_step(item)),
        ingredients = data.ingredients.map((item) => this._build_ingredient(item));

    ingredients = await Promise.all(ingredients);
    let recipe = new Recipe(id=id, data.name, data.serves, attrs, ingredients, steps);

    ingredients.forEach((ingredient) => ingredient.recipe = recipe);

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

  _build_step(step) {
    return new RecipeStep(step.task);
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
    return this._ontology = this._ontology
        || this._adapter.read_file(ONTOLOGY).then(JSON.parse);
  }
}

module.exports = Store;
