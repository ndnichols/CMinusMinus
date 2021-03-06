// The entry point for the package.
// Usage: $ node lib/cmm.js test.cmm

var fs = require('fs');
var util = require('util');

var escodegen = require('escodegen');

var parser = require('../parser').parser;
var analyzeAndGenerate = require('./staticAnalysis');
var contexts = require('./contexts');
var scrub = require('./builtinScrubber');
var preprocess = require('./preprocessor');
var postprocess = require('./postprocessor');

function execute(inputFilename) {
    // A `Context` instance keeps track of the functions, variables, and
    // scopes for type-checking purposes.
    var context = new contexts.Context();
    // The JavaScript ast node will go here.
    var output = []

    var input = fs.readFileSync(inputFilename, 'utf8');
    input = preprocess(input);
    var ast = parser.parse(input);
    analyzeAndGenerate(ast, context, output);
    var rootNode = output[0];
    rootNode = scrub(rootNode);
    var source = escodegen.generate(rootNode);
    source = postprocess(source);
    return eval(source);
}

if (require.main === module) {
    execute(process.argv[2]);
}

exports.execute = execute
