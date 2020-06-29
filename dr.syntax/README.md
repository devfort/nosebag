# Doctor Syntax

Doctor Syntax was a British thoroughbred race horse
who lived in the early 19th century,
winning at least 36 races.
His portrait hangs in Silverton Stables.

Dr. Syntax (in America known as Syntax, M.D.)
is an object model, and file layout
for representing recipes, ingredients, and shopping lists.

Examples are shown in JSON format, and the `nosebag` project will continue to
use JSON, but Dr. Syntax is format agnostic as long as the object can be
serialised and deserialised intact.

## Object model



### The list of known ingredients — `ontology.json`

Stored serialised as `ontology.json`, the ontology is an object containing
an abstraction of foodstuff used in recipes.

```javascript
{
    "ingredients": [
        {
            "name": "carrot",
            "group": "vegetable",
            "attributes": [
                "meat free",
                ...
            ]
        },
        ...
    ]
}
```

Each ingredient is an object, containing:

* `name` — _required_, the unique, singular name of the foodstuff, by
  convention lower cased (ie "carrot" not "Carrots")
* `group` — _optional_, the unique, singular name of the grouping of the
  foodstuff, also by convention lower cased (ie "spice" not "Spices")
* `attributes` — _optional_, an array of strings which represents aspects of the
  ingredient, such as "dairy" or "meat" that could be used for searching
  and filtering

Groups represent a phase of shopping where similar items are collected
together, such as an aisle or area in a supermarket, or visiting different
shops.


### The list of recipes — `recipes.json`

Stored serialised as `recipes.json`, the list of recipes is an array of
strings that represent the directory relative to the location storing both
`recipes.json` and `ontology.json` under which the recipe serialisation can be
found.

```javascript
{

    "recipes": [
        "bacon-hash",
        "cauliflower-fritter-lime-sauce",
        ...
    ]
}
```


### A recipe — `<dir>/recipe.json`

The recipe core object is serialised as JSON, and stored as `recipe.json`
alongside additional media files for that recipe. (Media files are
referenced using either a relative URL, meaning their leaf filename, or an
absolute URL if the media files are stored elsewhere such as on Wikipedia.)

```javascript
{
  "name": "Mashed potatoes",
  "serves": "2",
  "attributes": [
      "gluten free",
      ...
  ],
  "ingredients": [
      {
          "name": "large potato",
          "quantity": 4,
          "prep": "cut into 1-inch cubes",
          "notes": "Preferably Maris Piper or other floury potato."
      },
      ...
  ],
  "steps": [
      {
          "task": "Heat water in a large pan until boiling.",
      },
      ...
  ],
}
```

The **recipe object** contains:

* `name` — _required_, a string containing the name of the recipe (this does not
  have to be unique within a collection of recipes)
* `ingredients` - _required_, an array of ingredient objects (see below)
* `steps` — _required_, an array of step objects (see below)
* `serves` — _optional_, a string representing how many people this recipe will feed
* `attributes` — _optional_, an array of strings which represent aspects of
  this recipe (such as "gluten free") which can be used for searching and
  filtering


The **ingredient object** contains:

* `name` — _required_, a string containing the name of the ingredient to
  reference from the ontology (which may not exist, in which case it is
  treated as if an ingredient of that name exists with no other defined
  properties)
* `quantity` — _optional_, an object which contains:

    ```javascript
    {
        "amount": 300,
        "unit": "g",
    }
    ```

  * `amount` — _required_, a positive integer
  * `unit` — _optional_, a string representing the unit of which _amount_ is
    needed
  * `notes` — _optional_, a string containing advice on how to adjust the amount if
    necessary (eg "more if they are small")

  If both `unit` and `notes` are not needed, the object can be collapsed to a
  positive integer (eg requiring 2 onions has no new unit to be expressed).
* `prep` — _optional_, a string containing directions on how to prepare the
  ingredient before making the recipe (eg "finely chopped")
* `notes` — _optional_, a string containing advice on the ingredient (such as
  a preferred variety, acceptable substitutions, things to look out for when
  purchasing, etc)
* `optional` — _optional_, a boolean value set to `true` if the ingredient is
  not strictly necessary, such as a garnish or extra herbs/spices

The **step object** contains:

* `task` — _required_, a string containing the narrative description of a step
  in making the recipe


When interpreting a recipe object, these are the keys Dr. Syntax has imbued
with meaning. Other keys can exist in the object for private use, but note
that this specification may be expanded later which could introduce
incompatibilities. There is as yet no explicit extension model.

Prep instructions for ingredients are implicit steps that all come before
the first recipe step.


## Doctor Syntax recommends that

* attributes that indicate absence of something (such as allergens) should
  not be hyphenated; for instance, "nut free" or "dairy free". This is purely
  to have a convention.

* units are abbreviated using the most common abbreviation, such as "ml",
  "g", or "tsp". Again, this is a useful convention.

* ingredients are specified as precisely as possible. "Sweet cured, streaky
  bacon" will likely not be a perfect replacement for "back bacon", and vice
  versa. By keeping the ingredients separate in your recipe book, tools can
  let you decide whether to buy the same thing across different recipes or
  not. If you just put "bacon" everywhere, tools may attempt to combine all
  ingredients across multiple recipes (such as for a shopping list) in a way
  that makes it hard for you to remember that you may actually want
  different types of bacon.

* you make each recipe step fairly small and self-contained. This generally
  makes it easier for people to understand what's going on, but also enables
  tools to suggest ways of scheduling the steps of multiple recipes you need
  to cook at once, such as for a dinner.

* "large potato" as an ingredient can be more useful than "potato" with a
  quantity unit of "large".
