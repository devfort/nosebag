let {
  collate_recipes,
  collate_quantities,
  ShoppingListItem,
  ShoppingListItemAvailable,
} = require('../../lib/shopping/collate'),
    { Quantity, RecipeIngredient, } = require('../../lib/models'),
    {
  bacon,
  potato,
  chorizo,
  bread,
  bacon_hash,
  gumbo,
  bacon_sandwich,
  potato_surprise,
} = require('./testdata');

describe('collate_recipes', () => {
  it('lexically sorted groups with undefined first', () => {
    let groups = collate_recipes([ bacon_sandwich, bacon_hash ]);
    // Groups should be lexically sorted (but with undefined at the start)
    expect(groups[0].name).toEqual(undefined);
    expect(groups[1].name).toEqual('below the ground');
    expect(groups[2].name).toEqual('meat');
  })

  it('pulls together ingredients of the same name', () => {
    let groups = collate_recipes([ bacon_sandwich, bacon_hash ]);
    expect(groups.length).toEqual(3);
    // Bacon should have been collapsed into one ingredient
    // within the group
    expect(groups[2].ingredients.length).toEqual(1);
    expect(groups[2].ingredients[0].name).toEqual('bacon');
    // And we can access the RecipeIngredients that bacon was found in
    // (which tells us which recipes they came from, because of
    // backlinks).
    expect(
      groups[2].ingredients[0].recipe_ingredients.length
    ).toEqual(2);
  })

  it('pulls together ingredients in the same group', () => {
    let groups = collate_recipes([ gumbo, bacon_hash ]);
    expect(groups.length).toEqual(2);
    // Groups should be lexically sorted, with meat last
    expect(groups[1].name).toEqual('meat');
    expect(groups[1].ingredients.length).toEqual(2);
    // Ingredients lexically sorted within the group
    expect(groups[1].ingredients[0].name).toEqual('bacon');
    expect(groups[1].ingredients[1].name).toEqual('chorizo');
  })

  it('adds together quantities of an ingredient', () => {
    let groups = collate_recipes([ bacon_sandwich, bacon_hash ]);
    let collated_bacon = groups[2].ingredients[0];
    expect(collated_bacon.name).toEqual('bacon');
    expect(collated_bacon.quantity.amount).toEqual(150);
    expect(collated_bacon.quantity.unit).toEqual('g');
  })

  it('leaves quantities of different units separate', () => {
    let groups = collate_recipes([ potato_surprise, bacon_hash ]);
    collated_potato = groups[0].ingredients[0];
    expect(collated_potato.name).toEqual('large potato');
    expect(collated_potato.quantity).toEqual(null);
    expect(collated_potato.recipe_ingredients.length).toEqual(2);
  })

  it('collates ingredients without a group into an un-named groups', () => {
    let groups = collate_recipes([ bacon_sandwich ]);
    expect(groups.length).toEqual(2);
    expect(groups[0].name).toEqual(undefined);
    expect(groups[0].ingredients.length).toEqual(1);
    expect(groups[0].ingredients[0].name).toEqual('bread');
  })

  it('copes with the same recipe twice', () => {
    let groups = collate_recipes([ bacon_sandwich, bacon_sandwich ]);
    expect(groups[1].name).toEqual('meat');
    expect(groups[1].ingredients.length).toEqual(1);
    expect(groups[1].ingredients[0].quantity.amount).toEqual(100);
    expect(groups[1].ingredients[0].quantity.unit).toEqual('g');
    // And it should have the (singular) RI object _twice_ because otherwise
    // we don't know that the 100g is being used as 50g twice. If we only
    // included the RI object once, we'd either have to decorate it with x2
    // or we would show 100g of bacon having only 50g used, which is misleading.
    expect(
      groups[1].ingredients[0].recipe_ingredients.length
    ).toEqual(2);
  })

  it('copes with no recipes at all', () => {
    let groups = collate_recipes([]);
    expect(groups.length).toEqual(0);
  });
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

describe('ShoppingListItemAvailable', () => {
  it('satifies the item it was built from', () => {
    let ri = new RecipeIngredient(potato, quantity=new Quantity(2));
    ri.recipe = potato_surprise;
    let sli = new ShoppingListItem('potato', [ ri ]);
    sli.quantity = collate_quantities(
      sli.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let slia = new ShoppingListItemAvailable(sli);
    expect(slia.satisfies(sli)).toBe(true);
  });

  it('satifies an item for the same quantity for the same recipe', () => {
    let ri = new RecipeIngredient(potato, quantity=new Quantity(2));
    ri.recipe = potato_surprise;
    let sli = new ShoppingListItem('potato', [ ri ]);
    sli.quantity = collate_quantities(
      sli.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let sli_other = new ShoppingListItem('potato', [ ri ]);
    sli_other.quantity = collate_quantities(
      sli_other.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let slia = new ShoppingListItemAvailable(sli);
    expect(slia.satisfies(sli_other)).toBe(true);
  });

  it('satifies a similar item from a different recipe', () => {
    let ri = new RecipeIngredient(potato, quantity=new Quantity(2));
    let ri_other = new RecipeIngredient(potato, quantity=new Quantity(1));
    ri.recipe = potato_surprise;
    ri_other.recipe = bacon_hash;
    let sli = new ShoppingListItem('potato', [ ri ]);
    sli.quantity = collate_quantities(
      sli.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let sli_other = new ShoppingListItem('potato', [ ri_other ]);
    sli_other.quantity = collate_quantities(
      sli_other.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let slia = new ShoppingListItemAvailable(sli);
    expect(slia.satisfies(sli_other)).toBe(true);
  });

  it('satisfies items across different units', () => {
    let ri = new RecipeIngredient(potato, quantity=new Quantity(2));
    let ri_other = new RecipeIngredient(potato, quantity=new Quantity(100, 'g'));
    ri.recipe = potato_surprise;
    ri_other.recipe = potato_surprise;
    let sli = new ShoppingListItem('potato', [ ri, ri_other ]);
    sli.quantity = collate_quantities(
      sli.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let slia = new ShoppingListItemAvailable(sli);
    expect(slia.satisfies(sli)).toBe(true);
  });

  it('satifies two smaller items with no units from other recipes', () => {
    let ri = new RecipeIngredient(potato, quantity=new Quantity(2));
    let ri_other = new RecipeIngredient(potato, quantity=new Quantity(1));
    let ri_other2 = new RecipeIngredient(potato, quantity=new Quantity(1));
    ri.recipe = potato_surprise;
    ri_other.recipe = bacon_hash;
    ri_other2.recipe = gumbo; // this is a lie but a harmless one here
    let sli = new ShoppingListItem('potato', [ ri ]);
    sli.quantity = collate_quantities(
      sli.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let sli_other = new ShoppingListItem('potato', [ ri_other, ri_other2 ]);
    sli_other.quantity = collate_quantities(
      sli_other.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let slia = new ShoppingListItemAvailable(sli);
    expect(slia.satisfies(sli_other)).toBe(true);
    // And the inverse
    let slia_other = new ShoppingListItemAvailable(sli);
    expect(slia_other.satisfies(sli)).toBe(true);
  });

  it('satifies two smaller items with units from other recipes', () => {
    let ri = new RecipeIngredient(potato, quantity=new Quantity(2, 'g'));
    let ri_other = new RecipeIngredient(potato, quantity=new Quantity(1, 'g'));
    let ri_other2 = new RecipeIngredient(potato, quantity=new Quantity(1, 'g'));
    ri.recipe = potato_surprise;
    ri_other.recipe = bacon_hash;
    ri_other2.recipe = gumbo; // this is a lie but a harmless one here
    let sli = new ShoppingListItem('potato', [ ri ]);
    sli.quantity = collate_quantities(
      sli.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let sli_other = new ShoppingListItem('potato', [ ri_other, ri_other2 ]);
    sli_other.quantity = collate_quantities(
      sli_other.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let slia = new ShoppingListItemAvailable(sli);
    expect(slia.satisfies(sli_other)).toBe(true);
    // And the inverse
    let slia_other = new ShoppingListItemAvailable(sli);
    expect(slia_other.satisfies(sli)).toBe(true);
  });

  it('does not satisfy a larger item from a different recipe', () => {
    let ri = new RecipeIngredient(potato, quantity=new Quantity(2));
    let ri_other = new RecipeIngredient(potato, quantity=new Quantity(3));
    ri.recipe = potato_surprise;
    ri_other.recipe = bacon_hash;
    let sli = new ShoppingListItem('potato', [ ri ]);
    sli.quantity = collate_quantities(
      sli.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let sli_other = new ShoppingListItem('potato', [ ri_other ]);
    sli_other.quantity = collate_quantities(
      sli_other.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let slia = new ShoppingListItemAvailable(sli);
    expect(slia.satisfies(sli_other)).toBe(false);
  });

  it('does not satisfy an undefined quantity', () => {
    let ri = new RecipeIngredient(potato, quantity=new Quantity(2));
    let ri_other = new RecipeIngredient(potato);
    ri.recipe = potato_surprise;
    ri_other.recipe = potato_surprise;
    let sli = new ShoppingListItem('potato', [ ri ]);
    sli.quantity = collate_quantities(
      sli.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let sli_other = new ShoppingListItem('potato', [ ri_other ]);
    sli_other.quantity = collate_quantities(
      sli_other.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let slia = new ShoppingListItemAvailable(sli);
    expect(slia.satisfies(sli_other)).toBe(false);
  });

  it('does not satisfy with an undefined quantity', () => {
    let ri = new RecipeIngredient(potato);
    let ri_other = new RecipeIngredient(potato, quantity=new Quantity(2));
    ri.recipe = potato_surprise;
    ri_other.recipe = potato_surprise;
    let sli = new ShoppingListItem('potato', [ ri ]);
    sli.quantity = collate_quantities(
      sli.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let sli_other = new ShoppingListItem('potato', [ ri_other ]);
    sli_other.quantity = collate_quantities(
      sli_other.recipe_ingredients.map(
        ri => ri.quantity
      )
    )
    let slia = new ShoppingListItemAvailable(sli);
    expect(slia.satisfies(sli_other)).toBe(false);
  });
});
