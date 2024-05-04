export default class Storage {
  private _value: any = null;
  private listeners: Set<Function> = new Set<Function>();

  constructor (value: any) {
    this._value = value;
  }

  public addListener (listener: Function) {
    this.listeners.add(listener);

    listener(this.value);
  }

  public getDerived (key: string) {
    const derived = new Storage(this.value?.[key] ?? {});

    derived.addListener((value: any) => {
      this.value = {
        ...this.value,
        [key]: value,
      };
    });

    this.addListener((value: any) => {
      derived.value = value?.[key] ?? {};
    });

    return derived;
  }

  public set value (value: any) {
    if (value === this._value || !value) {
      return;
    }

    this._value = value;

    for (const listener of this.listeners) {
      listener(this._value);
    }
  }

  public get value () {
    return this._value;
  }
}