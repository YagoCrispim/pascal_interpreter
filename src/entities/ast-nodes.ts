import { AbstractAst } from './ast.abstract';
import { Token } from './token';

export class AssignNode {
  constructor(
    public readonly left: VarNode,
    public readonly operaion: Token,
    public readonly right: UnaryOpNode | VarNode | NumNode,
  ) { }
}

export class BinOpNode {
  constructor(
    public readonly left: VarNode,
    public readonly operaion: Token,
    public readonly right: UnaryOpNode | VarNode,
  ) { }
}

export class BlockNode {
  constructor(
    public readonly declarations: VarDeclNode[],
    public readonly compoundStatements: CompoundNode,
  ) { }
}

export class CompoundNode {
  public children: AssignNode[] = [];
  constructor() { }
}

export class NoOpNode {
  constructor() { }
}

export class NumNode {
  public readonly value: number;
  constructor(public readonly token: Token) {
    this.value = Number(token.value);
  }
}

export class ProgramNode {
  constructor(
    public readonly name: string,
    public readonly block: BlockNode
  ) { }
}

export class TypeNode {
  public readonly value: Token['value'];
  constructor(token: Token) {
    this.value = token.value;
  }
}

export class UnaryOpNode {
  public readonly operation: Token;
  constructor(
    public readonly token: Token,
    public readonly expression: BinOpNode | UnaryOpNode | VarNode | NumNode,
  ) {
    this.operation = token;
  }
}

export class VarDeclNode {
  constructor(
    public readonly varNode: VarNode,
    public readonly typeNode: TypeNode,
  ) { }
}

export class VarNode {
  public readonly value: Token['value'];
  constructor(public readonly token: Token) {
    this.value = token.value;
  }
}

// export class Symbol {
//   constructor(
//     public readonly name: string,
//     public readonly type: any | null
//   ) { }
// }

export class BuiltInSymbol {
  constructor(
    public readonly name: string,
    public readonly category: any
  ) { }
}

export class BuiltInTypeSymbol {
  constructor(public readonly name: string) { }
}

export class VarSymbol {
  constructor(
    public readonly name: string,
    public readonly type: BuiltInTypeSymbol | null, //? TODO: Add types
  ) { }
}

export class ProcedureDeclNode {
  constructor(
    public readonly name: string,
    public readonly params: Param[],
    public readonly block: BlockNode
  ) { }
}

/*
  Formal parameters:
    - Are parameters that show up in the declaration of a procedure.
  
  Arguments
    - Are different variables and expressions passed to a procedure in a particular procedure call.
*/
export class Param {
  constructor(
    public readonly varNode: VarNode,
    public readonly typeNode: TypeNode,
  ) { }
}

export class ProcedureSymbol {
  constructor(
    public readonly name: string,
    public readonly params?: Param[], // is this really optional?
  ) { }
}

