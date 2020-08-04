const fetch = require('node-fetch');
const pdfreader = require('pdfreader');
const paperModel = require("../models/paperModel.js");

async function printRows(rows) {
    Object.keys(rows) // => array of y-positions (type: float)
        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
        .forEach(y =>{
            return ((rows[y] || []).join(""));
        });
}

async function getText(file){
    var rows = {};
    let body=[];
    new pdfreader.PdfReader().parseFileItems(file.path, async function(
        err,
        i
    ) {
        if ( (!i) || (i.page)) {
            // end of file, or page
            if(!i){
                rows= {};
            }
            else if(i.page){
                let toPush = await printRows(i.page);
                body.push(toPush);
                rows = {}; // clear rows for next page
            }
        } else if (i.text) {
            // accumulate text items into rows object, per line
            (rows[i.y] = rows[i.y] || []).push(i.text);
        }
    });
    return body;
}
async function buildRaw(data, paper) {
    const buildRaw = new paperModel(paper);
    buildRaw.set({
        "body": await data,
    });
    return buildRaw;
}
async function savePdfText(json) {
    json.save(function (err, paper) {
        if (err) {
            console.log(err);
        }
    });
    return await json;
}
module.exports = {
       getData: async (file, paper) => {
        let data = await getText(file);
        return data;
    }
};