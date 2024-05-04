import express, { json, Express } from "express";
import { readdirSync } from "fs";
import dotenv from "dotenv";
import App from "./src/App";
import Server from "./src/Server";

dotenv.config();
const app: Express = express();
const server: Server = new Server(app);

app.use(json());

for (const moduleName of readdirSync("./app")) {
  const entry: App = require(`./app/${moduleName}`) as App;
  
  server.addApp(entry);
}

app.listen(process.env.PORT);
