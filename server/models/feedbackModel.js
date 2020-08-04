var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var feedbackSchema = new Schema({
	'message' : String,
	'email' : String
});

module.exports = mongoose.model('feedback', feedbackSchema);
