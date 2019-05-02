const ShoppingList = require('../../lib/shopping/list'),
      { Recipe } = require('../../lib/models'),
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

describe('shopping list', () => {
  it('starts with no recipes', () => {
    let list = new ShoppingList();
    expect(list.item_count()).toEqual(0);
    expect(list.groups.length).toEqual(0);
    expect(list.flat_recipes().length).toEqual(0);
  });

  it('re-collates when recipes are added', () => {
    let list = new ShoppingList();
    list.add(bacon_hash);
    expect(list.item_count()).toEqual(2);
    expect(list.groups.length).toEqual(2);
    expect(list.flat_recipes().length).toEqual(1);

    list.add(bacon_sandwich);
    expect(list.item_count()).toEqual(3);
    expect(list.groups.length).toEqual(3);
    expect(list.flat_recipes().length).toEqual(2);
  });

  it('re-collates when recipes are removed', () => {
    let list = new ShoppingList();
    list.add(bacon_hash);
    list.add(bacon_sandwich);

    list.remove(bacon_hash);
    expect(list.item_count()).toEqual(2);
    expect(list.groups.length).toEqual(2);
    expect(list.flat_recipes().length).toEqual(1);

    list.remove(bacon_sandwich);
    expect(list.item_count()).toEqual(0);
    expect(list.groups.length).toEqual(0);
    expect(list.flat_recipes().length).toEqual(0);
  });

  it('throws an error if you try to remove a recipe not in the list', () => {
    let list = new ShoppingList();
    expect(() => list.remove(bacon_hash)).toThrow();
  });

  it('keeps track of what has been bought', () => {
    let list = new ShoppingList();
    list.add(bacon_hash);
    expect(list.slias.size).toEqual(0);
    list.mark_item_bought(
      list.groups[0].ingredients[0],
    );
    expect(
      list.groups[0].ingredients[0].bought,
    ).toBeTruthy()
    expect(list.slias.size).toEqual(1);
    expect(list.slias.has('large potato')).toBe(true);
    let slia = list.slias.get('large potato');
    expect(slia.parts.length).toEqual(1);
    expect(slia.parts[0].quantity.amount).toEqual(2);
    expect(slia.parts[0].quantity.unit).toEqual(undefined);
    list.mark_item_unbought(
      list.groups[0].ingredients[0],
    )
    expect(
      list.groups[0].ingredients[0].bought,
    ).toBeFalsy()
    expect(list.slias.size).toEqual(0);
  });

  it('re-allocates available items after re-collation', () => {
    /* This relies pretty heavily on the unit tests for
     * ShoppingListItemAvailable.satisfies working in a wide
     * range of situations. We're checking here that we
     * seem to have preserved bought indicators where what
     * was indicated as to-purchase (ie in the ShoppingList)
     * would satisfy what we need now.
     */
    let list = new ShoppingList();
    list.add(bacon_hash); // requires 100g bacon
    list.add(bacon_hash); // twice, so we can remove once
    // Groups are below the ground, meat
    list.mark_item_bought(
      list.groups[1].ingredients[0],
    ); // so we have 200g
    list.remove(bacon_hash); // we only need 100g
    expect(list.groups[1].ingredients[0].bought).toBeTruthy();
    // Groups are undefined, below the ground, meat
    list.add(bacon_sandwich); // contains 50g, so we need 150g
    expect(list.groups[2].ingredients[0].bought).toBeTruthy();
  });
});
