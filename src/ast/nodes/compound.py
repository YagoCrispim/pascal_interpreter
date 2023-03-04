from typing import List
from ..ast import AST


class Compound(AST):
    def __init__(self):
        self.children = []
