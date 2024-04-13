if (false) {
    const Mob = require("../server/game/mob.js");
}

const mobdrawers = {

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
        (mob.collisionBox.y - camera.y) * camera.rate + drawer.cv.height / 2 + 15,
        Excel.dat.rarity[mob.rarity].color,
        50
    );
    drawer.text(mob.name,
        (mob.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
        (mob.collisionBox.y - camera.y - mob.collisionBox.r) * camera.rate + drawer.cv.height / 2 - 10,
        "black",
        50
    );
    drawer.text(Excel.dat.rarity[mob.rarity].name,
        (mob.collisionBox.x - camera.x) * camera.rate + drawer.cv.width / 2,
        (mob.collisionBox.y - camera.y + mob.collisionBox.r) * camera.rate + drawer.cv.height / 2 + 10,
        Excel.dat.rarity[mob.rarity].color,
        50
    )
}
