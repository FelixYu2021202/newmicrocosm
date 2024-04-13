const WebSocket = require("ws");
const url = require("url");
const fs = require("fs");

const Game = require("./game/game.js");

function init() {
    const config = JSON.parse(fs.readFileSync("./data/ports.json", "utf-8"));
    const host = config.ip;
    const port = config.socketPort;

    const wss = new WebSocket.Server({
        host, port
    });

    /**
     * @type {{[type: string]: {[room: string]: Game}}}
     */
    let createdGames = {};

    wss.on("connection", (ws, req) => {
        const parsed = url.parse(req.url, true);
        const { type, room, player } = parsed.query;

        if (!createdGames[type]) {
            createdGames[type] = {};
        }
        if (!createdGames[type][room] || !createdGames[type][room].open) {
            createdGames[type][room] = new Game.games[type](room);
        }

        /**
         * @type {Game}
         */
        let game = createdGames[type][room];

        game.addconnect(ws, player);

        ws.onclose = function () {
            game.remove(player);
        }

        game.run();
    });
}

module.exports = init;
