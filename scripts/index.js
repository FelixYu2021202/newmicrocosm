if (false) {
    const Entity = require("../server/game/entity");
    const Game = require("../server/game/game");
}

function Camera() {
    return {
        x: this.collisionBox.x,
        y: this.collisionBox.y,
        rate: this.effect.rate,
    }
}

function checkUser(user) {
    return user.match(/^[_\w]+$/) && user.length > 2 && user.length < 16;
}

function checkPerm(perm) {
    let includes = 0;
    if (perm.match(/[\!\@\#\$\%\^\&\*\_\+\-\=]/)) {
        includes++;
    }
    if (perm.match(/[\(\)\[\]\{\}\;\'\:\"\,\.\/\?\~\`\\]/)) {
        includes++;
    }
    if (perm.match(/[0-9]/)) {
        includes++;
    }
    if (perm.match(/[a-z]/)) {
        includes++;
    }
    if (perm.match(/[A-Z]/)) {
        includes++;
    }
    return includes > 1 && perm.match(/^[\!\@\#\$\%\^\&\*\_\+\-\=\(\)\[\]\{\}\;\'\:\"\,\.\/\?\~\`\\0-9a-zA-Z]+$/) && perm.length > 5 && perm.length < 41;
}

function queryValidUser(message) {
    let user = prompt(message);
    while (!checkUser(user)) {
        user = prompt(`${message}
A valid username should follow the rules:
- its length is between [3, 15] inclusive.
- it should only include the listed characters below:
  - 0123456789
  - abcdefghijklmnopqrstuvwxyz
  - ABCDEFGHIJKLMNOPQRSTUVWXYZ`);
    }
    return user;
}

function queryValidPerm(message) {
    let perm = prompt(message);
    while (!checkPerm(perm)) {
        perm = prompt(`${message}
A valid perm should follow the rules:
- its length is between [6, 40] inclusive.
- it should include the following types of characters at least two:
  - !@#$%^&*_+-=
  - ()[]{};':",./?~\`\\
  - 0123456789
  - abcdefghijklmnopqrstuvwxyz
  - ABCDEFGHIJKLMNOPQRSTUVWXYZ
- it should only include the listed characters above.`);
    }
    return perm;
}

let ports;

let domain = location.toString().match(/^http:\/\/([^:^/]+)/)[1];

function start() {
    $.get("/ports.json", dat => {
        ports = dat;
    }).then(() => {
        $(() => {
            const cv = document.getElementsByTagName("canvas").item(0);
            const ctx = cv.getContext("2d");
            const rect = cv.getBoundingClientRect();

            drawer.test();
            drawer.init();

            let currentFrame = 0;

            let data = {};
            let frames = {};
            let buttons = [];
            let bcb = {};

            let user = null;
            let cuser = localStorage.getItem("user");
            if (cuser && localStorage.getItem("perm")) {
                let perm = atob(localStorage.getItem("perm"));
                $.post({
                    url: "/api/login",
                    data: `{"user":"${cuser}","perm":"${perm}"}`,
                    success(dat) {
                        if (dat == "true") {
                            user = cuser;
                        }
                    }
                });
            }

            let cserver = "test";

            const pages = {
                chperm() {
                    if (user == null) {
                        alert("Please log in first.");
                        return gotoPage("home");
                    }
                    let perm = queryValidPerm("Please enter your new password/permission code:");
                    let permcheck = queryValidPerm("Please check your new password/permission code:");
                    while (permcheck != perm) {
                        perm = permcheck;
                        permcheck = queryValidPerm("Please check your new password/permission code:");
                    }

                    let changed = 0;

                    $.post({
                        url: "/api/chperm",
                        data: `{"user":"${user}","perm":"${perm}"}`,
                        success(dat) {
                            if (dat == "true") {
                                changed = 2;
                                localStorage.setItem("perm", btoa(perm));
                            }
                            else {
                                changed = 1;
                            }
                            setTimeout(() => {
                                gotoPage("home");
                            }, 1000);
                        }
                    });

                    return function chperm() {
                        frames = {};
                        drawer.clear();

                        drawer.backgroundline();
                        drawer.text("Change Password", cv.width / 2, 200, "black", 100);

                        if (changed == 0) {
                            drawer.text("Changing", cv.width / 2, cv.height / 2, "black", 80);
                        }
                        else if (changed == 2) {
                            drawer.text("Changing succeeded", cv.width / 2, cv.height / 2, "black", 80);
                        }
                        else {
                            drawer.text("Changing failed", cv.width / 2, cv.height / 2, "black", 80);
                        }

                        currentFrame = requestAnimationFrame(chperm);
                    }
                },
                home() {
                    console.log("home");
                    localStorage.setItem("page", "home");
                    data = { tag: false, login: false, chperm: false };
                    buttons = ["tag", "login", "chperm"];
                    bcb = {
                        tag() {
                            return gotoPage("tagStart");
                        },
                        login() {
                            return gotoPage("login");
                        },
                        chperm() {
                            return gotoPage("chperm");
                        }
                    }
                    return function home() {
                        frames = {};
                        drawer.clear();

                        drawer.backgroundline();

                        drawer.text("New Microcosm", cv.width / 2, 200, "blue", 100);
                        drawer.text(`User: ${user}`, cv.width - drawer.measure(`User: ${user}`, 50) / 2, cv.height - 20, "black", 50);

                        frames.tag = drawer.button("tag", cv.width / 2, 325, "black", drawerdata.buttons.magenta[data.tag], 40);

                        frames.login = drawer.button("log in", cv.width / 2 - 200, 500, "black", drawerdata.buttons.magenta[data.login], 40);
                        frames.chperm = drawer.button("change pwd", cv.width / 2 + 200, 500, "black", drawerdata.buttons.magenta[data.chperm], 40);

                        currentFrame = requestAnimationFrame(home);
                    }
                },
                login() {
                    console.log("login");
                    data = {};
                    buttons = [];
                    bcb = {};

                    let cuser = queryValidUser("Please enter your username:");
                    let perm = queryValidPerm("Please enter your password/permission code:");
                    let permcheck = queryValidPerm("Please check your password/permission code:");
                    while (permcheck != perm) {
                        perm = permcheck;
                        permcheck = queryValidPerm("Please check your password/permission code:");
                    }

                    let logged = 0;

                    $.post({
                        url: "/api/login",
                        data: `{"user":"${cuser}","perm":"${perm}"}`,
                        success(dat) {
                            if (dat == "true") {
                                logged = 2;
                                user = cuser;
                                localStorage.setItem("user", user);
                                localStorage.setItem("perm", btoa(perm));
                            }
                            else {
                                logged = 1;
                            }
                            setTimeout(() => {
                                gotoPage("home");
                            }, 1000);
                        }
                    });

                    return function login() {
                        frames = {};
                        drawer.clear();

                        drawer.backgroundline();
                        drawer.text("Log in", cv.width / 2, 200, "black", 100);

                        if (logged == 0) {
                            drawer.text("Logging in", cv.width / 2, cv.height / 2, "black", 80);
                        }
                        else if (logged == 1) {
                            drawer.text("Logging failed", cv.width / 2, cv.height / 2, "black", 80);
                        }
                        else {
                            drawer.text("Logging succeeded", cv.width / 2, cv.height / 2, "black", 80);
                        }

                        currentFrame = requestAnimationFrame(login);
                    }
                },
                tag() {
                    if (user != null) {
                        console.log("tag");
                        localStorage.setItem("page", "tag");
                        data = { home: false };
                        buttons = ["home"];

                        let ws = new WebSocket(`ws://${domain}:${ports.socketPort}?type=GameTag&room=${cserver}&player=${user}`);

                        bcb = {
                            home() {
                                ws.close(1000);
                            }
                        };

                        /**
                         * @type {Game}
                         */
                        let curdata = {
                            open: false
                        };

                        ws.onmessage = function (ev) {
                            curdata = JSON.parse(ev.data);
                            let dat = JSON.parse(ev.data);
                            if (dat.type == "game") {
                                curdata = dat.curdata;
                            }
                        }

                        /**
                         * @param {MouseEvent} ev
                         */
                        function mouseHandler(ev) {
                            let x = ev.clientX - rect.left - innerWidth / 2;
                            let y = ev.clientY - rect.top - innerHeight / 2;
                            if (ws.readyState == ws.OPEN) {
                                ws.send(JSON.stringify({
                                    x: x / innerWidth * drawerdata.windowwidth,
                                    y: y / innerWidth * drawerdata.windowwidth
                                }));
                            }
                        }

                        ws.onopen = function (ev) {
                            addEventListener("mousemove", mouseHandler);
                        }

                        ws.onclose = function (ev) {
                            removeEventListener("mousemove", mouseHandler);
                            setTimeout(() => {
                                gotoPage("tagStart");
                            }, 200);
                        }

                        function draw() {
                            if (curdata.open) {
                                let player = curdata.players.find(p => p.name == user);
                                let camera = Camera.call(player);
                                drawer.backgroundline(camera);
                                curdata.players.forEach(pl => {
                                    playerdrawer(pl, camera, curdata.tid);
                                });
                                curdata.mobs.forEach(mob => {
                                    mobdrawer(mob, camera);
                                });
                                curdata.fakes.forEach(wall => {
                                    drawer.rect(
                                        (wall.collisionBox.x - camera.x - wall.collisionBox.w / 2) * camera.rate + cv.width / 2,
                                        (wall.collisionBox.y - camera.y - wall.collisionBox.h / 2) * camera.rate + cv.height / 2,
                                        (wall.collisionBox.w) * camera.rate,
                                        (wall.collisionBox.h) * camera.rate,
                                        drawerdata.fakewallcolor
                                    );
                                });
                                curdata.walls.forEach(wall => {
                                    drawer.rect(
                                        (wall.collisionBox.x - camera.x - wall.collisionBox.w / 2) * camera.rate + cv.width / 2,
                                        (wall.collisionBox.y - camera.y - wall.collisionBox.h / 2) * camera.rate + cv.height / 2,
                                        (wall.collisionBox.w) * camera.rate,
                                        (wall.collisionBox.h) * camera.rate,
                                        drawerdata.wallcolor
                                    );
                                });
                                drawer.roundRect(cv.width - 600, cv.height - 75, 600, 50, "black");
                                drawer.roundRect(cv.width - 590, cv.height - 70, 580 * player.exp / Excel.dat.level[player.level + 1].exp, 40, "yellow");
                                drawer.text(`Lv. ${player.level}: ${drawer.wrapnumber(player.exp)} / ${drawer.wrapnumber(Excel.dat.level[player.level + 1].exp)}`, cv.width - 300, cv.height - 40, "grey", 30);
                            }
                        }

                        return function tag() {
                            frames = {};
                            drawer.clear();

                            draw();

                            frames.home = drawer.button("X", 100, 100, "red", drawerdata.buttons.magenta[data.home], 40);

                            currentFrame = requestAnimationFrame(tag);
                        }
                    }
                    else {
                        return function tag() {
                            gotoPage("login");
                        }
                    }
                },
                tagStart() {
                    console.log("tagStart");
                    data = { tag: false, home: false, chserver: false };
                    buttons = ["tag", "home", "chserver"];
                    bcb = {
                        tag() {
                            return gotoPage("tag");
                        },
                        login() {
                            return gotoPage("login");
                        },
                        chserver() {
                            cserver = prompt("Please enter server name:");
                        }
                    }
                    return function tagStart() {
                        frames = {};
                        drawer.clear();

                        drawer.backgroundline();

                        drawer.text("New Microcosm", cv.width / 2, 200, "blue", 100);
                        drawer.text("Tag", cv.width / 2, 350, "black", 80);
                        drawer.text(`Server: ${cserver}`, cv.width / 2, 500, "black", 50);
                        drawer.text(`User: ${user}`, cv.width - drawer.measure(`User: ${user}`, 50) / 2, cv.height - 20, "black", 50);

                        frames.tag = drawer.button("start", cv.width / 2, 650, "black", drawerdata.buttons.magenta[data.tag], 40);

                        frames.home = drawer.button("X", 100, 100, "red", drawerdata.buttons.magenta[data.home], 40);
                        frames.chserver = drawer.button("Change server", cv.width / 2, 800, "black", drawerdata.buttons.magenta[data.chserver], 40);

                        currentFrame = requestAnimationFrame(tagStart);
                    }
                }
            }

            let movepaused = false;

            function gotoPage(page) {
                movepaused = true;
                cancelAnimationFrame(currentFrame);
                requestAnimationFrame(pages[page]());
                movepaused = false;
            }

            let page = "home";

            gotoPage(page);

            cv.addEventListener("mousemove", ev => {
                if (movepaused) {
                    return;
                }
                let x = ev.clientX - rect.left;
                x = x / innerWidth * drawerdata.windowwidth;
                let y = ev.clientY - rect.top;
                y = y / innerWidth * drawerdata.windowwidth;
                let on = false;
                buttons.forEach(val => {
                    if (movepaused) {
                        return;
                    }
                    if (frames[val].l <= x && x <= frames[val].r && frames[val].u <= y && y <= frames[val].d) {
                        if (!data[val]) {
                            data[val] = true;
                        }
                        on = true;
                    }
                    else if (data[val]) {
                        data[val] = false;
                    }
                });
                if (on) {
                    cv.style.cursor = "pointer";
                }
                else {
                    cv.style.cursor = "default";
                }
            });

            cv.addEventListener("click", ev => {
                let x = ev.clientX - rect.left;
                x = x / innerWidth * drawerdata.windowwidth;
                let y = ev.clientY - rect.top;
                y = y / innerWidth * drawerdata.windowwidth;
                buttons.forEach(val => {
                    if (frames[val].l <= x && x <= frames[val].r && frames[val].u <= y && y <= frames[val].d) {
                        bcb[val]();
                    }
                });
            });

        });
    });
}