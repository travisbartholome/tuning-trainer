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
  let tuningDelta = 30; // Arbitrary. TODO: Make configurable.
  let isFlat = (Math.random() < 0.5);
  let detune = isFlat ? -tuningDelta : tuningDelta;
  let duration = 2; // Arbitrary. TODO: Make configurable.
  let waveform = "triangle"; // Arbitrary. TODO: Make configurable.
  let noteName = noteList[Math.floor(Math.random()*12)];
  let octave = 4; // Arbitrary. TODO: Make configurable.

  let chooseFlat = function() {
    if (isFlat) {
      // Give some feedback for correctness
        alert("Correct!");
      // Play a new example after a short delay, or present a "NEXT" button
    } else {
      alert("Incorrect!");
    }
  };

  let chooseSharp = function() {
    if (!isFlat) {
      alert("Correct!");
    } else {
      alert("Incorrect!");
    }
  };

  // Listen for answer (flat or sharp)
  document.getElementById("flat").addEventListener("click", chooseFlat);
  document.getElementById("sharp").addEventListener("click", chooseSharp);
  document.addEventListener("keyup", function(evt) {
    // Logic using evt.which, not evt.keyCode
    // TODO: Add some user-visible feedback, e.g., focus on the selected option.
    // Make the keypress correspond to some kind of visual feedback.
    let whichJ = 74; // Keypress: "J"
    let whichK = 75; // Keypress: "K"
    if (evt.which === whichJ) {
      chooseFlat();
    } else if (evt.which === whichK) {
      chooseSharp();
    }
  });

  // Allow replays after the audio plays.
  let callback = function() {
    // TODO: Allow user to press "R" to replay using keyboard.
    document.getElementById("replay").addEventListener("click", function() {
      playAudio(audioContext, noteName, octave, detune, duration, waveform, function(){});
    });
  };

  playAudio(audioContext, noteName, octave, detune, duration, waveform, callback);
}

// (Should execute after DOM load)
(function() {
  let audioContext = new AudioContext();
  newExample(audioContext);
})();
