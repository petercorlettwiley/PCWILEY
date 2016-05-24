$( document ).ready(function() {
  $('#body a').contents().filter(function(){
    return this.nodeType == 3 // Text node
  }).each(function(){
    this.data = this.data.replace(/ /g, '\u00a0');
  });
});