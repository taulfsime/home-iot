import Server from "./Server";

export default class App {
  public server: Server;
  public id: string;
  public storage: any;

  constructor (server: Server, id: string) {
    this.server = server;
    this.id = id;

    this.storage = server.storage.getDerived(id);
  }
}