# Libsql Viewer

`libsql-viewer` is a web-based libsql database browser written in JavaScript. It is desinged to be embeded in a npm project as an easy to use light weight cross platform tool in development.

## Installation

```bash
npm install --save-dev libsql-viewer
```

## Usage

Via the command line:
```bash
libsql-viewer <url or file>
    --auth-token <token>
        <the rest of the libsql client args>
    --port <port = 3000>

libsql-viewer ./my-db.db
```

Via code:
```js
import libsqlViewer from "libsql-viewer"
import { createClient } from "@libsql/client"

libsqlViewer({
    client: creatClient({ ... }),
    port: 3000
})
```

## Screenshots

![](screenshots/screenshot.png)