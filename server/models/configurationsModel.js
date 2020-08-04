let mongoose = require('mongoose');
let Schema   = mongoose.Schema;

let configurationsSchema = new Schema({
    'primaryColor' : String,
    'secondaryColor' : String,
    'institutionName': String,
    'oneSearchUrl':String,
    'oneSearchViewId': String,
    'images': {
        name:String,
        contentType:String,
        size: String,
        img: Buffer
    },
});

module.exports = mongoose.model('configurations', configurationsSchema);
