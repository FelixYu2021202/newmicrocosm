const CollisionBox = require("./collisionBox.js");
const PlayerData = require("./playerData.js");
const Entity = require("./entity.js");
const Effect = require("./effect.js");
const Excel = require("./excel.js");
const Game = require("./game.js");

const WebSocket = require("ws");

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

    /**
     * @type {Effect}
     */
    effect;

    towards = new CollisionBox.Force(0, 0);

    /**
     * @type {WebSocket}
     */
    #ws;

    get ws() { // readonly
        return this.#ws;
    }

    constructor(name, x, y, ws) {
        super(new CollisionBox("c", x, y, 50), 0.9, "movable");
        this.name = name;
        let pd = PlayerData.get(name);
        this.level = pd.level;
        this.exp = pd.exp;
        this.health = Excel.dat.level[this.level].health;
        this.bodyDamage = Excel.dat.level[this.level].bodyDamage;

        this.effect = new Effect(Excel.dat.level[this.level].effect, Excel.dat.rarity[1]);

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

    checkupgrade() {
        while (this.exp >= Excel.dat.level[this.level + 1].exp) {
            this.exp -= Excel.dat.level[this.level + 1].exp;
            this.health = this.health / Excel.dat.level[this.level].health * Excel.dat.level[this.level + 1].health;
            this.bodyDamage = Excel.dat.level[++this.level].bodyDamage;
            this.effect = new Effect(Excel.dat.level[this.level].effect, Excel.dat.rarity[1]);
        }
    }
}

module.exports = Player;
