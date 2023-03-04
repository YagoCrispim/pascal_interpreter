from src.interpreter import Intepreter
from src.lexer import Lexer
from src.parser import Parser
from src.ast.nodes.program import Program
from src.commom import Token

from src.commom import (
    ASSIGN,
    BEGIN,
    COLON,
    COMMA,
    DOT,
    END,
    EOF,
    ID,
    INTEGER,
    INTEGER_DIV,
    MUL,
    PLUS,
    PROGRAM,
    REAL,
    SEMI,
    VAR,
    INTEGER_CONST,
    REAL_CONST,
    FLOAT_DIV
)

program = """\
    PROGRAM Part10AST;
    VAR
        a, b : INTEGER;
        y    : REAL;

    BEGIN
        a := 2;
        b := 10 * a + 10 * a DIV 4;
        y := 20 / 7 + 3.14;
    END.
    """

tokens_list = [Token(PROGRAM, 'PROGRAM'), Token(ID, 'Part10AST'), Token(SEMI, ';'), Token(VAR, 'VAR'), Token(ID, 'a'), Token(COMMA, ','), Token(ID, 'b'), Token(COLON, ':'), Token(INTEGER, 'INTEGER'), Token(SEMI, ';'), Token(ID, 'y'), Token(COLON, ':'), Token(REAL, 'REAL'), Token(SEMI, ';'), Token(BEGIN, 'BEGIN'), Token(ID, 'a'), Token(ASSIGN, ':='), Token(INTEGER_CONST, 2), Token(SEMI, ';'), Token(ID, 'b'), Token(ASSIGN, ':='), Token(
    INTEGER_CONST, 10), Token(MUL, '*'), Token(ID, 'a'), Token(PLUS, '+'), Token(INTEGER_CONST, 10), Token(MUL, '*'), Token(ID, 'a'), Token(INTEGER_DIV, 'DIV'), Token(INTEGER_CONST, 4), Token(SEMI, ';'), Token(ID, 'y'), Token(ASSIGN, ':='), Token(INTEGER_CONST, 20), Token(FLOAT_DIV, '/'), Token(INTEGER_CONST, 7), Token(PLUS, '+'), Token(REAL_CONST, 3.14), Token(SEMI, ';'), Token(END, 'END'), Token(DOT, '.'), Token(EOF, None)]

result = []


# ======================== ASSERTIONS ========================

def _assert_tokens_list():
    tokens = Lexer(program).get_tokens()
    # check if two list are equal

    if len(tokens_list) != 42:
        result.append(
            {"tokens_list": False, "error": "tokens_list length is not 42"})
        return

    for i in range(len(tokens_list)):
        clausule = tokens[i].type == tokens_list[i].type and tokens[i].value == tokens_list[i].value
        if not clausule:
            result.append({"tokens_list": False, "error": "tokens_list is not equal",
                           "deatils": f"Error in token {i} {tokens[i]} != {tokens_list[i]}"})
            return

    result.append({"tokens_list": True})


# TODO: improve this test
def _assert_parser():
    tokens = Lexer(program).get_tokens()
    parser = Parser(tokens)
    ast = parser.parse()

    if not isinstance(ast, Program):
        result.append({"parser": False, "error": "ast is not Program"})
        return

    result.append({"parser": True})


def _assert_interpreter():
    tokens = Lexer(program).get_tokens()
    parser = Parser(tokens)
    ast = parser.parse()
    interpreter = Intepreter(ast)
    interpreter.interpret()

    expected_var_values = {
        "a": 2,
        "b": 25,
        "y": 5.997142857142857
    }

    if interpreter.get_global() != expected_var_values:
        result.append(
            {"interpreter": False, "error": "interpreter.GLOBAL_SCOPE has not the expected values"})
        return

    result.append({"interpreter": True})

# ======================== HELPER ========================


def _print_result():
    print("----- Results -----")
    for r in result:
        print(r)


# ======================== EXECUTIONS ========================
_assert_tokens_list()
_assert_parser()
_assert_interpreter()
_print_result()
