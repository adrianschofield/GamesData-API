var express =require('express');
var app = express();
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res, next){
    res.send('GamesData API root');
});

app.listen(PORT, function(){
    console.log('Server listening on port: ' + PORT)
});