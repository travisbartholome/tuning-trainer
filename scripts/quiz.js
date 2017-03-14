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

  let chooseFlat = function() {
    if (isFlat) {
      console.log("Correct!");
    } else {
      console.log("Incorrect!");
    }
    // TODO: Present a "NEXT" button between examples
    // TODO: Move to next example after getting an answer
    //newExample(audioContext);
  };

  let chooseSharp = function() {
    if (!isFlat) {
      console.log("Correct!");
    } else {
      console.log("Incorrect!");
    }
    //newExample(audioContext);
  };

  // Listen for answer (flat or sharp)
  document.getElementById("flat").addEventListener("click", chooseFlat);
  document.getElementById("sharp").addEventListener("click", chooseSharp);
  document.addEventListener("keyup", function(evt) {
    // Logic using evt.which, not evt.keyCode
    let whichJ = 74; // Keypress: "J"
    let whichK = 75; // Keypress: "K"
    if (evt.which === whichJ) {
      chooseFlat();
    } else if (evt.which === whichK) {
      chooseSharp();
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

  // Allow replays after the audio plays.
  let callback = function() {
    let replayDiv = '<div class="md-button" id="replay"><p>Replay</p><p class="key-label">R</p></div>';
    document.getElementById("control-btns").innerHTML = replayDiv;

    // Add listeners for the replay button
    let replay = document.getElementById("replay");
    replay.addEventListener("click", function() {
      playAudio(audioContext, noteName, octave, detune, duration, waveform, function(){});
    });
    document.addEventListener("keydown", function(evt) {
      let whichR = 82;
      if (evt.which === whichR) {
        replay.setAttribute("style", "background: #dd4444; color: #ffffff");
      }
    });
    document.addEventListener("keyup", function(evt) {
      let whichR = 82;
      if (evt.which === whichR) {
        replay.click();
        replay.setAttribute("style", "background: #ffffff; color: #000000");
      }
    });
  };

  // Initial audio playback
  playAudio(audioContext, noteName, octave, detune, duration, waveform, callback);
}

// (Should execute after DOM load)
(function() {
  let audioContext = new AudioContext();
  newExample(audioContext);
})();
