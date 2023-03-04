import sys
from typing import Union, List

from src.ast.nodes.var_decl import VarDecl
from src.ast.nodes.binop import BinOp
from src.ast.nodes.unary_op import UnaryOp
from src.ast.nodes.num import Num
from src.ast.nodes.noop import NoOp
from src.ast.nodes.var import Var
from src.ast.nodes.assign import Assign
from src.ast.nodes.compound import Compound
from src.ast.nodes.type import Type as TypeNode
from src.ast.nodes.block import Block
from src.ast.nodes.program import Program

from src.commom import (
    Token,
    INTEGER,
    LPAREN,
    MINUS,
    MUL,
    RPAREN,
    PLUS,
    ID,
    ASSIGN,
    BEGIN,
    SEMI,
    END,
    DOT,
    EOF,
    REAL,
    COMMA,
    COLON,
    VAR,
    PROGRAM,
    INTEGER_DIV,
    FLOAT_DIV,
    INTEGER_CONST,
    REAL_CONST
)


class Parser:
    def __init__(self, tokens) -> None:
        self.tokens: List[Token] = tokens
        self.pos: int = -1
        self.current_token: Token = self._get_next_token()  # type: ignore

    def parse(self) -> Program:
        node: Program = self._program()
        if self._compare_token_type(self.current_token, EOF, 'diff'):
            self._error()
        return node

    def _program(self) -> Program:
        """
        program : PROGRAM variable SEMI block DOT
        """
        self._eat(PROGRAM)
        var_node = self._variable()
        prog_name = var_node.value
        self._eat(SEMI)
        block_node = self._block()
        program_node = Program(prog_name, block_node)
        self._eat(DOT)
        return program_node

    def _block(self):
        """
        block : declarations compound_statement
        """
        declaration_nodes = self._declarations()
        compound_statement_nodes = self._compound_statement()
        node = Block(declaration_nodes, compound_statement_nodes)
        return node

    def _declarations(self) -> List[VarDecl]:
        """
        declarations : VAR (variable_declaration SEMI)+
            empty
        """
        declarations: List[VarDecl] = []

        if self._compare_token_type(self.current_token, VAR):
            self._eat(VAR)
            while self._compare_token_type(self.current_token, ID):
                var_decl = self._variable_declaration()
                declarations.extend(var_decl)  # extend????
                self._eat(SEMI)

        return declarations

    def _variable_declaration(self) -> List[VarDecl]:
        """
        variable_declaration : ID (COMMA ID)* COLON type_spec
        """
        var_nodes = [Var(self.current_token)]
        self._eat(ID)

        while self._compare_token_type(self.current_token, COMMA):
            self._eat(COMMA)
            var_nodes.append(Var(self.current_token))
            self._eat(ID)

        self._eat(COLON)

        type_node = self._type_spec()
        # TODO: doube check this
        var_declarations = [
            VarDecl(var_node, type_node)
            for var_node in var_nodes
        ]
        return var_declarations

    def _type_spec(self) -> TypeNode:
        """
        type_spec : INTEGER | REAL
        """
        token = self.current_token

        if self._compare_token_type(token, INTEGER):
            self._eat(INTEGER)
        else:
            self._eat(REAL)

        node = TypeNode(token)
        return node

    def _compound_statement(self) -> Compound:
        """
        compound_statement: BEGIN statement_list END
        """
        self._eat(BEGIN)
        nodes = self._statement_list()
        self._eat(END)

        root = Compound()
        for node in nodes:
            root.children.append(node)

        return root

    def _statement_list(self):
        """
        statement_list : statement
                       | statement SEMI statement_list
        """
        node = self._statement()

        results = [node]

        # TODO: double check this
        while self._compare_token_type(self.current_token, SEMI):
            self._eat(SEMI)
            results.append(self._statement())

        return results

    def _statement(self) -> Union[Compound, Assign, NoOp]:
        """
        statement: compound_statement
                | assignment_statement
                | empty
        """
        node = None

        if self._compare_token_type(self.current_token, BEGIN):
            node = self._compound_statement()
        if self._compare_token_type(self.current_token, ID):
            node = self._assignment_statement()
        else:
            node = self._empty()
        return node

    def _assignment_statement(self) -> Assign:
        """
        assignment_statement : variable ASSIGN expr
        """
        left = self._variable()
        token = self.current_token
        self._eat(ASSIGN)
        right = self._expr()
        node = Assign(left, token, right)  # type: ignore
        return node

    def _variable(self) -> Var:
        """
        variable : ID
        """
        node = Var(self.current_token)
        self._eat(ID)
        return node

    def _expr(self) -> Union[int, BinOp, UnaryOp, Var]:
        """
        expr : term ((PLUS | MINUS) term)*
        """
        node = self._term()

        while self.current_token.type in (PLUS, MINUS):
            token: Token = self.current_token

            if self._compare_token_type(token, PLUS):
                self._eat(PLUS)

            if self._compare_token_type(token, MINUS):
                self._eat(MINUS)

            node = BinOp(left=node, op=token, right=self._term())

        return node

    def _term(self) -> Union[int, BinOp, UnaryOp, Var]:
        """
        term : factor ((MUL | INTEGER_DIV | FLOAT_DIV) factor)*
        """
        node = self._factor()

        while self.current_token.type in (MUL, INTEGER_DIV, FLOAT_DIV):
            token: Token = self.current_token

            if self._compare_token_type(token, MUL):
                self._eat(MUL)

            if self._compare_token_type(token, INTEGER_DIV):
                self._eat(INTEGER_DIV)

            if self._compare_token_type(token, FLOAT_DIV):
                self._eat(FLOAT_DIV)

            node = BinOp(left=node, op=token, right=self._factor())

        return node

    def _factor(self) -> Union[int, BinOp, UnaryOp, Var]:
        """
        factor : PLUS factor
              | MINUS factor
              | INTEGER_CONST
              | REAL_CONST
              | LPAREN expr RPAREN
              | variable
        """
        token: Token = self.current_token

        if self._compare_token_type(token, PLUS):
            self._eat(PLUS)
            node = UnaryOp(token, self._factor())  # type: ignore
            return node

        if self._compare_token_type(token, MINUS):
            self._eat(MINUS)
            node = UnaryOp(token, self._factor())  # type: ignore
            return node

        if self._compare_token_type(token, INTEGER_CONST):
            self._eat(INTEGER_CONST)
            return Num(token)  # type: ignore

        if self._compare_token_type(token, REAL_CONST):
            self._eat(REAL_CONST)
            return Num(token)  # type: ignore

        if self._compare_token_type(token, LPAREN):
            self._eat(LPAREN)
            node = self._expr()
            self._eat(RPAREN)
            return node
        else:
            node = self._variable()
            return node

    @staticmethod
    def _empty() -> NoOp:
        return NoOp()

    def _eat(self, token_type: str) -> None:
        if self._compare_token_type(self.current_token, token_type):
            self.current_token = self._get_next_token()  # type: ignore
        else:
            self._error('Expected token type: ' + token_type +
                        ' but got: ' + self.current_token.type)

    def _get_next_token(self) -> Union[Token, None]:
        self.pos += 1

        if self.pos > len(self.tokens) - 1:
            return None
        else:
            return self.tokens[self.pos]

    def _error(self, msg=None):
        print('----- ERROR -----')
        print('Cause: Syntax error')
        print('Where: src/parser.py')
        print('\n----- DETAILS -----')
        print('Current token: ', self.current_token)
        print('Details: ', self.tokens[self.pos - 2:self.pos + 3])
        if msg:
            print('Message: ', msg)
        print('-------------------------')
        sys.exit(0)

    def _compare_token_type(self, token: Token, type: str, comparison='eq') -> bool:
        return token.type == type if comparison == 'eq' else token.type != type
