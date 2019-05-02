class Recipe {
  constructor(id, name, serves=null, attributes=[], ingredients=[], prepsteps=[], steps=[]) {
    this.id = id;
    this.name = name;
    this.attributes = attributes;
    this.serves = serves;
    this.ingredients = ingredients;
    this.prepsteps = prepsteps;
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

  satisfies(other) {
    /* Is this enough of something to satisfy a quantity requirement? */
    return (
      other !== null &&
      this.unit == other.unit &&
        this.amount >= other.amount
    );
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
