const fs = require('fs'),
      path = require('path'),
      Store = require('../../lib/storage/fs');

const { Recipe, RecipeIngredient, Quantity, Ingredient } = require('../../lib/models');

const STORE_PATH = path.resolve(__dirname, '..', '..', 'dr.syntax');


describe('filesystem store', () => {
  let store

  beforeEach(() => {
    store = new Store(STORE_PATH);
  })

  describe('list_recipes', () => {
    it('returns a list of recipe IDs', async () => {
      let recipes = await store.list_recipes();
      expect(recipes).toEqual([
          'bacon-hash',
          'cauliflower-fritter-lime-sauce',
          'chicken-chorizo-gumbo',
          'fish-chorizo-stew',
          'lemon-curd-tart',
          'rice-pudding',
          'sunday-lamb-roast',
        ]);
    })
  })

  describe('get_recipe', () => {
    let recipe

    beforeEach(async () => {
      recipe = await store.get_recipe('rice-pudding');
    })

    it('returns a Recipe', () => {
      expect(recipe instanceof Recipe).toBeTruthy();
    })

    it('exposes the recipe title', () => {
      expect(recipe.name).toEqual('Rice pudding');
    })

    it('exposes the attributes', () => {
      expect(recipe.attributes).toEqual(['dessert']);
    })

    it('exposes the ingredient list', () => {
      let ingredients = recipe.ingredients;
      expect(ingredients.length).toEqual(6);
      expect(ingredients[0] instanceof RecipeIngredient).toBeTruthy();
    })

    it('builds RecipeIngredient objects', () => {
      let item = recipe.ingredients[0];
      expect(item.ingredient).toEqual(new Ingredient('white long grain rice'));
      expect(item.quantity).toEqual(new Quantity(100, 'g'))
    })

    it('normalises quantities', () => {
      let item = recipe.ingredients[4];
      expect(item.quantity).toEqual(new Quantity(1));
    })
  })
})
