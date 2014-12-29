%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
(int|float)                 return 'TYPE'
\w+                   return 'VAR'
";"                   return 'SEMI'
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
    : e SEMI
        { $$ = {"nodeType": "Statement", "expression": $1};}
    ;

e
    : TYPE VAR
        {$$ = {nodeType:"Declaration", type: $1, name: $2}}
    ;
