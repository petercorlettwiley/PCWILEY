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

    this.trigger = function () {
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

  // OSC
  // ===

  function Oscillator( object, frequency, attackTime, releaseTime ) {
    object.type = 'sine';
    object.frequency.value = frequency;
  
    object.attackTime = attackTime;
    object.releaseTime = releaseTime;
  
    object.gain = context.createGain();
    object.gain.gain.value = 0;
  
    object.connect(object.gain);
    object.gain.connect(c);
    object.gain.connect(context.destination);
    object.start(0);
  
    object.trigger = function () {
      var now = context.currentTime;
      var currentGain = this.gain.gain.value;
  
      this.gain.gain.cancelScheduledValues(now);
      this.gain.gain.setValueAtTime(currentGain, now);
      this.gain.gain.linearRampToValueAtTime(1.0, now + this.attackTime);
      this.gain.gain.linearRampToValueAtTime(0, now + this.attackTime + this.releaseTime );
    }
  }

  o = context.createOscillator();
  Oscillator( o, 300, 0.125, 0.3 );

  o.gain.connect(c);
  o.gain.connect(context.destination);


  // for testing sound triggering
  $( document ).keydown( function( event ) {
    if (event.keyCode == 32) { // space
      a.trigger();
    }
    if (event.keyCode == 16) { // shift
      o.trigger();
    }
  });

});