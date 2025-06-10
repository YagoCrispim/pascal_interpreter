export const OP = {
  // Do nothing (for now)
  RETURN: 'OP_RETURN',

  /**
   * Read const value from vm constants and increment IP
   * Push that value onto the stack
   */
  CONSTANT: 'OP_CONSTANT',

  /**
   * Peek number from the top of the stack and check if is a number.
   * If so, then pop the number from the top of the stack, negate it and push
   * negated value onto the stack
   */
  NEGATE: 'OP_NEGATE',

  /**
   * Check if two values on top of the stack are strings. If so, concatenate.
   * If it's number, pop the two numbers, sum and push the result
   */
  ADD: 'OP_ADD',

  /**
   * Same as OP_ADD, but with subtraction
   */
  SUBTRACT: 'OP_SUBTRACT',

  /**
   * Same as OP_ADD, but with multiplication
   */
  MULTIPLY: 'OP_MULTIPLY',

  /**
   * Same as OP_ADD, but with division
   */
  DIVIDE: 'OP_DIVIDE',

  /**
   * Push "nil" onto the stack
   */
  NIL: 'OP_NIL',

  /**
   * Push true onto the stack
   */
  TRUE: 'OP_TRUE',

  /**
   * Push true onto the stack
   */
  FALSE: 'OP_FALSE',

  /**
   * Negate the value on top of the stack
   */
  NOT: 'OP_NOT',

  /**
   * Pop two values from the top of the stack and push the result if they're
   * equal
   */
  EQUAL: 'OP_EQUAL',

  /**
   * Do nothing (for now)
   */
  GREATER: 'OP_GREATER',

  /**
   * Do nothing (for now)
   */
  LESS: 'OP_LESS',

  /**
   * Pop value from the top of the stack ant print it
   */
  PRINT: 'OP_PRINT',

  /**
   * Move the value from the the top of the stack to the vm globals,
   * then, pop the value from the top
   */
  DEFINE_GLOBAL: 'OP_DEFINE_GLOBAL',

  /**
   * Get the value from the vm globals and push it onto the stack
   */
  GET_GLOBAL: 'OP_GET_GLOBAL',

  /**
   * Set value onto the top of the stack
   */
  SET_GLOBAL: 'OP_SET_GLOBAL',

  /**
   * Read value from current scope and push onto the stack
   */
  GET_LOCAL: 'OP_GET_LOCAL',

  /**
   * Set value on current scop
   */
  SET_LOCAL: 'OP_SET_LOCAL',

  /**
   * Pop value from the top of the stack
   */
  POP: 'OP_POP',

  /**
   * Set a value to add to the vm.ip
   */
  JUMP: 'OP_JUMP',

  /**
   * Set a value to add to the vm.ip if condition is false
   */
  JUMP_IF_FALSE: 'OP_JUMP_IF_FALSE',
};
