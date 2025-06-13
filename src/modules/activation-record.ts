export enum ARType {
  PROGRAM = 'PROGRAM',
  PROCEDURE = 'PROCEDURE',
  GLOBAL = 'GLOBAL',
}

export class ActivationRecord {
  private readonly items: { [key: string]: any } = {};

  constructor(
    private readonly name: string,
    private readonly type: ARType,
    private readonly nestingLevel: number,
  ) {}

  set(key: string, value: any): void {
    this.items[key] = value;
  }

  get(key: string): any {
    return this.items[key];
  }

  exist(key: string): any {
    return key in this.items;
  }

  getMember(key: string): any {
    return this.items[key];
  }

  toString(): string {
    const lines: string[] = [`${this.nestingLevel}: ${this.type} ${this.name}`];
    for (const [name, val] of Object.entries(this.items)) {
      lines.push(`   ${name.padEnd(20)}: ${val}`);
    }

    return lines.join('\n');
  }

  toStringRepresentation(): string {
    return this.toString();
  }
}
