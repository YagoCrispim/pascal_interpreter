from src.ast.ast import AST
from src.commom import Token
from src.ast.nodes.var import Var


class UnaryOp(AST):
    def __init__(self, op, expr) -> None:
        self.expr = expr
        self.token = self.op = op
