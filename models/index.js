// REQUIRE MONGOOSE AND CONNECT TO THE DATABASE
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var statuses = ['open', 'closed'];

// PAGE SCHEMA
var pageSchema = new mongoose.Schema({
  title:    {type: String, required: true},
  urlTitle: {type: String, required: true},
  content:  {type: String, required: true},
  status:   {type: String, enum: statuses},
  date:     {type: Date, default: Date.now},
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags:     {type: [String]}
});

pageSchema.statics.findByTag = function(tag){
    return this.find(
      { tags: 
        {$elemMatch: { $eq: tag } }
      } ).exec() ;
  };

pageSchema.pre('validate', function(next, done) {
  this.urlTitle = generateUrlTitle(this.title);
  next();
});

pageSchema.virtual('route').get(function(){
  //console.log("trying to get route")
  return "/wiki/" + this.urlTitle;
});

pageSchema.methods.findSimilarTags = function(cb) {
  return this.model('Page').find(
    {tags: {$in: this.tags}, urlTitle: {$ne: this.urlTitle}}, cb);
}

// USER SCHEMA
var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true}
});

// PAGE/USER MODELS
var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);


function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

module.exports = {
  Page: Page,
  User: User
};