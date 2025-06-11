import { type Client } from "@libsql/client";

export async function getTables(client: Client): Promise<Array<{ name: string }>> {
    const results = await client.execute(`
        SELECT name FROM sqlite_master WHERE type='table'
    `)
    return results.rows as unknown as Array<{ name: string }>
}

export async function getTableData(client: Client, table: string) {
    const data = await client.execute(`
        SELECT * FROM ${table} LIMIT 100
    `)

    const rows = data.rows.map(row => {
        const array = [] as any[]
        for (const c of data.columns) {
            array.push(row[c])
        }
        return array
    })

    return {
        columns: data.columns,
        columnTypes: data.columnTypes,
        rows
    }
}
