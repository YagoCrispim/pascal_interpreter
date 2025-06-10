import {
  Compiler,
  Interpreter,
  Lexer,
  Parser,
  SemanticAnalyzer,
} from './modules';

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
print(a);
print(b);
print(c);
END.  {Part11}
`;

try {
  const lexer = new Lexer(program);
  const ast = new Parser(lexer).parse();
  new SemanticAnalyzer(ast).walk();
  const compiler = new Compiler(ast);
  new Interpreter(compiler.chunk);
} catch (error) {
  console.log('[ERROR]', error);
}
