$( document ).ready(function() {

  // Replace spaces in links with non-breaking-spaces
  $('#body a').contents().filter(function(){
    return this.nodeType == 3 // Text node
  }).each(function(){
    this.data = this.data.replace(/ /g, '\u00a0');
  });

  if($('body').hasClass('archive')) {
    setScrollArchive();
    $(window).scroll(function(){
      scrollArchive();
    });
  }

  $(window).resize(function(){updateWindowHeight();});

});


var posts = [];
var $windowHeight = $(window).outerHeight();
var windowPadding = 0.1;

function setScrollArchive() {
  var $articles = $('body article');
  for (var i = 0; i < $articles.length; i++) {
    posts.push($('body article.post_'+i).offset().top);
  }
  console.log(posts);
}

function scrollArchive() {
  var $windowTop = $(window).scrollTop() ;
  var $windowBottom = $windowTop + $windowHeight;

  for (var i = 0; i < posts.length; i++) {
    if($windowTop < posts[i] && $windowBottom > posts[i]) {
      $('body article.post_'+i+' .description').css('opacity', 1);
      console.log(i);
    } else {
      $('body article.post_'+i+' .description').css('opacity', 0);
    }
  }
}

function updateWindowHeight() {
  $windowHeight = $(window).outerHeight();
}