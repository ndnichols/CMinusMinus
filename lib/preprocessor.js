// Before parsing the CMM source, we need to add in a printf declaration.
module.exports = function(source) {
    return "void printf(char *format, ...) {}\n" + source;
}
