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
    for (let key of ["mob", "drop", "level", "rarity", "tag", "petal"]) {
        res[key] = parsesheet(book.getWorksheet(key));
    }
    return res;
}

const Excel = {};

load("./data/test.xlsx").then(dat => {
    Excel.dat = dat;
});

module.exports = Excel;
