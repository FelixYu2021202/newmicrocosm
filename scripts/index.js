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
    $.get("/ports.json", (dat) => {
        ports = JSON.parse(dat);
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

            let user = prompt("Please enter user name:");

            let pages = {
                home() {
                    console.log("home");
                    localStorage.setItem("page", "home");
                    data = { legacy: false, siege: false };
                    buttons = ["legacy", "siege"];
                    bcb = {
                        legacy() {
                            return gotoPage("legacy");
                        },
                        siege() {
                            return gotoPage("siege");
                        }
                    }
                    return function home() {
                        frames = {};
                        drawer.clear();

                        drawer.backgroundline();

                        drawer.text("New Microcosm", cv.width / 2, 200, "blue", 100);

                        frames.legacy = drawer.button("legacy", cv.width / 2 - 200, 325, "black", drawerdata.buttons.magenta[data.legacy], 40);
                        frames.siege = drawer.button("siege", cv.width / 2 + 200, 325, "black", drawerdata.buttons.magenta[data.siege], 40);

                        currentFrame = requestAnimationFrame(home);
                    }
                },
                legacy() {
                    console.log("legacy");
                    localStorage.setItem("page", "legacy");
                    data = { home: false };
                    buttons = ["home"];

                    let ws = new WebSocket(`ws://${ports.ip}:${ports.socketPort}?type=GameLegacy&room=test&player=${user}`);

                    bcb = {
                        home() {
                            ws.close(1000);
                            return gotoPage("home");
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
                        removeEventListener("keydown", keyHandlerDown);
                        removeEventListener("keyup", keyHandlerUp);
                    }

                    function draw() {
                        if (curdata.open) {
                            let player = curdata.players.find(p => p.name == user);
                            let camera = Camera.call(player);
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
                                drawer.circle(
                                    (pl.collisionBox.x - camera.x) * camera.rate + cv.width / 2,
                                    (pl.collisionBox.y - camera.y) * camera.rate + cv.height / 2,
                                    (pl.collisionBox.r) * camera.rate,
                                    drawerdata.playercolor
                                );
                                drawer.text(
                                    drawer.wrapnumber(pl.health),
                                    (pl.collisionBox.x - camera.x) * camera.rate + cv.width / 2,
                                    (pl.collisionBox.y - camera.y) * camera.rate + cv.height / 2 + 15,
                                    "black",
                                    50
                                );
                                drawer.text(
                                    pl.name,
                                    (pl.collisionBox.x - camera.x) * camera.rate + cv.width / 2,
                                    (pl.collisionBox.y - camera.y - pl.collisionBox.r + 20) * camera.rate + cv.height / 2,
                                    "black",
                                    50
                                );
                            });
                            curdata.mobs.forEach(mob => {
                                mobdrawer(mob, camera);
                            });
                        }
                    }

                    return function legacy() {
                        frames = {};
                        drawer.clear();

                        drawer.backgroundline();

                        draw();

                        frames.home = drawer.button("X", 100, 100, "red", drawerdata.buttons.magenta[data.home], 40);

                        if (ws.readyState == ws.OPEN) {
                            ws.send(JSON.stringify({
                                x: 15 * (control.d - control.a),
                                y: 15 * (control.s - control.w)
                            }));
                        }

                        currentFrame = requestAnimationFrame(legacy);
                    }
                },
                siege() {
                    console.log("siege");
                    localStorage.setItem("page", "siege");
                    return function siege() {
                        alert("Under Construction!");
                        gotoPage("home");
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