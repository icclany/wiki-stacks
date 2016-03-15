module.exports = function(swig) {

// Takes a page instance and returns an HTML string for a link to that page
  var pageLink = function (page) {
    return '<a href="' + page.route + '">' + page.title + '</a>';
  };

  pageLink.safe = true;

  swig.setFilter('pageLink', pageLink);

};