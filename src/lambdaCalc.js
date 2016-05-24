// Ast -> Ast
function evaluate(ast) {
  return evalInEnv(ast, []);
}

function evalInEnv(ast, env) {
  if (ast.type === 'lambda') {
    return {
      type: 'closure',
      arg: ast.arg,
      body: ast.body,
      env: env
    };
  }
  if (ast.type === 'name') {
    return lookup(ast.value, env);
  }
  if (ast.type === 'application') {
    var closure = evalInEnv(ast.fn, env),
      value = evalInEnv(ast.arg, env);

    var newEnv = [[closure.arg, value]].concat(closure.env).concat(env);

    return evalInEnv(closure.body, newEnv);
  }
}

function lookup(name, env) {
  return env.find(function (pair) {
    return pair[0] === name;
  })[1];
}

// [Token] -> Ast
function parse(tokens) {
  return parseSingle(tokens).ast;
}

// [Token] -> { ast: Ast, rest: [Token] }
function parseSingle(tokens) {
  if (tokens[0].type === 'name') {
    return {
      ast: tokens[0],
      rest: tokens.slice(1)
    };
  }
  if (tokens[0].type === 'lparen') {
    var result1 = parseSingle(tokens.slice(1)),
      result2 = parseSingle(result1.rest);

    return {
      ast: {
        type: 'application',
        fn: result1.ast,
        arg: result2.ast
      },
      rest: result2.rest.slice(1)
    };
  }

  var parsed = parseSingle(tokens.slice(3));

  // Naively assume we only get good input, so this is a lambda
  return {
    ast: {
      type: 'lambda',
      arg: tokens[1].value,
      body: parsed.ast
    },
    rest: parsed.rest
  };
}

var simpleTokens = {
  '(': 'lparen',
  ')': 'rparen',
  '\\': 'lambda',
  '.': 'dot'
};

// String -> [Token]
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
