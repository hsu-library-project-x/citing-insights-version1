var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperSchema = new Schema({
	'title': String,
	'name': String,
	'body': {},
	'pdf': Buffer,
	'ref_id': String
});

module.exports = mongoose.model('paper', paperSchema);
