import * as fs from "fs"
import * as path from "path"
import { CONFIG } from "./Server"

export class HttpResponse {
    constructor(
        private status: HttpStatus = HttpStatuses.OK,
        private body: any | undefined = undefined,
        private headers: {[key: string]: string | undefined} = {},
        private version: string = "HTTP/1.0"
    ) {}

    setFile(filePath: string) {
        this.body = fs.readFileSync(path.join(__dirname, "..", CONFIG.public_directory, filePath)).toString()
    }

    setContentType(type: ContentType) {
        this.setHeader("Content-Type", type)
    }

    setHeader(key: string, value: string) {
        this.headers[key] = value
    }

    removeHeader(key: string) {
        this.headers[key] = undefined
    }

    produceString() {
        if(!this.body) {
            return "HTTP/1.0 404 Not Found\r\n"+
                "\r\n" +
                "Page not found!" +
                "\r\n"
        }

        let headerText = ""

        for (const key of Object.keys(this.headers)) {
            const value = this.headers[key];
            if(!value) continue
            headerText += `${key}: ${value}\r\n`
        }

        return `${this.version} ${this.status.index} ${this.status.name}\r\n`+
            headerText +
            `\r\n`+
            `${this.body}`+
            `\r\n`;
    }
}


export type HttpStatus = {
    index: number,
    name: string
}

export class HttpStatuses {
    private constructor() {}


    public static OK: HttpStatus = {index: 200, name: "OK"}
}

type ContentType = "text/html" | "text/plain";