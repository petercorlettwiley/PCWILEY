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

var k = 0.0625;

function mouseItUp(x, y) {
  var offsetX = Math.round((x - windowWidth/2) * k)*-1;
  var offsetY = Math.round((y - windowHeight/2) * k)*-1;
  $('.images').css({
    "-webkit-transform":"translate("+offsetX+"px,"+offsetY+"px)",
    "-ms-transform":"translate("+offsetX+"px,"+offsetY+"px)",
    "transform":"translate("+offsetX+"px,"+offsetY+"px)"
  });
}

function updateWindowDimensions() {
  windowWidth = $(window).outerWidth();
  windowHeight = $(window).outerHeight();
}