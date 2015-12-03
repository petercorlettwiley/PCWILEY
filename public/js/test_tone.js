$( document ).ready(function() {

  var context = new AudioContext();


  function loadAudio( object, url ) {
  
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
  
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        object.buffer = buffer;
        console.log('* buffer * '+buffer);
        object.play();
      });
    }
    request.send();

    console.log( '** LOAD AUDIO ** object: ' + object + ' // url: ' + url );

  }

  //var reverb_url = 'http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409276tin.wav';


  function SampleSound( sample_url ) {
    var sample_url = sample_url;
  
    loadAudio( this, sample_url );
    console.log(this['buffer']);

    this.play = function () {
      var s = context.createBufferSource();
      s.buffer = this.buffer;
      s.connect(context.destination);
      s.start(0);
      this.s = s;

      console.log( '** PLAY **' );
    }

    this.print = function () {
      console.log( '** PRINT ** ' + sample_url );
    }
  }

  var a = new SampleSound( 'http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409276tin.wav' );
  
  //a.play();
  a.print();


  console.log( "** SCRIPT LOADED **" );

});