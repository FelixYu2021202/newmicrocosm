const CollisionBox = require("./collisionBox.js");
const Effect = require("./effect.js");

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
     * @type {"enemy" | "friendship" | "player"}
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
    collide(entity) {
        let collision = this.collisionBox.collide(entity.collisionBox);
        if (collision.getlength() > 0 && this.friendship == "player" && entity.friendship == "enemy") {
            debugger;
        }
        if (this.type == "movable") {
            if (entity.type == "ghost") {
                return collision;
            }
            if (entity.type == "static") { // Only this entity moves.
                if (collision.getlength() != 0) {
                    let force = new CollisionBox.Force(collision);
                    this.speed.pluse(force);
                }
            }
            else {
                if (collision.getlength() != 0) {
                    let force = new CollisionBox.Force(collision);
                    force.setlength(Math.max(force.getlength() / 2, 50));
                    this.speed.pluse(force);
                }
            }
            return collision;
        }
        if (this.type == "ghost") {
            if (entity.type != "static") { // otherwise it does not move
                return collision;
            }
            if (collision.getlength() != 0) {
                let force = new CollisionBox.Force(collision);
                this.speed.pluse(force);
            }
            return collision;
        }
        return collision;
    }

    /**
     * @param {Entity} entity
     */
    collideWith(entity, dealMap) {
        let collision = this.collide(entity);
        if (collision.getlength() != 0) {
            if (dealMap[this.friendship][entity.friendship]) {
                this.health -= entity.bodyDamage;
                // if (this.health <= 0) {
                //     if (this.ws) {
                //         this.ws.close(1000);
                //     }
                // }
            }
        }
    }
}

module.exports = Entity;
