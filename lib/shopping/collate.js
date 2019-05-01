let { Quantity } = require('../models');

function collate_recipes(recipes) {
  let result = { groups: [] };
  // result.groups -> [ group ]
  // group.name
  // group.ingredients -> [ list_ingredient ]
  // list_ingredient.name
  // list_ingredient.recipe_ingredients
  // list_ingredient.quantity *
  let groups = [];
  let recipe_ingredients = [];
  for (let recipe of recipes) {
    for (let recipe_ingredient of recipe.ingredients) {
      recipe_ingredients.push(recipe_ingredient);
      if (! groups.includes(recipe_ingredient.ingredient.group)) {
        groups.push(recipe_ingredient.ingredient.group);
      }
    }
  }

  groups = groups.sort()
  if (groups.length > 0 && groups[groups.length - 1] === undefined) {
    // Move an undefined group to the beginning (this will contain
    // any ingredient that doesn't have a defined group -- perhaps
    // because it's not in our ontology at all).
    groups.pop();
    groups.unshift(undefined);
  }

  for (let group of groups) {
    let group_obj = { name: group, ingredients: [] };
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
      let list_ingredient = {
        name: ingredient,
        recipe_ingredients: group_ris.get(ingredient),
      }
      list_ingredient.quantity = collate_quantities(
        list_ingredient.recipe_ingredients.map(
          i => i.quantity
        )
      );
      group_obj.ingredients.push(list_ingredient);
    }

    result.groups.push(group_obj);
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

module.exports = { collate_recipes, collate_quantities };
