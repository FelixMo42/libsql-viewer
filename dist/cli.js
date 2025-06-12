#!/usr/bin/env node
import { createClient } from "@libsql/client";
import { program } from "commander";
import { libsqlViewer } from "./lib.js";
import { pathToFileURL } from 'url';
program
    .name("libsql-viewer")
    .description("A simple web viewer for libSQL databases")
    .version("0.1.0")
    .argument("[database]", "Url for the libSQL database. It can also be set using --client-url.")
    .option("-p, --port <number>", "Port to run the viewer on", "3000")
    .option("--url <value>")
    .option("--auth-token <value>")
    .option("--encryption-key <value>")
    .option("--sync-url <value>")
    .option("--sync-interval <number>")
    .option("--read-your-writes <boolean>")
    .option("--offline <boolean>")
    .option("--tls <value>")
    .option("--int-mode <string>")
    .option("--concurrency <number>");
function main() {
    program.parse(process.argv);
    // If the user provided a database URL as an argument, use it
    const clientConfig = {
        url: program.args[0],
        ...program.opts()
    };
    // Remove our extra options from the client config
    delete clientConfig.port;
    // Make sure the user provided a URL
    if (!clientConfig.url) {
        console.error("Please provide a database URL as an argument or using --url.");
        process.exit(1);
    }
    // Check if the user provided a path instead of a url
    // If so, convert it to a file URL
    if (!isUrl(clientConfig.url)) {
        clientConfig.url = pathToFileURL(clientConfig.url).toString();
        console.log(clientConfig.url);
    }
    // Run the viewer!
    libsqlViewer({
        client: createClient(clientConfig),
        port: program.opts().port
    });
}
function isUrl(str) {
    try {
        new URL(str);
        return true;
    }
    catch {
        return false;
    }
}
main();
