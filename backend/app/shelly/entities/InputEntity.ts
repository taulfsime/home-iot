import Entity from "../../../src/Entity";
import ShellyDevice from "../ShellyDevice";

export default class InputEntity extends Entity {
  private _parent: ShellyDevice;

  constructor (data: Object, parent: ShellyDevice) {
    super(data);
    this._parent = parent;
  }

  public export() {
    return {
      ...super.export(),
      type: "input",
    };
  }
}