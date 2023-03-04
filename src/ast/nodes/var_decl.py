from src.ast.ast import AST
from .var import Var
from .type import Type


class VarDecl(AST):
    def __init__(self, var_node: Var, type_node: Type):
        self.var_node = var_node
        self.type_node = type_node
