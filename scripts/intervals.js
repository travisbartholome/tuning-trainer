// Globals
const CURRENT_EXAMPLE = {
  allowNext: false,
  allowReplays: false, // Should be false at the beginning of each example
  isPlaying: false,
  isScored: false
};

const DATA = {
  totalCorrect: 0,
  totalQuestions: 0
};

const COOKIE_DAYS = 30; // Arbitrary lifetime of cookie
const USER_COOKIE = {};
const COOKIE_DEFAULTS = {
  "max-age": (24*60*60) * COOKIE_DAYS,
  "path": "/"
};

const INTERVALS = ['m2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'];

/* Cookie functions */

function setCookie(cookieObject, cookieDefaults) {
  for (var i in cookieObject) {
    document.cookie = encodeURIComponent(i) + "=" + encodeURIComponent(cookieObject[i]);
  }
  // Should override any existing path, max-age, etc.
  for (var i in cookieDefaults) {
    document.cookie = i + "=" + cookieDefaults[i];
  }
}

function setSingleCookie(key, value) {
  document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
  USER_COOKIE[key] = value;
}

function getCookie(callback) {
  if (document.cookie !== "") {
    let cookiePairs = document.cookie.split("; ");
    for (let i = 0; i < cookiePairs.length; i++) {
      let keyValue = cookiePairs[i].split("=");
      USER_COOKIE[keyValue[0]] = decodeURIComponent(keyValue[1]);
    }
  }
  callback();
}

function setUserPreferences() {
  // TODO: Find some way to generalize this process.
  if (USER_COOKIE.accuracy) {
    let selector = "#accuracy option[value='" + USER_COOKIE.accuracy + "']";
    document.querySelector(selector).selected = true;
  }

  if (USER_COOKIE.intervals) {
    for (let i = 0; i < USER_COOKIE.intervals.length; i += 2) {
      document.getElementById("interval" + USER_COOKIE.intervals.slice(i, i+2)).checked = true;
    }
  }
}

// TODO: Note: make sure no sensitive information ever goes in said cookies.

/* Primary app functions */

// TODO: Add another parameter for interval type
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

function displayScore() {
  let percent = Math.round(DATA.totalCorrect / DATA.totalQuestions * 100);
  let scoreStr = percent + "% (" + DATA.totalCorrect + "/" + DATA.totalQuestions + ")";
  document.getElementById("score").innerHTML = scoreStr;
}

function updateScore(isCorrect) {
  if (!CURRENT_EXAMPLE.isScored) {
    // Prevent multiple scorings of the same example
    CURRENT_EXAMPLE.isScored = true;
    // Update long-run score information
    DATA.totalQuestions += 1;
    if (isCorrect) {
      DATA.totalCorrect += 1;
    }
  }
}

function getAccuracy() {
  let accuracy = Number(document.getElementById("accuracy").value);
  USER_COOKIE.accuracy = accuracy;
  return accuracy;
}

function getIntervals() {
  let intervals = document.getElementsByName("intervals");
  let checkedString = "";
  let intervalsArray = [];
  for (var i = 0; i < intervals.length; i++) {
    if (intervals[i].checked) {
      checkedString += intervals[i].value;
      intervalsArray.push(intervals[i].value);
    }
  }
  if (checkedString) USER_COOKIE.intervals = checkedString;
  return intervalsArray;
}

function newExample(audioContext) {
  // Assorted parameters
  const noteList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  let tuningDelta = getAccuracy(); // User-defined
  let intervals = getIntervals(); // User-defined
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

  // Scoring
  CURRENT_EXAMPLE.isScored = false;

  // Allow replays after the audio plays, or move on if the
  // user has already answered.
  let callback = function() {
    CURRENT_EXAMPLE.isPlaying = false;
    if (CURRENT_EXAMPLE.isScored) {
      // Timeout is arbitrary
      setTimeout(function() {
        playNewExample(audioContext);
      }, 200);
    } else {
      addReplayButton();
    }
  };

  // Initial audio playback
  CURRENT_EXAMPLE.isPlaying = true;
  playAudio(audioContext, noteName, octave, detune, duration, waveform, callback);
}

function playNewExample(audioContext) {
  if (!CURRENT_EXAMPLE.isPlaying) {
    // Clear feedback
    document.getElementById("feedback").innerHTML = "";
    // Remove control buttons
    removeReplayButton();
    // Play next example
    newExample(audioContext);
  }
}

function chooseFlat(audioContext) {
  if (!CURRENT_EXAMPLE.isScored) {
    // Display feedback
    let feedback = document.getElementById("feedback");
    if (CURRENT_EXAMPLE.isFlat) {
      feedback.innerHTML = "✓";
      feedback.setAttribute("style", "color: green");
    } else {
      feedback.innerHTML = "✕";
      feedback.setAttribute("style", "color: red");
    }
  }
  // Update and display score
  updateScore(CURRENT_EXAMPLE.isFlat);
  displayScore();
  // TODO: Change this to be dependent on the NEXT button?
  // Play next example
  setTimeout(function() {
    playNewExample(audioContext);
  }, 1000);
}

function chooseSharp(audioContext) {
  if (!CURRENT_EXAMPLE.isScored) {
    // Display feedback
    let feedback = document.getElementById("feedback");
    if (!CURRENT_EXAMPLE.isFlat) {
      feedback.innerHTML = "✓";
      feedback.setAttribute("style", "color: green");
    } else {
      feedback.innerHTML = "✕";
      feedback.setAttribute("style", "color: red");
    }
  }
  // Update and display score
  updateScore(!CURRENT_EXAMPLE.isFlat);
  displayScore();
  // TODO: Change this to be dependent on the NEXT button?
  // Play next example
  setTimeout(function() {
    playNewExample(audioContext);
  }, 1000);
}

// Should be called before the first call to newExample
function setAnswerListeners(audioContext) {
  // Listen for answer (flat or sharp)
  document.getElementById("flat").addEventListener("click", chooseFlat.bind(null, audioContext));
  document.getElementById("sharp").addEventListener("click", chooseSharp.bind(null, audioContext));
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
    if (CURRENT_EXAMPLE.allowReplays && !CURRENT_EXAMPLE.isPlaying) {
      CURRENT_EXAMPLE.isPlaying = true;
      playAudio(audioContext, noteName, octave, detune, duration, waveform, function(){
        CURRENT_EXAMPLE.isPlaying = false;
        if (CURRENT_EXAMPLE.isScored) {
          // Timeout is arbitrary
          setTimeout(function() {
            playNewExample(audioContext);
          }, 200);
        }
      });
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
(function onPageLoad() {
  let audioContext = new AudioContext();
  getCookie(setUserPreferences);
  setAnswerListeners(audioContext);
  newExample(audioContext);

  // Save user settings when they leave the quiz
  window.addEventListener("beforeunload", function(evt) {
    setCookie(USER_COOKIE, COOKIE_DEFAULTS);
  });
})();
