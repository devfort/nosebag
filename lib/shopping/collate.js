let { Quantity } = require('../models');

class ShoppingListGroup {
  constructor(name, ingredients=[]) {
    this.name = name;
    this.ingredients = ingredients;
  }

  add_item(item) {
    this.ingredients.push(item);
  }
}

class ShoppingListItem {
  constructor(name, recipe_ingredients, quantity=null) {
    this.name = name;
    this.recipe_ingredients=recipe_ingredients;
    this.quantity = quantity;
    this.bought = null;
  }
}

class ShoppingListItemAvailable {
  constructor(name, parts=[]) {
    this.name = name;
    this.parts = parts;
  }
}

class ShoppingListItemAvailablePart {
  constructor(recipe_id, quantity) {
    this.recipe_id = recipe_id;
    this.quantity = quantity;
  }
}

function collate_recipes(recipes) {
  let result = [];
  // result -> [ ShoppingListGroup ]
  // group.ingredients -> [ ShoppingListItem ]
  let group_names = [];
  let recipe_ingredients = [];
  for (let recipe of recipes) {
    for (let recipe_ingredient of recipe.ingredients) {
      recipe_ingredients.push(recipe_ingredient);
      if (! group_names.includes(recipe_ingredient.ingredient.group)) {
        group_names.push(recipe_ingredient.ingredient.group);
      }
    }
  }

  group_names = group_names.sort()
  if (group_names.length > 0 && group_names[group_names.length - 1] === undefined) {
    // Move an undefined group to the beginning (this will contain
    // any ingredient that doesn't have a defined group -- perhaps
    // because it's not in our ontology at all).
    group_names.pop();
    group_names.unshift(undefined);
  }

  for (let group of group_names) {
    let group_obj = new ShoppingListGroup(group);
    let group_ingredients = [];
    let group_ris = new Map();
    for (let ri of recipe_ingredients) {
      if (ri.ingredient.group == group) {
        if (! group_ris.has(ri.ingredient.name)) {
          group_ris.set(ri.ingredient.name, [])
        }
        group_ris.get(ri.ingredient.name).push(ri);
        if (! group_ingredients.includes(ri.ingredient.name)) {
          group_ingredients.push(ri.ingredient.name);
        }
      }
    }

    group_ingredients = group_ingredients.sort();
    for (let ingredient of group_ingredients) {
      let list_ingredient = new ShoppingListItem(
        ingredient,
        group_ris.get(ingredient),
        collate_quantities(
          group_ris.get(ingredient).map(
            i => i.quantity
          )
        )
      )
      group_obj.add_item(list_ingredient);
    }

    result.push(group_obj);
  }

  return result;
}

function collate_quantities(quantities) {
  if (quantities.filter(
    q => q !== null
  ).length == quantities.length) {
    // All have quantities
    if (quantities.map(
      q => q.unit
    ).map(
      // The list ingredient wouldn't exist without at least one
      // recipe ingredient, which must have a quantity from the
      // previous test.
      u => u == quantities[0].unit
    ).reduce(
      (a, c) => a && c,
      true,
    )) {
      // All recipe ingredients have the same unit, so we can
      // combine them.
      return new Quantity(
        quantities.map(q => q.amount).reduce(
          (a, c) => a + c,
          0,
        ),
        quantities[0].unit,
      )
    }
  }
  return null;
}

module.exports = {
  collate_recipes,
  collate_quantities,
  ShoppingListItemAvailable,
  ShoppingListItemAvailablePart,
};
