import {
  AssignNode,
  BinOpNode,
  BlockNode,
  CompoundNode,
  NoOpNode,
  NumNode,
  ProcedureCall,
  ProcedureDeclNode,
  ProgramNode,
  TypeNode,
  UnaryOpNode,
  VarDeclNode,
  VarNode,
} from '../entities/ast-nodes';
import { TokenTypes } from '../types';
import { ActivationRecord, ARType } from './activation-record';
import { CallStack } from './call-stack';

export class AstInterpreter {
  private readonly callStack = new CallStack();

  constructor(private readonly ast: ProgramNode) {
    this.interpret();
  }

  private interpret() {
    return this.visitProgram(this.ast);
  }

  public getGlobal() {
    return this.callStack;
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
      | ProcedureCall
      | TypeNode
      | any, // TODO: Remove
  ) {
    if (node instanceof BinOpNode) {
      return this.visitBinOp(node as unknown as BinOpNode);
    }

    if (node instanceof BlockNode) {
      return this.visitBlock(node as unknown as BlockNode);
    }

    if (node instanceof NumNode) {
      return this.visitNum(node as unknown as NumNode);
    }

    if (node instanceof UnaryOpNode) {
      return this.visitUnaryOp(node as unknown as UnaryOpNode);
    }

    if (node instanceof CompoundNode) {
      return this.visitCompound(node as unknown as CompoundNode);
    }

    if (node instanceof NoOpNode) {
      return this.visitNoOp(node as unknown as NoOpNode);
    }

    if (node instanceof AssignNode) {
      return this.visitAssign(node as unknown as AssignNode);
    }

    if (node instanceof VarNode) {
      return this.visitVar(node as unknown as VarNode);
    }

    if (node instanceof ProgramNode) {
      return this.visitProgram(node as unknown as ProgramNode);
    }

    if (node instanceof VarDeclNode) {
      return this.visitVarDecl(node as unknown as VarDeclNode);
    }

    if (node instanceof TypeNode) {
      return this.visitType(node as unknown as TypeNode);
    }

    if (node instanceof ProcedureDeclNode) {
      return this.visitProcedureDecl(node as unknown as ProcedureDeclNode);
    }

    if (node instanceof ProcedureCall) {
      return this.visitProcedureCall(node as unknown as ProcedureCall);
    }

    throw `No $visit${node} method.`;
  }

  private visitProgram(node: ProgramNode): void {
    const prograName = node.name;

    const ar = new ActivationRecord(prograName, ARType.PROGRAM, 1);

    this.callStack.push(ar);
    this.visit(node.block);
    this.callStack.pop();
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

  private visitNoOp(_: NoOpNode): void {
    return;
  }

  private visitAssign(node: AssignNode): any {
    const varName = node.left.value;
    const value = this.visit(node.right);

    let idx = this.callStack.size() - 1;
    let ar: ActivationRecord;

    while (idx >= 0) {
      const arCandidate = this.callStack.get(idx);

      if (arCandidate?.exist(varName)) {
        ar = arCandidate;
        break;
      }

      idx--;
    }

    if (!ar) {
      throw `Variable "${varName}" not found.`;
    }

    ar.set(varName, value);
  }

  private visitVar(node: VarNode): any {
    const varName = node.value;

    let idx = this.callStack.size() - 1;
    let ar: ActivationRecord;

    while (idx >= 0) {
      const arCandidate = this.callStack.get(idx);

      if (arCandidate?.exist(varName)) {
        ar = arCandidate;
        break;
      }

      idx--;
    }

    const value = ar.get(varName);
    return value;
  }

  private visitBlock(node: BlockNode) {
    for (let decl of node.declarations) {
      this.visit(decl);
    }
    this.visit(node.compoundStatements);
  }

  private visitVarDecl(_: VarDeclNode) {
    this.callStack.peek().set(_.varNode.value, undefined);
  }

  private visitType(_: TypeNode) {
    return;
  }

  private visitProcedureDecl(_: ProcedureDeclNode) {
    return;
  }

  private visitProcedureCall(proc: ProcedureCall) {
    const procName = proc.name;
    const procSymbol = proc.symbol;

    const ar = new ActivationRecord(
      procName,
      ARType.PROCEDURE,
      procSymbol.scopeLevel + 1,
    );

    const formalParams = procSymbol.params;
    const args = proc.params;

    for (let i = 0; i < formalParams.length; i++) {
      const paramSymbol = formalParams[i];
      const argumentNode = args[i];
      ar.set(paramSymbol.varNode.value, this.visit(argumentNode));
    }

    this.callStack.push(ar);
    this.visit(proc.symbol.block);
    this.callStack.pop();
  }
}
