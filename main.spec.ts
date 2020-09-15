import { Socket } from "net";
import { Config, runServer, stopServer } from "./src/Server";

const CONFIG: Config = {
    host: "127.0.0.1",
     port: 6789,
      public_directory: "public"
    }

it("Run test",  async () => {  
    return new Promise(async (resolve) => {
        await runServer(CONFIG);

        var client = new Socket()
        client.connect(CONFIG.port, CONFIG.host, () => {
            console.log('Connected');
            client.write('Hello, server! Love, Client.');
        })

        client.on('data', function(data) {
            console.log('Received: ' + data);
            client.destroy(); // kill client after server's response
        });

        client.on('close', async function() {
            console.log('Connection closed');
            await stopServer()
            resolve();
        });
    })
    
})