var mongoose = require('mongoose'),
Schema   = mongoose.Schema,
history  = require('../../lib/mongoose-history');

var PostSchema = new Schema({
	updatedFor: String,
	title: String,
	tags: [],
	message: String
});


var sortIfArray = function(a) {
	if(Array.isArray(a)) {
		return a.sort();
	}
	return a;
}

var options = {
	diffOnly: true, 
	customDiffAlgo: function(key, newValue, oldValue) {
		var v1 = sortIfArray(oldValue);
		var v2 = sortIfArray(newValue);
		if(String(v1) != String(v2)){
			return {
				diff: newValue
			};
		}
		// no diff should be recorded for this key
		return null;
	}
};

PostSchema.plugin(history,options);
module.exports = mongoose.model('Post_custom_diff', PostSchema);
