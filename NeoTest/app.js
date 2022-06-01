var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');

var app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '123456'));
var session = driver.session();

app.get('/', function(req, res){
    session
        .run('MATCH (a: Movie) RETURN a LIMIT 5')                   //Se corre la sentencia en Neo4J                       
        .then(function(result){
            var movieArr = [];
            result.records.forEach(function(record){                //Se ponen los resultados en un Array
                movieArr.push({
                    id: record._fields[0].identity.low,                 //id de la serie
                    title: record._fields[0].properties.title,          //Titulo de la serie
                    year: record._fields[0].properties.year             //anio de la serie
                })
            });
            console.log(movieArr); //BORRAME                                     
            res.render('index', {                                       //Se pasa movieArr a index.ejs
                movies: movieArr
            })
        })
        .catch(function(err){
            console.log(err);
        });

});


//<form method = "post" action = "/movie/add"> 
app.post('/movie/add',function(req, res){
    var title = req.body.movie_title;                   //movie_title hace referencia al nombre definido en el .ejs
    var year = req.body.movie_year;                     //movie_year hace referencia al nombre definido en el .ejs 

    session 
        .run('CREATE (n: Movie {title: "'+ title + '", year: "' + year + '"})')
        .then(function(result){
            res.redirect('/');
            session.close();
        })
        .catch(function(err){
           console.log(err); 
        });
    res.redirect('/');                      //Regresa el 'buffer' al principio para poder llamar mas funciones en el .ejs
});





app.listen(3000);
console.log('Server Started on Port 3000');

module.exports = app;