import { Lexer } from '../../src/modules';

export class FakeLexer {
  public methods = {
    getNextToken: jest.fn(),
  };

  constructor(code: string) {}

  getNextToken() {
    this.methods.getNextToken();
  }
}

export const getTokens = (lexer: Lexer, iterationLimit: number = 1000) => {
  const tokens = [];
  const controller = {
    iterations: 0,
    iterationLimit,
  };

  while (true && controller.iterations < controller.iterationLimit) {
    const token = lexer.getNextToken();
    tokens.push(token);
    if (
      token.type === 'EOF' ||
      controller.iterationLimit === controller.iterations
    ) {
      break;
    }
  }
  return tokens;
};
