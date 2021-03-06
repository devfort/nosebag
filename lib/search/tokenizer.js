var character_class = {
    ALPHANUM: 1,
    WHITESPACE: 2,
    ELSE: 3
};

function tokenize(query) {
  let current_position = -1;
  let lookahead_position = 0;
  let current_class = character_class.WHITESPACE;
  let lookahead_class = character_class.WHITESPACE;
  let tokens = [];

  while (lookahead_position < query.length) {
    let lookahead_char = query[lookahead_position];

    if (lookahead_char.match(/\p{White_Space}/u)) {
      lookahead_class = character_class.WHITESPACE;
    }
    else if (lookahead_char.match(/[\p{Alphabetic}\d\.]/u)) {
      lookahead_class = character_class.ALPHANUM;
    }
    else {
      lookahead_class = character_class.ELSE;
    }

    if (current_class != lookahead_class) {
      if (current_class == character_class.ALPHANUM) {
        tokens.push({
          'type': 'word',
          'token': query.substr(
            current_position,
            lookahead_position - current_position
          )
        })
      }
      else if (current_class == character_class.ELSE) {
        tokens.push({
          'type': 'non-word',
          'token': query.substr(
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
        'token': query.substr(
          current_position,
          lookahead_position - current_position
        )
      })
    }
    else if (current_class == character_class.ELSE) {
      tokens.push({
        'type': 'non-word',
        'token': query.substr(
          current_position,
          lookahead_position - current_position
        )
      })
    }
  }

  for (let ele of tokens) {
    if (ele.type == 'word') {
      if (ele.token.toLowerCase() == 'and') {
        ele.type = 'and'
      } else if ([ 'not', 'no' ].includes(ele.token.toLowerCase())) {
        ele.type = 'not'
      } else if (ele.token.toLowerCase().match(/^\d+(?:m?l|k?g|tsp|tbsp)?$/)) {
        ele.type = 'quantity'
      }
    }
  }

  return tokens
}

module.exports = { tokenize };
