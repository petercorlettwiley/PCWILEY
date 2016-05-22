var blue = {hue: 196, saturation: 0.4, brightness: 0.9};
var green = {hue: 155, saturation: 0.28, brightness: 0.95};

var topLeft = view.center - view.center;
var bottomRight = view.center*2;

var path = new Path.Rectangle({
    rectangle: view.bounds,
    fillColor: {
        gradient: {
            stops: [green, blue],
            radial: true
        },
        origin: topLeft,
        destination: bottomRight,
       
    }
});

var color = path.fillColor;
var gradient = color.gradient;
var point = [0, 0];
var pointInvert = [path.bounds.width, path.bounds.height];

function getWave(x, scale) {
    return Math.sin(x)*scale;
}

function updatePoint(p) {
    var newX = (p.x-path.bounds.width)*-1;
    var newY = (p.y-path.bounds.height)*-1;
    point = [p.x, p.y];
    pointInvert = [newX, newY];
}

function onFrame(event) {
    var time = event.time;
    gradient.stops[0].color.saturation = green.saturation + getWave(time, 0.15);
    gradient.stops[1].color.saturation = blue.saturation + getWave(time+2, 0.15);

    var pointInvertWave = [pointInvert[0] + getWave(time, path.bounds.width*0.25), pointInvert[1]+getWave(time+5, path.bounds.height*0.25)]
    var pointWave = [point[0] + getWave(time, path.bounds.width*0.25), point[1]+getWave(time+5, path.bounds.height*0.25)]
    color.origin.x = pointWave[0];
    color.destination.x = pointInvertWave[0];
}

function onMouseMove(event) {
    updatePoint(event.point);
}

function onResize(event) {
  path.bounds = view.bounds;
}