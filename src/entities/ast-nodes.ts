import { AbstractAst } from './ast.abstract';
import { Token } from './token';

export class AssignNode extends AbstractAst {
  public readonly nodeName = AssignNode.name;

  constructor(
    public readonly left: VarNode,
    public readonly operaion: Token,
    public readonly right: UnaryOpNode | VarNode | NumNode,
  ) {
    super();
  }
}

export class BinOpNode extends AbstractAst {
  public readonly nodeName = BinOpNode.name;

  constructor(
    public readonly left: VarNode,
    public readonly operaion: Token,
    public readonly right: UnaryOpNode | VarNode,
  ) {
    super();
  }
}

export class BlockNode extends AbstractAst {
  public readonly nodeName = BlockNode.name;

  constructor(
    public readonly declarations: VarDeclNode[],
    public readonly compoundStatements: CompoundNode,
  ) {
    super();
  }
}

export class CompoundNode extends AbstractAst {
  public readonly nodeName = CompoundNode.name;

  public children: AssignNode[] = [];

  constructor() {
    super();
  }
}

export class NoOpNode extends AbstractAst {
  public readonly nodeName = NoOpNode.name;

  constructor() {
    super();
  }
}

export class NumNode extends AbstractAst {
  public readonly nodeName = NumNode.name;

  public readonly value: number;

  constructor(public readonly token: Token) {
    super();
    this.value = Number(token.value);
  }
}

export class ProgramNode extends AbstractAst {
  public readonly nodeName = ProgramNode.name;

  constructor(public readonly name: string, public readonly block: BlockNode) {
    super();
  }
}

export class TypeNode extends AbstractAst {
  public readonly nodeName = TypeNode.name;

  public readonly token: Token;
  public readonly value: Token['value'];

  constructor(token: Token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

export class UnaryOpNode extends AbstractAst {
  public readonly nodeName = UnaryOpNode.name;

  public readonly token: Token;
  public readonly expression: BinOpNode | UnaryOpNode | VarNode | NumNode;
  public readonly operation: Token;

  constructor(
    token: Token,
    expression: BinOpNode | UnaryOpNode | VarNode | NumNode,
  ) {
    super();
    this.token = token;
    this.expression = expression;
    this.operation = token;
  }
}

export class VarDeclNode extends AbstractAst {
  public readonly nodeName = VarDeclNode.name;

  constructor(
    public readonly varNode: VarNode,
    public readonly typeNode: TypeNode,
  ) {
    super();
  }
}

export class VarNode extends AbstractAst {
  public readonly nodeName = VarNode.name;

  public readonly token: Token;
  public readonly value: Token['value'];

  constructor(token: Token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

export class Symbol extends AbstractAst {
  public nodeName = Symbol.name;

  constructor(
    public readonly name: string,
    public readonly type: any | undefined, // TODO: Add type
    public readonly category: string | undefined,
  ) {
    super();
  }
}

export class BuiltInSymbol extends Symbol {
  public readonly nodeName = BuiltInSymbol.name;

  private localName: string;

  // TODO: Add type
  constructor(name: string, category: any) {
    super(name, category, undefined);
    this.localName = name;
  }

  print() {
    return this.localName;
  }
}

export class VarSymbol extends Symbol {
  public readonly nodeName = VarSymbol.name;

  private localName: string;
  private localType: Symbol | undefined;

  constructor(name: string, type: Symbol | undefined, category: string) {
    super(name, type, category);
    this.localName = name;
    this.localType = type;
  }

  print() {
    return `${this.localName}::${this.localType}`;
  }
}

export class ProcedureDeclNode extends AbstractAst {
  public readonly nodeName = ProcedureDeclNode.name;

  constructor(
    private readonly name: string,
    private readonly block: BlockNode, // TODO: Find a better name
  ) {
    super();
  }
}
