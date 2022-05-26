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
var session2 = driver.session();

app.get('/', function(req, res){
    session
        .run('MATCH (a: Person) RETURN a LIMIT 5')
        .then(function(result){
            var movieArr = [];
            result.records.forEach(function(record){
                movieArr.push({
                    id: record._fields[0].identity.low,
                    title: record._fields[0].properties.name,
                    year: record._fields[0].properties.year
                })
            });
            res.render('index', {
                movies: movieArr
            })
        })
        .catch(function(err){
            console.log(err);
        });

});


//<form method = "post" action = "/movie/add"> 
app.post('/movie/add',function(req, res){
    var title = req.body.movie_title;
    var year = req.body.movie_year;

    session2 
        .run('CREATE (n: Movie {title: "'+ title + '", year: "' + year + '"}) RETURN n.title')
        .then(function(result){})
        .catch(function(err){
           console.log(err); 
        });
        res.redirect('/'); 
        session2.close();  
});


app.listen(3000);
console.log('Server Started on Port 3000');

module.exports = app;