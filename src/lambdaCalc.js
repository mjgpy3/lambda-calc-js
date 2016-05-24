function tokenize(text) {
  if (text.length === 0) {
    return [];
  }

  var first = text[0],
    rest = text.slice(1);

  if (first === '(') {
    return [{
      type: 'lparen'
    }].concat(tokenize(rest));
  }
  if (first === ')') {
    return [{
      type: 'rparen'
    }].concat(tokenize(rest));
  }
  if (first === '\\') {
    return [{
      type: 'lambda'
    }].concat(tokenize(rest));
  }
  if (first === '.') {
    return [{
      type: 'dot'
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

console.log(tokenize('\\  x  .   x   '));
