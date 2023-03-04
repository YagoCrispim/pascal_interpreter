from typing import Union

from src.ast.nodes.unary_op import UnaryOp
from src.ast.nodes.var import Var
from src.commom import Token
from src.ast.ast import AST


class Assign(AST):
    def __init__(
        self, left: Var, op: Token, right: Union[int, UnaryOp, Var]
    ) -> None:
        self.left = left
        self.token = self.op = op
        self.right = right
