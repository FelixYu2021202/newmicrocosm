const CollisionBox = require("./collisionBox.js");
const PlayerData = require("./playerData.js");
const Entity = require("./entity.js");
const Game = require("./game.js");

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

    get ws() { // readonly
        return this.#ws;
    }

    constructor(data, name, x, y, ws) {
        super(new CollisionBox("c", x, y, 50), 0.9, "movable");
        this.name = name;
        let pd = PlayerData.get(name);
        this.level = pd.level;
        this.exp = pd.exp;
        this.health = data.level[this.level].health;
        this.bodyDamage = data.level[this.level].bodyDamage;

        this.effect = new Effect(data.level[this.level].effect, 1);

        this.#ws = ws;
        this.#ws.on("close", () => {
            PlayerData.set(this.name, {
                level: this.level,
                exp: this.exp
            });
        });
        this.registerControl();
    }

    #control = new CollisionBox.Force(0, 0);

    registerControl() {
        let self = this;
        this.ws.on("message", function (data) {
            self.#control.assign(JSON.parse(data));
            self.#control.setlength(self.effect.speed);
        });
    }

    /**
     * @param {Game} game
     */
    move(game) {
        this.collisionBox.pluse(this.#control);
    }
}

module.exports = Player;
