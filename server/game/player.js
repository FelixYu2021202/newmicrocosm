const CollisionBox = require("./collisionBox.js");
const PlayerData = require("./playerData.js");
const Entity = require("./entity.js");

const WebSocket = require("ws");
const Effect = require("./effect.js");

class Player extends Entity {
    role = "player";

    friendship = "player";

    /**
     * @type {number}
     */
    health;

    /**
     * @type {number}
     */
    bodyDamage;

    /**
     * @type {number}
     */
    level;

    /**
     * @type {number}
     */
    exp;

    /**
     * @type {[]} // TODO
     */
    petals;

    /**
     * @type {string}
     */
    name; // player name

    effect;

    towards = new CollisionBox.Force(0, 0);

    /**
     * @type {WebSocket}
     */
    #ws;

    get ws() {
        return this.#ws;
    }

    set ws(ws) {
        this.#ws = ws;
    }

    constructor(data, name, x, y, ws) {
        super(new CollisionBox("c", x, y, 50), 0.9, "movable");
        this.name = name;
        let pd = PlayerData.get(name);
        PlayerData.set(name, pd);
        this.level = pd.level;
        this.exp = pd.exp;
        this.health = data.level[this.level].health;
        this.bodyDamage = data.level[this.level].bodyDamage;

        this.effect = new Effect(data.level[this.level].effect, 1);

        this.ws = ws;
        this.registerControl();
    }

    #control = new CollisionBox.Force(0, 0);

    registerControl() {
        let self = this;
        this.ws.on("message", function (data) {
            self.#control.assign(JSON.parse(data));
        });
    }

    move() {
        this.collisionBox.pluse(this.#control);
        // console.log(this.#control);
    }
}

module.exports = Player;
