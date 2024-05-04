import Entity from "../../src/Entity";
import InputEntity from "./entities/InputEntity";
import SwitchEntity from "./entities/SwitchEntity";
import ShellyTransport from "./ShellyTransport";

export default class ShellyDevice extends Entity {
  private ip: string;
  private transport: ShellyTransport;
  private components: Set<Entity> = new Set([]);

  constructor (data: any) {
    super(data);

    this.ip = data.ip;

    this.transport = new ShellyTransport(this.ip);
    this.loadComponents();
  }

  public call (method: string, params?: Object) {
    const requestParams = {
      method,
      ...(typeof params === "object" ? params : {}),
    };

    return new Promise((resolve, reject) => {
      try {
        this.transport.request(requestParams, (isError: boolean, data: Object) => {
          if (isError) {
            reject(data);
            return;
          }
          
          resolve(data);
        });
      }
      catch (e) {
        reject(e);
      }
    });
  }

  async loadComponents () { 
    // loads components from the saved data
    for (const componentData of this.data?.components ?? []) {
      const entity = ShellyDevice.from(componentData, this);

      if (entity) {
        this.addComponent(entity);
      }
    }

    // fetch from the device
    let offset = 0;
    while (true) {
      const { total, components } = await this.call("Shelly.GetComponents", { offset }) as any;
      offset += components.length;

      for (const { key, status, config } of components) {
        const [ type ] = key.split(":");
        const { name } = config;

        const entity = ShellyDevice.from({ type, name }, this, status, config);

        if (entity) {
          this.addComponent(entity);
        }
      }

      if (offset >= total) {
        break;
      }
    }
  }

  public export() {
    return {
      ...super.export(),
      components: Array.from(this.components).map((component) => component.export()),
      type: "device",
    };
  }

  private addComponent (component: Entity) {
    this.components.add(component);
  }

  static from (data: any, ...params: any) {
    const type = data.type;

    if (!SHELLY_ENTITIES.has(type)) {
      return null;
    }

    const Entity = SHELLY_ENTITIES.get(type);

    return new Entity(data, ...params);
  }

  static createDevice (ip: string) {
    return new ShellyDevice({ ip });
  }
}

const SHELLY_ENTITIES: Map<string, any> = new Map<string, any>([
  [ "device", ShellyDevice ],
  [ "switch", SwitchEntity ],
  [ "input", InputEntity ],
]);