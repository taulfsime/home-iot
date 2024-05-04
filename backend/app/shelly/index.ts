import { Router, Request, Response } from 'express';
import Storage from '../../src/Storage';
import ShellyDevice from './ShellyDevice';
import Server from '../../src/Server';
import App from '../../src/App';

const SHELLY_ID: string = 'shelly';

export default class AppShelly extends App {
  private devices: Storage;
  private addedDevices: Set<string> = new Set();

  constructor(server: Server) {
    super(server, SHELLY_ID);
    this.devices = this.storage.getDerived('devices');

    // load devices from the storage
    this.devices.addListener((value: any) => {

      for (const [ id, data ] of Object.entries(value)) {
        const ip = (data as any).ip;

        if (this.addedDevices.has(ip)) {
          continue;
        }

        this.addedDevices.add(ip);

        try {
          this.server.entities.addItem(id, ShellyDevice.from(data));
        } 
        catch (e) {
          console.error(e);
        }
      }
    });

    // subscribe to the mDNS results
    this.server.mdnsResults.subscribe(this.mdnsResultHandler.bind(this));

    //TODO: nono
    const router = Router();
    router.get('/add/:ip', this.requestAddDevice.bind(this));

    router.get('/list/storage', (req: Request, res: Response) => {
      res.json(this.devices.value);
    });
    router.get('/list/ips', (req: Request, res: Response) => {
      res.json(Array.from(this.addedDevices));
    });

    this.server.nodeApp.use("/shelly", router);
  }

  private mdnsResultHandler (params: any, consume: Function) {
    const { name } = params;

    if (!(/\._shelly\._tcp/i.test(name))) {
      return;
    }

    console.log(name);
    consume();
  }

  private requestAddDevice(req: Request, res: Response) {
    const { ip } = req?.params ?? {};

    if (!ip?.length) {
      res.status(400).json({
        error: 'Missing ip',
      });
      return;
    }

    if (this.addedDevices.has(ip)) {
      res.status(400).json({
        error: 'Device already added',
      });
      return;
    }

    const device: ShellyDevice = ShellyDevice.createDevice(ip);

    if (!device) {
      res.status(400).json({
        error: 'Can not create/reach the device',
      });

      return;
    }

    const id = this.server.entities.addNewItem(device);

    this.addedDevices.add(ip);

    this.devices.value = {
      ...this.devices.value,
      [id]: {
        ip,
      },
    };

    res.status(200).json({ 
      ok: true, 
      id,
    });
  }
}
