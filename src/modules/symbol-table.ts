import {
  AssignNode,
  BinOpNode,
  BlockNode,
  CompoundNode,
  NoOpNode,
  NumNode,
  ProcedureDeclNode,
  ProgramNode,
  Symbol,
  TypeNode,
  UnaryOpNode,
  VarDeclNode,
  VarNode,
  VarSymbol,
} from '../entities/ast-nodes';

export class SymbolTable {
  private readonly symbols: Record<string, Symbol> = {};

  define(symbol: Symbol): void {
    this.symbols[symbol.name] = symbol;
  }

  lookup(name: string): Symbol {
    return this.symbols[name] || undefined;
  }
}

export class SymbolTableBuilder {
  private readonly symtab: SymbolTable = new SymbolTable();

  constructor(private readonly ast: ProgramNode) {}

  walk() {
    this.visitProgram(this.ast);
  }

  private visit(
    node:
      | CompoundNode
      | AssignNode
      | NoOpNode
      | VarNode
      | UnaryOpNode
      | BinOpNode
      | NumNode
      | BlockNode
      | ProgramNode
      | VarDeclNode
      | TypeNode
      | ProcedureDeclNode,
  ) {
    if (node.nodeName === BinOpNode.name) {
      return this.visitBinOp(node as unknown as BinOpNode);
    }

    if (node.nodeName === BlockNode.name) {
      return this.visitBlock(node as unknown as BlockNode);
    }

    if (node.nodeName === NumNode.name) {
      return this.visitNum(node as unknown as NumNode);
    }

    if (node.nodeName === UnaryOpNode.name) {
      return this.visitUnaryOp(node as unknown as UnaryOpNode);
    }

    if (node.nodeName === CompoundNode.name) {
      return this.visitCompound(node as unknown as CompoundNode);
    }

    if (node.nodeName === NoOpNode.name) {
      return this.visitNoOp(node as unknown as NoOpNode);
    }

    if (node.nodeName === AssignNode.name) {
      return this.visitAssign(node as unknown as AssignNode);
    }

    if (node.nodeName === VarNode.name) {
      return this.visitVar(node as unknown as VarNode);
    }

    if (node.nodeName === ProgramNode.name) {
      return this.visitProgram(node as unknown as ProgramNode);
    }

    if (node.nodeName === VarDeclNode.name) {
      return this.visitVarDecl(node as unknown as VarDeclNode);
    }

    if (node.nodeName === ProcedureDeclNode.name) {
      return this.visitProcedureDecl(node as unknown as ProcedureDeclNode);
    }
  }

  private visitProgram(node: ProgramNode): void {
    this.visit(node.block);
  }

  private visitCompound(node: CompoundNode): void {
    for (let child of node.children) {
      this.visit(child);
    }
  }

  private visitBinOp(node: BinOpNode): any {
    this.visit(node.left);
    this.visit(node.right);
  }

  private visitUnaryOp(node: UnaryOpNode): any {
    this.visit(node.expression);
  }

  private visitNum(node: NumNode) {
    return;
  }

  private visitNoOp(node: NoOpNode): void {
    return;
  }

  private visitAssign(node: AssignNode): any {
    const varName = node.left.value; // TODO: Number as var name?
    const varSymbol = this.symtab.lookup(String(varName));
    if (!varSymbol) {
      throw `Var "${varName}" not found.`;
    }
    this.visit(node.right);
  }

  private visitVar(node: VarNode): any {
    const varName = node.value;
    const varSymbol = this.symtab.lookup(String(varName));
    if (!varSymbol) {
      throw `Var ${varName} not found.`;
    }
  }

  private visitBlock(node: BlockNode) {
    for (let decl of node.declarations) {
      this.visit(decl);
    }
    this.visit(node.compoundStatements);
  }

  private visitVarDecl(node: VarDeclNode) {
    const typeName = node.typeNode.value;
    const typeSymbol = this.symtab.lookup(String(typeName));

    const varName = node.varNode.value;
    const varSymbol = new VarSymbol(String(varName), typeSymbol, '');

    this.symtab.define(varSymbol);
  }

  private visitProcedureDecl(node: ProcedureDeclNode) {
    return;
  }
}
