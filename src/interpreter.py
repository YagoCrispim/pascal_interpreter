from typing import Any, Union

from src.ast.nodes import (
    binop,
    unary_op,
    var,
    assign,
    program,
    num,
)
from src.commom import (
    MINUS,
    MUL,
    PLUS,
    INTEGER_DIV,
    FLOAT_DIV
)


class Intepreter:
    def __init__(self, ast: program.Program):
        self.ast = ast
        self.GLOBAL_SCOPE = {}

    def interpret(self):
        return self._visit_program(self.ast)

    def _visit_program(self, node):
        self._visit(node.block)

    def _visit(self, node) -> Any:
        if type(node).__name__ == "BinOp":
            return self._visit_bin_op(node)

        if type(node).__name__ == "Num":
            return self._visit_num(node)

        if type(node).__name__ == "UnaryOp":
            return self._visit_unary_op(node)

        if type(node).__name__ == "Compound":
            return self._visit_compound(node)

        if type(node).__name__ == "NoOp":
            return self._visit_noop(node)

        if type(node).__name__ == "Assign":
            return self._visit_assign(node)

        if type(node).__name__ == "Var":
            return self._visit_var(node)

        if type(node).__name__ == "Program":
            return self._visit_program(node)

        if type(node).__name__ == "Block":
            return self._visit_block(node)

        if type(node).__name__ == "VarDecl":
            return self._visit_var_decl(node)

        if type(node).__name__ == "Type":
            return self._visit_type(node)

        raise Exception("No visit_{} method".format(type(node).__name__))

    def _visit_compound(self, node):
        for child in node.children:
            self._visit(child)

    # add type
    def _visit_bin_op(self, node: binop.BinOp) -> Union[Any, float, None]:
        if node.op.type == PLUS:
            return self._visit(node.left) + self._visit(node.right)
        elif node.op.type == MINUS:
            return self._visit(node.left) - self._visit(node.right)
        elif node.op.type == MUL:
            return self._visit(node.left) * self._visit(node.right)
        elif node.op.type == INTEGER_DIV:
            return self._visit(node.left) // self._visit(node.right)
        elif node.op.type == FLOAT_DIV:
            return float(self._visit(node.left)) / float(self._visit(node.right))

    def _visit_num(self, node: num.Num) -> Union[str, int, float, None]:
        return node.value

    def _visit_unary_op(self, node: unary_op.UnaryOp) -> Union[Any, None]:
        op = node.op.type

        if op == PLUS:
            return +self._visit(node.expr)

        if op == MINUS:
            return -self._visit(node.expr)

    def _visit_noop(self, node) -> None:
        pass

    def _visit_assign(self, node: assign.Assign) -> Any:
        var_name = node.left.value
        # self.GLOBAL[var_name] = self._visit(node.right)  # type: ignore
        self.GLOBAL_SCOPE[var_name] = self._visit(node.right)

        return self.GLOBAL_SCOPE[var_name]

    def _visit_var(self, node: var.Var) -> Any:
        var_name = node.value
        val = self.GLOBAL_SCOPE.get(var_name)  # type: ignore

        if not val:
            raise NameError(repr(var_name))

        return val

    def get_global(self) -> dict[Any, Any]:
        return self.GLOBAL_SCOPE

    def _visit_block(self, node):
        for declaration in node.declarations:
            self._visit(declaration)
        self._visit(node.compound_statement)

    def _visit_var_decl(self, node) -> None:
        # Do nothing
        pass

    def _visit_type(self, node) -> None:
        # Do nothing
        pass
