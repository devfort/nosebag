import React, { Component } from 'react';
import Quantity from './widgets';

class AdjustRecipeCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
    }
  }

  increase_count() {
    this.setState({count: this.state.count + 1});
    this.props.inc_recipe(this.props.recipe);
  }

  decrease_count() {
    let count = this.state.count - 1;
    if (count < 0) {
      count = 0;
    }
    this.setState({count: count});
    this.props.dec_recipe(this.props.recipe);
  }

  close() {
    this.props.close(this);
  }

  render() {
    return <div id='popup'><p>
      Shopping for <span>{ this.props.recipe.name }</span>
      <i className='quantity'>{ this.state.count }<b> times.</b></i>
      <button onClick={ () => this.decrease_count() } className='decrease'>-</button> <button onClick={ () => this.increase_count() } className='increase'>+</button>
      </p>
      <button onClick={ () => this.close() }>Done</button>
      </div>;
  }
}

class IngredientForRecipe extends Component {
  render() {
    return <li><Quantity quantity={ this.props.quantity } /> for <a href='#'>{ this.props.recipe.name }</a></li>;
  }
}

class Ingredient extends Component {
  toggleRecipes(event) {
    let ele = event.target.parentNode; /* the li */
    ele.classList.toggle('recipe-use-open');
  }

  render() {
    /* li could have className i-have-this, recipe-use-open */
    let className = '',
        bought_unbought_button = '';
    if (this.props.item.bought) {
      className = 'i-have-this';
      bought_unbought_button = <button onClick={ () => this.props.mark_unbought(this.props.item) } className='i-have-this'>Unmark as got</button>;
    } else {
      bought_unbought_button = <button onClick={ () => this.props.mark_bought(this.props.item) } className='i-have-this'>Mark as got</button>;
    }
    return <li className={ className }>
      <p onClick={ (event) => this.toggleRecipes(event) }><Quantity quantity={ this.props.item.quantity } /> { this.props.item.name } <button>&#x22ef;</button></p>
      { bought_unbought_button }
      <ol className='recipe-use'>{ this.props.item.recipe_ingredients.map(
        (ri, idx) => <IngredientForRecipe key={ idx } recipe={ ri.recipe } quantity={ ri.quantity } />
      )}</ol>
    </li>;
  }
}

class IngredientGroup extends Component {
  render() {
    let className = '';
    if ( this.props.name === undefined ) {
      className = 'unclassified';
      name = 'Unclassified ingredients';
    } else {
      name = this.props.name;
    }
    return <li className={ className }>
      <h3>{ name }</h3>
      <ol className='items'>{ this.props.ingredients.map(
        i => <Ingredient key={ i.name } item={ i } mark_bought={ this.props.mark_bought } mark_unbought={ this.props.mark_unbought } />
      )}</ol>
    </li>;
  }
}

class ShoppingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
      popup: '',
    };
  }

  openAdjustRecipeCountPopup(recipe, count) {
    let popup = <AdjustRecipeCount
    recipe={ recipe }
    count={ count }
    close={ () => this.closePopup() }
    inc_recipe={ (r) => { this.props.inc_recipe(r); this.setState(); } }
    dec_recipe={ (r) => { this.props.dec_recipe(r); this.setState(); } }
      />;
    this.setState({ popup: popup });
  }

  closePopup(popup) {
    this.setState({ popup: '' });
  }

  toggleRecipes(event) {
    let ele = event.target.nextSibling; /* the ol.recipes */
    ele.classList.toggle('recipe-list-open');
  }

  render() {
    let footer = '';
    if (this.state.list.item_count() > 0) {
      if (this.state.list.item_count() > this.state.list.unmarked_item_count()) {
        footer = <footer>You have <i className='quantity'>{ this.state.list.unmarked_item_count() }</i> items to buy out of { this.state.list.item_count() } on the list.</footer>;
      } else {
        footer = <footer>You have <i className='quantity'>{ this.state.list.unmarked_item_count() }</i> items to buy.</footer>;
      }
    }
    return <div className='shopping-list'>
      <h2 onClick={ (event) => this.toggleRecipes(event) }>Shopping for <i>{ this.state.list.recipes_to_counts.size }</i> recipe(s) <button>&#x22ef;</button></h2>
      <ol className='recipes'>{
        [...this.state.list.recipes_to_counts.values()].map(
          (rac, r_id) => <li onClick={ () => this.openAdjustRecipeCountPopup(rac.recipe, rac.count) } key={ rac.recipe.id }>{ rac.recipe.name }<i className='quantity'>{ rac.count }</i></li>
      )}
      </ol>
      <ol className='groups'>
      { this.state.list.groups.map( g => <IngredientGroup key={ g.name } name={ g.name } ingredients={ g.ingredients } mark_bought={ this.props.mark_bought } mark_unbought={ this.props.mark_unbought } />) }
      </ol>
      { footer }
      { this.state.popup }
    </div>;
  }
}

export default ShoppingList;
