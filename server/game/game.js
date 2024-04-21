const Wall = require("./wall.js");
const Mob = require("./mob.js");
const Player = require("./player.js");
const Excel = require("./excel.js");
const WebSocket = require("ws");

class Game {
    /**
     * @type {boolean}
     */
    open;
    /**
     * @type {string}
     */
    rid;
    /**
     * @type {string}
     */
    tid;
    /**
     * @type {WebSocket[]}
     */
    ws = [];

    /**
     * @type {Wall[]}
     */
    walls = [];

    /**
     * @type {Mob[]}
     */
    mobs = [];

    /**
     * @type {Player[]}
     */
    players = [];

    /**
     * @param {WebSocket} ws
     */
    addconnect(ws, name) {
        if (this.players.find(p => p.name == name)) {
            return ws.close(1000);
        }
        Excel().then(dat => {
            this.players.push(new Player(dat, name, this.getSpawnX(), this.getSpawnY(), ws));
        });
    }

    registered = false;

    run() {
        if (this.registered) {
            return;
        }
        if (!this.open) {
            return;
        }
        this.registered = true;
        this.update();
        this.players = this.players.filter(pl => pl.ws.readyState == pl.ws.OPEN);
        this.players.forEach(pl => {
            Game.send(this, pl.ws);
        });
        let self = this;
        setTimeout(function () {
            self.registered = false;
            self.run();
        }, 21);
    }

    update() { }

    remove(name) {
        this.players = this.players.filter(p => p.name != name);
        if (this.players.length == 0) {
            this.open = false;
        }
    }

    getSpawnX() {
    }

    getSpawnY() {
    }
}

/**
 * 
 * @param {Game} game 
 * @param {WebSocket} ws 
 */
function send(game, ws) {
    ws.send(JSON.stringify({
        curdata: game,
        type: "game"
    }));
}

module.exports = Game;

module.exports.send = send;

module.exports.games = {
    GameTag: require("./tag/tag.js")
};