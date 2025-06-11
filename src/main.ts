import { assert } from "console"
import path from 'path'
import express from "express"
import mustacheExpress from "mustache-express"
import { type Client } from "@libsql/client"
import { getTableData, getTables } from "./utils.ts"
import { fileURLToPath } from "url"

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

    app.get('/t/:table', async (req, res) => {
        const tables = await getTables(options.client)
        const table = await getTableData(options.client, req.params.table)
        res.render("table", { tables, table })
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

// Get the current directory so that we can resolve templates & static files
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve(__filename, '../..')
