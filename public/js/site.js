$( document ).ready(function() {

  // Replace spaces in links with non-breaking-spaces
  /*$('#body a').contents().filter(function(){
    return this.nodeType == 3 // Text node
  }).each(function(){
    this.data = this.data.replace(/ /g, '\u00a0');
  });*/

  if($('body').hasClass('archive')) {
    $('body article').css('opacity', 0).delay(1000).animate({opacity: 1}, 1000);
    setScrollArchive();
    $(window).scroll(function(){
      scrollArchive();
    });
  }

  $(window).resize(function() {
    updateWindowHeight();
    setScrollArchive();
    scrollArchive();
  });
});

var posts = 0;
var windowHeight = $(window).outerHeight();
var windowPadding = 0.15;

var windowWidth = $(window).outerWidth();
var mobile = 760;

function setScrollArchive() {
  var imageCount = 0;
  var $articles = $('body article');

  function pushPost(i) { // add post info
    var $post = $('body article.post_'+i);
    var top = $post.offset().top;
    var height = $post.outerHeight();
    $post.attr('data-top', top).attr('data-height', height);
  }

  $articles.each(function(i) {
    $(this).find('img').each(function() {
      var imageId = 'img_'+imageCount;
      imageCount++;
      $(this).attr('id', imageId);
      var articleImg = document.getElementById(imageId);

      if (articleImg.complete) {
        pushPost(i);
      } else {
        articleImg.addEventListener('load', function() {
          pushPost(i);
        });
        articleImg.addEventListener('error', function() {
          console.log('error loading #img_'+imageCount);
        });
      }
    });
    
    posts++;
  });

  if (posts == $articles.length) {
    scrollArchive();
  }
}
setInterval(setScrollArchive, 500);

function scrollArchive() {
  if (windowWidth > mobile) {
    var windowTop = $(window).scrollTop();
    var windowMiddle = windowTop + windowHeight/2;
    var windowAdjust = windowHeight * windowPadding;
  
    for (var i = 0; i < posts; i++) {
      var $post = $('#archive article.post_'+i);
      postTop = parseInt($post.attr('data-top'));
      postBottom = postTop + parseInt($post.attr('data-height'));
  
      if (postTop < windowMiddle && postBottom > windowMiddle) {
        //$post.find('.description').fadeIn(750);
      } else {
        //$post.find('.description').fadeOut(250);
      }
  
    }
  } else {
    for (var i = 0; i < posts; i++) {
      var $post = $('#archive article.post_'+i);
      //$post.find('.description').show();
    }
  }
}

function updateWindowHeight() {
  windowHeight = $(window).outerHeight();
  windowWidth = $(window).outerWidth();
}