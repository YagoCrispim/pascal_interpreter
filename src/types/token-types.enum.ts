/**
 * Supported token types in the language.
 */
export enum TokenTypes {
  INTEGER = 'integer',
  MUL = 'mul',
  EOF = 'eof',
  PLUS = 'plus',
  MINUS = 'min',
  RPAREN = 'rparen',
  LPAREN = 'lparen',
  BEGIN = 'begin',
  END = 'end',
  DOT = 'dot',
  ASSIGN = 'assign',
  SEMI = 'semi',
  ID = 'id',
  PROGRAM = 'program',
  VAR = 'var',
  COLON = 'colon',
  COMMA = 'comma',
  REAL = 'real',
  INTEGER_CONST = 'integer_const',
  REAL_CONST = 'real_const',
  INTEGER_DIV = 'integer_div',
  FLOAT_DIV = 'float_div',
}
