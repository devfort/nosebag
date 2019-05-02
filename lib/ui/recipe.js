import React, { Component } from 'react';
import Store from '../storage/store';
import FetchAdaptor from '../storage/fetch_adapter';
import { Quantity, Serves } from './widgets';

class Recipe extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='recipe-page'>
      <div className='recipe-panel'>
        <h1>{ this.props.recipe.name }</h1>
        <Serves serves={ this.props.recipe.serves } />

        <section className='ingredients'>
        <h2>Ingredients</h2>
        <ol>
        { this.props.recipe.ingredients.map( (ri, idx) => <li key={ idx }><Quantity quantity={ ri.quantity } /> { ri.ingredient.name }</li> ) }
        </ol>
        </section>
        <section className='preparation'>
          <h2>Preparation</h2>
          <ol>
            { this.props.recipe.prepsteps.map( (step, idx) => <li key={ idx }>{ step.task }</li> ) }
          </ol>
        </section>
        <section className='steps'>
        <h2>Cooking steps</h2>
        <ol>
        { this.props.recipe.steps.map( (step, idx) => <li key={ idx }>{ step.task }</li> ) }
        </ol>
        </section>
      </div>
    </div>;
  }
}

export default Recipe;
