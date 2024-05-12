const CollisionBox = require("./collisionBox.js");
const PlayerData = require("./playerData.js");
const Entity = require("./entity.js");
const Effect = require("./effect.js");
const Excel = require("./excel.js");
const Petal = require("./petal.js");
const Game = require("./game.js");

const WebSocket = require("ws");

class PetalManager {
    /**
     * @type {Petal[]}
     */
    petals = [];

    /**
     * @type {string}
     */
    name;

    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }

    setpetal() {
        for (let i = 0; i < 10; i++) {
            this.petals.push(new Petal("protein", 2, this.name));
            setTimeout(() => {
                this.petals[i].active = true;
            }, 1000);
        }
    }

    /**
     * @param {CollisionBox.Force} force
     */
    move(force) {
        // set range: 250
        // round speed: 3 rad
        let dif = new CollisionBox.Force(250, 0).rotate((Date.now() / 333));
        for (let i = 0; i < 10; i++) {
            this.petals[i].collisionBox.assign(force.plus(dif));
            dif.assign(dif.rotate(Math.TAU / 10));
        }
    }
}

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
     * @type {PetalManager} // TODO
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
        this.petals = new PetalManager(name);
        this.petals.setpetal();

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
            self.#control.setlength(Math.max(Math.min(self.effect.speed, self.#control.getlength() * 0.8 - 20), 0));
        });
    }

    /**
     * @param {Game} game
     */
    move(game) {
        this.collisionBox.pluse(this.#control);
        this.petals.move(this.collisionBox);
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
