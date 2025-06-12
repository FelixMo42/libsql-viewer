# Libsql Viewer

`libsql-viewer` is a web-based libsql database browser written in JavaScript.

## Installation

```bash
npm install --save-dev libsql-viewer
```

## Usage

Via the command line:
```bash
libsql-viewer
    --url <url or file>
    --auth-token <token>
        <the rest of the libsql client args>
    --port <port = 3000>
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