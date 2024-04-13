const Game = require("../game.js");
const Wall = require("../wall.js");
const Player = require("../player.js");
const Mob = require("../mob.js");
const Excel = require("../excelparser.js");

let dealMap = {
    enemy: {
        enemy: false,
        friend: true,
        player: true,
    },
    friend: {
        enemy: true,
        friend: false,
        player: false,
    },
    player: {
        enemy: true,
        friend: false,
        player: false,
    },
};

class GameLegacy extends Game {
    /**
     * @param {string} rid
     */
    constructor(rid) {
        super();
        this.rid = rid;
        this.open = true;
        this.tid = "legacy";
        this.walls = Wall.buildFromMap([
            "##############################",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "#............................#",
            "##############################",
        ]);
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 1, 500, 500));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 2, 1000, 1000));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 3, 1500, 1500));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 4, 2000, 2000));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 5, 2500, 2500));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 6, 3000, 3000));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 7, 3500, 3500));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 8, 4000, 4000));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 9, 5000, 5000));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 10, 6000, 6000));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 11, 7000, 7000));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 12, 8000, 8000));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 13, 9000, 9000));
        });
        Excel().then(dat => {
            this.mobs.push(new Mob(dat, "chest", 14, 10000, 10000));
        });
    }

    getSpawnX() {
        return 500 + Math.random() * 1000;
    }

    getSpawnY() {
        return 500 + Math.random() * 1000;
    }
    update() {
        this.players.forEach(pl => {
            pl.move();
        });
        this.walls.forEach(wall => {
            this.mobs.forEach(mob => {
                wall.collideWith(mob, dealMap);
                mob.collideWith(wall, dealMap);
            });
            this.players.forEach(player => {
                wall.collideWith(player, dealMap);
                player.collideWith(wall, dealMap);
            });
        });
        this.mobs.forEach(mob => {
            this.players.forEach(player => {
                mob.collideWith(player, dealMap);
                player.collideWith(mob, dealMap);
            });
        });
        for (let i = 0; i < this.mobs.length; i++) {
            for (let j = i + 1; j < this.mobs.length; j++) {
                this.mobs[i].collideWith(this.mobs[j], dealMap);
                this.mobs[j].collideWith(this.mobs[i], dealMap);
            }
        }
        for (let i = 0; i < this.players.length; i++) {
            for (let j = i + 1; j < this.players.length; j++) {
                this.players[i].collideWith(this.players[j], dealMap);
                this.players[j].collideWith(this.players[i], dealMap);
            }
        }
        this.walls.forEach(wall => {
            wall.deal();
        });
        this.mobs.forEach(mob => {
            mob.deal();
        });
        this.players.forEach(player => {
            player.deal();
        });
    }
}

module.exports = GameLegacy;
module.exports.dealMap = dealMap;
