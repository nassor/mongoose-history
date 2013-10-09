var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose-history-test');
// mongoose.set('debug', true);

after(function(done) {
  mongoose.connection.db.dropDatabase();
  done();
});
