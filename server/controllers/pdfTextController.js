const pdfreader = require('pdfreader');

async function readlines(buffer, xwidth) {
    return new Promise((resolve, reject) => {
        let pdftxt = [];
        let pg = 0;
        new pdfreader.PdfReader().parseBuffer(buffer, function(err, item) {
            if (err) console.log("pdf reader error: " + err);
            else if (!item) {
                pdftxt.forEach(function(a, idx) {
                    pdftxt[idx].forEach(function(v, i) {
                        pdftxt[idx][i].splice(1, 2);
                    });
                });
                resolve(pdftxt);
            } else if (item && item.page) {
                pg = item.page - 1;
                pdftxt[pg] = [];
            } else if (item.text) {
                let t = 0;
                let sp = "";
                pdftxt[pg].forEach(function(val, idx) {
                    if (val[1] === item.y) {
                        if (xwidth && item.x - val[2] > xwidth) {
                            sp += " ";
                        } else {
                            sp = "";
                        }
                        pdftxt[pg][idx][0] += sp + item.text;
                        t = 1;
                    }
                });
                if (t === 0) {
                    pdftxt[pg].push([item.text, item.y, item.x]);
                }
            }
        });
    });
}


module.exports ={
    getData: async (buffer) => {
        let lines = await readlines(buffer);
        lines = await JSON.parse(JSON.stringify(lines));
        return lines;
    }
};