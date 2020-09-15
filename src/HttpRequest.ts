export type HttpRequest = {
    method: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT"
    resource: string,
    version: string,
    headers: {[key: string]: string}
}