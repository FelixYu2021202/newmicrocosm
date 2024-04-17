async function Excel() {
    if (Excel.dat) {
        return dat;
    }
    let dat = await (await fetch("/api/excel")).text();
    return Excel.dat = JSON.parse(dat);
}

Excel();
