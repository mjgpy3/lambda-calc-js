var simpleTokens = {
  '(': 'lparen',
  ')': 'rparen',
  '\\': 'lambda',
  '.': 'dot'
};

function tokenize(text) {
  if (text.length === 0) {
    return [];
  }

  var first = text[0],
    rest = text.slice(1);

  if (first in simpleTokens) {
    return [{
      type: simpleTokens[first]
    }].concat(tokenize(rest));
  }
  if (first.match(/[a-z]/)) {
    return [{
      type: 'name',
      value: first
    }].concat(tokenize(rest));
  }

  return tokenize(rest);
}
