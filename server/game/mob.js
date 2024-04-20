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
        this.exp = data.mob[name].exp;
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
            dis.setlength(50);
            this.speed.pluse(dis);
        }
    }
}

module.exports = Mob;
