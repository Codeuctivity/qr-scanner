const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const rootDir = path.resolve(__dirname, '..', '..');
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    let filePath = path.normalize(path.join(rootDir, decodeURIComponent(requestUrl.pathname)));

    if (!filePath.startsWith(rootDir)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (error, fileBuffer) => {
        if (error) {
            response.writeHead(error.code === 'ENOENT' ? 404 : 500, {
                'Content-Type': 'text/plain; charset=utf-8',
            });
            response.end(error.code === 'ENOENT' ? 'Not found' : 'Internal server error');
            return;
        }

        response.writeHead(200, {
            'Cache-Control': 'no-store',
            'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
        });
        response.end(fileBuffer);
    });
});

server.listen(port, '127.0.0.1', () => {
    process.stdout.write(`Static server listening on http://127.0.0.1:${port}\n`);
});
