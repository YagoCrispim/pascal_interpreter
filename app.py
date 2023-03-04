from typing import List, Any
import json

from src.interpreter import Intepreter
from src.lexer import Lexer
from src.parser import Parser
from src.ast.nodes.program import Program
from src.commom import Token


def main() -> None:
    text = """\
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

    tokens: List[Token] = Lexer(text).get_tokens()
    ast: Program = Parser(tokens).parse()
    interpreter = Intepreter(ast)
    interpreter.interpret()

    global_scope: dict[Any, Any] = interpreter.get_global()
    print("var_name: var_value")
    print(json.dumps(global_scope, indent=2))


if __name__ == "__main__":
    main()
