import * as fs from "fs";

export function load(base: string, fn: string) {
    fetch(`${base}/${fn}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "if-range": "\"15D32BB5532E3DBDCC9A6CC1FF6A541B-188\"",
            "priority": "i",
            "range": "bytes=5242880-480949550",
            "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "video",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-origin",
            "Referer": `${base}/${fn}`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }).then(p => {
        console.log("fetched");
        return p.arrayBuffer();
    }).then(val => {
        console.log("processed");
        return fs.promises.writeFile(`./${fn}`, Buffer.from(val))
    }).then(() => {
        console.log("succeeded");
    }).catch(() => {
        console.log("failed");
    });
}
