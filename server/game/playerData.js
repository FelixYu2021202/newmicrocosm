const fs = require("fs");

let pldata = JSON.parse(fs.readFileSync("./data/playerdata.json", "utf-8"));
let plperm = JSON.parse(fs.readFileSync("./data/playerperm.json", "utf-8"));

function create() {
    return {
        level: 0,
        exp: 0,
    };
}

function copy(obj) {
    if (typeof obj == "object") {
        let res = {};
        for (let key in obj) {
            res[key] = copy(obj[key]);
        }
        return res;
    }
    return obj;
}

function login(player, perm) {
    if (typeof plperm.player_perms[player] == "undefined") {
        let ds = plperm.default_settings;
        for (let tp in ds) {
            if (ds[tp].perm == btoa(perm)) {
                pldata[player] = copy(ds[tp].template);
                plperm.player_perms[player] = btoa(perm);
                fs.writeFile("./data/playerdata.json", JSON.stringify(pldata), "utf-8", Object);
                fs.writeFile("./data/playerperm.json", JSON.stringify(plperm), "utf-8", Object);
                return true;
            }
        }
        pldata[player] = create();
        plperm.player_perms[player] = btoa(perm);
        fs.writeFile("./data/playerdata.json", JSON.stringify(pldata), "utf-8", Object);
        fs.writeFile("./data/playerperm.json", JSON.stringify(plperm), "utf-8", Object);
        return true;
    }
    if (plperm.player_perms[player] != btoa(perm)) {
        return false;
    }
    return true;
}

function get(player) {
    return pldata[player];
}

function set(player, data) {
    pldata[player] = data;
    fs.writeFile("./data/playerdata.json", JSON.stringify(pldata), "utf-8", Object);
}

module.exports = {
    login,
    get,
    set,
};
