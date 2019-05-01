import React, { Component } from 'react';
import Quantity from './widgets';

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
    return <li>
      <p onClick={ (event) => this.toggleRecipes(event) }><Quantity quantity={ this.props.quantity } /> { this.props.name } <button>&#x22ef;</button></p>
      { /* <button className='i-have-this'>I have this item</button> */ }
      <ol className='recipe-use'>{ this.props.for_recipes.map(
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
        i => <Ingredient key={ i.name } name={ i.name } quantity={ i.quantity } for_recipes={ i.recipe_ingredients }/>
      )}</ol>
    </li>;
  }
}

class ShoppingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
    };
  }

  toggleRecipes(event) {
    let ele = event.target.nextSibling; /* the ol.recipes */
    ele.classList.toggle('recipe-list-open');
  }

  render() {
    return <div className='shopping-list'>
      <h2 onClick={ (event) => this.toggleRecipes(event) }>Shopping for <i>{ this.state.list.recipes_to_counts.size }</i> recipe(s) <button>&#x22ef;</button></h2>
      <ol className='recipes'>{
        [...this.state.list.recipes_to_counts.values()].map(
        (rac, r_id) => <li key={ rac.recipe.id }>{ rac.recipe.name }<i className='quantity'>{ rac.count }</i></li>
      )}
      </ol>
      <ol className='groups'>
      { this.state.list.groups.map( g => <IngredientGroup key={ g.name } name={ g.name } ingredients={ g.ingredients } />) }
      </ol>
      <footer>You have <i className='quantity'>{ this.state.list.item_count() }</i> items to buy.</footer>
    </div>;
  }
}

export default ShoppingList;
