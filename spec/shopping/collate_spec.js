let { collate_recipes, collate_quantities } = require('../../lib/shopping/collate'),
    {
      Recipe,
      Ingredient,
      RecipeIngredient,
      Quantity,
    } = require('../../lib/models');

let bacon = new Ingredient('bacon', [ 'meat' ], 'meat');
let potato = new Ingredient('large potato', [], 'below the ground');
let chorizo = new Ingredient('chorizo', [ 'meat' ], 'meat');
let bread = new Ingredient('bread');
let bacon_hash = new Recipe(
  'bacon hash',
  [ 'gluten-free' ],
  [
    new RecipeIngredient(bacon, quantity=new Quantity(100, 'g')),
    new RecipeIngredient(potato, quantity=new Quantity(2)),
  ],
);
let gumbo = new Recipe(
  'gumbo',
  [ 'gluten-free' ],
  [ new RecipeIngredient(chorizo) ],
);
let bacon_sandwich = new Recipe(
  'bacon sandwich',
  [ 'nut-free' ],
  [
    new RecipeIngredient(bacon, quantity=new Quantity(50, 'g')),
    new RecipeIngredient(bread),
  ],
);
let potato_surprise = new Recipe(
  'potato surprise',
  [],
  [
    new RecipeIngredient(potato, quantity=new Quantity(200, 'g')),
  ],
)

function fixup_ingredient_backrefs(recipes) {
  for (let recipe of recipes) {
    for (let ingredient of recipe.ingredients) {
      ingredient.recipe = recipe;
    }
  }
}
fixup_ingredient_backrefs([
  bacon_hash,
  gumbo,
  bacon_sandwich,
  potato_surprise,
])

describe('collate_recipes', () => {
  it('lexically sorted groups with undefined first', () => {
    let shopping_list = collate_recipes([ bacon_sandwich, bacon_hash ]);
    // Groups should be lexically sorted (but with undefined at the start)
    expect(shopping_list.groups[0].name).toEqual(undefined);
    expect(shopping_list.groups[1].name).toEqual('below the ground');
    expect(shopping_list.groups[2].name).toEqual('meat');
  })

  it('pulls together ingredients of the same name', () => {
    let shopping_list = collate_recipes([ bacon_sandwich, bacon_hash ]);
    expect(shopping_list.groups.length).toEqual(3);
    // Bacon should have been collapsed into one ingredient
    // within the group
    expect(shopping_list.groups[2].ingredients.length).toEqual(1);
    expect(shopping_list.groups[2].ingredients[0].name).toEqual('bacon');
    // And we can access the RecipeIngredients that bacon was found in
    // (which tells us which recipes they came from, because of
    // backlinks).
    expect(
      shopping_list.groups[2].ingredients[0].recipe_ingredients.length
    ).toEqual(2);
  })

  it('pulls together ingredients in the same group', () => {
    let shopping_list = collate_recipes([ gumbo, bacon_hash ]);
    expect(shopping_list.groups.length).toEqual(2);
    // Groups should be lexically sorted, with meat last
    expect(shopping_list.groups[1].name).toEqual('meat');
    expect(shopping_list.groups[1].ingredients.length).toEqual(2);
    // Ingredients lexically sorted within the group
    expect(shopping_list.groups[1].ingredients[0].name).toEqual('bacon');
    expect(shopping_list.groups[1].ingredients[1].name).toEqual('chorizo');
  })

  it('adds together quantities of an ingredient', () => {
    let shopping_list = collate_recipes([ bacon_sandwich, bacon_hash ]);
    let collated_bacon = shopping_list.groups[2].ingredients[0];
    expect(collated_bacon.name).toEqual('bacon');
    expect(collated_bacon.quantity.amount).toEqual(150);
    expect(collated_bacon.quantity.unit).toEqual('g');
  })

  it('leaves quantities of different units separate', () => {
    let shopping_list = collate_recipes([ potato_surprise, bacon_hash ]);
    collated_potato = shopping_list.groups[0].ingredients[0];
    expect(collated_potato.name).toEqual('large potato');
    expect(collated_potato.quantity).toEqual(null);
    expect(collated_potato.recipe_ingredients.length).toEqual(2);
  })

  it('collates ingredients without a group into an un-named groups', () => {
    let shopping_list = collate_recipes([ bacon_sandwich ]);
    expect(shopping_list.groups.length).toEqual(2);
    expect(shopping_list.groups[0].name).toEqual(undefined);
    expect(shopping_list.groups[0].ingredients.length).toEqual(1);
    expect(shopping_list.groups[0].ingredients[0].name).toEqual('bread');
  })

  it('copes with the same recipe twice', () => {
    let shopping_list = collate_recipes([ bacon_sandwich, bacon_sandwich ]);
    expect(shopping_list.groups[1].name).toEqual('meat');
    expect(shopping_list.groups[1].ingredients.length).toEqual(1);
    expect(shopping_list.groups[1].ingredients[0].quantity.amount).toEqual(100);
    expect(shopping_list.groups[1].ingredients[0].quantity.unit).toEqual('g');
    // And it should have the (singular) RI object _twice_ because otherwise
    // we don't know that the 100g is being used as 50g twice. If we only
    // included the RI object once, we'd either have to decorate it with x2
    // or we would show 100g of bacon having only 50g used, which is misleading.
    expect(
      shopping_list.groups[1].ingredients[0].recipe_ingredients.length
    ).toEqual(2);
  })
});

describe('collate_quantities', () => {
  it('adds quantities with the same unit', () => {
    let quantity = collate_quantities([
      new Quantity(100, 'g'),
      new Quantity(200, 'g'),
    ]);
    expect(quantity.unit).toEqual('g');
    expect(quantity.amount).toEqual(300);
  })

  it('returns null with missing quantities', () => {
    let quantity = collate_quantities([
      new Quantity(100, 'g'),
      null,
    ]);
    expect(quantity).toEqual(null);
  })

  it('returns null with missing units', () => {
    let quantity = collate_quantities([
      new Quantity(100, 'g'),
      new Quantity(200),
    ]);
    expect(quantity).toEqual(null);
  })

  it('returns null with mismatched units', () => {
    let quantity = collate_quantities([
      new Quantity(100, 'g'),
      new Quantity(2, 'cups'),
    ]);
    expect(quantity).toEqual(null);
  })
});
