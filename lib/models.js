class Recipe {
  constructor(id, name, attributes=[], ingredients=[], steps=[]) {
    this.id = id;
    this.name = name;
    this.attributes = attributes;
    this.ingredients = ingredients;
    this.steps = steps;
  }

  toString() {
    return this.name;
  }
}

class RecipeStep {
  constructor(task) {
    this.task = task;
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

  toString() {
    if (! this.unit) {
      return this.amount;
    } else {
      return this.amount + ' ' + this.unit.toString();
    }
  }
}

class Ingredient {
  constructor(name, attributes=[], group=undefined) {
    this.name = name;
    this.attributes = attributes;
    this.group = group;
  }
}

module.exports = {
  Recipe,
  RecipeIngredient,
  RecipeStep,
  Quantity,
  Ingredient,
};
