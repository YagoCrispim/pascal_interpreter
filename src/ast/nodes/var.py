from src.ast.ast import AST
from src.commom import Token


class Var(AST):
    def __init__(self, token: Token):
        self.token = token
        self.value = token.value
