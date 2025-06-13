import { Lexer, Parser, SemanticAnalyzer } from './modules';
import { AstInterpreter } from './modules/ast-interpreter';

const program = `
program Main;
    var x: integer;

    procedure Alpha(a : integer; b : integer);
        procedure Beta();
            procedure Omega();
            begin
                x := a * 10 + b * 2;
               { Writeln(x);}
            end;
        
        begin
            Omega();
        end;
        
    begin
        x := (a + b) * 2;
        Beta();
    end;

begin
    Alpha(3 + 5, 7);
    {Writeln('End!');}
end.
`;

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
