const EJ = require("exceljs");

const wb = new EJ.Workbook();

/**
 * 
 * @param {EJ.Worksheet} sheet
 */
function parsesheet(sheet) {
    let r = sheet.rowCount;
    let c = sheet.columnCount;
    let book = [];
    for (let i = 1; i <= r; i++) {
        book.push(sheet.getRow(i).values.slice(1));
    }
    let dat = {};
    for (let i = 1; i < r; i++) {
        dat[book[i][0]] = {};
        for (let j = 1; j < c; j++) {
            let pos = book[i][j];
            if (!pos) {
                continue;
            }
            if (pos.result) {
                dat[book[i][0]][book[0][j]] = pos.result;
            }
            else {
                dat[book[i][0]][book[0][j]] = pos;
            }
        }
    }
    return dat;
}

async function load(fn) {
    let res = {
        loaded: true
    };
    let book = await wb.xlsx.readFile(fn);
    for (let key of ["mob", "drop", "level", "rarity", "legacy"]) {
        res[key] = parsesheet(book.getWorksheet(key));
    }
    return res;
}

let dat = {
    loaded: false
};

module.exports = async function requiredata() {
    if (!dat.loaded) {
        dat = await load("./data/test.xlsx");
    }
    return dat;
}
