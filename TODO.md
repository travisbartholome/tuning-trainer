# Short-term TODOs

- Make the UI look better

- (Low priority) Figure out live reloading

- Move from cookies to local storage for user preferences?

# Known Bugs

- After using keyboard to answer, the main buttons no longer animate on hover/focus

    * Possibly due to the keyup event listener inside setAnswerListeners, but I'm not sure yet.

    * Replay has the same issue, but it resets/goes away temporarily with each new example.

# Long-term TODO List

### Add pitch accuracy test

- [x] Tell whether a pitch is flat or sharp

- [ ] Identify how far a pitch is out of tune

### Add intervals

- [x] Should be able to specify ascending, descending, or both

- [ ] Multiple difficulty levels: octaves, fifths, fourths, thirds, sevenths, sixths and seconds

- [x] Harmonic, melodic, or halfway (harmonic with delayed second attack)

- [ ] Allow intervals greater than an octave if the user chooses

### Add chords?

- [ ] Find which note is out of tune, and by how much

    * This might be evil, but useful

### Add a NEXT button

- [ ] Add NEXT button between examples

- [ ] Allow next button to appear and interrupt playings if the user gets the example right before the playback is finished?

- [ ] (Make said NEXT button removable eventually using user settings/config)
