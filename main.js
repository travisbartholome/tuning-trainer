(function() {
  var audioContext = new AudioContext();

  function playAudio(detune, duration, waveform) {
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
    base.frequency.value = 440;
    base.type = waveform;
    baseGain.gain.value = 0.3; // So the primary is louder than the base

    // Settings for primary node
    primary.frequency.value = 440;
    primary.type = waveform;
    primary.detune.value = detune; // Detune A440 up by 25 cents
    primaryGain.gain.value = 0.6; // Take the edge off

    // Start sounds
    base.start(startTime);
    primary.start(startTime + primaryDelay);

    // Stop sounds eventually
    primary.stop(stopTime);
    base.stop(stopTime);
  }

  document.getElementById("make-noise").addEventListener("click", function() {
    let detune = Number(document.getElementById("detune-value").value);
    let duration = Number(document.getElementById("duration-value").value);
    let waveform = document.querySelector('input[name=waveform]:checked').value;
    playAudio(detune, duration, waveform);
  });
})();
