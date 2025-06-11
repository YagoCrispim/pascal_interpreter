# Programming Language Grammar

This is the grammar for the programming language. It is written in EBNF.

```
program : PROGRAM variable SEMI block DOT

block : declarations compound_statement

declarations : (VAR (variable_declaration SEMI)+)? procedure_declaration*

variable_declaration : ID (COMMA ID)* COLON type_spec

procedure_declaration :
      PROCEDURE ID (LPAREN formal_parameter_list RPAREN)? SEMI block SEMI

formal_params_list : formal_parameters
                    | formal_parameters SEMI formal_parameter_list

formal_parameters : ID (COMMA ID)* COLON type_spec

type_spec : INTEGER | REAL

compound_statement : BEGIN statement_list END

statement_list : statement
                | statement SEMI statement_list

statement : compound_statement
          | proccall_statement
          | assignment_statement
          | empty

proccall_statement : ID LPAREN (expr (COMMA expr)*)? RPAREN

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

---

1. program : PROGRAM variable SEMI block DOT

   Descrição: Esta regra define a estrutura básica de um programa. Um programa começa com a palavra-chave PROGRAM, seguida por um identificador (que representa o nome do programa), um ponto e vírgula (SEMI), um bloco de código (definido pela regra block), e termina com um ponto (DOT).

2. block : declarations compound_statement

   Descrição: Um bloco de código é composto por declarações (definidas pela regra declarations) e uma declaração composta (definida pela regra compound_statement). Isso permite que o bloco contenha variáveis e procedimentos, além de um conjunto de instruções.

3. declarations : (VAR (variable_declaration SEMI)+)? procedure_declaration\*

   Descrição: As declarações podem incluir uma seção opcional que começa com a palavra-chave VAR, seguida por uma ou mais declarações de variáveis (cada uma terminada por um ponto e vírgula). Além disso, pode haver zero ou mais declarações de procedimentos.

4. variable_declaration : ID (COMMA ID)\* COLON type_spec

   Descrição: Uma declaração de variável consiste em um identificador (nome da variável), que pode ser seguido por uma lista de identificadores separados por vírgulas, um dois-pontos (COLON), e um tipo de dado (definido pela regra type_spec).

5. procedure_declaration : PROCEDURE ID (LPAREN formal_parameter_list RPAREN)? SEMI block SEMI

   Descrição: Uma declaração de procedimento começa com a palavra-chave PROCEDURE, seguida por um identificador (nome do procedimento). Opcionalmente, pode haver uma lista de parâmetros formais entre parênteses. A declaração termina com um ponto e vírgula, seguida por um bloco de código e outro ponto e vírgula.

6. formal_parameter_list : formal_parameters | formal_parameters SEMI formal_parameter_list

   Descrição: A lista de parâmetros formais pode ser uma única lista de parâmetros (definida pela regra formal_parameters) ou uma lista de parâmetros seguida por um ponto e vírgula e outra lista de parâmetros.

7. formal_parameters : ID (COMMA ID)\* COLON type_spec

   Descrição: Os parâmetros formais são semelhantes às declarações de variáveis, consistindo em um ou mais identificadores, seguidos por um dois-pontos e um tipo de dado.

8. type_spec : INTEGER | REAL

   Descrição: Esta regra define os tipos de dados disponíveis na linguagem: INTEGER (números inteiros) e REAL (números de ponto flutuante).

9. compound_statement : BEGIN statement_list END

   Descrição: Uma declaração composta começa com a palavra-chave BEGIN, seguida por uma lista de instruções (definida pela regra statement_list), e termina com a palavra-chave END.

10. statement_list : statement | statement SEMI statement_list

    Descrição: A lista de instruções pode ser uma única instrução ou uma instrução seguida por um ponto e vírgula e outra lista de instruções.

11. statement : compound_statement | proccall_statement | assignment_statement | empty

    Descrição: Uma instrução pode ser uma declaração composta, uma chamada de procedimento, uma atribuição ou uma instrução vazia.

12. proccall_statement : ID LPAREN (expr (COMMA expr)\*)? RPAREN

    Descrição: Uma chamada de procedimento consiste em um identificador (nome do procedimento), seguido por uma lista de expressões entre parênteses. A lista de expressões é opcional e pode conter uma ou mais expressões separadas por vírgulas.

13. assignment_statement : variable ASSIGN expr

    Descrição: Uma instrução de atribuição consiste em uma variável, seguida pelo operador de atribuição (ASSIGN), e uma expressão (definida pela regra expr).

14. empty :

    Descrição: Esta regra define uma instrução vazia, que não contém nenhum código.

15. expr : term ((PLUS | MINUS) term)\*

    Descrição: Uma expressão é composta por um termo (definido pela regra term), seguido opcionalmente por uma sequência de operadores de adição (PLUS) ou subtração (MINUS) e mais termos.

16. term : factor ((MUL | INTEGER_DIV | FLOAT_DIV) factor)\*

    Descrição: Um termo é composto por um fator (definido pela regra factor), seguido opcionalmente por uma sequência de operadores de multiplicação (MUL), divisão inteira (INTEGER_DIV) ou divisão de ponto flutuante (FLOAT_DIV), e mais fatores. Isso permite a construção de expressões matemáticas que envolvem multiplicação e divisão.

17. factor : PLUS factor | MINUS factor | INTEGER_CONST | REAL_CONST | LPAREN expr RPAREN | variable

    Descrição: Um fator pode ser:
    Um fator precedido por um sinal de adição (PLUS) ou subtração (MINUS), permitindo a inclusão de sinais em números.
    Um número inteiro (INTEGER_CONST).
    Um número de ponto flutuante (REAL_CONST).
    Uma expressão entre parênteses, que permite a alteração da precedência das operações (LPAREN expr RPAREN).
    Uma variável (definida pela regra variable), que representa um valor armazenado.

18. variable : ID

    Descrição: Esta regra define uma variável como um identificador (ID). Um identificador é um nome que representa uma variável no programa, permitindo que o programador armazene e manipule dados.

---

1. \+ (Mais)

   Significado: O símbolo + indica que o elemento que o precede deve aparecer uma ou mais vezes. Em outras palavras, é um operador que requer pelo menos uma ocorrência do elemento.
   Exemplo: Na regra variable_declaration : ID (COMMA ID)\* COLON type_spec, se tivermos uma parte como (COMMA ID)+, isso significa que deve haver pelo menos uma ocorrência de COMMA ID, ou seja, pelo menos um identificador adicional separado por vírgula.

2. ? (Interrogação)

   Significado: O símbolo ? indica que o elemento que o precede é opcional, ou seja, pode aparecer zero ou uma vez. Isso significa que a presença do elemento não é obrigatória.
   Exemplo: Na regra procedure_declaration : PROCEDURE ID (LPAREN formal_parameter_list RPAREN)? SEMI block SEMI, a parte (LPAREN formal_parameter_list RPAREN)? significa que a lista de parâmetros formais entre parênteses é opcional. O procedimento pode ser declarado com ou sem essa lista.
