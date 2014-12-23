module.exports = function(source) {
    var prologue = "\
util = require('util');\n\
\n\
function printf() {\n\
    console.log(util.format.apply(null, arguments));\n\
}\n\
\n\
function Value(value) {\n\
    this.value = value;\n\
}\n\n\
";

    var epilogue = "\n\
main();\n\
\n";

    return prologue + source + epilogue;
}
