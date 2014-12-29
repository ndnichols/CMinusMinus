var util = require('util');
var escodegen = require('escodegen');
var parser = require('../parser').parser;

var input = "int a; float b; float c;";

// var input = "
// int sum(int a, int b)
// {
//     return a + b;
// }

// int main()
// {
//   printf(\"The answer is %i\", sum(40,2));
//   return 0;
// }
// "

var nodes = parser.parse(input);
console.log(util.inspect(nodes, {depth: null}));
// console.log(escodegen.generate(nodes));
