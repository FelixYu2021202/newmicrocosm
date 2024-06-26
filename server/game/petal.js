const CollisionBox = require("./collisionBox.js");
const Effect = require("./effect.js");
const Entity = require("./entity.js");
const Excel = require("./excel.js");
const Game = require("./game.js");

class Petal extends Entity {
    role = "petal";

    /**
     * @type {"enemy" | "friend" | "player" | "none" | "petal"}
     */
    friendship = "petal";

    //---

    /**
     * @type {number}
     */
    maxHealth;

    /**
     * @type {number}
     */
    rarity;

    /**
     * @type {string}
     */
    name;

    /**
     * @type {string}
     */
    owner;

    /**
     * @type {boolean}
     */
    active;

    constructor(name, rarity, owner) { // its position should be assigned by the player directly
        super(new CollisionBox("c", 0, 0, Excel.dat.petal[name].radius), 1, "movable");
        this.name = name;
        this.maxHealth = this.health = Excel.dat.petal[name].health * Excel.dat.rarity[rarity].petal;
        this.bodyDamage = Excel.dat.petal[name].bodyDamage * Excel.dat.rarity[rarity].petal;
        this.rarity = rarity;
        this.owner = owner;

        this.effect = new Effect(Excel.dat.petal[name].effect, Excel.dat.rarity[rarity]);
    }
}

module.exports = Petal;
