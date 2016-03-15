// Exporting a function that takes in the swig library and uses it
module.exports = function(swig) {

// Takes a page instance and returns an HTML string for a link to that page
  var pageLink = function (page) {
    return '<a href="' + page.route + '">' + page.title + '</a>';
  };

  pageLink.safe = true;

  // Create this filter so we can use it in our templates
  swig.setFilter('pageLink', pageLink);

};