import { OP } from './op';

interface IChunk {
  constants: any[];
  opcodes: (string | string[])[];
  scope: {
    name: string;
    value: any;
  }[];
}

export class Interpreter {
  ip = 0;
  instruction = 1 as any;
  stack = [] as any[];

  constructor(private readonly chunk: IChunk) {
    this.run();
  }

  private run() {
    const stack = this.stack;
    const scope = this.chunk.scope;

    while (this.instruction) {
      this.read();

      const instructionName = Array.isArray(this.instruction)
        ? this.instruction[0]
        : this.instruction;

      if (instructionName === OP.NIL) {
      } else if (instructionName === OP.DEFINE_GLOBAL) {
        stack.push(scope[this.instruction[1]].value);
      } else if (instructionName === OP.GET_GLOBAL) {
        stack.push(scope[this.instruction[1]].value);
      } else if (instructionName === OP.SET_GLOBAL) {
        const index = this.instruction[1];
        scope[index].value = stack[stack.length - 1];
      } else if (instructionName === OP.ADD) {
        const v2 = stack.pop();
        const v1 = stack.pop();
        stack.push(v1 + v2);
      } else if (instructionName === OP.DIVIDE) {
        const v2 = stack.pop();
        const v1 = stack.pop();
        stack.push(v1 / v2);
      } else if (instructionName === OP.MULTIPLY) {
        const v2 = stack.pop();
        const v1 = stack.pop();
        stack.push(v1 * v2);
      } else if (instructionName === OP.SUBTRACT) {
        const v2 = stack.pop();
        const v1 = stack.pop();
        stack.push(v1 - v2);
      } else if (instructionName === OP.CONSTANT) {
        const index = this.instruction[1];
        stack.push(this.chunk.constants[index]);
      } else if (instructionName === OP.POP) {
        stack.pop();
      }
    }

    console.log('END.');
  }

  private read() {
    this.ip += 1;
    this.instruction = this.chunk.opcodes[this.ip];
  }
}
