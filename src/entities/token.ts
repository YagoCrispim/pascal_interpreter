import { TokenTypes } from '../types/token-types.enum';

/**
 * Represents a token in the input code.
 */
export class Token {
  constructor(
    public readonly type: TokenTypes,
    public readonly value: string | undefined,
  ) {
    this.type;
  }
}
