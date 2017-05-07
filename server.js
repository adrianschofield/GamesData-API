var express =require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');

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
    var matchedGame;

    games.forEach(function (game) {
        if(game.id === gamesId){
            matchedGame = game;
        }
    });

    if(matchedGame) {
        res.json(matchedGame);
    } else {
        res.status(404).send();
    }
    
});

//POST /games
app.post('/games', function (req, res, next) {
    var body = req.body;

    body.id = gameNextId;
    gameNextId++;

    games.push(body);

    res.json(body);
});

app.listen(PORT, function(){
    console.log('Server listening on port: ' + PORT)
});