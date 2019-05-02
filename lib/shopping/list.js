const Store = require('../storage/store');
const FetchAdaptor = require('../storage/fetch_adapter');
const { collate_recipes } = require('./collate');

class ShoppingList {
  constructor() {
    this.recipes_to_counts = new Map();
    this.groups = [];
  }

  add(recipe) {
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
    this.groups = collate_recipes(this.flat_recipes());
  }

  remove(recipe) {
    if (! this.recipes_to_counts.has(recipe.id)) {
      throw new Error(`The recipe "${recipe.name}" is not in this list.`);
    }
    if (-- this.recipes_to_counts.get(recipe.id).count == 0) {
      this.recipes_to_counts.delete(recipe.id);
    }
    this.groups = collate_recipes(this.flat_recipes());
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
