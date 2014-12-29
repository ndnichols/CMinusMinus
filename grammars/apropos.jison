%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
(int|float|void)           return 'TYPE'
\w+                   return 'VAR'
";"                   return 'SEMI'
"*"                   return 'STAR'
"="                   return 'EQUAL'
"("                   return 'LP'
")"                   return 'RP'
"{"                   return 'LB'
"}"                   return 'RB'
","                   return 'COMMA'
<<EOF>>               return 'EOF'

/lex

%start program

%%

program
    : statement_list EOF
        {return $statement_list;}
    ;

statement_list
    : statement_list statement
       { $$ = $statement_list; $$.push($statement); }
    | statement
       { $$ = [$statement]; }
    | function_declaration
        { $$ = $1; }
    ;

arg_list
    : arg_list COMMA declaration
       { $$ = $arg_list; $$.push($declaration); }
    | declaration
        { $$ = [$1]; }
    ;

val_list
    : val_list COMMA value
       { $$ = $val_list; $$.push($value); }
    | value
        { $$ = [$1]; }
    ;


statement
    : declaration EQUAL value SEMI
        { $$ = {"nodeType": "Assignment", lhs: $1, rhs: $3};}
    | declaration SEMI
        { $$ = $1; }
    | VAR LP val_list RP SEMI
        { $$ = {nodeType: "FuncCall", name: $1, args: $3};}
    ;

value
    : variable
        { $$ = $1; }
    | NUMBER
        { $$ = {nodeType: "number", value: $1}; }
    ;

variable
    : VAR
        { $$ = {nodeType: "variable", value: $1}; }
    | STAR VAR
        { $$ = {nodeType: "pointer", value: $2}; }
    ;

declaration
    : TYPE variable
        { $$ = {nodeType: "declaration", type: $1, name: $2};}
    ;

function_declaration
    : TYPE VAR LP arg_list RP block
        { $$ = {nodeType: "functionDeclaration", name: $2, arg_list: $4, block: $6}}
    ;

block
    : LB statement_list RB
        { $$ = {nodeType: "block", statements: $2}}
    ;

