export default class Entity {
  private _commands: Map<string, Function> = new Map<string, Function>([]);
  private _listeners: Set<Function> = new Set<Function>([]);
  protected data: any;

  constructor (data: any) {
    this.data = data;
  };

  /**
   * Subscribe for executing commands
   * @param listener {Function} - callback function when command is executed with its name
   */
  public addListener (listener: Function) {
    this._listeners.add(listener);
  }

  /**
   * Execute command
   * @param name {string} - name of the command
   * @param args [Array<any>] - arguments for the command
   * @throws {Error} - if command is not found
   */
  public execute (name: string, ...args: any) {
    const command = this._commands.get(name);

    if (!command) {
      throw new Error(`Command ${name} not found`);
    }

    this._listeners.forEach((listener) => {
      listener(name);
    });

    command(...args);
  }

  /**
   * Get all commands
   * @returns {Array<string>} - list of all commands
   */
  public get commands (): Array<string> {
    return Array.from(this._commands.keys());
  }

  public export (): any {
    return this.data;
  }

  /**
   * Registers new command
   * @param name {string} - unique command name
   * @param callback {Function} - callback function to execute
   */
  protected addCommand (name: string, callback: Function) {
    this._commands.set(name, callback);
  }
}