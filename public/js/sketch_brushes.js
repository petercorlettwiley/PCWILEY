// CLASSES
// main brush 'P' class
var P = function(point, color, speed, interval, width) {
  this.point = point;
  this.color = color;
  this.speed = speed;
  this.vector = Point.random()*this.speed - this.speed/2;
  this.interval = interval;
  this.lastPoint = point;
  this.width = width;
  this.life = 0;

  this.path = new Path();
  this.path.fillColor = this.color;
  this.path.add(this.point);
}

P.prototype.iterate = function() {
  this.point += this.vector;

  if (this.point.x > size.width) {
    this.point.x = size.width;
    this.vector.x *= -1;
  }
  if (this.point.x < 0) {
    this.point.x = 0;
    this.vector.x *= -1;
  }
  if (this.point.y > size.height) {
    this.point.y = size.height;
    this.vector.y *= -1;
  }
  if (this.point.y < 0) {
    this.point.y = 0;
    this.vector.y *= -1;
  }

  var delta = this.point - this.lastPoint;

  var step = delta / this.width;
  step.angle += 90;

  var top = this.point + step;
  var bottom = this.point - step;
  
  this.path.add(top);
  this.path.insert(0, bottom);

  this.life++;

  if (this.life >= this.interval) {
    this.vector.angle += Math.random()*360;
    this.lastPoint = this.point;
    this.life = 0;
  }
}
P.prototype.restart = function() {
  if (this.path)
    this.path.remove();
}


// mouse brush 'MouseP' class
var MouseP = function(color, width) {
  this.color = color;
  this.width = width;

  this.path = new Path();
  this.path.fillColor = this.color;
}

MouseP.prototype.iterate = function(event) {
  var point = event.point
  
  var step = event.delta / this.width;
  step.angle += 90;

  var top = point + step;
  var bottom = point - step;

  this.path.add(top);
  this.path.insert(0, bottom);

  this.path.smooth();
}

MouseP.prototype.restart = function() {
  if (this.path)
    this.path.remove();
}

// GLOBAL VARIABLES
var size = view.size;
var pp;
var mousey;
var colorIndex = 2;
var setupIndex = 0;

// COLOR SCHEMES
var colors = [
  // bg, brush, mouse
  ["#fff", "#c55347", "#bce4e5"],
  ["#fff", "#00978c", "#f58e84"],
  ["#fff", "#121315", "#fff200"],
  ["#fff", "#40456a", "#f99d1c"],
  ["#fff", "#006eb8", "#fdd4bd"]

  // old 3 color brushes
  //["#006eb8", "#b59392", "#e2b53f"],
  //["#63c6bf", "#263122", "#f9ed43"],
  //["#66629c", "#b6bfc1", "#f38094"],
  //["#fbe6a0", "#f48067", "#456e6b"]
];

// SPEEDS + SIZES
var setup = [
  // pp speed, pp interval, pp width, mouse width
  [30, 300, 10, 8],
  [15, 100, 2, 20],
  [50, 400, 20, 4]
];

// RESET FUNCTION
function resetGraphic(bgColor, brushColor, mouseColor, brushSpeed, brushInterval, brushWidth, mouseWidth) {
  if (bg)
    bg.remove();
  setBG(bgColor);

  if (pp)
    pp.restart();
  pp = new P( getRandomStart(), brushColor, brushSpeed, brushInterval, brushWidth );

  if (mousey)
    mousey.restart();
  mousey = new MouseP(mouseColor, mouseWidth);
}

// GET RANDOM START
function getRandomStart() {
  return new Point(Math.random()*size.width, Math.random()*size.height);
};

// BG FUNCTION
var bg;
function setBG( color ) {
  bg = new Path.Rectangle({
    point: [0, 0],
    size: [size.width, size.height]
  });
  bg.sendToBack();
  bg.fillColor = color;
}

// FUNCTION CALLS
resetGraphic(
  colors[colorIndex][0],
  colors[colorIndex][1],
  colors[colorIndex][2],
  setup[setupIndex][0],
  setup[setupIndex][1],
  setup[setupIndex][2],
  setup[setupIndex][3]
);

function onFrame() {
  pp.iterate();
}

function onMouseMove(event) {
  mousey.iterate(event);
}

function onMouseDown() {
  colorIndex++;
  setupIndex++;
  resetGraphic(
    colors[colorIndex % colors.length][0],
    colors[colorIndex % colors.length][1],
    colors[colorIndex % colors.length][2],
    setup[setupIndex % setup.length][0],
    setup[setupIndex % setup.length][1],
    setup[setupIndex % setup.length][2],
    setup[setupIndex % setup.length][3]
  );
}