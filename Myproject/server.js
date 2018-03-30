var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//create application/json parser
var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({extended : true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('HelloExpress.db');

var port = 3000;

app.get(`/`, function(request, response){
    response.send("Hello, World");
});

app.get(`/quotes`, function(request, response){

   db.all("SELECT * FROM Quotes;", function(err, rows){
        console.log("GET Quotes: The database currently contains the following: " + rows);

        response.send(rows);
    });
});

app.get(`/quotes/:author`, function(request, response){

    db.all("SELECT * FROM Quotes WHERE Author = ?", [request.params.author], function(err, rows){
        console.log("GET Request for author: " + request.params.author);

        response.send(rows);
    });
});

// respond to Application/Json post.body
app.post('/quotes', jsonParser, function(request, response) {
    console.log(request.body);
    db.run("INSERT INTO Quotes VALUES ('quote?', 'author?');");
    response.status(400).send(request.body);
//  response.send('OK');
});

app.listen(port, function(){
    console.log("Express app listening on port " + port);
});

