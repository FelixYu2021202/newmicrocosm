async function Excel() {
    let dat = await (await fetch("/api/excel")).text();
    return JSON.parse(dat);
}

Excel().then(dat => {
    Excel.dat = dat;
});
