var character_class = {
    ALPHANUM: 1,
    WHITESPACE: 2,
    ELSE: 3
};

function tokenize(search_term) {
  let current_position = -1;
  let lookahead_position = 0;
  let current_class = character_class.WHITESPACE;
  let lookahead_class = character_class.WHITESPACE;
  let tokens = [];

  while (lookahead_position < search_term.length) {
    let lookahead_char = search_term[lookahead_position];

    if (lookahead_char.match(/\p{White_Space}/u)) {
      lookahead_class = character_class.WHITESPACE;
    }
    else if (lookahead_char.match(/\p{Alphabetic}/u)) {
      lookahead_class = character_class.ALPHANUM;
    }
    else {
      lookahead_class = character_class.ELSE;
    }

    if (current_class != lookahead_class) {
      if (current_class == character_class.ALPHANUM) {
        tokens.push({
          'type': 'word',
          'token': search_term.substr(
            current_position,
            lookahead_position - current_position
          )
        })
      }
      else if (current_class == character_class.ELSE) {
        tokens.push({
          'type': 'non-word',
          'token': search_term.substr(
            current_position,
            lookahead_position - current_position
          )
        })
      }

      current_class = lookahead_class;
      current_position = lookahead_position;
    }

    lookahead_position++;
  }

  if (current_position != lookahead_position) {
    if (current_class == character_class.ALPHANUM) {
      tokens.push({
        'type': 'word',
        'token': search_term.substr(
          current_position,
          lookahead_position - current_position
        )
      })
    }
    else if (current_class == character_class.ELSE) {
      tokens.push({
        'type': 'non-word',
        'token': search_term.substr(
          current_position,
          lookahead_position - current_position
        )
      })
    }
  }

  return tokens
}

module.exports = { tokenize };
