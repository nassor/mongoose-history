var mongoose = require('mongoose');

var connectionUri = process.env.CONNECTION_URI || 'mongodb://localhost/mongoose-history-test';
mongoose.connect(connectionUri);

var secondConnectionUri = process.env.SECONDARY_CONNECTION_URI || 'mongodb://localhost/mongoose-history-test-second';
var secondConn = mongoose.createConnection(secondConnectionUri);
// mongoose.set('debug', true);

after(function(done) {
  mongoose.connection.db.dropDatabase();
  secondConn.db.dropDatabase();
  done();
});
