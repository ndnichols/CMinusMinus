/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'
"PI"                  return 'PI'
"E"                   return 'E'
"int"                 return 'TYPE'
\w+                   return 'VAR'
";"                   return 'SEMI'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS
%left TYPE

%% /* language grammar
*/

program
    : statement_list EOF
        {return $statement_list}
    ;

statement_list
    : statement_list statement
       { $$ = $var_list; $$.unshift($var); }
    | statement
        { $$ = [$var]; }
    ;

statement
    : e SEMI
        { return {"type": "Program", "body": [{"type": "ExpressionStatement", "expression":$1}]};}
    ;

e
    : TYPE VAR
        {$$ = {type:"Declaration", type: $1, name: $2}}
    ;
