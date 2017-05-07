var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/gamesdata-api.sqlite'
});

var db = {};

db.games = sequelize.import(__dirname + '/models/game.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;