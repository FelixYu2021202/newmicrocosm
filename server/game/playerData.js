const fs = require("fs");

let pldata = JSON.parse(fs.readFileSync("./data/playerdata.json", "utf-8"));

function create() {
    return {
        level: 0,
        exp: 0,
    };
}

function get(player) {
    if (!pldata[player]) {
        pldata[player] = create();
    }
    return pldata[player];
}

function set(player, data) {
    pldata[player] = data;
    fs.writeFile("./data/playerdata.json", JSON.stringify(pldata), "utf-8", Object);
}

module.exports = {
    get,
    set
};
