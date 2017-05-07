var express =require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

app.use(bodyParser.json());

app.get('/', function(req, res, next){
    res.send('GamesData API root');
});

//GET /games

app.get('/games', function(req, res, next) {
    var query = req.query;
    var where = {};

    if(query.hasOwnProperty('platform') && query.platform.trim().length > 0)
    {
        where.platform = query.platform;
    }


    db.games.findAll({where: where}).then(function(games){
        if(!!games) {
            res.json(games);
        } else {
            res.status(404).send();
        }
    }, function (e){
        res.status(500).send();
    });
});

//GET /games/:id
app.get('/games/:id', function (req, res, next) {
    var gamesId = parseInt(req.params.id, 10);

    db.games.findById(gamesId).then(function(game){
        if(!!game) {
            res.json(game.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e){
        res.status(500).send();
    });
    
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

app.delete('/games/:id', function (req, res, next) {
    var gamesId = parseInt(req.params.id, 10);
    var where = {};

    where.id = gamesId;

    try {
        db.games.destroy({ where: where }).then(function (rowsDeleted) {
            console.log(rowsDeleted);
            if (rowsDeleted === 0) {
                console.log('couldnt find row to deleted');
                res.status(404).json({
                    error: 'No game with id'
                });
            } else {
                res.status(204).send();
            }
        }), function (e) {
            res.status(500).json(e).send;
        }
    }
    catch (err) {
        console.log(err.message);
    }
})

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

