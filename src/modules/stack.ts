export class Stack {
  private readonly items: any[] = [];

  public push(item) {
    this.items.push(item);
  }

  public pop() {
    return this.items.pop();
  }

  public peek() {
    return this.items[this.items.length - 1];
  }
}