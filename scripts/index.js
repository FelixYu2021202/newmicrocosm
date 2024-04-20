if (false) {
    const Entity = require("../server/game/entity");
    const Game = require("../server/game/game");
}

function Camera() {
    return {
        x: this.collisionBox.x,
        y: this.collisionBox.y,
        rate: 1 / this.effect.sight,
    }
}

let ports;

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

            let pages = {
                home() {
                    console.log("home");
                    localStorage.setItem("page", "home");
                    data = { tag: false, login: false };
                    buttons = ["tag", "login"];
                    bcb = {
                        tag() {
                            return gotoPage("tag");
                        },
                        login() {
                            return gotoPage("login");
                        }
                    }
                    return function home() {
                        frames = {};
                        drawer.clear();

                        drawer.backgroundline();

                        drawer.text("New Microcosm", cv.width / 2, 200, "blue", 100);
                        drawer.text(`User: ${user}`, cv.width - drawer.measure(`User: ${user}`, 50) / 2, cv.height - 20, "black", 50);

                        frames.tag = drawer.button("tag", cv.width / 2 - 200, 325, "black", drawerdata.buttons.magenta[data.tag], 40);
                        frames.login = drawer.button("login", cv.width / 2 + 200, 325, "black", drawerdata.buttons.magenta[data.login], 40);

                        currentFrame = requestAnimationFrame(home);
                    }
                },
                login() {
                    console.log("login");
                    data = {};
                    buttons = [];
                    bcb = {};

                    let cuser = prompt("Please enter your username:");
                    let perm = prompt("Please enter your password/permission code:");
                    let permcheck = prompt("Please check your password/permission code:");
                    while (permcheck != perm) {
                        perm = permcheck;
                        permcheck = promt("Please check you password/permission code:");
                    }

                    let logged = 0;

                    $.post({
                        url: "/api/login",
                        data: `{"user":"${cuser}","perm":"${perm}"}`,
                        success(dat) {
                            if (dat == "true") {
                                logged = 2;
                                user = cuser;
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

                        let ws = new WebSocket(`ws://${ports.ip}:${ports.socketPort}?type=GameTag&room=test&player=${user}`);

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

                        let control = {
                            w: false,
                            d: false,
                            s: false,
                            a: false
                        };

                        /**
                         * @param {KeyboardEvent} ev
                         */
                        function keyHandlerDown(ev) {
                            if (ev.key == "d") {
                                control.d = true;
                            }
                            if (ev.key == "s") {
                                control.s = true;
                            }
                            if (ev.key == "a") {
                                control.a = true;
                            }
                            if (ev.key == "w") {
                                control.w = true;
                            }
                        }

                        /**
                         * @param {KeyboardEvent} ev
                         */
                        function keyHandlerUp(ev) {
                            if (ev.key == "a") {
                                control.a = false;
                            }
                            if (ev.key == "w") {
                                control.w = false;
                            }
                            if (ev.key == "d") {
                                control.d = false;
                            }
                            if (ev.key == "s") {
                                control.s = false;
                            }
                        }

                        ws.onopen = function (ev) {
                            addEventListener("keydown", keyHandlerDown);
                            addEventListener("keyup", keyHandlerUp);
                        }

                        ws.onclose = function (ev) {
                            alert("You aborted / died.");
                            removeEventListener("keydown", keyHandlerDown);
                            removeEventListener("keyup", keyHandlerUp);
                            gotoPage("home");
                        }

                        function draw() {
                            if (curdata.open) {
                                let player = curdata.players.find(p => p.name == user);
                                let camera = Camera.call(player);
                                drawer.backgroundline(camera);
                                curdata.walls.forEach(wall => {
                                    drawer.rect(
                                        (wall.collisionBox.x - camera.x - wall.collisionBox.w / 2) * camera.rate + cv.width / 2,
                                        (wall.collisionBox.y - camera.y - wall.collisionBox.h / 2) * camera.rate + cv.height / 2,
                                        (wall.collisionBox.w) * camera.rate,
                                        (wall.collisionBox.h) * camera.rate,
                                        drawerdata.wallcolor
                                    );
                                });
                                curdata.players.forEach(pl => {
                                    playerdrawer(pl, camera);
                                });
                                curdata.mobs.forEach(mob => {
                                    mobdrawer(mob, camera);
                                });
                            }
                        }

                        return function tag() {
                            frames = {};
                            drawer.clear();

                            draw();

                            frames.home = drawer.button("X", 100, 100, "red", drawerdata.buttons.magenta[data.home], 40);

                            if (ws.readyState == ws.OPEN) {
                                ws.send(JSON.stringify({
                                    x: control.d - control.a,
                                    y: control.s - control.w
                                }));
                            }

                            currentFrame = requestAnimationFrame(tag);
                        }
                    }
                    else {
                        return function tag() {
                            gotoPage("login");
                        }
                    }
                },
            }

            let movepaused = false;

            function gotoPage(page) {
                movepaused = true;
                cancelAnimationFrame(currentFrame);
                requestAnimationFrame(pages[page]());
                movepaused = false;
            }

            let page = localStorage.getItem("page");
            if (!page) {
                page = "home";
            }

            gotoPage(page);

            cv.addEventListener("mousemove", ev => {
                if (movepaused) {
                    return;
                }
                let x = ev.clientX - rect.left;
                x = x / innerWidth * drawerdata.windowwidth;
                let y = ev.clientY - rect.top;
                y = y / innerWidth * drawerdata.windowwidth;
                buttons.forEach(val => {
                    if (frames[val].l <= x && x <= frames[val].r && frames[val].u <= y && y <= frames[val].d) {
                        if (!data[val]) {
                            data[val] = true;
                        }
                    }
                    else if (data[val]) {
                        data[val] = false;
                    }
                });
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