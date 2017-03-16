// TODO: Don't allow multiple replays to be playing at once. Don't duplicate playback in general
// TODO: Maintain and show the user's running score

// Globals
/** TODO: Is there some way I can avoid globals? My problem: too many event listeners.
    Looking for a way to only need a single event listener for answer feedback.
    TODO: What was actually causing the issue with notes not going away?
    How can I document that issue accurately?
*/
const CURRENT_EXAMPLE = {
  allowReplays: false // Should be false at the beginning of each example
};

function playAudio(audioContext, noteName, octave, detune, duration, waveform, callback) {
  // Sound constants
  const A4 = 440;
  const C4 = A4 * Math.pow(2, -9/12);
  const noteList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  let slightDelay = 0.1; // (In seconds)

  // Calculate chosen frequency
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

  // Execute callback after audio finishes playing
  setTimeout(callback, (stopTime - startTime + slightDelay) * 1000);
}

function addReplayButton() {
  // Allow replays in global settings
  CURRENT_EXAMPLE.allowReplays = true;
  // Show replay button
  document.getElementById("replay").setAttribute("style", "display: default");
}

function removeReplayButton() {
  // Disallow replays in global settings
  CURRENT_EXAMPLE.allowReplays = false;
  // Hide replay button
  document.getElementById("replay").setAttribute("style", "display: none");
}

function newExample(audioContext) {
  // Assorted parameters
  const noteList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  let tuningDelta = 30; // Arbitrary. TODO: Make configurable.
  let isFlat = (Math.random() < 0.5);
  let detune = isFlat ? -tuningDelta : tuningDelta;
  let duration = 2; // Arbitrary. TODO: Make configurable.
  let waveform = "triangle"; // Arbitrary. TODO: Make configurable.
  let noteName = noteList[Math.floor(Math.random()*12)];
  let octave = 4; // Arbitrary. TODO: Make configurable.

  // Set global parameters accordingly
  CURRENT_EXAMPLE.isFlat = isFlat;
  CURRENT_EXAMPLE.noteName = noteName;
  CURRENT_EXAMPLE.octave = octave;
  CURRENT_EXAMPLE.detune = detune;
  CURRENT_EXAMPLE.duration = duration;
  CURRENT_EXAMPLE.waveform = waveform;

  // Allow replays after the audio plays
  let callback = function() {
      addReplayButton();
  };

  // Initial audio playback
  playAudio(audioContext, noteName, octave, detune, duration, waveform, callback);
}

function playNewExample(audioContext) {
  // Clear feedback
  document.getElementById("feedback").innerHTML = "";
  // Remove replay button
  removeReplayButton();
  // Play next example
  // TODO: Present a "NEXT" button between examples (IF the user wants it)
  // (Make said NEXT button removable eventually using user settings/config)
  newExample(audioContext);
}

function chooseFlat(audioContext) {
  let feedback = document.getElementById("feedback");
  if (CURRENT_EXAMPLE.isFlat) {
    feedback.innerHTML = "✓";
    feedback.setAttribute("style", "color: green");
  } else {
    feedback.innerHTML = "✕";
    feedback.setAttribute("style", "color: red");
  }
  // Play next example
  setTimeout(function() {
    playNewExample(audioContext);
  }, 1000);
}

function chooseSharp(audioContext) {
  let feedback = document.getElementById("feedback");
  if (!CURRENT_EXAMPLE.isFlat) {
    feedback.innerHTML = "✓";
    feedback.setAttribute("style", "color: green");
  } else {
    feedback.innerHTML = "✕";
    feedback.setAttribute("style", "color: red");
  }
  // Play next example
  setTimeout(function() {
    playNewExample(audioContext);
  }, 1000);
}

// Should be called before the first call to newExample
function setAnswerListeners(audioContext) {
  // Listen for answer (flat or sharp)
  document.getElementById("flat").addEventListener("click", chooseFlat.bind(audioContext));
  document.getElementById("sharp").addEventListener("click", chooseSharp.bind(audioContext));
  document.addEventListener("keyup", function(evt) {
    // Logic using evt.which, not evt.keyCode
    let whichJ = 74; // Keypress: "J"
    let whichK = 75; // Keypress: "K"
    if (evt.which === whichJ) {
      chooseFlat(audioContext);
    } else if (evt.which === whichK) {
      chooseSharp(audioContext);
    }
  });

  // Give visual feedback when one of the buttons is selected via keyboard
  document.addEventListener("keydown", function(evt) {
    let whichJ = 74;
    let whichK = 75;
    if (evt.which === whichJ) {
      let flat = document.getElementById("flat");
      flat.setAttribute("style", "background: #444444; color: white");
      document.addEventListener("keyup", function(evt) {
        if (evt.which === whichJ) {
          flat.setAttribute("style", "background: #ffffff; color: #000000");
        }
      });
    } else if (evt.which === whichK) {
      let sharp = document.getElementById("sharp");
      sharp.setAttribute("style", "background: #444444; color: white");
      document.addEventListener("keyup", function(evt) {
        if (evt.which === whichK) {
          sharp.setAttribute("style", "background: #ffffff; color: #000000");
        }
      });
    }
  });

  // Add listeners for the replay button
  // TODO: Consolidate these with the listeners above, maybe?
  let replay = document.getElementById("replay");
  replay.addEventListener("click", function() {
    // Pull in information about current example from global variables
    let noteName = CURRENT_EXAMPLE.noteName,
        octave = CURRENT_EXAMPLE.octave,
        detune = CURRENT_EXAMPLE.detune,
        duration = CURRENT_EXAMPLE.duration,
        waveform = CURRENT_EXAMPLE.waveform;
    // Replay current example if replays are currently allowed
    if (CURRENT_EXAMPLE.allowReplays) {
      playAudio(audioContext, noteName, octave, detune, duration, waveform, function(){});
    }
  });
  document.addEventListener("keyup", function(evt) {
    let whichR = 82;
    if (evt.which === whichR && CURRENT_EXAMPLE.allowReplays) {
      replay.click();
      replay.setAttribute("style", "background: #ffffff; color: #000000");
    }
  });
  document.addEventListener("keydown", function(evt) {
    let whichR = 82;
    if (evt.which === whichR && CURRENT_EXAMPLE.allowReplays) {
      replay.setAttribute("style", "background: #dd4444; color: #ffffff");
    }
  });
}

// (Should execute after DOM load)
(function() {
  let audioContext = new AudioContext();
  setAnswerListeners(audioContext);
  newExample(audioContext);
})();
