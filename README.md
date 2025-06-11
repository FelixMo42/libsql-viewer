# Libsql Viewer

`libsql-viewer` is a web-based libsql database browser written in JavaScript.

## Installation

> NOTE: I plan to publish this to npm, but my phone got stolen!

```bash
npm install --save-dev git+https://github.com/coleifer/sqlite-web.git
```

## Usage

Via the command line:
```bash
libsql-viewer
    --client-url <url or file>
    --client-auth-token <token>
        <the rest of the client params>
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