var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

//Default attribute will be false for all user-created rubrics. 
//On initial user creation, we will query for all rubrics with 'default = true'
//and add all those rubrics to the user
var rubricSchema = new Schema({
	'name' : String,
	'cards' : Array,
	'user_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'group_ids':[{
		type: Schema.Types.ObjectId,
		ref: 'groups',
	}],
	'members' : [String],
});

module.exports = mongoose.model('rubric', rubricSchema);
