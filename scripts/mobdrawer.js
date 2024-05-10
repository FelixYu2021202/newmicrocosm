if (false) {
    const Player = require("../server/game/player.js");
    const Mob = require("../server/game/mob.js");
    const { Force } = require("../server/game/collisionBox.js");
    const Game = require("../server/game/game.js");
}

const mobdrawers = {

    /**
     * @param {Mob} mob
     */
    bob(mob, camera) {
        drawer.circle(
            ...drawer.transform(new Force(mob.collisionBox)),
            "grey"
        );
    },
    /**
     * @param {Mob} mob
     */
    chest(mob, camera) {
        let { x, y, r } = mob.collisionBox;
        r *= 0.9;
        let s2 = Math.sqrt(2);
        drawer.ctx.lineWidth = r * 0.1 * camera.rate;
        drawer.line(
            ...drawer.transform(new Force(x - r, y - r)),
            ...drawer.transform(new Force(x + r, y - r)),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x - r, y + r)),
            ...drawer.transform(new Force(x + r, y + r)),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x - r, y - r)),
            ...drawer.transform(new Force(x - r, y + r)),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x + r, y - r)),
            ...drawer.transform(new Force(x + r, y + r)),
            "yellow"
        );
        r *= s2;
        drawer.line(
            ...drawer.transform(new Force(x - r, y)),
            ...drawer.transform(new Force(x, y - r)),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x + r, y)),
            ...drawer.transform(new Force(x, y - r)),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x - r, y)),
            ...drawer.transform(new Force(x, y + r)),
            "yellow"
        );
        drawer.line(
            ...drawer.transform(new Force(x + r, y)),
            ...drawer.transform(new Force(x, y + r)),
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
        ...drawer.transform(new Force(mc.x, mc.y + 15)),
        Excel.dat.rarity[mob.rarity].color,
        40 * camera.rate
    );
    drawer.text(mob.name,
        ...drawer.transform(new Force(mc.x, mc.y - mc.r - 10)),
        "black",
        40 * camera.rate
    );
    drawer.text(Excel.dat.rarity[mob.rarity].name,
        ...drawer.transform(new Force(mc.x, mc.y + mc.r + 10)),
        Excel.dat.rarity[mob.rarity].color,
        40 * camera.rate
    )
}

/**
 * @param {Player} pl
 * @param {Force} camera
 * @param {string} game
 */
const playerdrawer = function (pl, camera, game) {
    let pc = pl.collisionBox;
    drawer.circle(
        ...drawer.transform(pc),
        drawerdata.playercolor
    );
    drawer.text(drawer.wrapnumber(pl.health),
        ...drawer.transform(new Force(pc.x, pc.y + 15)),
        "black",
        50 * camera.rate
    );
    drawer.text(pl.name,
        ...drawer.transform(new Force(pc.x, pc.y - pc.r - 10)),
        "black",
        50 * camera.rate
    );
    if (game == "tag") {
        drawer.text(pl.level == 10001 ? "Catcher" : "Escapee",
            ...drawer.transform(new Force(pc.x, pc.y + pc.r + 30)),
            "black",
            50 * camera.rate
        )
    }
    else {
        drawer.text(`Lv. ${pl.level}`,
            ...drawer.transform(new Force(pc.x, pc.y + pc.r + 30)),
            "black",
            50 * camera.rate
        );
    }
}
