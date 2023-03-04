from src.ast.ast import AST


class Program(AST):
    def __init__(self, name, block):
        self.name = name
        self.block = block
