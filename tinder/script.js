// Array of event image filenames
const events = [
  "Event 1.png.png",
  "Event 2.png.png",
  "Event 3.png.png",
  "Event 4.png.png",
  "Event 5.png.png"
];

// DOM elements
const eventImage = document.getElementById("eventImage");
const swipeOverlay = document.getElementById("swipeOverlay");
const overlayImage = document.getElementById("overlayImage");
const noZone = document.getElementById("noZone");
const yesZone = document.getElementById("yesZone");

let currentIndex = 0;
let isAnimating = false;

// Update the card with the current event image and trigger enter animation
function updateCard() {
  const nextImage = events[currentIndex];
  eventImage.src = encodeURI(`assets/Wireframes/${nextImage}`);
  const cardFrame = document.getElementById("cardFrame");
  cardFrame.classList.remove("active");
  setTimeout(() => {
    cardFrame.classList.add("active");
  }, 10);
}

// Show feedback overlay based on direction
function showFeedback(direction) {
  const animationName = direction === "right"
    ? "assets/Animation/yes.png.png"
    : "assets/Animation/no.png.png";

  overlayImage.src = encodeURI(animationName);
  swipeOverlay.classList.add("active", direction);

  setTimeout(() => {
    swipeOverlay.classList.remove("active", "left", "right");
  }, 300); // match transition time
}

// Move to the next event in the cycle
function nextEvent() {
  currentIndex = (currentIndex + 1) % events.length;
  updateCard();
}

// Handle user choice (left for no, right for yes)
function handleChoice(direction) {
  if (isAnimating) return;
  isAnimating = true;

  showFeedback(direction);

  setTimeout(() => {
    nextEvent();
    isAnimating = false;
  }, 260);
}

// Event listeners for tap zones
noZone.addEventListener("click", () => handleChoice("left"));
yesZone.addEventListener("click", () => handleChoice("right"));

// Initialize the first card
updateCard();
document.getElementById("cardFrame").classList.add("active");
