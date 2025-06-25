import { assert } from "console";
import path from 'path';
import express from "express";
import mustacheExpress from "mustache-express";
import { fileURLToPath } from "url";
export function libsqlViewer(options) {
    assert(options.client, "libsqlViewer must have a client");
    // 
    const app = express();
    app.use(express.static(path.join(__dirname, 'public')));
    app.engine('mustache', mustacheExpress());
    app.set('view engine', 'mustache');
    app.set('views', `${__dirname}/views`);
    app.get('/', async (_req, res) => {
        res.redirect("/t/sqlite_master");
    });
    app.get('/t/:table', async (req, res) => {
        const tables = await getTables(options.client);
        const table = await getTableData(options.client, req.params.table);
        res.render("table", { tables, table });
    });
    // 
    const port = options.port || 3000;
    app.listen(port, (err) => {
        if (err && err.message.includes('EADDRINUSE')) {
            console.error(`LibsqlViewer: Port ${port} is already in use. Please choose a different port.`);
            return;
        }
        if (err) {
            console.error("Error starting libsql viewer:", err);
            return;
        }
        console.log(`libsql viewer running at http://localhost:${port}`);
    });
}
async function getTables(client) {
    const results = await client.execute(`
        SELECT name FROM sqlite_master WHERE type='table'
    `);
    return results.rows;
}
async function getTableData(client, table) {
    const data = await client.execute(`
        SELECT * FROM ${table}
    `);
    const rows = data.rows.map(row => {
        const array = [];
        for (const c of data.columns) {
            array.push(row[c]);
        }
        return array;
    });
    return {
        columns: data.columns,
        columnTypes: data.columnTypes,
        rows
    };
}
// Get the current directory so that we can resolve templates & static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(__filename, '../..');
