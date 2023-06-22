const input = document.getElementById("input");
const leftHighlight = document.getElementById("left-highlight");
const rightHighlight = document.getElementById("right-highlight");
const middleHighlight = document.getElementById("middle-highlight");
const urlParams = new URLSearchParams(window.location.search);
const score = urlParams.get("score");

if (score) {
  moveHighlight(score);

  input.value = score;
}

// Move highlight to the specific level
function moveHighlight(score) {
  if (score < 30) {
    leftHighlight.classList.add("show-highlight");
    middleHighlight.classList.remove("show-highlight");
    rightHighlight.classList.remove("show-highlight");
  } else if (score < 80) {
    middleHighlight.classList.add("show-highlight");
    leftHighlight.classList.remove("show-highlight");
    rightHighlight.classList.remove("show-highlight");
  } else if (score < 101) {
    rightHighlight.classList.add("show-highlight");
    middleHighlight.classList.remove("show-highlight");
    leftHighlight.classList.remove("show-highlight");
  } else {
    rightHighlight.classList.remove("show-highlight");
    middleHighlight.classList.remove("show-highlight");
    leftHighlight.classList.remove("show-highlight");
  }
}

// Parse value from the input
function getAndParseValue(value) {
  const val = value.target.value;

  moveHighlight(parseInt(val, 10));
}

input.addEventListener("keyup", getAndParseValue);
