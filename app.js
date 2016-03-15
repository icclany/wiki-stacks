'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
require('./filters')(swig);
var makesRouter = require('./routes');
var fs = require('fs');
var path = require('path');


// BODY-PARSING MIDDLEWARE
// Parses the request body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

var wikiRouter = require('./routes/wiki')
app.use("/wiki", wikiRouter);
app.get("/", makesRouter);

// LOGGING MIDDLEWARE
// Logs information about each incoming request
app.use(morgan('dev'));

// STATIC MIDDLEWARE
// Serves up static files from a public folder
app.use(express.static(path.join(__dirname, '/public')));

// SWIG CONFIGURATION FOR RENDERING
// point res.render to the proper directory
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});

app.listen(3000, function(){
  console.log('listening on port 3000');
})
