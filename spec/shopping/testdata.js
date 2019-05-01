const {
  Quantity,
  Recipe,
  RecipeIngredient,
  Ingredient,
} = require('../../lib/models');

let bacon = new Ingredient('bacon', [ 'meat' ], 'meat');
let potato = new Ingredient('large potato', [], 'below the ground');
let chorizo = new Ingredient('chorizo', [ 'meat' ], 'meat');
let bread = new Ingredient('bread');
let bacon_hash = new Recipe(
  'bacon-hash',
  'bacon hash',
  [ 'gluten-free' ],
  [
    new RecipeIngredient(bacon, quantity=new Quantity(100, 'g')),
    new RecipeIngredient(potato, quantity=new Quantity(2)),
  ],
);
let gumbo = new Recipe(
  'gumbo',
  'gumbo',
  [ 'gluten-free' ],
  [ new RecipeIngredient(chorizo) ],
);
let bacon_sandwich = new Recipe(
  'bacon-sandwich',
  'bacon sandwich',
  [ 'nut-free' ],
  [
    new RecipeIngredient(bacon, quantity=new Quantity(50, 'g')),
    new RecipeIngredient(bread),
  ],
);
let potato_surprise = new Recipe(
  'potato-surprise',
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

module.exports = {
  bacon,
  potato,
  chorizo,
  bread,
  bacon_hash,
  gumbo,
  bacon_sandwich,
  potato_surprise,
};
