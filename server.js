var express =require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

app.use(bodyParser.json());

var games = [{
    id: 1,
    name: 'Skyrim',
    platfrom: 'Xbox',
    timePlayed: 45,
    hoursPlayed: 0,
    minsPlayed: 45,
    like: true,
    current: false,
    completed: false,
    finished: false
}, {
    id: 2,
    name: 'Planet Coaster',
    platfrom: 'PC',
    timePlayed: 165,
    hoursPlayed: 2,
    minsPlayed: 45,
    like: true,
    current: true,
    completed: false,
    finished: false
}];
var gameNextId = 3;

app.get('/', function(req, res, next){
    res.send('GamesData API root');
});

//GET /games

app.get('/games', function(req, res, next) {
    res.json(games);
});
//GET /games/:id
app.get('/games/:id', function (req, res, next) {
    var gamesId = parseInt(req.params.id, 10);
    var matchedGame = _.findWhere(games, {id: gamesId});

    if(matchedGame) {
        res.json(matchedGame);
    } else {
        res.status(404).send();
    }
    
});

//POST /games
app.post('/games', function (req, res, next) {
    var body = _.pick(req.body, 'name', 'platform', 'timePlayed');
    body.hours = Math.floor(body.timePlayed / 60);
    body.minutes = body.timePlayed % 60;

    db.games.create(body).then(function (game) {
        res.json(game.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
    
});

//DELETE /games/:id

//PUT /games/:id

app.put('/games/:id', function (req, res, next) {
    var body = _.pick(req.body, 'name', 'platform');
    var gamesId = parseInt(req.params.id, 10);
    var matchedGame = _.findWhere(games, {id: gamesId});
    var validAttributes = {};

    if(!matchedGame) {
        return res.status(404).send();
    }

    if(body.hasOwnProperty('name') && _.isString(body.name) && body.name.trim().length > 0) {
        validAttributes.name = body.name;
    } else if (body.hasOwnProperty('name')) {
        return res.status(400).send();
    }

    if(body.hasOwnProperty('platform') && _.isString(body.platform) && body.platform.trim().length > 0) {
        validAttributes.platform = body.platform;
    } else if (body.hasOwnProperty('platform')) {
        return res.status(400).send();
    }

    _.extend(matchedGame, validAttributes);
    res.json(matchedGame);
});

db.sequelize.sync({force: true}).then(function () {
    app.listen(PORT, function () {
        console.log('Server listening on port: ' + PORT)
    });
});

