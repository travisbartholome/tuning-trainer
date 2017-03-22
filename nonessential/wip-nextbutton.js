/**
  I was going to add a NEXT button, but I decided to hold off
    on that feature for now.
  Mar. 21, 2017
*/

function addNextButton() {
  // Allow moving to next example in global settings
  CURRENT_EXAMPLE.allowNext = true;
  // Show next button
  document.getElementById("next").setAttribute("style", "display: default");
}

function removeNextButton() {
  // Disallow moving to next example in global settings
  CURRENT_EXAMPLE.allowNext = false;
  // Hide next button
  document.getElementById("next").setAttribute("style", "display: none");
}

// In newExample, set CURRENT_EXAMPLE.allowNext = false;
// In playNewExample, call removeNextButton

// Add listeners for the NEXT button
let next = document.getElementById("next");
next.addEventListener("click", function() {
  // Play new example if possible
  if (CURRENT_EXAMPLE.allowNext) {
    setTimeout(function() {
      playNewExample(audioContext);
    }, 200);
  }
});
