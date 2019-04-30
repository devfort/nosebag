class Term {
  constructor(words) {
    this.type  = 'term';
    this.words = words;
  }

  _matches(matchable) {
    return (
      matchable.name.includes(
        this.words
      ) || matchable.attributes.map(
        attribute => attribute.includes(this.words)
      ).some(x => x == true)
    )
  }

  matches(recipe) {
    return this._matches(
      recipe
    ) || recipe.ingredients.map(
      recipe_ingredient => this._matches(recipe_ingredient.ingredient)
    ).some(x => x == true)
  }
}

class QuantityTerm {
  constructor(amount, unit, term) {
    this.type   = 'quantity';
    this.amount = amount;
    this.unit   = unit;
    this.term   = new Term(term);
  }

  _matches(matchable) {
    return(
         matchable.ingredient.name.includes(this.term.words)
      && matchable.quantity.unit == this.unit
      && matchable.quantity.amount <= this.amount
    )
  }

  matches(recipe) {
    return recipe.ingredients.map(
      recipe_ingredient => this._matches(recipe_ingredient)
    ).some(x => x == true);
  }
}

class And {
  constructor(left, right) {
    this.type  = 'and';
    this.left  = left;
    this.right = right;
  }

  matches(recipe) {
    return this.left.matches(recipe) && this.right.matches(recipe);
  }
}

class AndNot {
  constructor(left, right) {
    this.type  = 'and-not';
    this.left  = left;
    this.right = right;
  }

  matches(recipe) {
    return this.left.matches(recipe) && ! this.right.matches(recipe);
  }
}

class Any {
  matches(recipe) {
    return true;
  }
}

module.exports = {
  QuantityTerm,
  Term,
  And,
  AndNot,
  Any,
};
