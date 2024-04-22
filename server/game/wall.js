const CollisionBox = require("./collisionBox");
const Effect = require("./effect");
const Entity = require("./entity");

class Wall extends Entity { // Just a wall.
    role = "wall";
    friendship = "none";
    health = 1e100;
    bodyDamage = 0;

    /**
     * @param {CollisionBox} cb
     */
    constructor(cb) {
        super(cb, 0, "static");
        this.effect = new Effect("{}", Excel.dat.rarity[1]);
    }

    move() { }
}

class FakeWall extends Entity { // Just nothing.
    role = "wall";
    friendship = "none";
    health = 1e100;
    bodyDamage = 0;

    /**
     * @param {CollisionBox} cb
     */
    constructor(cb) {
        super(cb, 0, "static");
        this.effect = new Effect("{}", Excel.dat.rarity[1]);
    }

    move() { }
}

/**
 * @param {("." | "#" | "?")[][]} m
 * @returns {{wall: Wall[], fake: FakeWall[]}}
 */
function buildFromMap(m) {
    let res = {
        wall: [],
        fake: []
    };
    let width = 500;
    for (let x = 0; x < m.length; x++) {
        for (let y = 0; y < m.length; y++) {
            if (m[y][x] == "#") {
                res.wall.push(new Wall(new CollisionBox("r", x * width, y * width, width + 25, width + 25), 0, "static"));
            }
            else if (m[y][x] == "?") {
                res.fake.push(new FakeWall(new CollisionBox("r", x * width, y * width, width + 25, width + 25), 0, "static"));
            }
        }
    }
    return res;
}

module.exports = Wall;

module.exports.buildFromMap = buildFromMap;

module.exports.FakeWall = FakeWall;
