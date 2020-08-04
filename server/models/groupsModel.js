var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var groupsSchema = new Schema({
	'creator' : String,
	'name' : String,
	'note' : String,
	'members' : [String],
	'pendingMembers': [{
		email:String,
		message: String,
		name: String
	}]
});

module.exports = mongoose.model('groups', groupsSchema);
