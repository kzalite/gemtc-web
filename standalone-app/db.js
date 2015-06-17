var pg = require('pg');
var logger = require('./logger');

module.exports = function(url) {
  var dbUrl = url;
  return {
    query: function(text, values, callback) {
      pg.connect(dbUrl, function(err, client, done) {
        if (err) {
          logger.error(err);
          callback(err);
          return done();
        }
        var query = client.query(text, values, function(err, result) {
          done();
          callback(err, result);
        });
      });
    }
  };
}
