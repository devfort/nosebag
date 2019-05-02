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
  constructor(item) {
    this.name = item.name;
    this.parts = item.recipe_ingredients.map(
      ri => new ShoppingListItemAvailablePart(
        ri.recipe.id,
        ri.quantity,
      ),
    );
    this.quantity = item.quantity;
  }

  satisfies(item) {
    /* does what we've marked as available satisfy the requirement
     * (which is likely to be from a different collation)?
     */
    if (item.name != this.name) {
      return false;
    }
    /* If we satisfy the item's quantity, then everything is fine,
     * because if there were mismatches units then we wouldn't have
     * a collated quantity at all.
     */
    if (this.quantity && this.quantity.satisfies(item.quantity)) {
      return true;
    }
    /* We ignore the collated quantity, because in the general case
     * that's not enough. So instead we compare our parts (which is
     * how we were going to use what we have available to satisfy
     * various recipes) with the RecipeIngredients of the item we're
     * checking against.
     */
    this.parts.forEach(
      p => p.used = false
    );
    for (let ri of item.recipe_ingredients) {
      var satisfied = false;
      /* First we look for the same recipe. (Otherwise we'll helpfully
       * use another part to satisfy this RI, and may run into trouble
       * later because we won't necessarily have used all of it. We
       * could do a better job by aggregating Quantity objects with the
       * same unit, but that sounds like work.) */
      for (var part of this.parts) {
        if (part.used || part.recipe_id != ri.recipe.id) {
          continue;
        }
        if (part.quantity && part.quantity.satisfies(ri.quantity)) {
          satisfied = true;
          part.used = true;
          continue;
        }
      }
      if (! satisfied) {
        /* If that didn't work, we find any part with a quantity that
         * would satisfy us. */
        for (var part of this.parts) {
          if (! part.used && part.quantity &&
              part.quantity.satisfies(ri.quantity)) {
            satisfied = true;
            part.used = true;
            continue;
          }
        }
      }
      if (! satisfied) {
        /* Something cannot be satisfied by our parts, so we cannot
         * satisfy the item overall.
         */
        return false;
      }
    }
    this.parts.forEach(
      p => p.used = undefined
    );
    return true;
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
  ShoppingListItem,
  ShoppingListItemAvailable,
  ShoppingListItemAvailablePart,
};
