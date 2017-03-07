(function() {
  var audioContext = new AudioContext();
  document.getElementById("make-noise").addEventListener("click", function() {
    // Nodes
    let base = audioContext.createOscillator();
    let primary = audioContext.createOscillator();
    let baseGain = audioContext.createGain();
    let primaryGain = audioContext.createGain();

    // Timing variables
    let startTime = audioContext.currentTime + 0.1;
    let duration = 3;
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
    baseGain.gain.value = 0.5; // So the primary is louder than the base

    // Settings for primary node
    primary.frequency.value = 440;
    primary.detune.value = 25; // Detune A440 up by 25 cents

    // Start sounds
    base.start(startTime);
    primary.start(startTime + primaryDelay);

    // Stop sounds eventually
    primary.stop(stopTime);
    base.stop(stopTime);
  });
})();
