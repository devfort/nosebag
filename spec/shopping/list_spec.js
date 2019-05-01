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
});
