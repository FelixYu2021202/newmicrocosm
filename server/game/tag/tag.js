const Game = require("../game.js");
const Wall = require("../wall.js");
const Mob = require("../mob.js");
const Excel = require("../excel.js");

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
        player: true,
    },
};

function gen(size, rate) {
    if (!rate) {
        rate = 0.23;
    }
    let map = [
        "#".repeat(size)
    ];
    for (let i = 2; i < size; i++) {
        let row = "#";
        for (let j = 2; j < size; j++) {
            if (Math.random() <= rate && (i != 2 || j != 2)) {
                row = row.concat("#");
            }
            else {
                row = row.concat(".");
            }
        }
        map.push(row.concat("#"));
    }
    map.push("#".repeat(size));
    return map;
}

class GameTag extends Game {
    /**
     * @param {string} rid
     */
    constructor(rid) {
        super();
        this.rid = rid;
        this.open = true;
        this.tid = "tag";

        this.size = 60;

        this.walls = Wall.buildFromMap(gen(this.size));
        let self = this;
        function spawnChest() {
            Excel().then(dat => {
                self.mobs.push(new Mob(dat, "chest", 8, 500 + Math.random() * (self.size - 2) * 500, 500 + Math.random() * (self.size - 2) * 500));
            });

            setTimeout(spawnChest, 4000);
        }
        spawnChest();
        function spawnBob() {
            Excel().then(dat => {
                self.mobs.push(new Mob(dat, "bob", 2, 500 + Math.random() * (self.size - 2) * 500, 500 + Math.random() * (self.size - 2) * 500))
            });

            setTimeout(spawnBob, 1000);
        }
        spawnBob();
    }

    getSpawnX() {
        return 500;
    }

    getSpawnY() {
        return 500;
    }
    update() {
        let self = this;
        this.players.forEach(pl => {
            pl.move(self);
        });
        this.mobs.forEach(mob => {
            mob.move(self);
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
        this.mobs = this.mobs.filter(mob => mob.health > 0);
        this.players = this.players.filter(player => player.health > 0);
    }
}

module.exports = GameTag;
module.exports.dealMap = dealMap;
module.exports.gen = gen;
