var util = require('util');
var escodegen = require('escodegen');
var parser = require('../parser').parser;

// var input = "int a = 42; float b = *d; float c;";

var input = "void swap(int *a, int *b)"

// var input = "int c = 19;"

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
