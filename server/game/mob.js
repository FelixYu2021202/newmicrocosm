const CollisionBox = require("./collisionBox.js");
const Effect = require("./effect.js");
const Entity = require("./entity.js");
const Excel = require("./excel.js");
const Game = require("./game.js");

class Mob extends Entity {
    role = "mob";

    /**
     * @type {"enemy" | "friend" | "player"}
     */
    friendship;

    /**
     * @type {"passive" | "aggressive"}
     */
    mobtype;

    //---

    /**
     * real exp is counted as `exp * expMultiplier(rairty)`
     * @type {number}
     */
    exp;

    /**
     * @type {number}
     */
    rarity;

    /**
     * @type {string}
     */
    name;

    constructor(name, rarity, x, y) {
        super(new CollisionBox("c", x, y, Excel.dat.mob[name].radius * Excel.dat.rarity[rarity].size), Excel.dat.mob[name].friction, Excel.dat.mob[name].type);
        this.name = name;
        this.health = Excel.dat.mob[name].health * Excel.dat.rarity[rarity].health;
        this.bodyDamage = Excel.dat.mob[name].bodyDamage * Excel.dat.rarity[rarity].damage;
        this.exp = Excel.dat.mob[name].exp * Excel.dat.rarity[rarity].exp;
        this.effect = JSON.parse(Excel.dat.mob[name].effect);
        this.friendship = Excel.dat.mob[name].friendship;
        this.mobtype = Excel.dat.mob[name].mobtype;
        this.rarity = rarity;

        this.effect = new Effect(Excel.dat.mob[name].effect, Excel.dat.rarity[rarity]);
    }

    /**
     * @param {Game} game
     */
    move(game) {
        if (this.mobtype == "aggressive") {
            let dis = new CollisionBox.Force(Infinity, Infinity);
            let self = this;
            game.players.forEach(pl => {
                dis = dis.min(pl.collisionBox.minus(self.collisionBox));
            });
            dis.setlength(22);
            this.speed.pluse(dis);
        }
    }

    playerdealts = {};

    /**
     * @param {Entity} entity
     */
    addDamage(entity) {
        if (entity.role == "player") { // body damage
            if (this.playerdealts[entity.name] == undefined) {
                this.playerdealts[entity.name] = 0;
            }
            this.playerdealts[entity.name] += entity.bodyDamage;
        }
    }

    /**
     * @param {Game} game
     */
    reward(game) {
        let dealts = [];
        for (let pl in this.playerdealts) {
            dealts.push({
                dmg: this.playerdealts[pl],
                pl
            });
        }
        dealts = dealts.sort((a, b) => a.dmg - b.dmg);
        for (let i = 0; i < Math.min(4, dealts.length); i++) {
            game.players.forEach(pl => {
                if (pl.name == dealts[i].pl) {
                    pl.exp += this.exp;
                    pl.checkupgrade();
                }
            });
        }
    }
}

module.exports = Mob;
