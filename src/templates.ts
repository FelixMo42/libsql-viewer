export function page(content: string=""): string {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Libsql Viewer</title>

                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="stylesheet" href="/style.css">

                <!-- <script src="https://unpkg.com/htmx.org@2.0.4"></script> -->
                <script src="/htmx.js"></script>
            </head>
            <body>
                <div id="tables-selector">
                    <input
                        hx-get="/api/tables"
                        hx-trigger="input changed delay:500ms, keyup[key=='Enter'], load"
                        hx-target="#tables"
                    >
                    <ul id="tables"></ul>
                </div>
                ${content}
            </body>
        </html>
    `.trim()
}