var express =     require('express');
var bodyParser =  require('body-parser');
var _ =           require('underscore');
var db =          require('./db.js');
var middleware =  require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res, next){
    res.send('GamesData API root');
});

//GET /games
//Get all games
app.get('/games',  function(req, res) {
    var query = req.query;
    var where = {};

    //Try and filter out Episodic and any obsolete games
    //where = {
    //    name: {
    //        $not: { $contains: ["Obsolete"] },
    //    }
    //}
    
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
//Get game with id of id
app.get('/games/:id', middleware.requireAuthentication, function (req, res) {
    var gamesId = parseInt(req.params.id, 10);
    var where = {
        id: gamesId,
        userId: req.user.get('id')
    };

    db.games.findOne({where: where}).then(function(game){
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
//Add a new game
app.post('/games', middleware.requireAuthentication, function (req, res) {
    var body = _.pick(req.body, 'name', 'platform', 'timePlayed');
    body.hours = Math.floor(body.timePlayed / 60);
    body.minutes = body.timePlayed % 60;

    db.games.create(body).then(function (game) {
        //
        req.user.addGame(game).then(function() {
            return game.reload();
        }).then(function(game) {
            res.json(game.toJSON());
        });
    }, function (e) {
        res.status(400).json(e);
    });
    
});

//DELETE /games/:id
//Delete a game with id of id

app.delete('/games/:id', middleware.requireAuthentication, function (req, res) {
    var gamesId = parseInt(req.params.id, 10);
    var where = {
        id: gamesId,
        userId: req.user.get('id')
    };

    try {
        db.games.destroy({where: where}).then(function (rowsDeleted) {
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
//Update a game with id of id

app.put('/games/:id', middleware.requireAuthentication, function (req, res) {
    var body = _.pick(req.body, 'name', 'platform', 'like', 'current', 'timePlayed');
    var gamesId = parseInt(req.params.id, 10);
    var attributes = {};
    var where = {
        id: gamesId,
        userId: req.user.get('id')
    };

    if (body.hasOwnProperty('name')) {
        attributes.name = body.name;
    }

    if (body.hasOwnProperty('platform')) {
        attributes.platform = body.platform;
    }

    if (body.hasOwnProperty('like')) {
        attributes.like = body.like;
    }

    if (body.hasOwnProperty('current')) {
        attributes.current = body.current;
    }

    if (body.hasOwnProperty('timePlayed')) {
        attributes.timePlayed = body.timePlayed;
        attributes.hours = Math.floor(body.timePlayed / 60);
        attributes.minutes = body.timePlayed % 60;
    }

    db.games.findOne({where: where}).then(function (game) {
        if (game) {
            game.update(attributes).then(function (game) {
                res.json(game.toJSON());
            }, function (e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
});

//GET /data/dashboard

app.get('/data/dashboard', function(req, res) {
    
    var where = {};
    var results = {
        totalGames: 0,
        lessThanHourGames: 0,
        lessThanThreeHourGames: 0,
        currentGames: []
    }
    
    db.games.findAll({where: where}).then(function(games){
        if(!!games) {
            //console.log(games);
            games.forEach(function(game) {
                //if(!game.name.includes("obsolete")){
                if(game.dataValues.timePlayed < 60){
                    results.lessThanHourGames++;
                } else if(game.dataValues.timePlayed > 60 && game.dataValues.timePlayed < 180) {
                    results.lessThanThreeHourGames++;
                }

                if(game.dataValues.current) {
                    results.currentGames.push(game.dataValues.name);
                }
                //}
            }, this);
            results.totalGames = games.length;
            res.json(results);
        } else {
            res.status(404).send();
        }
    }, function (e){
        res.status(500).send();
    });
});
//POST /users
app.post('/users', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');
    
    db.users.create(body).then(function (user) {
        res.status(201).json(user.toPublicJSON());
    }, function (e) {
        res.status(400).json(e);
    });
    
});

//POST /users/login
app.post('/users/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');
    var userInstance;

    db.users.authenticate(body).then(function (user) {
        var token = user.generateToken('authentication');
        userInstance = user;

        return db.token.create({
            token: token
        });

    }).then(function (tokenInstance) {
        res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
    }).catch(function() {
        res.status(401).send();
    });

});

//DELETE /users/login
app.delete('/users/login', middleware.requireAuthentication, function(req, res) {
    req.token.destroy().then(function() {
        res.status(204).send();
    }).catch(function () {
        res.status(500).send();
    });
});


//This is all we need to start the application

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log('Server listening on port: ' + PORT)
    });
});



