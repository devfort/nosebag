const fs        = require('fs'),
      path      = require('path'),
      Store     = require('../../lib/storage/store'),
      FSAdapter = require('../../lib/storage/fs_adapter');

const { Recipe, RecipeIngredient, Quantity, Ingredient } = require('../../lib/models');

const STORE_PATH = path.resolve(__dirname, '..', 'fixtures');


describe('filesystem store', () => {
  let adapter, store

  beforeEach(() => {
    adapter = new FSAdapter(STORE_PATH);
    store = new Store(adapter);
  })

  describe('list_recipes', () => {
    it('returns a list of recipe IDs', async () => {
      let recipes = await store.list_recipes();
      expect(recipes).toEqual([
          'bacon-hash',
          'cauliflower-fritter-lime-sauce',
          'chicken-chorizo-gumbo',
          'fish-chorizo-stew',
          'key-lime-pie',
          'lemon-curd-tart',
          'rice-pudding',
          'sunday-lamb-roast',
        ]);
    })

    it('can load all the enumerated recipes', async () => {
      let recipes = await store.list_recipes();
      for (let id of recipes)
        await store.get_recipe(id)
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

    it('exposes the recipe ID', () => {
      expect(recipe.id).toEqual('rice-pudding');
    })

    it('exposes the attributes', () => {
      expect(recipe.attributes).toEqual(['dessert']);
    })

    it('exposes the ingredient list', () => {
      expect(recipe.ingredients.length).toEqual(6);
    })

    it('exposes the recipe serves', () => {
      expect(recipe.serves).toEqual('4 to 6');
    })

    it('builds RecipeIngredient objects', () => {
      let item = recipe.ingredients[0];
      expect(item instanceof RecipeIngredient).toBeTruthy();
      expect(item.recipe).toEqual(recipe);
    })

    it('supplies Ingredient metadata', () => {
      let expected = new Ingredient('white long grain rice', [], 'rice');
      let item = recipe.ingredients[0];
      expect(item.ingredient).toEqual(expected);
    })

    it('builds Quantity objects', () => {
      let item = recipe.ingredients[0];
      expect(item.quantity).toEqual(new Quantity(100, 'g'))
    })

    it('normalises quantities', () => {
      let item = recipe.ingredients[4];
      expect(item.quantity).toEqual(new Quantity(1));
    })

    it('builds Step objects', () => {
      expect(recipe.steps.length).toEqual(6);
      let item = recipe.steps[2];
      expect(item.task).toEqual("Remove the lid, turn off the heat, then add the sugar and milk. Whisk for a minute or two, until the pan is deglazed.");
    })

    it('builds preparation Step objects', () => {
      expect(recipe.prepsteps.length).toEqual(2);
      let item = recipe.prepsteps[1];
      console.log(recipe.prepsteps);
      expect(item.task).toEqual("egg: separate the yolk from the white");
    });
  })
})
