var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose-history-test');
var secondConn = mongoose.createConnection('mongodb://localhost/mongoose-history-test-second');
// mongoose.set('debug', true);

after(function(done) {
  mongoose.connection.db.dropDatabase();
  secondConn.db.dropDatabase();
  done();
});
