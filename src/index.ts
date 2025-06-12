import {
  Compiler,
  Interpreter,
  Lexer,
  Parser,
  SemanticAnalyzer,
} from './modules';
import { AstInterpreter } from './modules/ast-interpreter';

const program = `
program Main;
   var x, y: real;

   procedure Alpha(a: integer);
      var y: integer;
   begin
      x := a + x + y;
   end;

begin
  Alpha(12);
end.
`;

// const program = `
// program Part11;
// var
//   number : integer;
//   a, b   : integer;
//   y      : real;

// begin {Part11}
//   number := 2;
//   a := number ;
//   y := 20 / 7 + 3.14;
//   b := 10 * a + 10 * number DIV 4;

//   print(a);
// end.  {Part11}
// `;

try {
  const lexer = new Lexer(program);
  const ast = new Parser(lexer).parse();
  new SemanticAnalyzer(ast).walk();
  new AstInterpreter(ast);
  // const compiler = new Compiler(ast);
  // new Interpreter(compiler.chunk);
} catch (error) {
  console.log('[ERROR]', error);
}
