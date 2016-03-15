var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true})); // <= attaches request.body
router.use(bodyParser.json());
var models = require('../models')

var Page = models.Page; 
var User = models.User; 

module.exports = router;

router.get("/", function(req, res) {
	Page.find().exec().then(function(arrayPages) {
		res.render('index', {pages: arrayPages});
	}); 
})
