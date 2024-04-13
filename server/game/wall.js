const CollisionBox = require("./collisionBox");
const Effect = require("./effect");
const Entity = require("./entity");

class Wall extends Entity { // Just a wall.
    role = "wall";
    friendship = "friend";
    health = 1e100;
    bodyDamage = 0;

    /**
     * @param {CollisionBox} cb
     */
    constructor(cb) {
        super(cb, 0, "static");
        this.effect = new Effect("{}", 1);
    }

    move() { }
}

/**
 * @param {("." | "#")[][]} m
 * @returns {Wall[]}
 */
function buildFromMap(m) {
    let res = [];
    let width = 500;
    for (let x = 0; x < m.length; x++) {
        for (let y = 0; y < m.length; y++) {
            if (m[y][x] == "#") {
                res.push(new Wall(new CollisionBox("r", x * width, y * width, width + 10, width + 10), 0, "static"));
            }
        }
    }
    return res;
}

module.exports = Wall;

module.exports.buildFromMap = buildFromMap;
