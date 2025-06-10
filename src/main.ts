import express from "express"
import { assert } from "console"
import { type Client } from "@libsql/client"
import { getTableData, getTables } from "./utils.ts"
import { page } from "./templates.ts"

interface libsqlViewerOptions {
    client: Client,
    port?: number,
}

export function libsqlViewer(options: libsqlViewerOptions) {
    assert(options.client, "libsqlViewer must have a client")

    // 
    const app = express()
    app.use(express.static('public'))
    app.set('view engine', 'html')

    app.get('/', async (req, res) => {
        res.send(page())
    })

    app.get('/t/:table', async (req, res) => {
        const table = req.params.table
        const data = await getTableData(options.client, table)
        const rows = data.rows.map(row => {
            const array = [] as any[]
            for (const c of data.columns) {
                array.push(row[c])
            }
            return array
        })

        res.send(page(`
            <table id="table">
                <tr>${data.columns.map(c => `<th>${c}</th>`).join("")}</tr>
                ${rows.map(row => `<tr>${
                    row.map(item => `<td>${item}</td>`).join("")
                }</tr>`).join("")}
            </table>
        `))
    })

    // 
    app.get('/api/tables', async (req, res) => {
        const tables = await getTables(options.client)
        res.send(tables.map(t => `
            <li><a href="/t/${t.name}">${t.name}</a></li>
        `.trim()).join(""))
    })

    // 
    const port = options.port || 3000
    app.listen(port, () =>  {
        console.log(`libsql viewer running at http://localhost:${port}`)
    })
}
