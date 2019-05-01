import React, { Component } from 'react';
import Search from './search';
import ShoppingList from './shopping_list';
import List from '../shopping/list';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: new List(props.recipes),
      shopping_items: 0,
      screen: 'search',
    }
    this.state.shopping_items = this.state.list.item_count();
  }

  render() {
    let screen = null;
    if (this.state.screen == 'search') {
      screen = <Search />;
    } else {
      screen = <ShoppingList />;
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
