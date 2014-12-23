%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
(int|float|void|char) return 'TYPE'
"return"              return 'RETURN'
\".*?\"               return 'STRING'
\w+                   return 'IDENTIFIER'
";"                   return 'SEMI'
"*"                   return 'STAR'
"="                   return 'EQUAL'
"("                   return 'LP'
")"                   return 'RP'
"{"                   return 'LB'
"}"                   return 'RB'
","                   return 'COMMA'
"&"                   return 'AMPERSAND'
"..."                 return 'VARIADIC'
(\+|\-|\/)            return 'OPERATOR'
<<EOF>>               return 'EOF'

/lex

%start program

%%

program
    : statement_list EOF
        {return {nodeType: "Program", statements: $statement_list};}
    ;

statement_list
    : statement_list statement
       { $$ = $statement_list; $$.push($statement); }
    | statement
       { $$ = [$statement]; }
    ;

param_list
    : param_list COMMA declaration
       { $$ = $param_list; $$.push($declaration); }
    | param_list COMMA VARIADIC
       { $$ = $param_list; $$.push({"nodeType": "Variadic"}); }
    | declaration
        { $$ = [$1]; }
    |
        {$$ = [];}
    ;

arg_list
    : arg_list COMMA value
       { $$ = $arg_list; $$.push($value); }
    | value
        { $$ = [$1]; }
    ;

statement
    : declaration EQUAL value SEMI
        { $$ = {"nodeType": "DeclarationAndAssignment", left: $1, right: $3, line: @1.first_column};}
    | declaration SEMI
        { $$ = {nodeType: "DeclarationStatement", declaration:$1 };}
    | variable EQUAL value SEMI
        { $$ = {nodeType: "Assignment", left:$1 , right: $3};}
    | IDENTIFIER LP arg_list RP SEMI
        { $$ = {nodeType: "FunctionCall", name: $1, args: $3};}
    | RETURN value SEMI
        { $$ = {nodeType: "Return", value: $2};}
    | function_declaration
        { $$ = $1; }
    ;

value
    : LP value OPERATOR value RP
        { $$ = {nodeType: "BinaryExpression", operator: $3, left: $2, right: $4};}
    | LP value STAR value RP
        { $$ = {nodeType: "BinaryExpression", operator: $3, left: $2, right: $4};}
    | variable
        { $$ = $1; }
    | AMPERSAND variable
        { $$ = {nodeType: "AddressOf", value: $2};}
    | NUMBER
        { $$ = {nodeType: "Literal", type: "int", value: parseInt($1, 10)}; }
    | STRING
        { $$ = {nodeType: "Literal", type: {nodeType: 'Pointer', value: 'char'}, value: $1.slice(1, -1)}; }
    ;

variable
    : IDENTIFIER
        { $$ = {nodeType: "Variable", value: $1}; }
    | STAR IDENTIFIER
        { $$ = {nodeType: "ValueAt", value: {nodeType: "Variable", value:$2}}; }
    ;

declaration
    : TYPE variable
        { $$ = $2.nodeType == 'ValueAt' ? {nodeType: "Declaration", type: {nodeType: 'Pointer', value: $1}, name: $2.value} : {nodeType: "Declaration", type: $1, name: $2};}
    ;

function_declaration
    : TYPE IDENTIFIER LP param_list RP block
        { $$ = {nodeType: "FunctionDeclaration", returnType: $1, name: $2, parameters: $4, block: $6}}
    ;

block
    : LB statement_list RB
        { $$ = {nodeType: "Block", statements: $2}}
    | LB RB
        { $$ = {nodeType: "Block", statements: []}}
    ;

