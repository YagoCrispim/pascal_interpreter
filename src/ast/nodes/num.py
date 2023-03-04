from src.ast.ast import AST
from src.commom.tkn import Token


class Num(AST):
    def __init__(self, token: Token) -> None:
        self.token = token
        self.value = token.value
