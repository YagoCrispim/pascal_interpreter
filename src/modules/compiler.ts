import {
  AssignNode,
  BinOpNode,
  BlockNode,
  CompoundNode,
  NoOpNode,
  NumNode,
  ProgramNode,
  TypeNode,
  UnaryOpNode,
  VarDeclNode,
  VarNode,
} from '../entities/ast-nodes';
import { TokenTypes } from '../types';
import { OP } from './op';

export class Compiler {
  public readonly chunk = {
    constants: [] as any[],
    opcodes: [] as Array<string | string[]>,
    globals: [] as Array<{ name: string; value: any }>,
  };

  constructor(private readonly ast: ProgramNode) {
    this.compile();
  }

  public emitBytes(b1: any, b2: any = null): void {
    if (b2 !== null) {
      this.chunk.opcodes.push([b1, b2]);
    } else {
      this.chunk.opcodes.push(b1);
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
      | TypeNode,
  ): void {
    if (node instanceof BinOpNode) {
      this.visitBinOp(node as unknown as BinOpNode);
    } else if (node instanceof BlockNode) {
      this.visitBlock(node as unknown as BlockNode);
    } else if (node instanceof NumNode) {
      this.visitNum(node as unknown as NumNode);
    } else if (node instanceof UnaryOpNode) {
      this.visitUnaryOp(node as unknown as UnaryOpNode);
    } else if (node instanceof CompoundNode) {
      this.visitCompound(node as unknown as CompoundNode);
    } else if (node instanceof NoOpNode) {
      this.visitNoOp(node as unknown as NoOpNode);
    } else if (node instanceof AssignNode) {
      this.visitAssign(node as unknown as AssignNode);
    } else if (node instanceof VarNode) {
      this.visitVar(node as unknown as VarNode);
    } else if (node instanceof ProgramNode) {
      this.visitProgram(node as unknown as ProgramNode);
    } else if (node instanceof VarDeclNode) {
      this.visitVarDecl(node as unknown as VarDeclNode);
    } else {
      throw `No $visit${node} method.`;
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

  private visitBinOp(node: BinOpNode): void {
    this.visit(node.left);
    this.visit(node.right);

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
  }

  private visitUnaryOp(node: UnaryOpNode): void {
    const opType = node.operation.type;

    if (opType === TokenTypes.MINUS) {
      this.emitBytes(OP.NEGATE);
    }

    this.visit(node.expression);
  }

  private visitNum(node: NumNode) {
    const index = this.chunk.constants.length;
    this.chunk.constants.push(node.value);
    this.emitBytes(OP.CONSTANT, index);
  }

  private visitNoOp(_: NoOpNode): void {
    this.emitBytes(OP.NIL);
  }

  private visitAssign(node: AssignNode): void {
    this.visit(node.right);

    const name = node.left.value;
    const varIndex = this.chunk.globals.findIndex((el) => el.name === name);

    if (varIndex === -1) {
      throw 'Var not found in GLOBAL_SCOPE';
    }

    this.emitBytes(OP.SET_GLOBAL, varIndex);
  }

  private visitVar(node: VarNode): void {
    const varName = node.value;
    const varIndex = this.chunk.globals.findIndex((el) => el.name === varName);
    this.emitBytes(OP.GET_GLOBAL, varIndex);
  }

  private visitBlock(node: BlockNode): void {
    for (let decl of node.declarations) {
      this.visit(decl);
    }
    this.visit(node.compoundStatements);
  }

  private visitVarDecl(decl: VarDeclNode): void {
    const token = decl.varNode.token;
    this.emitBytes(OP.SET_GLOBAL, this.chunk.globals.length);
    this.chunk.globals.push({ name: token.value, value: undefined });
  }
}
