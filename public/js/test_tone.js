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

  // OSC CONFIG
  // ----------

  function Oscillator( object, amplitude, pan, waveform, frequency, attackTime, releaseTime ) {
    object.type = waveform;
    object.amplitude = amplitude;
    object.frequency.value = frequency;
    object.attackTime = attackTime;
    object.releaseTime = releaseTime;
  
    object.gain = context.createGain();
    object.gain.gain.value = 0;

    object.pan = context.createStereoPanner();
    object.pan.pan.value = pan;
    
    object.pan.connect(object.gain);
    object.connect(object.pan);
    object.start(0);
  
    object.trigger = function () {
      var now = context.currentTime;
      var currentGain = this.gain.gain.value;
  
      this.gain.gain.cancelScheduledValues( now );
      this.gain.gain.setValueAtTime( currentGain, now );
      this.gain.gain.linearRampToValueAtTime( this.amplitude, now + this.attackTime );
      this.gain.gain.linearRampToValueAtTime( 0, now + this.attackTime + this.releaseTime );
    }
  }

  // Make Osc's
  var pitchRatio = [ 1, 1.1224, 1.2599, 1.3348, 1.4983, 1.6818, 1.8877 ];
  var rootPitch = 220;

  p1 = context.createOscillator();
  p2 = context.createOscillator();
  p3 = context.createOscillator();
  p4 = context.createOscillator();

  Oscillator( p1, 1, 0.2, 'sine', rootPitch, 0.125, 0.3 );
  Oscillator( p2, 0.8, 0.4, 'sine', rootPitch*pitchRatio[2], 0.125, 0.3 );
  Oscillator( p3, 0.6, 1.6, 'sine', rootPitch*pitchRatio[4], 0.125, 0.3 );
  Oscillator( p4, 0.4, 1.8, 'sine', rootPitch*pitchRatio[6], 0.125, 0.3 );


  p1.gain.connect( c );
  p1.gain.connect( context.destination );
  p2.gain.connect( c );
  p2.gain.connect( context.destination );
  p3.gain.connect( c );
  p3.gain.connect( context.destination );
  p4.gain.connect( c );
  p4.gain.connect( context.destination );



  // testin
  // var pitches = [110, 138.59, 164.81];

  





  // for testing sound triggering
  $( document ).keydown( function( event ) {
    if (event.keyCode == 32) { // space
      a.trigger();
    }
    if (event.keyCode == 16) { // shift
      p1.trigger();
      p2.trigger();
      p3.trigger();
      p4.trigger();
      //p4.pan.pan.value -= 0.1; yes you can change panning like this
    }
  });

});