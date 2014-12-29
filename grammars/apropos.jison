%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
(int|float)           return 'TYPE'
\w+                   return 'VAR'
";"                   return 'SEMI'
"*"                   return 'STAR'
"="                   return 'EQUAL'
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
       { $$ = $statement_list; $$.unshift($statement); }
    | statement
       { $$ = [$statement]; }
    ;

statement
    : declaration EQUAL value SEMI
        { $$ = {"nodeType": "Assignment", lhs: $1, rhs: $3};}
    | declaration SEMI
        { $$ = $1; }
    ;

value
    : VAR
        { $$ = {nodeType: "variable", value: $1}; }
    | STAR VAR
        { $$ = {nodeType: "pointer", value: $2}; }
    | NUMBER
        { $$ = {nodeType: "number", value: $1}; }
    ;

declaration
    : TYPE VAR
        { $$ = {nodeType: "declaration", type: $1, name: $2};}
    ;
