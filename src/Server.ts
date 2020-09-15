import { Server } from "net";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

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
        
                const data = rawData.toString().split(/\r\n/)
                let request!: HttpRequest;
                try {
                    let line1 = data[0].split(" ")

                    request = {
                        method: line1[0] as "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT",
                        resource: line1[1],
                        version: line1[2],
                        headers: {}
                    }

                    for (let i = 1; i < data.length && data[i] !== ""; i++) {
                        const header = data[i];
                        const pair = header.split(" ");

                        const key = pair[0].substr(0, pair[0].length-1);
                        const value = pair[1];
                        request.headers[key] = value
                    }
                    
                } catch (error) {
                    socket.write("error")
                    socket.end()
                    return
                }
                const response = new HttpResponse()
                
                response.setFile("index.html")
                response.setContentType("text/html")

                socket.write(response.produceString())
                socket.write("\n")

                socket.end()
                return
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