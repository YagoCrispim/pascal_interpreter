import { OP } from './op';

interface IChunk {
  constants: any[];
  opcodes: (string | string[])[];
  globals: {
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
    const scope = this.chunk.globals;

    while (this.instruction) {
      this.read();

      const instructionName = Array.isArray(this.instruction)
        ? this.instruction[0]
        : this.instruction;

      switch (instructionName) {
        case OP.NIL: {
        }
        case OP.DEFINE_GLOBAL: {
          stack.push(scope[this.instruction[1]].value);
        }
        case OP.GET_GLOBAL: {
          stack.push(scope[this.instruction[1]].value);
        }
        case OP.SET_GLOBAL: {
          const index = this.instruction[1];
          scope[index].value = stack[stack.length - 1];
        }
        case OP.ADD: {
          const v2 = stack.pop();
          const v1 = stack.pop();
          stack.push(v1 + v2);
        }
        case OP.DIVIDE: {
          const v2 = stack.pop();
          const v1 = stack.pop();
          stack.push(v1 / v2);
        }
        case OP.MULTIPLY: {
          const v2 = stack.pop();
          const v1 = stack.pop();
          stack.push(v1 * v2);
        }
        case OP.SUBTRACT: {
          const v2 = stack.pop();
          const v1 = stack.pop();
          stack.push(v1 - v2);
        }
        case OP.CONSTANT: {
          const index = this.instruction[1];
          stack.push(this.chunk.constants[index]);
        }
        case OP.POP: {
          stack.pop();
        }
      }
    }
  }

  private read() {
    this.ip += 1;
    this.instruction = this.chunk.opcodes[this.ip];
  }
}
