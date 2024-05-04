import Entity from "../../../src/Entity";
import ShellyDevice from "../ShellyDevice";

export default class SwitchEntity extends Entity {
  private _parent: ShellyDevice;

  constructor (data: Object, parent: ShellyDevice) {
    super(data);
    this._parent = parent;

    this.addCommand("turnOn", () => {
      console.log("Turning on");
    });

    this.addCommand("turnOff", () => {
      console.log("Turning off");
    });
  }

  public export() {
    return {
      ...super.export(),
      type: "switch",
    };
  }
}