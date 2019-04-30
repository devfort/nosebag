class Recipe {
  constructor(name, attributes=[], ingredients=[]) {
    this.name = name;
    this.attributes = attributes;
    this.ingredients = ingredients;
  }

  toString() {
    return this.name;
  }
}

class RecipeIngredient {
  constructor(ingredient, quantity=null, prep=null) {
    this.ingredient = ingredient;
    this.quantity = quantity;
    this.prep = prep;
  }
}

class Quantity {
  constructor(amount, unit) {
    this.amount = amount;
    this.unit = unit;
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
  Quantity,
  Ingredient,
};
