import { Token } from '../entities';
import { Keywords, TokenTypes, alphanumeric, letters, numbers } from '../types';

/**
 * The lexer is responsible for reading the input code and identifying the tokens in it.
 * It's also responsible for raising an error if the current character is not recognized.
 * @see https://ruslanspivak.com/lsbasi-part3/
 */
export class Lexer {
  private code: string = '';
  private carretPosition: number = 0;
  private currentCharacter: string | undefined;

  constructor(code: string) {
    this.code = code.trim();
    this.currentCharacter = this.code[this.carretPosition];
  }

  /**
   * Returns the next token in the input code.
   * Throws an error if the current character is not recognized.
   */
  getNextToken(): Token {
    while (this.currentCharacter) {
      if (this.currentCharacter === ' ') {
        this.skipWhitespace();
        continue;
      }

      if (this.currentCharacter === '\n') {
        this.skipNewLine();
        continue;
      }

      if (this.currentCharacter === '{') {
        this.advance();
        this.skipComment();
        continue;
      }

      if (letters.includes(this.currentCharacter)) {
        return this.id();
      }

      if (numbers.includes(this.currentCharacter)) {
        return this.createNumber();
      }

      if (this.currentCharacter === ':' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token(TokenTypes.ASSIGN, ':=');
      }

      if (this.currentCharacter === ';') {
        this.advance();
        return new Token(TokenTypes.SEMI, ';');
      }

      if (this.currentCharacter === '+') {
        this.advance();
        return new Token(TokenTypes.PLUS, '+');
      }

      if (this.currentCharacter === '-') {
        this.advance();
        return new Token(TokenTypes.MINUS, '-');
      }

      if (this.currentCharacter === '*') {
        this.advance();
        return new Token(TokenTypes.MUL, '*');
      }

      if (this.currentCharacter === '(') {
        this.advance();
        return new Token(TokenTypes.LPAREN, '(');
      }

      if (this.currentCharacter === ')') {
        this.advance();
        return new Token(TokenTypes.RPAREN, ')');
      }

      if (this.currentCharacter === '.') {
        this.advance();
        return new Token(TokenTypes.DOT, '.');
      }

      if (this.currentCharacter === ':') {
        this.advance();
        return new Token(TokenTypes.COLON, ':');
      }

      if (this.currentCharacter === ',') {
        this.advance();
        return new Token(TokenTypes.COMMA, ',');
      }

      if (this.currentCharacter === '/') {
        this.advance();
        return new Token(TokenTypes.FLOAT_DIV, '/');
      }

      this.raiseError(this.getSnippet());
    }

    return new Token(TokenTypes.EOF, TokenTypes.EOF);
  }

  /**
   * Creates the token that contains the numeric value, which can be integer or real.
   */
  private createNumber(): Token {
    let number = '';
    let token = { token: '' as any };

    const getNumberSequence = (
      onExitCb?: (tokenRef: Record<string, Token>) => void,
    ) => {
      while (this.currentCharacter && numbers.includes(this.currentCharacter)) {
        number += this.currentCharacter;
        this.advance();
      }
      onExitCb && onExitCb(token);
    };

    getNumberSequence(() => {
      if (this.currentCharacter !== '.') {
        token.token = new Token(TokenTypes.INTEGER_CONST, number);
        return;
      }

      getNumberSequence((tokenRef) => {
        number += this.currentCharacter;
        this.advance();

        getNumberSequence();
        tokenRef.token = new Token(TokenTypes.REAL_CONST, number);
      });
    });

    return token.token;
  }

  /**
   * Moves the position of the reading pointer forward and assigns the current character in "currentCharacter".
   * in "currentCharacter".
   */
  private advance() {
    this.carretPosition += 1;

    if (this.carretPosition > this.code.length - 1) {
      this.currentCharacter = undefined;
    } else {
      this.currentCharacter = this.code[this.carretPosition];
    }
  }

  /**
   * A sort of buffer that looks for the next character without advancing the global pointer.
   * The purpose is to be able to assemble a set of characters to form a specific token.
   * Ex: When it encounters ':' it will check if the next character is '=' to form the token ':='.
   */
  private peek(): string | undefined {
    const peekPosition = this.carretPosition + 1;
    if (peekPosition > this.code.length - 1) {
      return undefined;
    }
    return this.code[peekPosition];
  }

  /**
   * Handles validation of whether the character, or sequence of characters, is a
   * reserved word or a new variable.

   * If it is a reserved word it returns the corresponding token.
   * If it is a new variable it returns the token of type ID.
   */
  private id(): Token {
    let result = '';

    while (
      !!this.currentCharacter &&
      alphanumeric.includes(this.currentCharacter)
    ) {
      result += this.currentCharacter;
      this.advance();
    }
    const type = Keywords[result] || TokenTypes.ID;
    return new Token(type, result);
  }

  /**
   * It will ignore comments for the code.
   * In Pascal comments are all code between braces.
   * Ex: {comment in pascal}
   */
  private skipComment() {
    while (this.currentCharacter !== '}') {
      this.advance();
    }
    this.advance(); // The closing curly brace
  }

  /**
   * Will ignore whitespace by moving the reading pointer forward.
   */
  private skipWhitespace() {
    while (!this.currentCharacter || this.currentCharacter === ' ') {
      this.advance();
    }
  }

  /**
   * Will ignore whitespace by moving the reading pointer forward.
   */
  private skipNewLine() {
    while (this.currentCharacter === '\n') {
      this.advance();
    }
  }

  /**
   * Returns an error if an invalid character is detected.
   */
  private raiseError(message?: string) {
    throw message || 'Invalid character detected';
  }

  /**
   * Returns a code snippet to be displayed in the error.
   */
  private getSnippet(
    initialPos = this.carretPosition - 10,
    finalPos = this.carretPosition + 10,
  ) {
    return this.code.substring(initialPos, finalPos);
  }
}
