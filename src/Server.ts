import { Server } from "net";
import { join } from "path";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse, HttpStatuses } from "./HttpResponse";

var server: Server | null

export var CONFIG!: Config

export function runServer(config: Config) {
    CONFIG = config
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

                    if(request.resource.search("..") > 0) throw new Error("May not be relative upwards pointing path")
                    
                } catch (error) {
                    socket.write(new HttpResponse(HttpStatuses.BAD_REQUEST, "Invalid request").produceString())
                    socket.end()
                    return
                }
                const response = new HttpResponse()
                
                response.setFile(request.resource.endsWith("/") ? join(request.resource, "index.html") : request.resource)
                response.setContentType("text/html")

                socket.write(response.produceString())
                socket.write("\n")

                socket.end()
                return
            })
        
        })
            
        server.listen(CONFIG.port, CONFIG.host, () => {
            console.log("Started server on " + CONFIG.host + ":" + CONFIG.port)
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


export type Config = {
    port: number,
    host: string,
    public_directory: string
}