function getId(): string {
  //TODO: Keep all ids and check if its unique before returning
  return crypto.randomUUID();
}

export default class UniqueList {
  //TODO: any -> device
  private items: Map<string, any> = new Map();

  constructor () {

  }

  public addNewItem (item: any) {
    const id: string = getId();
    this.addItem(id, item);

    return id;
  }

  public addItem (id: string, item: any) {
    this.items.set(id, item);
  }

  public checkItem (id: string) {
    return this.items.has(id);
  }

  public getItem (id: string, defaultValue: any = undefined) {
    if (!this.checkItem(id)) {
      return defaultValue;
    }

    return this.items.get(id);
  }

  public getItems (ids: Array<string>, defaultValue: any) {
    return ids.map(id => this.getItem(id, defaultValue));
  }

  public get ids () {
    return Array.from(
      this.items.keys()
    );
  }
}