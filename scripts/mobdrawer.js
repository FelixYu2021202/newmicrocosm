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
            (mob.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
            (mob.collisionBox.y - camera.y) * camera.rate + drawer.cv.height / 2,
            (mob.collisionBox.r) * camera.rate,
            drawerdata.playercolor
        );
    },
    /**
     * @param {Mob} mob
     */
    chest(mob, camera) {
        drawer.circle(
            (mob.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
            (mob.collisionBox.y - camera.y) * camera.rate + drawer.cv.height / 2,
            (mob.collisionBox.r) * camera.rate,
            drawerdata.playercolor
        );
    },
};

/**
 * @param {Mob} mob
 */
const mobdrawer = function (mob, camera) {
    mobdrawers[mob.name](mob, camera);
    drawer.text(drawer.wrapnumber(mob.health),
        (mob.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
        (mob.collisionBox.y - camera.y) * camera.rate + drawer.cv.height / 2 + 15 * camera.rate,
        Excel.dat.rarity[mob.rarity].color,
        50 * camera.rate
    );
    drawer.text(mob.name,
        (mob.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
        (mob.collisionBox.y - camera.y - mob.collisionBox.r) * camera.rate + drawer.cv.height / 2 - 10 * camera.rate,
        "black",
        50 * camera.rate
    );
    drawer.text(Excel.dat.rarity[mob.rarity].name,
        (mob.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
        (mob.collisionBox.y - camera.y + mob.collisionBox.r) * camera.rate + drawer.cv.height / 2 + 10 * camera.rate,
        Excel.dat.rarity[mob.rarity].color,
        50 * camera.rate
    )
}

/**
 * @param {Player} pl
 * @param {Force} camera
 * @param {string} game
 */
const playerdrawer = function (pl, camera, game) {
    drawer.circle(
        (pl.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
        (pl.collisionBox.y - camera.y) * camera.rate + drawer.cv.height / 2,
        (pl.collisionBox.r) * camera.rate,
        drawerdata.playercolor
    );
    drawer.text(
        drawer.wrapnumber(pl.health),
        (pl.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
        (pl.collisionBox.y - camera.y) * camera.rate + drawer.cv.height / 2 + 15 * camera.rate,
        "black",
        50 * camera.rate
    );
    drawer.text(
        pl.name,
        (pl.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
        (pl.collisionBox.y - camera.y - pl.collisionBox.r - 10) * camera.rate + drawer.cv.height / 2,
        "black",
        50 * camera.rate
    );
    if (game == "tag") {
        drawer.text(
            pl.level == 101 ? "Catcher" : "Escapee",
            (pl.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
            (pl.collisionBox.y - camera.y + pl.collisionBox.r + 30) * camera.rate + drawer.cv.height / 2,
            "black",
            50 * camera.rate
        )
    }
    else {
        drawer.text(
            `Lv. ${pl.level}`,
            (pl.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
            (pl.collisionBox.y - camera.y + pl.collisionBox.r + 30) * camera.rate + drawer.cv.height / 2,
            "black",
            50 * camera.rate
        );
    }
}
