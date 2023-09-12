import { ProgramNode } from '../../src/entities';
import { Lexer, Parser } from '../../src/modules';
import { FakeLexer, codeAst, testCode } from '../test-helpers';

describe('Parser', () => {
  it('empty', () => {
    expect(1).toBe(1);
  });

  it('should call "getNextToken" and increment +1 in carretPosition', () => {
    const fakeLexer = new FakeLexer(testCode) as any;
    new Parser(fakeLexer as unknown as Lexer);
    expect(fakeLexer.methods.getNextToken).toHaveBeenCalledTimes(1);
  });

  describe('parse', () => {
    it('should return a ProgramNode instance', () => {
      const lexer = new Lexer(testCode);
      const result = new Parser(lexer).parse();
      expect(result).toBeInstanceOf(ProgramNode);
    });
  });

  describe('AST', () => {
    it('should return a AST', () => {
      const lexer = new Lexer(testCode);
      const result = new Parser(lexer).parse();
      expect(result).toMatchObject(codeAst);
    });
  });
});
