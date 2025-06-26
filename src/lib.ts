import { assert } from "console"
import path from "path"
import { fileURLToPath } from "url"

import express from "express"
import mustacheExpress from "mustache-express"
import { type Client } from "@libsql/client"
import { json2csv } from 'json-2-csv'

interface LibsqlViewerOptions {
    client: Client,
    port?: number,
}

export function libsqlViewer(options: LibsqlViewerOptions) {
    assert(options.client, "libsqlViewer must have a client")

    // 
    const app = express()
    app.use(express.static(path.join(__dirname, 'public')))
    app.engine('mustache', mustacheExpress())
    app.set('view engine', 'mustache')
    app.set('views', `${__dirname}/views`)

    app.get('/', async (_req, res) => {
        res.redirect("/t/sqlite_master")
    })

    app.get('/q', async (req, res) => {
        const tables = await getTables(options.client)
        const query = req.query.q as string

        const table = query ? await getReadonlyQueryColumns(options.client, query) : []
        res.render("query", { tables, table, query })
    })

    app.get('/t/:table', async (req, res) => {
        const tables = await getTables(options.client)
        const table = await getTableColumns(options.client, req.params.table)
        res.render("table", { tables, table })
    })

    app.get('/t/:table/csv', async (req, res) => {
        const data = await options.client.execute(`
            SELECT * FROM ${req.params.table}
        `)

        res.header('Content-Type', 'text/csv')
        res.attachment(`${req.params.table}.csv`)
        res.send(json2csv(data.rows))
    })

    app.get('/t/:table/json', async (req, res) => {
        const data = await options.client.execute(`
            SELECT * FROM ${req.params.table}
        `)

        res.header('Content-Type', 'application/json')
        res.attachment(`${req.params.table}.json`)
        res.send(JSON.stringify(data.rows))
    })

    // 
    const port = options.port || 3000
    app.listen(port, (err) =>  {
        if (err && err.message.includes('EADDRINUSE')) {
            console.error(`LibsqlViewer: Port ${port} is already in use. Please choose a different port.`)
            return
        }
    
        if (err) {
            console.error("Error starting libsql viewer:", err)
            return
        }

        console.log(`libsql viewer running at http://localhost:${port}`)
    })
}

async function getTables(client: Client): Promise<Array<{ name: string }>> {
    const results = await client.execute(`
        SELECT name FROM sqlite_master WHERE type='table'
    `)

    return results.rows as unknown as Array<{ name: string }>
}

async function getReadonlyQueryColumns(client: Client, query: string) {
    const data = (await client.batch([query], "read"))[0]

    return data.columns.map(name => ({
        name,
        data: data.rows.map(item => item[name])
    }))
}

async function getTableColumns(client: Client, table: string) {
    const data = await client.execute(`
        SELECT *
        FROM ${table}
    `)

    return data.columns.map(name => ({
        name,
        data: data.rows.map(item => item[name])
    }))
}

// Get the current directory so that we can resolve templates & static files
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve(__filename, '../..')
