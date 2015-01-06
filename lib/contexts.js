// A helper class that keeps track of available functions and variables, and
// their types.
util = require('util');
_ = require('underscore');

function Context () {
    this.stack = [];
}

Context.prototype.getFrame = function() {
    return this.stack[this.stack.length-1];
}

Context.prototype.addVariable = function(name, type) {
    var frame = this.getFrame().variables;
    if (frame[name]) {
        throw new Error("Redefinition of " + name);
    }
    frame[name] = {type: type};
}

Context.prototype.addFunction = function(name, returnType, parameters) {
    var frame = this.getFrame().functions;
    if (frame[name]) {
        throw new Error("Redefinition of " + name);
    }
    frame[name] = {
        type: returnType,
        parameters: parameters
    }
}

Context.prototype.getFunction = function(name) {
    for (var i = this.stack.length-1; i--; i < 0) {
        var frame = this.stack[i];
        if (frame.functions[name]) {
            return frame.functions[name]
        }
    }
    throw new Error("Undefined function " + name);
}

Context.prototype._getVariable = function(name) {
    var allVariables = {}
    for (var s in this.stack) {
        var frame = this.stack[s];
        allVariables = _.extend(allVariables, frame.variables);
    }
    if (allVariables[name]) {
        return allVariables[name];
    }
    throw new Error("Undefined variable " + name + ", options were " + util.inspect(allVariables));
}

Context.prototype.push = function () {
    this.stack.push({variables:{}, functions:{}})
}

Context.prototype.pop = function() {
    this.stack.pop();
}

// The main exposed method. Given a CMM ast node, returns the type of that
// expression.
Context.prototype.getType = function(node) {
    switch (node.nodeType) {
        case "Literal":
            return node.type;
        case "Declaration":
            return node.type;
        case "ValueAt":
            var pointer = this.getType(node.value);
            return pointer.type.value;
        case "AddressOf":
            var type = this._getVariable(node.value.value);
            return { nodeType: 'Pointer', value: type.type };
        case "Variable":
            var type = this._getVariable(node.value);
            if (!type) {
                console.log("Defined variables are " + util.inspect(this.getFrame().variables));
                throw new Error("Undefined variable: " + node.value);
            }
            return type;
        case "Variadic":
            return "VARIADIC";
        case "BinaryExpression":
            var type = this.getType(node.left);
            return type;
        default:
            throw new Error("Don't know " + node.nodeType);
    }
}

Context.prototype.confirmTypeCompatibility = function(val1, val2) {
    if (! _.isEqual(val1, val2)) {
        throw new Error("Type mismatch between " + util.inspect(val1) + " and " + util.inspect(val2));
    }
}

exports.Context = Context
