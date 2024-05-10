// Supports web.

class Force {
    /**
     * @type {number}
     */
    x;
    /**
     * @type {number}
     */
    y;

    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }

    /**
     * @param {number | Force} x
     * @param {number} y
     */
    constructor(x, y) {
        if (typeof x == "number") {
            this.x = x;
            this.y = y;
        }
        else {
            this.x = x.x;
            this.y = x.y;
        }
    }

    /**
     * @param {Force} force
     */
    assign(force) {
        this.x = force.x;
        this.y = force.y;
        return this;
    }

    /**
     * @param {Force} force
     */
    plus(force) {
        return new Force(this.x + force.x, this.y + force.y);
    }

    /**
     * @param {Force} force
     */
    pluse(force) {
        return this.assign(this.plus(force));
    }

    /**
     * @param {Force} force
     */
    minus(force) {
        return this.plus(force.negate());
    }

    /**
     * @param {Force} force
     */
    min(force) {
        if (this.getlength() <= force.getlength()) {
            return this;
        }
        else {
            return force;
        }
    }

    /**
     * @param {number} m
     */
    mul(m) {
        return new Force(this.x * m, this.y * m);
    }

    negate() {
        return new Force(-this.x, -this.y);
    }

    getlength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * @param {number} len
     */
    setlength(len) {
        if (this.x == 0 && this.y == 0) {
            return this;
        }
        let clen = this.getlength();
        return this.assign(this.mul(len / clen));
    }

    /**
     * @param {Force} force
     */
    equals(force) {
        return force.x == this.x && force.y == this.y;
    }

    /**
     * @param {number} angle rad
     * @param {Force} force
     */
    rotate(angle, force) {
        if (force == undefined) {
            force = new Force(0, 0);
        }
        let { x, y } = this.minus(force);
        return new Force(
            x * Math.cos(angle) + y * Math.sin(angle),
            y * Math.cos(angle) - x * Math.sin(angle)
        ).plus(force);
    }
}

class CollisionBox extends Force {
    /**
     * @type {"r" | "c"}
     */
    type; // "r" or "c"

    // for type "r"

    /**
     * @type {number}
     */
    w;
    /**
     * @type {number}
     */
    h;

    // for type "c"

    /**
     * @type {number}
     */
    r;

    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        if (this.type == "r") {
            yield this.w;
            yield this.h;
        }
        else {
            yield this.r;
        }
    }

    /**
     * @param {"r" | "c"} type
     * @param {number} x
     * @param {number} y
     * @param {number} w or also r for circles
     * @param {number} h
     */
    constructor(type, x, y, w, h) {
        super(x, y);
        this.type = type;

        if (type == "r") {
            this.w = w;
            this.h = h;
        }
        else {
            this.r = w;
        }
    }

    /**
     * @param {CollisionBox} b
     * @returns {Force}
     */
    collide(b) {
        let a = this;
        if (a.type == "c") {
            if (b.type == "c") {
                let d = distance(a, b) - a.r - b.r;
                if (d >= 0) {
                    return new Force(0, 0);
                }
                else {
                    return new Force(this).minus(b).setlength(-d);
                }
            }
            else {
                let l = b.x - b.w / 2, r = b.x + b.w / 2, d = b.y - b.h / 2, u = b.y + b.h / 2;
                if (a.x <= l - a.r || a.x >= r + a.r || a.y < d - a.r || a.y > u + a.r) {
                    return new Force(0, 0);
                }
                let res = new Force(l - a.r - a.x, 0);
                res = res.min(new Force(r + a.r - a.x, 0));
                res = res.min(new Force(0, d - a.r - a.y));
                res = res.min(new Force(0, u + a.r - a.y));
                return res;
            }
        }
        else {
            if (b.type == "c") {
                return b.collide(a).negate();
            }
            else {
                let l = b.x - b.w / 2, r = b.x + b.w / 2, d = b.y - b.h / 2, u = b.y + b.h / 2;
                let res = new Force(Infinity, Infinity);
                if (a.x + a.w / 2 <= l) {
                    return new Force(0, 0);
                }
                else {
                    res = res.min(new Force(l - a.x - a.w / 2, 0));
                }
                if (a.x - a.w / 2 >= r) {
                    return new Force(0, 0);
                }
                else {
                    res = res.min(new Force(r - a.x + a.w / 2, 0));
                }
                if (a.y + a.h / 2 <= d) {
                    return new Force(0, 0);
                }
                else {
                    res = res.min(new Force(0, d - a.y - a.h / 2));
                }
                if (a.y - a.h / 2 >= u) {
                    return new Force(0, 0);
                }
                else {
                    res = res.min(new Force(0, u - a.y + a.h / 2));
                }
                return res;
            }
        }
    }
}

/**
 * @param {Force} a
 * @param {Force} b
 */
function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

CollisionBox.Force = Force;

CollisionBox.distance = distance;

if (typeof module != "undefined") {
    module.exports = CollisionBox;

    module.exports.Force = Force;

    module.exports.distance = distance;
}
