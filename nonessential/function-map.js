/**
    Should be able to create a directed graph showing how each function
      calls other functions in quiz.js.
    This is mostly just out of curiosity, although it might be useful.

    Each function name is a property of connections
      and is associated with another object.
    If an object `callerFunc` has a property `funcName`, it means that
      `callerFunc` includes a call to `funcName`.

    This would probably be a good thing to automate.
*/

let connections = {
  playAudio: {},
  addReplayButton: {},
  removeReplayButton: {},
  addNextButton: {},
  removeNextButton: {},
  displayScore: {},
  updateScore: {},
  newExample: {
    addReplayButton: true,
    playAudio: true
  },
  playNewExample: {
    newExample: true,
    removeReplayButton: true
  },
  chooseFlat: {
    updateScore: true,
    displayScore: true,
    playNewExample: true
  },
  chooseSharp: {
    updateScore: true,
    displayScore: true,
    playNewExample: true
  },
  setAnswerListeners: {
    chooseSharp: true,
    chooseFlat: true,
    playAudio: true
  },
  onPageLoad: {
    setAnswerListeners: true,
    newExample: true
  }
};
