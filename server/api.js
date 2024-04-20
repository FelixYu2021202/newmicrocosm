const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs");

const Excel = require("./game/excel");
const PlayerData = require("./game/playerData");

/**
 * @param {string} an 
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage}} res 
 * @param {url.UrlWithParsedQuery & url.UrlWithStringQuery & url.Url} pu 
 */
function load_api(an, res, pu) {
    const parsed = path.parse(an);
    let body = "";
    res.req.on("data", chunk => {
        body += chunk;
    });
    res.req.on("end", () => {
        if (body.startsWith("{")) {
            body = JSON.parse(body);
        }
        else {
            body = {};
        }
        switch (parsed.base) {
            case "excel":
                Excel().then(dat => {
                    res.writeHead(200, {
                        "Content-Type": "text/plain"
                    });
                    res.end(JSON.stringify(dat));
                });
                break;
            case "login":
                res.writeHead(200, {
                    "Content-Type": "text/plain"
                });
                res.end(PlayerData.login(body.user, body.perm).toString());
                break;
        }
    });
}

module.exports = load_api;
