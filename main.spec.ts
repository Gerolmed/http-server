import { Socket } from "net";
import { runServer, stopServer } from "./src/Server";

it("Run test",  async () => {  
    return new Promise(async (resolve) => {
        await runServer();

        var client = new Socket()
        client.connect(6789, "127.0.0.1", () => {
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