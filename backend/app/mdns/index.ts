import createMdns from "multicast-dns";
import App from "../../src/App";
import Server from "../../src/Server";

export default class AppResolver_mDNS extends App {
  private browser: createMdns.MulticastDNS;

  constructor (server: Server) {
    super(server, "mDNS-resolver");

    this.browser = createMdns({
      multicast: true,
    });

    this.browser.on('response', ({ answers }) => {
      if (!Array.isArray(answers) || !answers?.length) {
        return;
      }
    
      for (const { name, type } of answers) {
        server.mdnsResults.addMessage({ name, type });
      }
    });
  } 
}