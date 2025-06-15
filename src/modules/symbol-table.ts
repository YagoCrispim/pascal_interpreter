import { BuiltInTypeSymbol, ProcedureSymbol, VarSymbol } from '../entities';

type SymTabValue = ProcedureSymbol | VarSymbol | BuiltInTypeSymbol;

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
    public readonly enclosingScope?: ScopedSymbolTable,
  ) {
    this.initBuiltins();
  }

  insert(symbol: VarSymbol | ProcedureSymbol): void {
    if (this.symbols.get(symbol.name)) {
      throw "Error: Duplicate identifier '%s' found: " + symbol.name;
    }
    this.symbols.set(symbol.name, symbol);
  }

  lookup(name: string): SymTabValue | null {
    const res = this.symbols.get(name) || null;

    if (!res && this.enclosingScope) {
      return this.enclosingScope.lookup(name);
    }

    return res;
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
