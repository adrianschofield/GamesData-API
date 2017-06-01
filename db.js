var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize; 

if (env === 'production'){
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/gamesdata-api.sqlite'
    });
}



var db = {};

db.games = sequelize.import(__dirname + '/models/game.js');
db.users = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.games.belongsTo(db.users);
db.users.hasMany(db.games);


module.exports = db;