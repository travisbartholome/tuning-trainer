// TODO: Should this actually include a callback parameter?
function playAudio(audioContext, noteName, octave, detune, duration, waveform, callback) {
  // Sound constants
  const A4 = 440;
  const C4 = A4 * Math.pow(2, -9/12);
  const noteList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  let baseFrequency = C4 * Math.pow(2, noteList.indexOf(noteName)/12);
  baseFrequency *= Math.pow(1/2, 4 - octave);

  // Nodes
  let base = audioContext.createOscillator();
  let primary = audioContext.createOscillator();
  let baseGain = audioContext.createGain();
  let primaryGain = audioContext.createGain();

  // Timing variables
  let startTime = audioContext.currentTime + 0.1;
  let primaryDelay = 1;
  let stopTime = startTime + duration + primaryDelay;

  // Connect base node
  base.connect(baseGain);
  baseGain.connect(audioContext.destination);
  // Connect primary node
  primary.connect(primaryGain);
  primary.connect(audioContext.destination);

  // Settings for base node
  base.frequency.value = baseFrequency;
  base.type = waveform;
  baseGain.gain.value = 0.3; // So the primary is louder than the base

  // Settings for primary node
  primary.frequency.value = baseFrequency; // TODO: Change eventually for intervals
  primary.type = waveform;
  primary.detune.value = detune; // Detune A440 up by 25 cents
  primaryGain.gain.value = 0.6; // Take the edge off

  // Start sounds
  base.start(startTime);
  primary.start(startTime + primaryDelay);

  // Stop sounds eventually
  primary.stop(stopTime);
  base.stop(stopTime);

  // Execute callback
  // TODO: IMPORTANT! When does this execute?
  // I want it to be called once the sound stops playing.
  callback();
}

function newExample(audioContext) {
  const noteList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  let detune = 30; // Arbitrary
  let duration = 2; // Arbitrary
  let waveform = "triangle"; // Arbitrary
  let noteName = noteList[Math.floor(Math.random()*12)];
  let octave = 4; // Arbitrary

  let callback = function() {
    document.getElementById("replay").addEventListener("click", function() {
      playAudio(audioContext, noteName, octave, detune, duration, waveform, function(){});
    });
  }

  playAudio(audioContext, noteName, octave, detune, duration, waveform, callback);
}

// (Should execute after DOM load)
(function() {
  let audioContext = new AudioContext();
  newExample(audioContext);
})();
