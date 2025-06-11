# Libsql Viewer

Built using express & htmx.

## How to use

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
