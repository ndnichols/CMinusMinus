var util = require('util');
var _ = require('underscore');
var generate = require('./generator')

function analyze(node, context, output) {
    output = generate(node, context, output);
    switch (node.nodeType) {
        case "DeclarationStatement":
            analyze(node.declaration, context, output)
            break;
        case "Declaration":
            context.addVariable(node.name.value, node.type);
            break;
        case "DeclarationAndAssignment":
            analyze(node.left, context, output);
            analyze(node.right, context, output);
            var leftType = context.getType(node.left);
            var rightType = context.getType(node.right);
            context.confirmTypeCompatibility(leftType, rightType);
            break;
        case "FunctionDeclaration":
            context.addFunction(node.name, node.returnType, node.parameters);
            context.push()
            for (var p in node.parameters) {
                var param = node.parameters[p];
                if (param.nodeType !== 'Variadic') {
                    context.addVariable(param.name.value, param.type);
                }
            }
            analyze(node.block, context, output);
            context.pop()
            break;
        case "FunctionCall":
            var func = context.getFunction(node.name);
            var zipped = _.zip(node.args, func.parameters);
            var variadic = false;
            for (var z in zipped) {
                var passed = zipped[z][0];
                var required = zipped[z][1];
                var passedType = context.getType(passed);
                var requiredType = context.getType(required);
                if (requiredType === 'VARIADIC') {
                    break;
                }
                context.confirmTypeCompatibility(passedType, requiredType);
            }
            break;
        case "Program":
        case "Block":
            context.push()
            for (var statement in node.statements) {
                analyze(node.statements[statement], context, output);
            }
            context.pop();
            break;
    }
}

module.exports = analyze;
