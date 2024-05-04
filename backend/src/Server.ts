import App from "./App";
import UniqueList from "./UniqueList";
import MessagesChannel from "./MessagesChannel";
import { Express } from "express";
import FileStorage from "./FileStorage";

export default class Server {
  public entities: UniqueList;
  public mdnsResults: MessagesChannel;
  public storage: FileStorage;

  public nodeApp: Express;
  private apps: Set<App> = new Set<App>();

  constructor (nodeApp: Express) {
    this.nodeApp = nodeApp;
    this.entities = new UniqueList();
    this.mdnsResults = new MessagesChannel();
    this.storage = new FileStorage("data");
  }

  public addApp (integration: any) {
    this.apps.add(
      new (integration.default)(this)
    ); 
  }
}