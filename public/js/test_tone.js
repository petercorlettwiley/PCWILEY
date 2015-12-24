$( document ).ready(function() {

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext()

  // LOAD AUDIO BUFFERS
  // ------------------

  function loadAudio( object, url ) {
    var request = new XMLHttpRequest();
    request.open( 'GET', url, true );
    request.responseType = 'arraybuffer';
  
    request.onload = function() {
      context.decodeAudioData(
        request.response,
        function( buffer ) {
          object.buffer = buffer;
        },
        function(e){ "Error with decoding audio data" + e.err }
      );
    }
    request.send();
  }

  // SAMPLE SOUND CLASS
  // ------------------

  function SampleSound( sample_url ) {
    var sample_url = sample_url;
  
    loadAudio( this, sample_url );

    this.gain = context.createGain();

    this.play = function () {
      var s = context.createBufferSource();
      s.buffer = this.buffer;
      s.connect( this.gain );
      s.start(0);
      this.s = s;
    }
  }

  // ASSETS
  // ------

  var bongo_url = '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409276tin.wav';
  var hall_reverb_url = '//dab1nmslvvntp.cloudfront.net/wp-content/uploads/2014/08/1407409273irHall.ogg';

  // CREATE + CONNECT
  // ----------------

  var c = context.createConvolver();
  c.connect( context.destination );
  loadAudio( c, hall_reverb_url );

  a = new SampleSound( bongo_url );
  a.gain.connect( c );
  a.gain.connect( context.destination );


  oscillator = context.createOscillator(); // Create sound source
  oscillator.type = 'sine';
  oscillator.frequency.value = 300;

  oscillator.attackTime = 0.01;
  oscillator.releaseTime = 1;

  oscillator.gain = context.createGain();
  oscillator.gain.gain.value = 0;

  oscillator.connect(oscillator.gain);
  oscillator.gain.connect(c);
  oscillator.gain.connect(context.destination);
  oscillator.start(0);

  oscillator.trigger = function () {
    var now = context.currentTime;
    var currentGain = this.gain.gain.value;

    this.gain.gain.cancelScheduledValues(now);

    this.gain.gain.setValueAtTime(currentGain, now);
    this.gain.gain.linearRampToValueAtTime(1.0, now + this.attackTime);
    this.gain.gain.linearRampToValueAtTime(0, now + this.attackTime + this.releaseTime );
  }

  oscillator.gain.connect(c);
  oscillator.gain.connect(context.destination);


  // for testing sound triggering
  $( document ).keydown( function( event ) {
    if (event.keyCode == 32) { // space
      a.play();
    }
    if (event.keyCode == 16) { // shift
      oscillator.trigger();
    }
  });

});