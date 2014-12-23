BUILTINS = ['printf'];

function scrub(node) {
    switch(node.type) {
        case "Program":
            node.body = _.filter(node.body, function (funcNode) {
                return (funcNode.type === 'FunctionDeclaration') &&
                    (_.indexOf(BUILTINS, funcNode.id.name) === -1)
            });
    }
    return node;
}

module.exports = scrub;
