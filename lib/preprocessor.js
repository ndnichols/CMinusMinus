module.exports = function(source) {
    return "void printf(char *format, ...) {}\n" + source;
}
