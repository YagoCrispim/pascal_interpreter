import {
  AssignNode,
  BinOpNode,
  BlockNode,
  CompoundNode,
  NoOpNode,
  ProcedureDeclNode,
  ProcedureSymbol,
  ProgramNode,
  VarDeclNode,
  VarNode,
  VarSymbol,
} from '../entities';
import { ScopedSymbolTable } from './symbol-table';

/**
 * What is done in a semantic check?
 * - Check if the variable was declared before it was used.
 * - Check if the variable was declared with the correct type.
 * - Check if the variable was declared only once.
 *
 * What is static semantic checks?
 *  - SSC are the checks that we can make before interpreting (evaluating) the program,
 *    that is, before calling the interpret method on an instance of the Interpreter class.
 */
export class SemanticAnalyzer {
  constructor(
    private readonly ast: ProgramNode,
    private currentScope?: ScopedSymbolTable,
  ) {}

  walk() {
    this.visitProgram(this.ast);
  }

  private visit(
    node:
      | CompoundNode
      | NoOpNode
      | BlockNode
      | ProgramNode
      | VarDeclNode
      | VarNode
      | AssignNode
      | ProcedureDeclNode
      | BinOpNode,
  ) {
    if (node instanceof BlockNode) {
      return this.visitBlock(node as BlockNode);
    }

    if (node instanceof ProgramNode) {
      return this.visitProgram(node as ProgramNode);
    }

    if (node instanceof NoOpNode) {
      return this.visitNoOp(node as NoOpNode);
    }

    if (node instanceof VarDeclNode) {
      return this.visitVarDecl(node as VarDeclNode);
    }

    if (node instanceof CompoundNode) {
      return this.visitCompound(node as CompoundNode);
    }

    if (node instanceof VarNode) {
      return this.visitVar(node as VarNode);
    }

    if (node instanceof AssignNode) {
      return this.visitAssign(node as AssignNode);
    }

    if (node instanceof BinOpNode) {
      return this.visitBinOp(node as BinOpNode);
    }

    if (node instanceof ProcedureDeclNode) {
      return this.visitProcedureDecl(node as ProcedureDeclNode);
    }
  }

  private visitBlock(node: BlockNode) {
    for (const declaration of node.declarations) {
      this.visit(declaration);
    }
    this.visit(node.compoundStatements);
  }

  private visitProgram(node: ProgramNode) {
    console.log('Entering the global scope');
    const globalScope = new ScopedSymbolTable('global', 1);
    this.currentScope = globalScope;

    // visit subtree
    this.visit(node.block);

    console.log(globalScope);
    this.currentScope = this.currentScope.enclosingScope;
    console.log('Leaving GS');
  }

  private visitCompound(node: CompoundNode) {
    for (let child of node.children) {
      this.visit(child);
    }
  }

  private visitNoOp(_: NoOpNode) {
    return;
  }

  private visitVar(node: VarNode) {
    const varName = node.value;
    const varSymbol = this.currentScope.lookup(varName as string);
    if (!varSymbol) {
      throw `[Semantic error]: Var ${varName} not found.`;
    }
  }

  private visitAssign(node: AssignNode) {
    // left-hand
    this.visit(node.left);

    // right-hand
    this.visit(node.right);
  }

  private visitBinOp(binOp: BinOpNode) {
    this.visit(binOp.left);
    this.visit(binOp.right);
  }

  private visitVarDecl(varDecl: VarDeclNode) {
    const typeName = varDecl.typeNode.value;
    const typeSymbol = this.currentScope.lookup(typeName as string);

    const varName = varDecl.varNode.value;
    const varSymbol = new VarSymbol(varName as string, typeSymbol);

    this.currentScope.define(varSymbol);
  }

  /**
   Important.
    The enclosing scope should be reset to prevent problems like
    two procedures in tha same scope. Each procedure should point
    to it own internal scope level.
   */
  private visitProcedureDecl(procedure: ProcedureDeclNode) {
    const procSymbol = new ProcedureSymbol(procedure.name);
    this.currentScope.define(procSymbol);

    console.log('Enter scope ', procedure.name);
    // Scope for parameters and local variables
    const procedureScope = new ScopedSymbolTable(
      procedure.name,
      this.currentScope.scopeLevel + 1,
      this.currentScope,
    );
    this.currentScope = procedureScope;

    // Insert parameters into the procedure scope
    procedure.params.forEach((param) => {
      const paramType = this.currentScope.lookup(param.typeNode.value);
      const paramName = param.varNode.value;
      const varSymbol = new VarSymbol(paramName, paramType);
      this.currentScope.define(varSymbol);
      procedure.params.push(varSymbol as any); // why var symbol and not "Param" node?
    });

    this.visit(procedure.block);
    
    console.log(procedureScope.symbols);
    this.currentScope = this.currentScope.enclosingScope;
    console.log('Leaving scope ', procedure.name);
  }
}
