$( document ).ready(function() {

  var context = new AudioContext();
  var convolver = context.createConvolver();

  function loadAudio( object, url ) {
  
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
  
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        object.buffer = buffer;
        console.log('* buffer * '+buffer);
      });
    }
    request.send();

    console.log( '** LOAD AUDIO ** object: ' + object + ' // url: ' + url );

  }

  //var bongo_url = '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409276tin.wav';
  //var hall_reverb_url = '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409273irHall.ogg';

  function SampleSound( sample_url ) {
    var sample_url = sample_url;
  
    loadAudio( this, sample_url );

    this.reverb = true;
    this.volume = context.createGain();

    this.play = function () {
      var s = context.createBufferSource();
      s.buffer = this.buffer;
      s.connect(this.volume);
      s.start(0);
      this.s = s;

      if (this.reverb === true) {
        this.convolver = context.createConvolver();
        this.convolver.buffer = irHall.buffer;
        this.volume.connect(this.convolver);
        this.convolver.connect(context.destination);

      } else if (this.convolver) {
        this.volume.disconnect(0);
        this.convolver.disconnect(0);
        this.volume.connect(context.destination);
      } else {
        this.volume.connect(context.destination);
      }

      console.log( '** PLAY **' );
    }

    this.print = function () {
      console.log( '** PRINT ** ' + sample_url );
    }
  }

  function ReverbObject( reverb_url ) {
    var reverb_url = reverb_url;
    this.source = reverb_url;
    loadAudio(this, reverb_url);
  }

  irHall = new ReverbObject( '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409273irHall.ogg' );
  a = new SampleSound( '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409276tin.wav' );


  $( document ).keydown(function( event ) {
    a.play();
  });

  console.log( "** SCRIPT LOADED **" );

});