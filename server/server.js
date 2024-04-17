const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const config = JSON.parse(fs.readFileSync("./data/ports.json", "utf8"));

const host = config.ip;
const port = config.serverPort;

const scripts = {
    api: require("./api"),
    ws: require("./ws")
};

/**
 * 
 * @param {string} fn 
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res 
 * @param {string} fld 
 * @param {string} ctt 
 */
function load_file(fn, res, fld, ctt) {
    fs.readFile("./" + fld + fn, (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end(`Error: ${err.code}`);
        }
        res.writeHead(200, {
            "Content-Type": ctt
        });
        res.end(data, "utf-8");
    });
}

/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res 
 */
function load(req, res) {
    fs.appendFile("./logs/server.log", `[${Date.now()}] ${req.url.substring(0, 40)}\n`, () => {
        console.log(`[${Date.now()}] ${req.url.substring(0, 40)}`);
    });
    const parsed = url.parse(req.url, true);
    const filePath = parsed.pathname.endsWith("/") ? parsed.pathname + "index.html" : parsed.pathname;
    if (filePath.startsWith("/api/")) {
        return scripts.api(filePath.substring(5), res, parsed);
    }
    const extname = path.extname(filePath).toLowerCase();
    const ctt = {
        ".css": "text/css",
        ".html": "text/html",
        ".ico": "image/x-icon",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png"
    };
    const fld = {
        ".css": "styles",
        ".html": "pages",
        ".ico": "pics",
        ".jpeg": "pics",
        ".jpg": "pics",
        ".js": "scripts",
        ".json": "data",
        ".png": "pics",
    }
    if (extname != ".jss") {
        load_file(filePath, res, fld[extname], ctt[extname]);
    }
    else {
        load_file(filePath.substring(0, filePath.length - 1), res, "server", "application/javascript");
    }
}

const server = http.createServer(load);

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});

if (scripts.ws) {
    scripts.ws();
}
