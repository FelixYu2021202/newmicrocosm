const Game = require("../game.js");
const Wall = require("../wall.js");
const Mob = require("../mob.js");
const Excel = require("../excel.js");
const Player = require("../player.js");

/**
 * @type {{
 *     [k in ("enemy" | "friend" | "player" | "none")]: {
 *         [k in ("enemy" | "friend" | "player" | "none")]: {
 *             valueOf(a: Entity, b: Entity): boolean;
 *         }
 *     }
 * }}
 */
let dealMap = {
    enemy: {
        enemy: false,
        friend: true,
        player: true,
        none: false,
        petal: true,
    },
    friend: {
        enemy: true,
        friend: false,
        player: false,
        none: false,
        petal: false
    },
    player: {
        enemy: true,
        friend: false,
        player: {
            /**
             * @param {Player} a
             * @param {Player} b
             */
            valueOf(a, b) {
                return !!(((a.level == 101) + (b.level == 101)) % 2);
            }
        },
        none: false,
        petal: false
    },
    none: {
        enemy: false,
        friend: false,
        player: false,
        none: false,
        petal: false
    },
    petal: {
        enemy: true,
        friend: false,
        player: false,
        none: false,
        petal: false
    }
};

let hitMap = {
    enemy: {
        enemy: false,
        friend: true,
        player: true,
        none: false,
        petal: false,
    },
    friend: {
        enemy: true,
        friend: false,
        player: false,
        none: false,
        petal: false
    },
    player: {
        enemy: true,
        friend: false,
        player: {
            /**
             * @param {Player} a
             * @param {Player} b
             */
            valueOf(a, b) {
                return !!(((a.level == 101) + (b.level == 101)) % 2);
            }
        },
        none: false,
        petal: false
    },
    none: {
        enemy: false,
        friend: false,
        player: false,
        none: false,
        petal: false
    },
    petal: {
        enemy: false,
        friend: false,
        player: false,
        none: false,
        petal: false
    }
};

function gen(size, rate, fakerate) {
    if (!rate) {
        rate = 0.23;
    }
    if (!fakerate) {
        fakerate = 0.01;
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
            else if (Math.random() <= fakerate && (i != 2 || j != 2)) {
                row = row.concat("?");
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

        this.size = 20;

        let map = Wall.buildFromMap(gen(this.size));
        this.walls = map.wall;
        this.fakes = map.fake;
        let self = this;
        function spawnChest() {
            let rar = 0;
            for (let i = 1; i < 15; i++) {
                if (Math.random() <= Excel.dat.tag[i].chest) {
                    rar = i;
                }
            }
            self.mobs.push(new Mob("chest", rar, 500 + Math.random() * (self.size - 2) * 500, 500 + Math.random() * (self.size - 2) * 500));

            setTimeout(spawnChest, 2000);
        }
        spawnChest();
        function spawnBob() {
            let rar = 0;
            for (let i = 1; i < 15; i++) {
                if (Math.random() <= Excel.dat.tag[i].bob) {
                    rar = i;
                }
            }
            self.mobs.push(new Mob("bob", rar, 500 + Math.random() * (self.size - 2) * 500, 500 + Math.random() * (self.size - 2) * 500))

            setTimeout(spawnBob, 3000);
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
                wall.collideWith(mob, dealMap, hitMap, this);
                mob.collideWith(wall, dealMap, hitMap, this);
            });
            this.players.forEach(player => {
                wall.collideWith(player, dealMap, hitMap, this);
                player.collideWith(wall, dealMap, hitMap, this);
            });
        });
        this.mobs.forEach(mob => {
            this.players.forEach(player => {
                mob.collideWith(player, dealMap, hitMap, this);
                player.collideWith(mob, dealMap, hitMap, this);
            });
        });
        for (let i = 0; i < this.mobs.length; i++) {
            for (let j = i + 1; j < this.mobs.length; j++) {
                this.mobs[i].collideWith(this.mobs[j], dealMap, hitMap, this);
                this.mobs[j].collideWith(this.mobs[i], dealMap, hitMap, this);
            }
        }
        for (let i = 0; i < this.players.length; i++) {
            for (let j = i + 1; j < this.players.length; j++) {
                this.players[i].collideWith(this.players[j], dealMap, hitMap, this);
                this.players[j].collideWith(this.players[i], dealMap, hitMap, this);
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
module.exports.hitMap = hitMap;
module.exports.gen = gen;
