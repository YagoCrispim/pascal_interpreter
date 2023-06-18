import { Interpreter, Lexer, Parser } from './modules';
import { SymbolTableBuilder } from './modules/symbol-table';

// VALID
// const program = `
// PROGRAM Part11;
// VAR
// number : INTEGER;
// a, b   : INTEGER;
// y      : REAL;
// 
// BEGIN {Part11}
// number := 2;
// a := number ;
// b := 10 * a + 10 * number DIV 4;
// y := 20 / 7 + 3.14
// END.  {Part11}
// `;

// INVALID
// const program = `
//   PROGRAM Part10AST;
//   VAR
//       a: INTEGER;
//   BEGIN
//       c := 2 + b;
//   END.
// `;

const program = `
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
`

try {
  const lexer = new Lexer(program);
  const ast = new Parser(lexer).parse();
  new SymbolTableBuilder(ast).walk();
  const interpreter = new Interpreter(ast);
  interpreter.interpret();
  console.log(interpreter.getGlobal());
} catch (error) {
  console.log('[ERROR]', error);
}
