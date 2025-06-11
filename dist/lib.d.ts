import { type Client } from "@libsql/client";
interface LibsqlViewerOptions {
    client: Client;
    port?: number;
}
export declare function libsqlViewer(options: LibsqlViewerOptions): void;
export {};
