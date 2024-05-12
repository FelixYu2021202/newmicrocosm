const CollisionBox = require("./collisionBox.js");
const Effect = require("./effect.js");
const Game = require("./game.js");

class Entity {
    /**
     * @type {CollisionBox}
     */
    collisionBox;

    /**
     * @type {CollisionBox.Force}
     */
    speed = new CollisionBox.Force(0, 0);

    /**
     * @type {"static" | "movable" | "ghost"}
     */
    type;

    /**
     * @type {number}
     */
    friction;

    /**
     * @type {"wall" | "mob" | "petal" | "player"}
     */
    role;

    /**
     * @type {number}
     */
    health;

    /**
     * @type {number}
     */
    bodyDamage;

    /**
     * @type {"enemy" | "friend" | "player" | "none" | "petal"}
     */
    friendship;

    /**
     * @type {Effect}
     */
    effect;

    /**
     * @param {CollisionBox} cb
     * @param {number} friction
     */
    constructor(cb, friction, type) {
        this.collisionBox = cb;
        this.friction = friction;
        this.type = type;
    }

    deal() {
        this.collisionBox.x += this.speed.x * this.friction;
        this.collisionBox.y += this.speed.y * this.friction;
        this.speed = new CollisionBox.Force(0, 0);
    }

    move() { }

    /**
     * @param {Entity} entity
     */
    collide(entity, dealMap, exertMap) {
        let collision = this.collisionBox.collide(entity.collisionBox);
        if (this.type == "movable") {
            if (entity.type == "ghost") {
                return collision;
            }
            if (entity.type == "static") { // Only this entity moves.
                if (collision.getlength() != 0 && exertMap[this.friendship][entity.friendship].valueOf(this, entity)) {
                    let force = new CollisionBox.Force(collision);
                    this.speed.pluse(force);
                }
            }
            else {
                if (collision.getlength() != 0 && exertMap[this.friendship][entity.friendship].valueOf(this, entity)) {
                    let force = new CollisionBox.Force(collision);
                    let len = force.getlength() / 2;
                    if (dealMap[this.friendship][entity.friendship].valueOf(this, entity)) {
                        force.setlength(Math.max(len, 40));
                    }
                    else {
                        force.setlength(len);
                    }
                    this.speed.pluse(force);
                }
            }
            return collision;
        }
        if (this.type == "ghost") {
            if (entity.type != "static") { // otherwise it does not move
                return collision;
            }
            if (collision.getlength() != 0 && exertMap[this.friendship][entity.friendship].valueOf(this, entity)) {
                let force = new CollisionBox.Force(collision);
                this.speed.pluse(force);
            }
            return collision;
        }
        return collision;
    }

    /**
     * @param {Entity} entity
     * @param {Game} game
     */
    collideWith(entity, dealMap, hitMap, exertMap, game) {
        let collision = this.collide(entity, hitMap, exertMap);
        if (collision.getlength() != 0) {
            if (dealMap[this.friendship][entity.friendship].valueOf(this, entity)) {
                this.health -= entity.bodyDamage;
                if (this.role == "mob") {
                    this.addDamage(entity);
                }
                if (this.health <= 0) {
                    if (this.ws) { // player
                        this.ws.close(1000);
                    }
                    if (this.reward) { // mob
                        this.reward(game);
                    }
                }
            }
        }
    }
}

module.exports = Entity;
