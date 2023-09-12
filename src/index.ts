import { Interpreter, Lexer, Parser, SemanticAnalyzer } from './modules';

global.SPI_DEBUG = true;
global.LOG = (...args: any[]) => global.SPI_DEBUG && console.log(...args);

let program = `
PROGRAM Main;
   VAR x, y: REAL;

   PROCEDURE Alpha(AlphaParam : INTEGER);
      VAR AlphaVar : INTEGER;
   BEGIN
   END;

   PROCEDURE Beta(BetaParam : INTEGER);
      VAR BetaVar : INTEGER;
   BEGIN
   END;

   PROCEDURE Lambda(LambdaParam : INTEGER);
      VAR LambdaVar : INTEGER;
   BEGIN
   END;

BEGIN { Main }

END.  { Main }`;

try {
  global.LOG('Simple Pascal Interpreter.');
  const lexer = new Lexer(program);
  const ast = new Parser(lexer).parse();
  new SemanticAnalyzer(ast).walk();
  const interpreter = new Interpreter(ast);
  interpreter.interpret();
  console.log(interpreter.getGlobal());
} catch (error) {
  console.log('[ERROR]', error);
}
