$( document ).ready(function() {

  /* Archive page functions */

  if($('body').hasClass('archive')) {
    /* Call archive scroll hide/show functionality */
    setScrollArchive();
    $(window).scroll(function(){
      scrollArchive();
    });
    $(window).resize(function() {
      updateWindowHeight();
      setScrollArchive();
      scrollArchive();
    });

    /* Call archive image click through functionality */
    $('#archive article .images').click(function() {
      shuffleImg($(this));
    });
  }

});

/* Archive scroll hide/show functionality */

var posts = 0;
var windowHeight = $(window).outerHeight();
var windowPadding = 0;

var windowWidth = $(window).outerWidth();
var mobile = 820;

function setScrollArchive() {
  posts = 0;
  var imageCount = 0;
  var $articles = $('#archive article');
  console.log($articles.length);

  function pushPost(i) { // add post info
    var $post = $('#archive article.post_'+i);
    var top = $post.offset().top;
    var height = $post.outerHeight();
    $post.attr('data-top', top).attr('data-height', height);
  }

  $articles.each(function(i) {
    $(this).find('img').each(function() {
      var imageId = 'img_'+imageCount;
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
    posts++;       // need to test if 'all images in one article are loaded, posts++'
  });

  if (posts == $articles.length) {
    scrollArchive();
  }
}

function scrollArchive() {
  if (windowWidth > mobile) {
    var windowTop = $(window).scrollTop();
    var windowMiddle = windowTop + windowHeight/2;
    var windowAdjust = windowHeight * windowPadding;
  
    for (var i = 0; i < posts; i++) {
      var $post = $('#archive article.post_'+i);
      postTop = parseInt($post.attr('data-top'));
      postBottom = postTop + parseInt($post.attr('data-height'));

      $description = $('#text article.post_'+i);
      if (postTop < windowMiddle && postBottom > windowMiddle) {
        $description.show();
        console.log('show_'+i+": top("+postTop+"), bottom("+postBottom+"), mid("+windowMiddle+")");
      } else {
        $description.hide();
        console.log('hidden_'+i+": top("+postTop+"), bottom("+postBottom+"), mid("+windowMiddle+")");
      }
    }
  } else {
    for (var i = 0; i < posts; i++) {
      var $post = $('#archive article.post_'+i);
      $post.find('.description').show();
    }
  }
}

function updateWindowHeight() {
  windowHeight = $(window).outerHeight();
  windowWidth = $(window).outerWidth();
}

/* Archive image click through functionality */

function shuffleImg(obj) {
  var $container = obj;
  var $first_child = $container.children().first();
  $first_child.appendTo($container);
}

