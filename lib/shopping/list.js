const Store = require('../storage/store');
const FetchAdaptor = require('../storage/fetch_adapter');
const { collate_recipes } = require('./collate');

class ShoppingList {
  constructor(recipes) {
    this.recipes_to_counts = new Map();
    recipes.forEach(recipe => {
      if (! this.recipes_to_counts.has(recipe.id)) {
        this.recipes_to_counts.set(
          recipe.id,
          {
            recipe: recipe,
            count: 0,
          }
        )
      }
      this.recipes_to_counts.get(recipe.id).count ++;
    });
    let collation = collate_recipes(this.flat_recipes());
    this.groups = collation.groups;
  }

  flat_recipes() {
    let result = [];
    this.recipes_to_counts.forEach(
      (rac, r_id) => {
        for (let i=0; i<rac.count; ++i) {
          result.push(rac.recipe);
        }
      }
    )
    return result;
  }

  item_count() {
    return this.groups.reduce(
      (acc, cur) => acc + cur.ingredients.length,
      0
    )
  }
}

module.exports = ShoppingList;
