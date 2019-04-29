class Recipe {
  constructor(name, attributes=[], ingredients=[]) {
    this.name = name;
    this.attributes = attributes;
    this.ingredients = ingredients;
  }
}

class RecipeIngredient {
  constructor(ingredient, quantity=null, prep=null) {
    this.ingredient = ingredient;
    this.quantity = quantity;
    this.prep = prep;
  }
}

class Ingredient {
  constructor(name, attributes=[]) {
    this.name = name;
    this.attributes = attributes;
  }
}

module.exports = {
  Recipe,
  RecipeIngredient,
  Ingredient,
};
