import React, { Component } from 'react';
import Search from './search';
import ShoppingList from './shopping_list';
import List from '../shopping/list';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: new List(),
      shopping_items: 0,
      screen: 'search',
    }
  }

  update_shopping_items_count() {
    this.setState({ shopping_items: this.state.list.unmarked_item_count() });
  }

  add_recipe_to_list(recipe) {
    this.state.list.add(recipe);
    this.update_shopping_items_count();
  }

  remove_recipe_from_list(recipe) {
    try {
      this.state.list.remove(recipe);
      this.update_shopping_items_count();
    } catch {
      // It's just about possible you could have hit a remove
      // button while the backend was processing a sync event
      // which removes the recipe. In this case we'd get an
      // Error, but we should just ignore it.
    }
  }

  mark_item_bought(item) {
    this.state.list.mark_item_bought(item);
    this.update_shopping_items_count();
  }

  mark_item_unbought(item) {
    this.state.list.mark_item_unbought(item);
    this.update_shopping_items_count();
  }

  render() {
    let screen = null;
    if (this.state.screen == 'search') {
      screen = <Search add_recipe={ (recipe) => this.add_recipe_to_list(recipe) } />;
    } else {
      screen = <ShoppingList inc_recipe={ (recipe) => this.add_recipe_to_list(recipe) } dec_recipe={ (recipe) => this.remove_recipe_from_list(recipe) } list={ this.state.list } mark_bought={ (item) => this.mark_item_bought(item) } mark_unbought={ (item) => this.mark_item_unbought(item) } />;
    }
    return <>
      <header>
      <h1>Nosebag</h1>
      <nav>
        <ol>
      <li className='search' onClick={ () => this.setState({'screen': 'search'}) }><button><b>Search</b></button></li>
      <li className='shopping-list' onClick={ () => this.setState({'screen': 'shopping'}) }><button><i className='quantity'>{ this.state.shopping_items }</i><b> items on your shopping list</b></button></li>
        </ol>
      </nav>
      </header>
      <div id='content'>{ screen }</div>
    </>;
  }
}

export default App;
