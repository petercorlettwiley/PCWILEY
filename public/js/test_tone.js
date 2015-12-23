$( document ).ready(function() {

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext()

  //var bongo_url = '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409276tin.wav';
  //var hall_reverb_url = '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409273irHall.ogg';


  function loadAudio( object, url ) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
  
    request.onload = function() {
      context.decodeAudioData(
        request.response,
        function(buffer) {
          object.buffer = buffer;
        },
        function(e){"Error with decoding audio data" + e.err}
      );
    }
    request.send();
  }


  function SampleSound( sample_url ) {
    var sample_url = sample_url;
  
    loadAudio( this, sample_url );

    this.volume = context.createGain();
    //this.volume.connect(c);
    this.volume.connect(context.destination);

    this.play = function () {
      var s = context.createBufferSource();
      s.buffer = this.buffer;
      s.connect(this.volume);
      s.start(0);
      this.s = s;
    }

  }

  //var convolver;
  //convolver = context.createConvolver();
  //convolver.connect(context.destination);

  var c = context.createConvolver();
  c.connect(context.destination);
  loadAudio(c, '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409273irHall.ogg');


  a = new SampleSound( '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409276tin.wav' );
  a.volume.connect(c);

  $( document ).keydown(function( event ) {
    a.play();
  });

  console.log( "** SCRIPT LOADED **" );

});