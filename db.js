var dbConfig = require('./config').db;

var db = require('nbe-' + dbConfig.type);

module.exports = db(dbConfig.connString);