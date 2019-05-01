import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';
import Store from '../storage/store';
import FetchAdaptor from '../storage/fetch_adapter';

let store = new Store(new FetchAdaptor('/recipes'));
async function load_recipes() {
  let recipe_ids = await store.list_recipes();
  let recipes = recipe_ids.slice(0, 2).map(
    recipe_id => store.get_recipe(recipe_id)
  )
  return Promise.all(recipes);
}
let node = document.getElementById('app');
load_recipes().then(function(recipes) {
  ReactDOM.render(<App recipes={ recipes } />, node);
});
