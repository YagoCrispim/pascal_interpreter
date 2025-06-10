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

const OP = {
  // Do nothing (for now)
  RETURN: 'OP_RETURN',

  /**
   * Read const value from vm constants and increment IP
   * Push that value onto the stack
   */
  CONSTANT: 'OP_CONSTANT',

  /**
   * Peek number from the top of the stack and check if is a number.
   * If so, then pop the number from the top of the stack, negate it and push
   * negated value onto the stack
   */
  NEGATE: 'OP_NEGATE',

  /**
   * Check if two values on top of the stack are strings. If so, concatenate.
   * If it's number, pop the two numbers, sum and push the result
   */
  ADD: 'OP_ADD',

  /**
   * Same as OP_ADD, but with subtraction
   */
  SUBTRACT: 'OP_SUBTRACT',

  /**
   * Same as OP_ADD, but with multiplication
   */
  MULTIPLY: 'OP_MULTIPLY',

  /**
   * Same as OP_ADD, but with division
   */
  DIVIDE: 'OP_DIVIDE',

  /**
   * Push "nil" onto the stack
   */
  NIL: 'OP_NIL',

  /**
   * Push true onto the stack
   */
  TRUE: 'OP_TRUE',

  /**
   * Push true onto the stack
   */
  FALSE: 'OP_FALSE',

  /**
   * Negate the value on top of the stack
   */
  NOT: 'OP_NOT',

  /**
   * Pop two values from the top of the stack and push the result if they're
   * equal
   */
  EQUAL: 'OP_EQUAL',

  /**
   * Do nothing (for now)
   */
  GREATER: 'OP_GREATER',

  /**
   * Do nothing (for now)
   */
  LESS: 'OP_LESS',

  /**
   * Pop value from the top of the stack ant print it
   */
  PRINT: 'OP_PRINT',

  /**
   * Move the value from the the top of the stack to the vm globals,
   * then, pop the value from the top
   */
  DEFINE_GLOBAL: 'OP_DEFINE_GLOBAL',

  /**
   * Get the value from the vm globals and push it onto the stack
   */
  GET_GLOBAL: 'OP_GET_GLOBAL',

  /**
   * Set value onto the top of the stack
   */
  SET_GLOBAL: 'OP_SET_GLOBAL',

  /**
   * Read value from current scope and push onto the stack
   */
  GET_LOCAL: 'OP_GET_LOCAL',

  /**
   * Set value on current scop
   */
  SET_LOCAL: 'OP_SET_LOCAL',

  /**
   * Pop value from the top of the stack
   */
  POP: 'OP_POP',

  /**
   * Set a value to add to the vm.ip
   */
  JUMP: 'OP_JUMP',

  /**
   * Set a value to add to the vm.ip if condition is false
   */
  JUMP_IF_FALSE: 'OP_JUMP_IF_FALSE'
}

export class Compiler {
  public readonly chunk = {
    constants: [] as any[],
    opcodes: [] as Array<string | string[]>
  }

  constructor(private readonly ast: ProgramNode) {
    this.compile();
  }

  public emitBytes(b1: any, b2: any = null): void {
    if (b2 === null) {
      this.chunk.opcodes.push(b1);
    } else {
      this.chunk.opcodes.push([b1, b2]);
    }
  }

  public compile(): void {
    return this.visitProgram(this.ast);
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
  ): void {
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

    if ((node as any) instanceof ProcedureDeclNode) {
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

  private visitBinOp(node: BinOpNode): void {
    if (node.operaion.type === TokenTypes.PLUS) {
      this.emitBytes(OP.ADD);
    }

    if (node.operaion.type === TokenTypes.MINUS) {
      this.emitBytes(OP.SUBTRACT);
    }

    if (node.operaion.type === TokenTypes.MUL) {
      this.emitBytes(OP.MULTIPLY);
    }

    if (node.operaion.type === TokenTypes.INTEGER_DIV) {
      this.emitBytes(OP.DIVIDE);
    }

    if (node.operaion.type === TokenTypes.FLOAT_DIV) {
      this.emitBytes(OP.DIVIDE);
    }

    this.visit(node.left);
    this.visit(node.right);
  }

  private visitUnaryOp(node: UnaryOpNode): void {
    const opType = node.operation.type;

    if (opType === TokenTypes.MINUS) {
      this.emitBytes(OP.NEGATE);
    }

    this.visit(node.expression);
  }

  private visitNum(node: NumNode) {
    this.emitBytes(OP.CONSTANT);
    this.chunk.constants.push(node.value);
    this.emitBytes(this.chunk.constants.length);
  }

  private visitNoOp(_: NoOpNode): void {
    return;
  }

  private visitAssign(node: AssignNode): void {
    this.visit(node.right);

    const name = node.left.value;
    const varIndex = this.GLOBAL_SCOPE.findIndex(el => el.name === name);

    if (varIndex === -1) {
      throw 'Var not found in GLOBAL_SCOPE';
    }

    this.emitBytes(OP.SET_GLOBAL, varIndex);
  }

  private visitVar(node: VarNode): void {
    const varName = node.value;
    const varIndex = this.GLOBAL_SCOPE.findIndex(el => el.name === varName);

    this.emitBytes(OP.GET_GLOBAL, varIndex);
  }

  private visitBlock(node: BlockNode): void {
    for (let decl of node.declarations) {
      this.visit(decl);
    }
    this.visit(node.compoundStatements);
  }

  private visitVarDecl(decl: VarDeclNode): void {
    const token = decl.varNode.token
    this.emitBytes(OP.DEFINE_GLOBAL, this.GLOBAL_SCOPE.length);
    this.GLOBAL_SCOPE.push({ name: token.value, value: undefined });
  }

  private visitType(_: TypeNode): void {
    return;
  }

  private visitProcedureDecl(_: ProcedureDeclNode): void {
    return;
  }
}
