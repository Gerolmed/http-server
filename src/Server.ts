import { Server } from "net";

var server: Server | null

export function runServer() {
    return new Promise(resolve => {
        console.log("Starting server")
        server = new Server(
            (socket) => {
                console.log("Connected to a socket")
                socket.on("close", hadError => {
                    if(!server) return
                    console.log(`Connection closed (Error: ${hadError})`)
                })
            }
        );
        
        
        server.on("connection", (socket) => {
            socket.on("data", rawData => {
        
                const data = rawData.toString()

                if(!data || data.split(" ").length < 2) {
                    socket.write("ERROR can't find someword\n")
                    socket.end()
                    return;
                }
                const command = data.split(" ", 1)[0]
                const body = data.substr(command.length+1)
            
                socket.write("ANSWER " + body)
                socket.end()
            })
        
        })
            
        server.listen(6789, "127.0.0.1", () => {
            console.log("Started server")
            resolve()
        })
    })
}

/**
 * Stops the server
 */
export async function stopServer() {
    new Promise(resolve => server?.close(() => {
        server = null
        resolve()
    }))
}