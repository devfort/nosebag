# Doctor Syntax

Doctor Syntax was a British thoroughbred race horse who lived in the early 19th century, winning at least 36 races. His portrait hangs in Silverton Stables.

Dr. Syntax (in America known as Syntax, M.D.) is an object model, and file layout for representing recipes, ingredients, and shopping lists.

## Object model

### Recipes

Each recipe is represented as a core object and optional additional media. The centra properties of each recipe are two lists:

 * recipe ingredients, which:
   * reference an ingredient by name
   * have an optional quantity which are either a naked positive number, meaning an amount without unit, or contain:
     * an amount
     * a unit
     * optional notes that provide advice on how to modify the amount required (such as "more if they are small")
   * an optional property of 'optional', meaning that the ingredient can be omitted
   * an optional prep instruction
   * an optional note (distinct from the quantity note), which can be used to express a preference; for instance, you could indicate a preferred variety
 * steps, each of which is a narrative of the task to be accomplished

Recipes also have a name, and zero or more attributes (such as "gluten free"), which are used for searching and filtering.

Prep instructions for ingredients are implicit steps that all come before the first recipe step.

### Ingredients

Ingredients are the abstraction of the food stuff used in recipes. So "carrot" rather than "100g carrots". The names of ingredients are unique, and by convention are singular and lower-cased.

Ingredients also have an optional group, referenced by name, and zero or more attributes (such as "meat") which are used for searching and filtering recipes.

### Groups

Groups represent a phase of your shopping, and may be thought of as aisles of a supermarket, or different shopkeepers. They have a name, which like ingredients are unique, singular, and lower-cased. For example, "vegetable", or "spice".

## File layout

The recipe core object is serialised as JSON, and stored as `recipe.json` alongside additional media files for that recipe. (Media files are referenced using either a relative URL, meaning their leaf filename, or an absolute URL if the media files are stored elsewhere such as on Wikipedia.)

Ingredients and groups are serialised as one JSON object, stored as `ontology.json`.
