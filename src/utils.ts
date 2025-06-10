import { type Client } from "@libsql/client";

export async function getTables(client: Client): Promise<Array<{ name: string }>> {
    const results = await client.execute(`
        SELECT name FROM sqlite_master WHERE type='table'
    `)
    return results.rows as unknown as Array<{ name: string }>
}

export async function getTableData(client: Client, table: string) {
    return await client.execute(`
        SELECT * FROM ${table} LIMIT 100
    `)
}
