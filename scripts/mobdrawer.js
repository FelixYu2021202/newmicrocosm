if (false) {
    const Player = require("../server/game/player.js");
    const Mob = require("../server/game/mob.js");
    const Petal = require("../server/game/petal.js");
    const { Force } = require("../server/game/collisionBox.js");
    const Game = require("../server/game/game.js");
}

const mobdrawers = {
    /**
     * @param {Mob} mob
     */
    bob(mob, camera) {
        drawer.circle(
            ...drawer.transform(mob.collisionBox, camera),
            "grey"
        );
    },
    /**
     * @param {Mob} mob
     */
    chest(mob, camera) {
        let mc = mob.collisionBox;
        let { x, y, r } = mc;
        r *= 0.9;
        drawer.ctx.lineWidth = r * 0.1 * camera.rate;
        let rot = Date.now() / 1500; // 1.5s a rad
        drawer.line(
            ...drawer.transform(new Force(x - r, y - r).rotate(rot, mc), camera),
            ...drawer.transform(new Force(x + r, y - r).rotate(rot, mc), camera),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x - r, y + r).rotate(rot, mc), camera),
            ...drawer.transform(new Force(x + r, y + r).rotate(rot, mc), camera),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x - r, y - r).rotate(rot, mc), camera),
            ...drawer.transform(new Force(x - r, y + r).rotate(rot, mc), camera),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x + r, y - r).rotate(rot, mc), camera),
            ...drawer.transform(new Force(x + r, y + r).rotate(rot, mc), camera),
            "yellow"
        );
        rot = Date.now() / 3500; // 3.5s a rad
        drawer.line(
            ...drawer.transform(new Force(x - r, y - r).rotate(rot, mc), camera),
            ...drawer.transform(new Force(x + r, y - r).rotate(rot, mc), camera),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x - r, y + r).rotate(rot, mc), camera),
            ...drawer.transform(new Force(x + r, y + r).rotate(rot, mc), camera),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x - r, y - r).rotate(rot, mc), camera),
            ...drawer.transform(new Force(x - r, y + r).rotate(rot, mc), camera),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x + r, y - r).rotate(rot, mc), camera),
            ...drawer.transform(new Force(x + r, y + r).rotate(rot, mc), camera),
            "yellow"
        );
    },
};

/**
 * @param {Mob} mob
 */
const mobdrawer = function (mob, camera) {
    mobdrawers[mob.name](mob, camera);
    let mc = mob.collisionBox;
    drawer.text(drawer.wrapnumber(mob.health),
        ...drawer.transform(new Force(mc.x, mc.y + 15), camera),
        Excel.dat.rarity[mob.rarity].color,
        40 * camera.rate
    );
    drawer.text(mob.name,
        ...drawer.transform(new Force(mc.x, mc.y - mc.r - 10), camera),
        "black",
        40 * camera.rate
    );
    drawer.text(Excel.dat.rarity[mob.rarity].name,
        ...drawer.transform(new Force(mc.x, mc.y + mc.r + 10), camera),
        Excel.dat.rarity[mob.rarity].color,
        40 * camera.rate
    );
}

const petaldrawers = {
    /**
     * @param {Petal} ptl
     */
    protein(ptl, camera) {
        drawer.circle(
            ...drawer.transform(ptl.collisionBox, camera),
            "blue"
        );
    }
}

/**
 * @param {Petal} ptl
 */
const petaldrawer = function (ptl, camera) {
    petaldrawers[ptl.name](ptl, camera);
}

/**
 * @param {Player} pl
 * @param {Force} camera
 * @param {string} game
 */
const playerdrawer = function (pl, camera, game) {
    let pc = pl.collisionBox;
    drawer.circle(
        ...drawer.transform(pc, camera),
        drawerdata.playercolor
    );
    drawer.text(drawer.wrapnumber(pl.health),
        ...drawer.transform(new Force(pc.x, pc.y + 15), camera),
        "black",
        50 * camera.rate
    );
    drawer.text(pl.name,
        ...drawer.transform(new Force(pc.x, pc.y - pc.r - 10), camera),
        "black",
        50 * camera.rate
    );
    if (game == "tag") {
        drawer.text(pl.level == 10001 ? "Catcher" : "Escapee",
            ...drawer.transform(new Force(pc.x, pc.y + pc.r + 30), camera),
            "black",
            50 * camera.rate
        )
    }
    else {
        drawer.text(`Lv. ${pl.level}`,
            ...drawer.transform(new Force(pc.x, pc.y + pc.r + 30), camera),
            "black",
            50 * camera.rate
        );
    }
}
