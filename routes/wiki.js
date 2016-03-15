var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page; 
var User = models.User; 

// PAGE INSTANCE METHOD

// HOMEPAGE: GET ALL WIKI PAGES
router.get("/", function(req, res, next){
	res.redirect('/');
});

// POST: MAKE NEW PAGE AND REDIRECT TO IT
router.post('/', function(req, res, next) {
// Could have just said var page = new Page(req.body)
  var page = new Page({
  	title: req.body.title,
  	content: req.body.content,
  	//status: req.body.status,
  	tags: req.body.tags.split(" ")
  });
  page.save().then(function(savedPage) {
  	res.redirect(savedPage.route);
  }).then(null, next)
});

// "ADD PAGE" FORM
router.get("/add", function(req, res, next){
	//retrieve the add page form
	res.render('addpage');
});

// "SEARCH TAGS" FORM
router.get("/search", function(req, res, next){
	res.render('search');
});

// "SEARCH TAGS" RESULTS
router.get("/tags", function(req, res, next) {
	Page.find({
		// $in matches a set of possibilities
		tags: {$in: [req.query.tags]}}).exec() 
			// Render index.html with a list of matching pages
			.then( function(arrayOfPages){     
				res.render('index', {pages: arrayOfPages});
			}, function(error) {
				console.log(error)
			});
})

// SEARCH SIMILAR PAGES
router.get('/:urlTitle/similar', function (req, res, next) {
	Page.findOne({ urlTitle: req.params.urlTitle }).exec(function(err, foundPage) {
		return foundPage.findSimilarTags().then(function(foundPages){
			res.render('index', {pages: foundPages});
			}, function(error) {
				console.log(error)
			});
		})
});

// SINGLE PAGE VIEW
router.get('/:urlTitle', function (req, res, next) {
	Page.findOne({ urlTitle: req.params.urlTitle }).exec().then(function(foundPage){
  	//res.json(foundPage);
  	res.render('wikipage', {title: foundPage.title, content: foundPage.content, tags: foundPage.tags, urlTitle: foundPage.urlTitle});
  }).catch(next); // assuming you replaced mpromise
});

module.exports = router;

