var posts = 0;
var images = 0;

var $articles = $('#archive article');

var windowHeight = $(window).outerHeight();
var windowWidth = $(window).outerWidth();
var windowPadding = 0.5;

function loadImages() {

  $articles.find('img').each(function(i) {
    var id = 'img_'+i;
    $(this).attr('id', id);

    var articleImg = document.getElementById(id);
    if (articleImg.complete) {
      newImageLoaded();
    } else {
      articleImg.addEventListener('load', function() {
        newImageLoaded();
      });
      articleImg.addEventListener('error', function() {
        console.log('error loading #img_'+i);
      });
    }
  });

  function newImageLoaded() {
    images++;
    if (images == $articles.find('img').length) {
      console.log('all images loaded :)');
      setScrollArchive();
    }
  }
}


function setScrollArchive() {

  posts = 0;

  $articles.each(function(i){
    var $post = $(this);
    var top = $post.offset().top;
    var height = $post.height();

    // this needs to be fixed: errors out when small window becomes large window
    //$post.find('img').css('max-height', height).css('width', 'auto');
    //$post.find('.images').css('height', height);
    $post.attr('data-top', top).attr('data-height', height);
    posts++;

    if (posts == $articles.length){
      console.log('all posts updated :)');
      scrollArchive();
    }
  });
}


function updateWindowSize() {
  windowHeight = $(window).outerHeight();
  windowWidth = $(window).outerWidth();
}


function scrollArchive() {

  var windowTop = $(window).scrollTop();
  var windowMiddle = windowTop + windowHeight/2;
  var windowBottom = windowTop + windowHeight;
  var windowTopPad = windowMiddle - windowPadding/2*windowHeight;
  var windowBottomPad = windowMiddle + windowPadding/2*windowHeight;

  $articles.each(function(i) {
    var articleHeight = parseInt($(this).attr('data-height'));
    var articleTop = parseInt($(this).attr('data-top'));
    var articleBottom = articleTop + articleHeight;
    var articleMiddle = articleTop + articleHeight/2;

    if (articleTop < windowBottom && articleBottom > windowTop) {
      var opacity;
      if (articleMiddle < windowTopPad) {
        opacity = 1 - Math.abs(articleMiddle - windowTopPad)/(windowPadding*windowHeight);
      } else if(articleMiddle > windowBottomPad) {
        opacity = 1 - Math.abs(articleMiddle - windowBottomPad)/(windowPadding*windowHeight);
      } else {
        opacity = 1;
      }
      $(this).css('opacity', opacity);
    } else {
      $(this).css('opacity', 0);
    }

    var $text = $(this).find('.text');

    if (articleTop < windowTop) {
      $text.css('position', 'fixed');
    } else {
      $text.css('position', 'absolute');
    }

  });

}

function shuffleImg(obj, e) {
  var $container = obj;

  var offset = $container.offset();
  var mouse_x = (e.pageX - offset.left);
  var mid_line = $container.outerWidth()/2;

  var shuffle_next = mouse_x > mid_line;

  var $first_child = $container.children().first();
  var $last_child = $container.children().last();

  shuffle_next ? $first_child.appendTo($container) : $last_child.prependTo($container);
}

$(document).ready(function() {
  loadImages();

  $('#archive article .images').click(function(e) {
    shuffleImg($(this), e);
  });
});

$(window).resize(function() {
  updateWindowSize();
  setScrollArchive();
});

$(window).scroll(function(){
  scrollArchive();
});