const ShoppingList = require('../../lib/shopping/list');
let {
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
});
