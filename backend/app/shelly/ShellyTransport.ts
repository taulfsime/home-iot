import { WebSocket } from "ws";

const MAX_REQUESTS_IN_PROGRESS: number = 3;

type RequestType = {
  params: Object,
  callback: Function,
};

type RPCResponseType = {
  id: number,
  result?: Object, 
  error?: Object, 
  dst: string,
};

export default class ShellyTransport {
  private ip: string;
  private counter: number;
  private requestsQueue: Array<RequestType>;
  private responsesMap: Map<number, Function>;
  private socket: WebSocket;

  constructor (ip: string) {
    this.ip = ip;

    this.counter = 0;
    this.requestsQueue = [];
    this.responsesMap = new Map();
    this.socket = new WebSocket(`ws://${this.ip}/rpc`);

    this.socket.on("open", this.onOpen.bind(this));
    this.socket.on("close", this.onClose.bind(this));
    this.socket.on("message", this.onMessage.bind(this));
    this.socket.on("error", this.onError.bind(this));
  }

  public request (params: Object, callback?: Function) {
    this.requestsQueue.push({
      params,
      callback,
    } as RequestType);

    this.tryMakeCall();
  }

  tryMakeCall () {
    if (!this.socket.readyState) {
      return;
    }

    if (this.responsesMap.size > MAX_REQUESTS_IN_PROGRESS) {
      return;
    }

    if (!this.requestsQueue.length) {
      return;
    }

    const { params, callback } = this.requestsQueue.shift() as RequestType;
    const id = this.counter++;

    this.responsesMap.set(id, callback);

    this.socket.send(JSON.stringify({
      ...params,
      id,
      src: "home-iot",
    }));

    this.tryMakeCall();
  }

  onClose (msg: string) {
    console.log("Close", msg);
  }

  onOpen () {
    this.tryMakeCall();
  }

  onError (msg: string) {
    console.log("Error", msg);
  }

  onMessage (raw: string) {
    try {
      const { id, result, error, dst }  = JSON.parse(raw) as RPCResponseType;
      const callback = this.responsesMap.get(id);

      if (typeof callback !== "function" || dst !== "home-iot") {
        return;
      }

      this.responsesMap.delete(id)

      callback(!!error, result || error);
    }
    catch (e) {
      throw e;
    }

    this.tryMakeCall();
  }
}