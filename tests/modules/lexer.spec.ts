import { Lexer } from '../../src/modules';
import { TokenTypes } from '../../src/types';
import { getTokens } from '../test-helpers/lexer';

const sampleProgram = `
PROGRAM Part12;
VAR
   a : INTEGER;

PROCEDURE P1;
VAR
   a : REAL;
   k : INTEGER;

   PROCEDURE P2;
   VAR
      a, z : INTEGER;
   BEGIN {P2}
      z := 777;
   END;  {P2}

BEGIN {P1}

END;  {P1}

BEGIN {Part12}
   a := 10;
END.  {Part12}
`;

describe('Lexer', () => {
  it('should return EOF', () => {
    const tokens = getTokens(new Lexer(sampleProgram));
    const lastToken = tokens[tokens.length - 1];
    expect(lastToken.type).toBe(TokenTypes.EOF);
  });

  it('should return the correct tokens', () => {
    const tokens = getTokens(new Lexer(sampleProgram));
    const expectedTokens = [
      'PROGRAM',
      'ID',
      'SEMI',
      'VAR',
      'ID',
      'COLON',
      'INTEGER',
      'SEMI',
      'PROCEDURE',
      'ID',
      'SEMI',
      'VAR',
      'ID',
      'COLON',
      'REAL',
      'SEMI',
      'ID',
      'COLON',
      'INTEGER',
      'SEMI',
      'PROCEDURE',
      'ID',
      'SEMI',
      'VAR',
      'ID',
      'COMMA',
      'ID',
      'COLON',
      'INTEGER',
      'SEMI',
      'BEGIN',
      'ID',
      'ASSIGN',
      'INTEGER_CONST',
      'SEMI',
      'END',
      'SEMI',
      'BEGIN',
      'END',
      'SEMI',
      'BEGIN',
      'ID',
      'ASSIGN',
      'INTEGER_CONST',
      'SEMI',
      'END',
      'DOT',
      'EOF',
    ];

    tokens.forEach((tk, idx) => {
      expect(tk.type).toEqual(expectedTokens[idx]);
    });
  });

  it('should return an error if an invalid token is found', () => {
    // should be a := 10;
    const sampleProgram = `
    PROGRAM Part12;
    VARS
      a : INTEGER;

    BEGIN {Part12}
      a = 10;
    END.  {Part12}
    `;
    let result: any;
    try {
      getTokens(new Lexer(sampleProgram));
    } catch (error) {
      result = error;
    }
    expect(result).toContain('a = 10;');
  });
});
