// Because we don't support actually #include "stdio.h", etc., we have to hack
// in included functions like printf. We do that by pasting the "builtin"
// definitions at the top of the source (so the type-checker doesn't complain)
// and then pulling out the empty definition here.

BUILTINS = ['printf'];

function scrub(node) {
    switch(node.type) {
        case "Program":
            // "Pull out all the function definitions whose name is in
            // BUILTINS".
            node.body = _.filter(node.body, function (funcNode) {
                return (funcNode.type === 'FunctionDeclaration') &&
                    (_.indexOf(BUILTINS, funcNode.id.name) === -1)
            });
    }
    return node;
}

module.exports = scrub;
