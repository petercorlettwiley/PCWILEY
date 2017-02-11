var posts = 0;
var images = 0;

var $articles = $('#archive article');

var windowHeight = $(window).outerHeight();
var windowWidth = $(window).outerWidth();
var windowPadding = 0.5;

var $break_mobile_1 = 1000;
var $break_mobile_2 = 850;
var $unit_small = 36;

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
      removeLoader();
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
    var imgHeight = Math.round($post.find('img:first-of-type').height());

    // this needs to be fixed: errors out when small window becomes large window
    //$post.find('img').css('max-height', imgHeight).css('width', 'auto');
    //$post.find('.images').css('height', height);
    
    $post.attr('data-top', top).attr('data-height', height);
    posts++;

    if (posts == $articles.length){
      console.log('all posts updated :)');
      $('body').addClass('loaded');
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

  var mobile_1 = windowWidth <= $break_mobile_1;
  var mobile_2 = windowWidth <= $break_mobile_2;

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

    if (!mobile_1 && !mobile_2) {
      if (articleTop < windowTop) {
        $text.addClass('stuck');
      } else {
        $text.removeClass('stuck');
      }
    } else if (mobile_1 && !mobile_2) {
      if (articleTop < windowTop+$unit_small*3) {
        $text.addClass('stuck');
      } else {
        $text.removeClass('stuck');
      }
    } else {
      $text.removeClass('stuck');
    }

  });

}

function shuffleImg(obj, e) {
  var $container = obj;

  var offset = $container.offset();
  var container_width = $container.outerWidth();
  var mouse_x = (e.pageX - offset.left);
  var mid_line = container_width/2;

  var shuffle_next = mouse_x > mid_line;

  var $first_child = $container.children().first();
  var $last_child = $container.children().last();

  /*$first_child.fadeOut(300, function(){
    shuffle_next ? (
      $first_child.appendTo($container)
    ) : (
      $last_child.prependTo($container)
    );
    $(this).css('display', '');
  });*/

  if (shuffle_next) {
    $first_child.animate({ left: container_width*-0.5, opacity: 0 }, 200, 'linear', function(){
      $first_child.css('left', '').css('opacity', '').appendTo($container);
      $container.children().first().hide().fadeIn(200);
    });
  } else {
    $first_child.animate({ left: container_width*0.5, opacity: 0 }, 200, 'linear', function(){
      $first_child.css('left', '').css('opacity', '');
      $last_child.prependTo($container);
      $container.children().first().hide().fadeIn(200);
    });

  }
}

function removeLoader() {
  $('#loader').fadeOut(1000, function(){
    $('body .wrap').animate({ opacity: 1 }, 1500);
  });
}

$(document).ready(function() {
  if ($('body').hasClass('archive')) {
    loadImages();
  } else {
    removeLoader();
  }

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