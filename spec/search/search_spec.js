let { Recipe, Ingredient, RecipeIngredient } = require('../../lib/models');
let { Term, And, AndNot } = require('../../lib/search/nodes');

let bacon = new Ingredient('bacon', [ 'meat' ]);
let potato = new Ingredient('large potato');
let chorizo = new Ingredient('chorizo', [ 'meat' ]);
let bacon_hash = new Recipe(
  'bacon hash',
  [ 'gluten-free' ],
  [
    new RecipeIngredient(bacon),
    new RecipeIngredient(potato),
  ],
);
let gumbo = new Recipe(
  'gumbo',
  [ 'gluten-free' ],
  [ new RecipeIngredient(chorizo) ],
);

describe('term_node', () => {
  it('matches recipe names', () => {
    expect(new Term('bacon').matches(bacon_hash)).toEqual(true);
    expect(new Term('gumbo').matches(gumbo)).toEqual(true);
    expect(new Term('bacon').matches(gumbo)).toEqual(false);
    expect(new Term('gumbo').matches(bacon_hash)).toEqual(false);
  })

  it('matches on recipe attributes', () => {
    expect(new Term('gluten-free').matches(gumbo)).toEqual(true);
    expect(new Term('gluten-free').matches(bacon_hash)).toEqual(true);
  })

  it('matches on recipe ingredient names', () => {
    expect(new Term('chorizo').matches(gumbo)).toEqual(true);
    expect(new Term('potato').matches(bacon_hash)).toEqual(true);
  })

  it('matches on recipe ingredient attributes', () => {
    expect(new Term('meat').matches(gumbo)).toEqual(true);
    expect(new Term('meat').matches(bacon_hash)).toEqual(true);
  })
});

describe('and_node', () => {
  it('matches both subtrees', () => {
    expect(
      new And(new Term('bacon'), new Term('hash')).matches(bacon_hash)
    ).toEqual(true);
    expect(
      new And(new Term('bacon'), new Term('hash')).matches(gumbo)
    ).toEqual(false);
    expect(
      new And(new Term('gumbo'), new Term('hash')).matches(bacon_hash)
    ).toEqual(false);
    expect(
      new And(new Term('gumbo'), new Term('hash')).matches(gumbo)
    ).toEqual(false);
  })
});

describe('andnot_node', () => {
  it('matches left but not right subtrees', () => {
    expect(
      new AndNot(new Term('gluten-free'), new Term('bacon')).matches(bacon_hash)
    ).toEqual(false);
    expect(
      new AndNot(new Term('gumbo'), new Term('chorizo')).matches(gumbo)
    ).toEqual(false);
    expect(
      new AndNot(new Term('bacon'), new Term('chorizo')).matches(bacon_hash)
    ).toEqual(true);
    expect(
      new AndNot(new Term('gluten-free'), new Term('bacon')).matches(gumbo)
    ).toEqual(true);
  })
});
