import * as fs from "fs";

function convert(fn: string, ext: string) {
    fs.readFile(`${fn}.${ext}`, (err, data) => {
        if (err) {
            console.error(`File: ${fn}; Load error!`);
        }
        fs.writeFile(`${fn}.${ext}.base64`, `data:image/${ext};base64,${data.toString("base64")}`, Object);
    });
}

convert("../pics/image", "png");