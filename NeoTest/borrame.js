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
var session3 = driver.session();
var session4 = driver.session();
var session5 = driver.session();



var labels = [];
var series = [];
var genre = [];
var allSeries = [];
var allGenres = [];

app.get('/', function(req, res){
    session
        .run('MATCH (a: serie)-[r]->(b:genre) return a')
        .then(function(result){
            result.records.forEach(function(record){
                //series.push(record._fields[0].properties.type)
                series.push(record._fields[0].properties.title)
            })
            //console.log(series);
        })
        .catch(function(err){
            console.log(err);
        });


    session2
        .run('MATCH (a: serie)-[r]->(b:genre) return b')
        .then(function(result){
            result.records.forEach(function(record){
                genre.push(record._fields[0].properties.type)
            })
            //console.log(genre)          //PRINT
        })
        
        .catch(function(err){
            console.log(err);
        });

    session3
        .run('MATCH (n) RETURN distinct labels(n)')
        .then(function(result){
            result.records.forEach(function(record){
                //series.push(record._fields[0].properties.type)
                labels.push(record._fields[0][0])
            })
            //console.log(labels);            //PRINT
        })
        
        .catch(function(err){
            console.log(err);
        });

    session4
        .run('Match (a: serie) return a')
            .then(function(result){
                result.records.forEach(function(record){
                    //console.log(record._fields[0].properties.title)
                    allSeries.push(record._fields[0].properties.title)
                })
                //console.log(labels);            //PRINT
            })
            
            .catch(function(err){
                console.log(err);
            });
        
    session5
    .run('Match (a: genre) return a')
    .then(function(result){
        result.records.forEach(function(record){
            //console.log(record._fields[0].properties.type)
            allGenres.push(record._fields[0].properties.type);
        })
        //console.log(labels);            //PRINT



        console.log("MIRAME");
        matrix = makeMatrix(allSeries, allGenres, series, genre);
        console.log(matrix);


    })
    
    .catch(function(err){
        console.log(err);
    });

});



function makeMatrix(column, row, relArray1, relArray2){
    let matrix = [];    
    let relationArr = [];

    
    for(let i = 0; i < column.length; i++){
        
        let emptyRow = [];
        for(let j = 0; j < row.length; j++ ){
            emptyRow.push(0);
        }
        matrix.push(emptyRow);
    }
    console.log(matrix);

    for(let i = 0 ; i < relArray1.length; i++){
        relationArr.push([relArray1[i], relArray2[i]]);
    }

    for(let k = 0; k < column.length; k++){
        for(let j = 0; j < row.length; j++){
            for(let i = 0; i < relationArr.length; i++){
                if(column[k] == relationArr[i][0] && row[j] == relationArr[i][1]){
                    matrix[k][j] = 1;
                }
            }
        }
    }

    return matrix;
}





app.listen(3000);
console.log('Server Started on Port 3000');

module.exports = app;


/*
app.get('/', function(req, res){
    session
        .run('MATCH (a: serie)-[r]->(b:genre) RETURN a')                   //Se corre la sentencia en Neo4J                       
        .then(function(result){
            var serieGenreArr = [];
            //console.log(result);
            result.records.forEach(function(record){                //Se ponen los resultados en un Array
                
                console.log(record._fields[0].properties.title);
                console.log(record._fields[0].properties.type);
                serieGenreArr.push({
                    /*
                    id: record._fields[0].identity.low,                 //id de la serie
                    title: record._fields[0].properties.title,          //Titulo de la serie
                    year: record._fields[0].properties.year             //anio de la serie
                    */ /*
                })
            });
            console.log(serieGenreArr); //BORRAME                                     
            res.render('index', {                                       //Se pasa movieArr a index.ejs
                movies:serieGenreArr
            })
        })
        .catch(function(err){
            console.log(err);
        });

});
*/
