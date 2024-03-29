# Programming Language Grammar

This is the grammar for the programming language. It is written in EBNF.

```
program : PROGRAM variable SEMI block DOT

block : declarations compound_statement

declarations : VAR (variable_declaration SEMI)+)*
            | (PROCEDURE ID (LPAREN formal_parameter_list RPAREN)? SEMI block SEMI)*
            | empty

formal_parameter_list : formal_parameters
                      | formal_parameters SEMI formal_parameter_list

variable_declaration : ID (COMMA ID)* COLON type_spec

type_spec : INTEGER | REAL

compound_statement : BEGIN statement_list END

statement_list : statement
                | statement SEMI statement_list

statement : compound_statement
            | assignment_statement
            | empty

assignment_statement : variable ASSIGN expr

empty :

expr : term ((PLUS | MINUS) term)*

term : factor ((MUL | INTEGER_DIV | FLOAT_DIV) factor)*

factor : PLUS factor
        | MINUS factor
        | INTEGER_CONST
        | REAL_CONST
        | LPAREN expr RPAREN
        | variable

variable: ID
```
