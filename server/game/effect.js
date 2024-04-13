const Excel = require("./excelparser");
const { Force } = require("./collisionBox");

class Effect {
    sight = 1;

    constructor(json, rarity) {
        let data = JSON.parse(json);
        Excel().then((dat) => {
            if (data.sight) {
                sight = data.sight * dat.rarity[rarity].effect;
            }
        });
    }
}

class Camera extends Force {
    rate = 1;
}

module.exports = Effect;
module.exports.Camera = Camera;