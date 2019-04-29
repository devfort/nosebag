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
  Term,
  And,
  AndNot,
  Any,
};
