const CollisionBox = require("./collisionBox.js");
const Effect = require("./effect.js");
const Entity = require("./entity.js");
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

    constructor(data, name, rarity, x, y) {
        super(new CollisionBox("c", x, y, data.mob[name].radius * data.rarity[rarity].size), data.mob[name].friction, data.mob[name].type);
        this.name = name;
        this.health = data.mob[name].health * data.rarity[rarity].health;
        this.bodyDamage = data.mob[name].bodyDamage * data.rarity[rarity].damage;
        this.exp = data.mob[name].exp * data.rarity[rarity].exp;
        this.effect = JSON.parse(data.mob[name].effect);
        this.friendship = data.mob[name].friendship;
        this.mobtype = data.mob[name].mobtype;
        this.rarity = rarity;

        this.effect = new Effect(data.mob[name].effect, rarity);
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
                    while (pl.exp >= Excel.dat.level[pl.level + 1].exp) {
                        pl.exp -= Excel.dat.level[++pl.level].exp;
                    }
                }
            });
        }
    }
}

module.exports = Mob;
