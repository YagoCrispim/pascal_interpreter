import {
  AssignNode,
  BinOpNode,
  BlockNode,
  CompoundNode,
  NoOpNode,
  NumNode,
  ProcedureDeclNode,
  ProgramNode,
  Token,
  TypeNode,
  UnaryOpNode,
  VarDeclNode,
  VarNode,
} from '../entities';
import { reservedKeywords, TokenTypes } from '../types';
import { Lexer } from './lexer';

export class Parser {
  private tokens: Token[] | undefined;
  private currentToken: Token;
  private carretPosition: number = -1;

  constructor(private readonly lexer: Lexer) {
    this.currentToken = this.advance();
  }

  parse(): ProgramNode {
    const program = this.program();
    if (!this.isTheSameType(this.currentToken, TokenTypes.EOF)) {
      this.error();
    }
    return program;
  }

  private advance(): Token | undefined {
    this.carretPosition += 1;
    return this.lexer.getNextToken();
  }

  /**
   * program : PROGRAM variable SEMI block DOT
   */
  private program(): ProgramNode {
    this.eat(TokenTypes.PROGRAM);
    const varNode = this.variable();
    const programName = varNode.value as string;
    this.eat(TokenTypes.SEMI);
    const blockNode = this.block();
    const programNode = new ProgramNode(programName, blockNode);
    this.eat(TokenTypes.DOT);
    return programNode;
  }

  /**
   * block : declarations compound_statement
   */
  private block(): BlockNode {
    const declarations = this.declarations();
    const compoundStatement = this.compoundStatement();
    return new BlockNode(declarations, compoundStatement);
  }

  /**
   * declarations : VAR (variable_declaration SEMI)+
      empty
   */
  private declarations(): VarDeclNode[] {
    const declarations = [];

    if (this.isTheSameType(this.currentToken, TokenTypes.VAR)) {
      this.eat(TokenTypes.VAR);

      // TODO: Study this piece
      while (this.isTheSameType(this.currentToken, TokenTypes.ID)) {
        const variableDeclaration = this.variableDeclaration();
        declarations.push(...variableDeclaration);
        this.eat(TokenTypes.SEMI);
      }
    }

    while (this.currentToken.type === reservedKeywords.PROCEDURE) {
      this.eat(reservedKeywords.PROCEDURE);
      const procedureName = this.currentToken.value;
      this.eat(TokenTypes.ID);
      this.eat(TokenTypes.SEMI);
      const procedureCode = this.block();
      const procedureDeclaration = new ProcedureDeclNode(
        procedureName as string,
        procedureCode,
      );
      declarations.push(procedureDeclaration);
      this.eat(TokenTypes.SEMI);
    }

    return declarations;
  }

  /**
   * variable_declaration : ID (COMMA ID)* COLON type_spec
   */
  private variableDeclaration(): VarDeclNode[] {
    const variablesNodes = [new VarNode(this.currentToken)];
    this.eat(TokenTypes.ID);

    while (this.isTheSameType(this.currentToken, TokenTypes.COMMA)) {
      this.eat(TokenTypes.COMMA);
      variablesNodes.push(new VarNode(this.currentToken));
      this.eat(TokenTypes.ID);
    }

    this.eat(TokenTypes.COLON);

    const typeNode = this.typeSpec();

    const result = variablesNodes.map(
      (varNode) => new VarDeclNode(varNode, typeNode),
    ) as VarDeclNode[];
    return result;
  }

  /**
   * type_spec : INTEGER | REAL
   */
  private typeSpec(): TypeNode {
    const token = this.currentToken;

    if (this.isTheSameType(this.currentToken, TokenTypes.INTEGER)) {
      this.eat(TokenTypes.INTEGER);
    }

    if (this.isTheSameType(this.currentToken, TokenTypes.REAL)) {
      this.eat(TokenTypes.REAL);
    }

    return new TypeNode(token);
  }

  /**
   * compound_statement: BEGIN statement_list END
   */
  private compoundStatement(): CompoundNode {
    this.eat(TokenTypes.BEGIN);
    const statementList = this.statementList();
    this.eat(TokenTypes.END);

    const root = new CompoundNode();

    for (const node of statementList) {
      root.children.push(node as any);
    }

    return root;
  }

  /**
   * statement_list : statement
   *  | statement SEMI statement_list
   */
  private statementList(): (CompoundNode | AssignNode | NoOpNode)[] {
    const statementList = [this.statement()];

    while (this.isTheSameType(this.currentToken, TokenTypes.SEMI)) {
      this.eat(TokenTypes.SEMI);
      statementList.push(this.statement());
    }

    return statementList;
  }

  /**
   * statement: compound_statement
   *  | assignment_statement
   *  | empty
   */
  private statement(): CompoundNode | AssignNode | NoOpNode {
    let result: CompoundNode | AssignNode | NoOpNode = this.empty();

    if (this.isTheSameType(this.currentToken, TokenTypes.BEGIN)) {
      result = this.compoundStatement();
    }

    if (this.isTheSameType(this.currentToken, TokenTypes.ID)) {
      result = this.assignmentStatement();
    }

    return result;
  }

  /**
   * assignment_statement : variable ASSIGN expr
   */
  private assignmentStatement(): AssignNode {
    const left = this.variable();
    const operationToken = this.currentToken;
    this.eat(TokenTypes.ASSIGN);
    const right = this.expression();
    return new AssignNode(left, operationToken, right as any);
  }

  /**
   * variable : ID
   */
  private variable(): VarNode {
    const variable: VarNode = new VarNode(this.currentToken);
    this.eat(TokenTypes.ID);
    return variable;
  }

  /**
   * expr : term ((PLUS | MINUS) term)*
   */
  private expression(): NumNode | BinOpNode | UnaryOpNode | VarNode {
    let node = this.term();

    while (
      [TokenTypes.PLUS, TokenTypes.MINUS].includes(this.currentToken.type)
    ) {
      const opearionToken = this.currentToken;

      if (this.isTheSameType(this.currentToken, TokenTypes.PLUS)) {
        this.eat(TokenTypes.PLUS);
      }

      if (this.isTheSameType(this.currentToken, TokenTypes.MINUS)) {
        this.eat(TokenTypes.MINUS);
      }

      node = new BinOpNode(node as VarNode, opearionToken, this.term() as any);
    }

    return node;
  }

  /*
   * term : factor ((MUL | INTEGER_DIV | FLOAT_DIV) factor)*
   */
  private term(): NumNode | BinOpNode | UnaryOpNode | VarNode {
    let node = this.factor();

    while (
      [TokenTypes.MUL, TokenTypes.INTEGER_DIV, TokenTypes.FLOAT_DIV].includes(
        this.currentToken.type,
      )
    ) {
      const token: Token = this.currentToken;

      if (this.isTheSameType(this.currentToken, TokenTypes.MUL)) {
        this.eat(TokenTypes.MUL);
      }

      if (this.isTheSameType(this.currentToken, TokenTypes.INTEGER_DIV)) {
        this.eat(TokenTypes.INTEGER_DIV);
      }

      if (this.isTheSameType(this.currentToken, TokenTypes.FLOAT_DIV)) {
        this.eat(TokenTypes.FLOAT_DIV);
      }

      node = new BinOpNode(node as VarNode, token, this.factor() as any);
    }

    return node;
  }

  /*
   * factor :
   *   | PLUS factor
   *   | MINUS factor
   *   | INTEGER_CONST
   *   | REAL_CONST
   *   | LPAREN expr RPAREN
   *   | variable
   */
  private factor(): BinOpNode | UnaryOpNode | VarNode | NumNode {
    const token: Token = this.currentToken;

    if (this.isTheSameType(token, TokenTypes.PLUS)) {
      this.eat(TokenTypes.PLUS);
      return new UnaryOpNode(token, this.factor());
    }

    if (this.isTheSameType(token, TokenTypes.MINUS)) {
      this.eat(TokenTypes.MINUS);
      return new UnaryOpNode(token, this.factor());
    }

    if (this.isTheSameType(token, TokenTypes.INTEGER_CONST)) {
      this.eat(TokenTypes.INTEGER_CONST);
      return new NumNode(token);
    }

    if (this.isTheSameType(token, TokenTypes.REAL_CONST)) {
      this.eat(TokenTypes.REAL_CONST);
      return new NumNode(token);
    }

    if (this.isTheSameType(token, TokenTypes.LPAREN)) {
      this.eat(TokenTypes.LPAREN);
      const result = this.expression();
      this.eat(TokenTypes.RPAREN);
      return result;
    }

    return this.variable();
  }

  private empty() {
    return new NoOpNode();
  }

  private eat(tokenType: Token['type']) {
    if (this.isTheSameType(this.currentToken, tokenType)) {
      this.currentToken = this.advance();
    } else {
      this.error(`
      Expected token type "${tokenType}", but got ${this.currentToken.type}
      `);
    }
  }

  private isTheSameType(token: Token, type: Token['type']): boolean {
    return token.type === type;
  }

  private error(message?: string) {
    const stringify = (el: any) => JSON.stringify(el);
    const currentToken = this.currentToken;
    const tokens = this.tokens.slice(
      this.carretPosition - 2,
      this.carretPosition + 3,
    );
    console.error(`
      [Error]: Syntax error \n
      [Details]: Current token: ${stringify(currentToken)} \n
      [Details]: Details: ${stringify(tokens)} \n
      [Details]: Message: ${stringify(message)} \n
    `);
    process.exit(0);
  }
}
