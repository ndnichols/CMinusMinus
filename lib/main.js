var escodegen = require('escodegen');
var parser = require('../parser').parser;

var nodes = parser.parse('5+3');
console.log(nodes);

console.log(escodegen.generate(nodes));
