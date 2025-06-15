import { ActivationRecord } from "./activation-record";

export class CallStack {
  private records: ActivationRecord[] = [];

  push(ar: any): void {
    this.records.push(ar);
  }

  pop(): ActivationRecord | undefined {
    return this.records.pop();
  }

  peek(): ActivationRecord | undefined {
    return this.records[this.records.length - 1];
  }

  size(): number {
    return this.records.length;
  }

  get(idx: number): ActivationRecord {
    return this.records[idx];
  }

  toString(): string {
    const s = this.records.slice().reverse().map(ar => JSON.stringify(ar)).join('\n');
    return `CALL STACK\n${s}\n`;
  }

  toStringRepresentation(): string {
    return this.toString();
  }
}
