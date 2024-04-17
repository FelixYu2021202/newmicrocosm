// Supports web

if (typeof Excel == "undefined") {
    global.Excel = require("./excel.js");
}

class Effect {
    sight = 1; // these are default settings
    speed = 22;
    rate = 1;

    constructor(json, rarity) {
        let data = JSON.parse(json);
        Excel().then((dat) => {
            if (data.sight) {
                this.sight = data.sight * dat.rarity[rarity].effect;
                this.rate = 1 / this.sight;
            }
            if (data.speed) {
                this.speed = data.speed;
            }
        });
    }
}

if (typeof module != "undefined") {
    module.exports = Effect;
}