import {
  AssignNode,
  BinOpNode,
  BlockNode,
  CompoundNode,
  NoOpNode,
  NumNode,
  ProcedureDeclNode,
  ProgramNode,
  TypeNode,
  UnaryOpNode,
  VarDeclNode,
  VarNode,
} from '../entities/ast-nodes';
import { TokenTypes } from '../types';

export class Interpreter {
  private readonly GLOBAL_SCOPE: Record<string, any> = {};

  constructor(private readonly ast: ProgramNode) {}

  public interpret() {
    return this.visitProgram(this.ast);
  }

  public getGlobal() {
    return this.GLOBAL_SCOPE;
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
      | any, // TODO: Remove
  ) {
    if (node.nodeName === 'BinOpNode') {
      return this.visitBinOp(node as unknown as BinOpNode);
    }

    if (node.nodeName === 'BlockNode') {
      return this.visitBlock(node as unknown as BlockNode);
    }

    if (node.nodeName === 'NumNode') {
      return this.visitNum(node as unknown as NumNode);
    }

    if (node.nodeName === 'UnaryOpNode') {
      return this.visitUnaryOp(node as unknown as UnaryOpNode);
    }

    if (node.nodeName === 'CompoundNode') {
      return this.visitCompound(node as unknown as CompoundNode);
    }

    if (node.nodeName === 'NoOpNode') {
      return this.visitNoOp(node as unknown as NoOpNode);
    }

    if (node.nodeName === 'AssignNode') {
      return this.visitAssign(node as unknown as AssignNode);
    }

    if (node.nodeName === 'VarNode') {
      return this.visitVar(node as unknown as VarNode);
    }

    if (node.nodeName === 'ProgramNode') {
      return this.visitProgram(node as unknown as ProgramNode);
    }

    if (node.nodeName === 'VarDeclNode') {
      return this.visitVarDecl(node as unknown as VarDeclNode);
    }

    if (node.nodeName === 'TypeNode') {
      return this.visitType(node as unknown as TypeNode);
    }

    if (node.nodeName === ProcedureDeclNode.name) {
      return this.visitProcedureDecl(node as unknown as ProcedureDeclNode);
    }

    throw `No $visit${node} method.`;
  }

  private visitProgram(node: ProgramNode): void {
    this.visit(node.block);
  }

  private visitCompound(node: CompoundNode): void {
    for (let child of node.children) {
      this.visit(child);
    }
  }

  private visitBinOp(node: BinOpNode): number {
    if (node.operaion.type === TokenTypes.PLUS) {
      return this.visit(node.left) + this.visit(node.right);
    }

    if (node.operaion.type === TokenTypes.MINUS) {
      return this.visit(node.left) - this.visit(node.right);
    }

    if (node.operaion.type === TokenTypes.MUL) {
      return this.visit(node.left) * this.visit(node.right);
    }

    if (node.operaion.type === TokenTypes.INTEGER_DIV) {
      return Math.floor(this.visit(node.left) / this.visit(node.right));
    }

    if (node.operaion.type === TokenTypes.FLOAT_DIV) {
      return this.visit(node.left) / this.visit(node.right);
    }
  }

  private visitUnaryOp(node: UnaryOpNode): number {
    const opType = node.operation.type;

    if (opType === TokenTypes.PLUS) {
      return +this.visit(node.expression);
    }

    if (opType === TokenTypes.MINUS) {
      return -this.visit(node.expression);
    }
  }

  private visitNum(node: NumNode): number {
    return node.value;
  }

  private visitNoOp(node: NoOpNode): void {
    return;
  }

  private visitAssign(node: AssignNode): any {
    const varName = node.left.value;
    this.GLOBAL_SCOPE[varName] = this.visit(node.right);
    return this.GLOBAL_SCOPE[varName];
  }

  private visitVar(node: VarNode): any {
    const varName = node.value;
    const programVar = this.GLOBAL_SCOPE[varName];

    if (!programVar) {
      throw 'Var not found in GLOBAL_SCOPE';
    }

    return programVar;
  }

  private visitBlock(node: BlockNode) {
    for (let decl of node.declarations) {
      this.visit(decl);
    }
    this.visit(node.compoundStatements);
  }

  private visitVarDecl(node: VarDeclNode) {
    return;
  }

  private visitType(node: TypeNode) {
    return;
  }

  private visitProcedureDecl(node: ProcedureDeclNode) {
    return;
  }
}
