import { Compiler, Lexer, Parser, SemanticAnalyzer } from './modules';

global.SPI_DEBUG = true;
global.LOG = (...args: any[]) => global.SPI_DEBUG && console.log(...args);

const program = `
PROGRAM Part11;
VAR
number : INTEGER;
a, b   : INTEGER;
y      : REAL;

BEGIN {Part11}
number := 2;
a := number ;
y := 20 / 7 + 3.14;
b := 10 * a + 10 * number DIV 4;
END.  {Part11}
`;

try {
  global.LOG('Simple Pascal Interpreter.');
  const lexer = new Lexer(program);
  const ast = new Parser(lexer).parse();
  new SemanticAnalyzer(ast).walk();
  const bytecode = new Compiler(ast);
  // const interpreter = new Interpreter(ast);
  // interpreter.interpret();
  // console.log(interpreter.getGlobal());
} catch (error) {
  console.log('[ERROR]', error);
}
