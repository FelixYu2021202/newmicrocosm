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
                return !!(((a.level == 10001) + (b.level == 10001)) % 2);
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
                return !!(((a.level == 10001) + (b.level == 10001)) % 2);
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

let exertMap = {
    enemy: {
        enemy: true,
        friend: true,
        player: true,
        none: true,
        petal: false,
    },
    friend: {
        enemy: true,
        friend: true,
        player: false,
        none: true,
        petal: false
    },
    player: {
        enemy: true,
        friend: false,
        player: true,
        none: true,
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

function gen() {
    return [
        "####################",
        "#          #       #",
        "#          #       #",
        "#      #   #       #",
        "#     ##   #       #",
        "#      #   #       #",
        "##     #   #       #",
        "#      #   #       #",
        "#     ##   #       #",
        "#     #    #       #",
        "#     #    #       #",
        "#     ######       #",
        "#     #            #",
        "#     #            #",
        "#     #            #",
        "#     ######       #",
        "#                  #",
        "#                  #",
        "#                  #",
        "####################"
    ];
}

class GameMap extends Game {
    /**
     * @param {string} rid
     */
    constructor(rid) {
        super();
        this.rid = rid;
        this.open = true;
        this.tid = "tag";

        this.size = 20;

        let map = Wall.buildFromMap(gen());
        this.walls = map.wall;
        let self = this;
        // function spawnChest() {
        //     let rar = 0;
        //     for (let i = 1; i < 15; i++) {
        //         if (Math.random() <= Excel.dat.tag[i].chest) {
        //             rar = i;
        //         }
        //     }
        //     self.summonChest(rar);

        //     setTimeout(spawnChest, 8000);
        // }
        // spawnChest();
        // function spawnBob() {
        //     let rar = 0;
        //     for (let i = 1; i < 15; i++) {
        //         if (Math.random() <= Excel.dat.tag[i].bob) {
        //             rar = i;
        //         }
        //     }
        //     self.summonBob(rar);

        //     setTimeout(spawnBob, 7500);
        // }
        // spawnBob();
    }

    summonBob(rarity) {
        if (this.mobs.length < 200) {
            this.mobs.push(new Mob("bob", rarity, 500 + Math.random() * (this.size - 2) * 500, 500 + Math.random() * (this.size - 2) * 500));
        }
    }

    summonChest(rarity) {
        if (this.mobs.length < 200) {
            this.mobs.push(new Mob("chest", rarity, 500 + Math.random() * (this.size - 2) * 500, 500 + Math.random() * (this.size - 2) * 500));
        }
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
                wall.collideWith(mob, dealMap, hitMap, exertMap, this);
                mob.collideWith(wall, dealMap, hitMap, exertMap, this);
            });
            this.players.forEach(player => {
                wall.collideWith(player, dealMap, hitMap, exertMap, this);
                player.collideWith(wall, dealMap, hitMap, exertMap, this);
            });
        });
        this.mobs.forEach(mob => {
            this.players.forEach(player => {
                mob.collideWith(player, dealMap, hitMap, exertMap, this);
                player.collideWith(mob, dealMap, hitMap, exertMap, this);
                player.petals.petals.forEach(petal => {
                    if (!petal.active) {
                        return;
                    }
                    mob.collideWith(petal, dealMap, hitMap, exertMap, this);
                    petal.collideWith(mob, dealMap, hitMap, exertMap, this);
                });
            });
        });
        for (let i = 0; i < this.mobs.length; i++) {
            for (let j = i + 1; j < this.mobs.length; j++) {
                this.mobs[i].collideWith(this.mobs[j], dealMap, hitMap, exertMap, this);
                this.mobs[j].collideWith(this.mobs[i], dealMap, hitMap, exertMap, this);
            }
        }
        for (let i = 0; i < this.players.length; i++) {
            for (let j = i + 1; j < this.players.length; j++) {
                this.players[i].collideWith(this.players[j], dealMap, hitMap, exertMap, this);
                this.players[j].collideWith(this.players[i], dealMap, hitMap, exertMap, this);
            }
        }
        this.walls.forEach(wall => {
            wall.deal();
        });
        this.mobs.forEach(mob => {
            mob.deal();
        });
        this.players.forEach(player => {
            player.petals.petals.forEach(petal => {
                if (petal.health <= 0) {
                    petal.active = false;
                    setTimeout(() => {
                        petal.health = petal.maxHealth;
                        petal.active = true;
                    }, 1000);
                }
            });
            player.deal();
        });
        this.mobs = this.mobs.filter(mob => mob.health > 0);
        this.players = this.players.filter(player => player.health > 0);
    }
}

module.exports = GameMap;
module.exports.dealMap = dealMap;
module.exports.hitMap = hitMap;
module.exports.exertMap = exertMap;
module.exports.gen = gen;
