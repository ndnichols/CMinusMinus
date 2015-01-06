// This method does the actual CMM AST -> JS AST conversion.
var util = require('util');
var _ = require('underscore');


function jsAssignmentTarget(node, context) {
    if (node.nodeType === 'ValueAt') {
        return {
            type: 'MemberExpression',
            computed: false,
            object: {
                type: 'Identifier',
                name: node.value.value
            },
            property: {
                type: 'Identifier',
                name: 'value'
            }
        }
    }
    else {
        return {
            type: 'Identifier',
            name: node.value
        };
    }
}

// Takes in a value node, produces the JS AST representation.
function jsValue(node, context) {
    if (node.nodeType === 'Literal') {
        return {
            type: 'Literal',
            value: node.value,
            raw: node.value.toString()
        };
    }
    else if (node.nodeType === 'ValueAt') {
        return {
            type: 'MemberExpression',
            computed: false,
            object: {
                type: 'Identifier',
                name: node.value.value
            },
            property: {
                type: 'Identifier',
                name: 'value'
            }
        }
    }
    else if (node.nodeType === 'Variable') {
        var valType = context.getType(node);
        if (valType.type.nodeType === 'Pointer') {
            return {
                type: 'Identifier',
                name: node.value
            }
        }
        else {
            return {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: node.value
                },
                property: {
                    type: 'Identifier',
                    name: 'value'
                }
            }
        }
    }
    else if (node.nodeType === 'AddressOf') {
        return {
            type: 'Identifier',
            name: node.value.value
        }
    }
    else if (node.nodeType === 'BinaryExpression') {
        return {
            type: "BinaryExpression",
            operator: node.operator,
            left: jsValue(node.left, context),
            right: jsValue(node.right, context)
        }
    }
    else {
        throw new Error("Can't generate value for " + util.inspect(node));
    }
}

// Takes an arbitrary CMM node, the context object, and the body, which is
// just the list that the generated nodes should be appended to.
function generate(node, context, body) {
    switch(node.nodeType) {
        case "Program":
            var js = {type: "Program", body: []};
            body.push(js);
            return js.body;
        case "FunctionDeclaration":
            var js = {type: "FunctionDeclaration"};
            js.id = {
                type: "Identifier",
                name: node.name
            };
            js.params = [];
            for (var p in node.parameters) {
                var param = node.parameters[p];
                if (param.nodeType === 'Variadic') {
                    break;
                }
                var jsParam = {
                    type: 'Identifier',
                    name: param.name.value
                }
                js.params.push(jsParam);
            }
            js.defaults = [];
            js.rest = null;
            js.generator = false;
            js.expression = false;
            js.body = {
                type: 'BlockStatement',
                body: []
            }
            body.push(js);
            return js.body.body;
        case "DeclarationAndAssignment":
            var js = {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: []
            };
            var jsDec = {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: node.left.name.value
                },
                init: null
            };
            js.declarations.push(jsDec);
            var rightType = context.getType(node.right);
            jsDec.init = jsValue(node.right, context);
            var leftType = context.getType(node.left);
            if (leftType.nodeType !== 'Pointer') {
                jsDec.init = {
                    type: 'NewExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'Value'
                    },
                    arguments: [jsDec.init]
                }
            }
            body.push(js);
            return body;
        case "Assignment":
            var js = {
                type: "ExpressionStatement",
                expression: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left: jsAssignmentTarget(node.left),
                    right: jsValue(node.right, context)
                }
            }
            body.push(js);
            return body;
        case "FunctionCall":
            var js = {
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: node.name
                    },
                    arguments: []
                }
            }
            for (var a in node.args) {
                var arg = node.args[a];
                js.expression.arguments.push(jsValue(arg, context));
            }
            body.push(js);
            break;
        case "Return":
            var js = {
                type: "ReturnStatement",
                argument: jsValue(node.value)
            }
            body.push(js);
            break;
        default:
            return body;
    }
}

module.exports = generate;
