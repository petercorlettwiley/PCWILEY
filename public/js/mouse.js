$( document ).ready(function() {

  $(document).mousemove(function(e){
    mouseItUp(e.clientX, e.clientY);
  });

  $(window).resize(function() {
    updateWindowDimensions();
  });

});

var windowWidth = $(window).outerWidth();
var windowHeight = $(window).outerHeight();

var mouseX = Math.round(windowWidth/2);
var mouseY = Math.round(windowHeight/2);

var k = 0.4;
var damp = 0.6;

var pX = 0;
var pY = 0;
var x = 0;
var y = 0;

function mouseItUp(x, y) {

  var $images = $('.images');

  var gX = Math.round((x - windowWidth/2) * k)*-1;
  var gY = Math.round((y - windowHeight/2) * k)*-1;

  $('.images').css({
    "-webkit-transform":"translate("+gX+"px,"+gY+"px)",
    "-ms-transform":"translate("+gX+"px,"+gY+"px)",
    "transform":"translate("+gX+"px,"+gY+"px)"
  });

}

function updateWindowDimensions() {
  windowWidth = $(window).outerWidth();
  windowHeight = $(window).outerHeight();
}