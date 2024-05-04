export default class MessagesChannel {
  private currentMessage: Object|null = null;
  private messages: Array<Object> = [];
  private listeners: Array<Function> = [];

  constructor () {}

  public subscribe (callback: Function) {
    this.listeners.push(callback);

    return () => this.listeners = this.listeners.filter(l => l !== callback);
  }

  public addMessage (msg: Object) {
    this.messages.push(msg);

    if (!this.currentMessage) {
      this.sendMessage();
    }
  }

  private sendMessage () {
    if (!this.messages.length) {
      return;
    }

    this.currentMessage = this.messages.shift() as Object;

    for (const callback of this.listeners) {
      if (!this.currentMessage) {
        break;
      }

      callback(this.currentMessage, this.consume.bind(this));
    }

    this.consume();
  }

  private consume () {
    this.currentMessage = null;
    this.sendMessage();
  }
}