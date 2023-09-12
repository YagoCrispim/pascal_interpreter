import { BuiltInTypeSymbol, ProcedureSymbol, VarSymbol } from '../entities';

type SymTabValue = VarSymbol | BuiltInTypeSymbol;

/**
 * What is a symbol?
 *  - In a nutshell, a symbol is an identifier of some program entity like a variable,
 *    a suroutine, a built-in type, etc.
 */
export class ScopedSymbolTable {
  public readonly symbols: Map<string, SymTabValue> = new Map();

  constructor(
    public readonly scopeName: string,
    public readonly scopeLevel: number,
    // This is a pointer to the scope's enclosing scope
    public readonly enclosingScope?: any,
  ) {
    this.initBuiltins();
  }

  define(symbol: VarSymbol | ProcedureSymbol): void {
    // console.log('Inserting ', symbol);
    this.symbols.set(symbol.name, symbol);
  }

  lookup(name: string): SymTabValue {
    // console.log('Lookup ', name);
    return this.symbols.get(name) || null;
  }

  dump() {
    console.log(`Scope name: ${this.scopeName}`);
    console.log(`Scope level: ${this.scopeLevel}`);
    console.log('Scope contents:');
    for (let [_, symbol] of this.symbols) {
      console.log(symbol);
    }
  }

  private initBuiltins(): void {
    this.symbols.set('INTEGER', new BuiltInTypeSymbol('INTEGER') as any);
    this.symbols.set('REAL', new BuiltInTypeSymbol('REAL') as any);
  }
}
