class Vec2 {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vec4 {
    /**
     * @param {number} l
     * @param {number} u
     * @param {number} r
     * @param {number} d
     */
    constructor(l, u, r, d) {
        this.l = l;
        this.u = u;
        this.r = r;
        this.d = d;
    }
}

const drawer = {

    /**
     * @type {HTMLCanvasElement}
     */
    cv: null,
    /**
     * @type {CanvasRenderingContext2D}
     */
    ctx: null,

    backgroundline() {
        this.ctx.lineWidth = drawerdata.backgroundlinewidth;
        this.ctx.strokeStyle = drawerdata.backgroundlinecolor;
        for (let i = drawerdata.backgroundlinespace; i < this.cv.height; i += drawerdata.backgroundlinespace) {
            this.line(0, i, this.cv.width, i);
        }
        for (let i = drawerdata.backgroundlinespace; i < this.cv.width; i += drawerdata.backgroundlinespace) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.cv.height);
            this.ctx.stroke();
        }
    },

    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {string} color
     * @param {string} bgcolor
     * @param {number} size
     */
    button(text, x, y, color, bgcolor, size) {
        this.ctx.fillStyle = bgcolor;

        let siz = this.measure(text, size);

        let rp = new Vec4(x - siz / 2 - drawerdata.buttonpaddingx,
            y - size - drawerdata.buttonpaddingy,
            x + siz / 2 + drawerdata.buttonpaddingx,
            y + drawerdata.buttonpaddingy,
        );

        this.ctx.beginPath();
        this.ctx.roundRect(rp.l, rp.u, rp.r - rp.l, rp.d - rp.u, drawerdata.buttonradius);
        this.ctx.fill();

        this.text(text, x, y - 5, color, size);
        return rp;
    },

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} r
     * @param {string} color
     */
    circle(x, y, r, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fill();
    },

    clear() {
        this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    },

    init() {
        this.cv = document.getElementsByTagName("canvas").item(0);
        this.ctx = this.cv.getContext("2d");
        let resize = () => {
            this.cv.width = drawerdata.windowwidth; // adjust
            this.cv.height = drawerdata.windowwidth / innerWidth * innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);
    },

    /**
     * @param {number} x1
     * @param {number} x2
     * @param {number} y1
     * @param {number} y2
     */
    line(x1, y1, x2, y2, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    },

    /**
     * @param {string} text
     * @param {number} size
     */
    measure(text, size) {
        this.ctx.font = `${size}px ${drawerdata.font}`;
        return this.ctx.measureText(text).width;
    },

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} y
     * @param {string} color
     */
    rect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    },

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} y
     * @param {string} color
     */
    roundRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, w, h, drawerdata.buttonradius);
        this.ctx.fill();
    },

    test() {
        console.log("drawer loaded");
    },

    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {string} color
     * @param {number} size
     */
    text(text, x, y, color, size) {
        this.ctx.font = `${size}px ${drawerdata.font}`;
        this.ctx.fillStyle = color;
        let siz = this.ctx.measureText(text);
        this.ctx.fillText(text, x - siz.width / 2, y);
    },

    /**
     * @param {number} val
     */
    wrapnumber(val) {
        if (val < 0) {
            return `-${this.wrapnumber(-val)}`;
        }
        if (val > 1e15) {
            return `${Math.floor(val / 1e15)}Q`;
        }
        if (val > 1e12) {
            return `${Math.floor(val / 1e12)}T`;
        }
        if (val > 1e9) {
            return `${Math.floor(val / 1e9)}B`;
        }
        if (val > 1e6) {
            return `${Math.floor(val / 1e6)}M`;
        }
        if (val > 1e3) {
            return `${Math.floor(val / 1e3)}K`;
        }
        return `${Math.floor(val)}`;
    },
};
