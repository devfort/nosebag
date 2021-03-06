import React, { Component } from 'react';
import Store from '../storage/store';
import FetchAdaptor from '../storage/fetch_adapter';
import { tokenize } from '../search/tokenizer';
import { parse } from '../search/parser';
import { Quantity, Serves } from './widgets';

class SearchExamples extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'examples': [ 'eggs', 'no meat', 'salad, no cheese', 'lentils, 3 cabbages' ],
    }
  }
  render() {
    return <ol className='samples'>{ this.state.examples.map(
      (example, idx) => <li key={ idx } data-key={ idx }>
        <a onClick={ () => this.props.setSearch(example) } href='#'>{ example }</a>
        </li>
    )}</ol>;
  }
}

class SearchResult extends Component {
  render() {
    return <div className='recipe-panel'>
      <h2><a onClick={ () => this.props.show_recipe(this.props.recipe) }>{ this.props.recipe.name }</a></h2>
      <Serves serves={ this.props.recipe.serves } />

      <section className='ingredients'>
      <h3>Ingredients</h3>
      <ol>
      { this.props.recipe.ingredients.map( (ri, idx) => <li key={ idx }><Quantity quantity={ ri.quantity } /> { ri.ingredient.name }</li> ) }
      </ol>
      </section>
      <section className='preparation'>
      <h3>Preparation steps</h3>
      <ol>
      { this.props.recipe.prepsteps.map( (step, idx) => <li key={ idx }>{ step.task }</li> ) }
      </ol>
      </section>
    </div>;
  }
}

class SearchResults extends Component {
  render() {
    if (this.props.results.length == 0) {
      return <>
        <h2>Sorry, I could not find anything. Why not try one of the following?</h2>
        <SearchExamples setSearch={this.props.setSearch} />
      </>;
    } else {
      let results = this.props.results.map(
        r => <li key={ r.id }>
          <SearchResult recipe={ r } show_recipe={ this.props.show_recipe } />
          <button onClick={ () => this.props.add_recipe(r) } className='add'>Add to shopping list</button>
          </li>
      );
      return <ol className='results'>{ results }</ol>;
    }
  }
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      query: props.query || '',
      store: new Store(new FetchAdaptor('/recipes')),
    };
  }

  async handleSearch(event) {
    event.persist();
    let query_string = event.target.value
    this.setState(
      {
        query: query_string,
      }
    );
    this.runSearch(query_string);
  }

  async runSearch(query_string) {
    let results = [],
        recipe_list = await this.state.store.list_recipes(),
        query = parse(tokenize(query_string));
    if (query !== null) {
      for (let recipe_id of recipe_list) {
        let recipe = await this.state.store.get_recipe(recipe_id);
        if (query.matches(recipe)) {
          results.push(recipe);
        }
      }
    }
    this.setState(
      {
        results: results,
      }
    );
  }

  setSearch(query_string) {
    this.setState({query: query_string});
    this.runSearch(query_string);
    document.getElementById('query').focus();
  }

  render() {
    let results_or_examples;
    if (this.state.query == '') {
      results_or_examples = <>
        <h2>Why not try one of the following?</h2>
        <SearchExamples setSearch={(x) => this.setSearch(x)} />
        </>;
    } else {
      results_or_examples = <SearchResults add_recipe={ this.props.add_recipe } show_recipe={ this.props.show_recipe } setSearch={(x) => this.setSearch(x)} results={this.state.results} />;
    }
    return <div className='search'>
      <h2>Search</h2>
      <form>
      <input id='query' type='text' value={this.state.query} name='q' onChange={(event) => { this.handleSearch(event)}} autoFocus />
      <button type='submit'>Search</button>
      </form>
      <div id='results-or-examples'>{ results_or_examples }</div>
    </div>;
  }
}

export default Search;
