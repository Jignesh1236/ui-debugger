console.log("UI Debugger: Content script loaded");

// ─ DOM Elements (created once at script load) ─

// Overlay box for width/height display
const overlay = document.createElement("div");
overlay.id = "debugger-overlay";

// Lines (red measurement lines from element to viewport edges)
const topLine = document.createElement("div");
topLine.className = "ui-debugger-line ui-debugger-line-vertical";

const rightLine = document.createElement("div");
rightLine.className = "ui-debugger-line ui-debugger-line-horizontal";

const bottomLine = document.createElement("div");
bottomLine.className = "ui-debugger-line ui-debugger-line-vertical";

const leftLine = document.createElement("div");
leftLine.className = "ui-debugger-line ui-debugger-line-horizontal";

// Labels (distance values shown at line endpoints)
const topLabel = document.createElement("div");
topLabel.className = "ui-debugger-label";

const rightLabel = document.createElement("div");
rightLabel.className = "ui-debugger-label";

const bottomLabel = document.createElement("div");
bottomLabel.className = "ui-debugger-label";

const leftLabel = document.createElement("div");
leftLabel.className = "ui-debugger-label";

// ─ Append elements to body once 

const elements = [
  overlay,
  topLine, rightLine, bottomLine, leftLine,
  topLabel, rightLabel, bottomLabel, leftLabel,
];
elements.forEach((el) => document.body.appendChild(el));

// ─ Helper functions 

function hideAllMeasurements() {
  [topLine, rightLine, bottomLine, leftLine,
   topLabel, rightLabel, bottomLabel, leftLabel,
  ].forEach((el) => { el.style.display = "none"; });
}

function updateOverlayBox(event) {
  if (!document.body.classList.contains("ui-debugger")) {
    overlay.style.display = "none";
    return;
  }

  const target = event.target;
  overlay.textContent = `Width: ${target.offsetWidth}px Height: ${target.offsetHeight}px`;
  overlay.style.left = event.clientX + 12 + "px";
  overlay.style.top = event.clientY - 28 + "px";
  overlay.style.display = "block";
}

function updateSelection(rect) {
  //  Top line: vertical line from viewport top to element top
  topLine.style.display = "block";
  topLine.style.left = rect.left + rect.width / 2 + "px";
  topLine.style.top = "0px";
  topLine.style.height = rect.top + "px";

  //  Right line: horizontal line from element right to viewport right edge
  rightLine.style.display = "block";
  rightLine.style.left = rect.right + "px";
  rightLine.style.top = rect.top + rect.height / 2 + "px";
  rightLine.style.width = Math.max(0, window.innerWidth - rect.right) + "px";

  //  Bottom line: vertical line from element bottom to viewport bottom edge
  bottomLine.style.display = "block";
  bottomLine.style.left = rect.left + rect.width / 2 + "px";
  bottomLine.style.top = rect.bottom + "px";
  bottomLine.style.height = Math.max(0, window.innerHeight - rect.bottom) + "px";

  //Left line: horizontal line from viewport left edge to element left
  leftLine.style.display = "block";
  leftLine.style.left = "0px";
  leftLine.style.top = rect.top + rect.height / 2 + "px";
  leftLine.style.width = rect.left + "px";
}

function updateMeasurements(rect) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const topDistance = rect.top;
  const rightDistance = windowWidth - rect.right;
  const bottomDistance = windowHeight - rect.bottom;
  const leftDistance = rect.left;

  //  Top label 
  topLabel.textContent = `Top: ${Math.round(topDistance)}px`;
  topLabel.style.display = "block";
  // Position to the right of the top line, or if no space, to the left
  const topLabelOffset = rect.left + rect.width / 2 + 6;
  topLabel.style.left = (topLabelOffset + 60 > windowWidth
    ? rect.left + rect.width / 2 - 70
    : topLabelOffset) + "px";
  topLabel.style.top = Math.max(0, rect.top / 2 - 8) + "px";

  //  Right label 
  rightLabel.textContent = `Right: ${Math.round(rightDistance)}px`;
  rightLabel.style.display = "block";
  const rightLabelX = rect.right + Math.max(0, rightDistance) / 2 - 25;
  rightLabel.style.left = (rightLabelX + 50 > windowWidth
    ? rect.right - 60
    : rightLabelX) + "px";
  rightLabel.style.top = rect.top + rect.height / 2 - 8 + "px";

  //  Bottom label 
  bottomLabel.textContent = `Bottom: ${Math.round(bottomDistance)}px`;
  bottomLabel.style.display = "block";
  const bottomLabelY = rect.bottom + Math.max(0, bottomDistance) / 2 - 8;
  bottomLabel.style.left = rect.left + rect.width / 2 - 20 + "px";
  bottomLabel.style.top = (bottomLabelY + 20 > windowHeight
    ? rect.bottom - 20
    : bottomLabelY) + "px";

  //  Left label 
  leftLabel.textContent = `Left: ${Math.round(leftDistance)}px`;
  leftLabel.style.display = "block";
  const leftLabelX = Math.max(0, leftDistance) / 2 - 15;
  leftLabel.style.left = (leftLabelX < 0 ? 4 : leftLabelX) + "px";
  leftLabel.style.top = rect.top + rect.height / 2 - 8 + "px";
}

// ─ Event Listeners (registered once at the top level) 

document.addEventListener("mousemove", (event) => {
  if (!document.body.classList.contains("ui-debugger")) return;
  updateOverlayBox(event);
});

document.addEventListener("mouseover", (event) => {
  if (!document.body.classList.contains("ui-debugger")) return;

  const target = event.target;
  // Skip measurement elements themselves
  if (target.classList.contains("ui-debugger-line") ||
      target.classList.contains("ui-debugger-label") ||
      target.id === "debugger-overlay") {
    return;
  }

  const rect = target.getBoundingClientRect();
  updateSelection(rect);
  updateMeasurements(rect);
});

// Hide measurements when leaving the element
document.addEventListener("mouseout", (event) => {
  if (!document.body.classList.contains("ui-debugger")) return;

  const target = event.target;
  if (target.classList.contains("ui-debugger-line") ||
      target.classList.contains("ui-debugger-label") ||
      target.id === "debugger-overlay") {
    return;
  }

  // Only hide if we're not moving to a child of the same element
  const relatedTarget = event.relatedTarget;
  if (relatedTarget && target.contains(relatedTarget)) return;

  hideAllMeasurements();
});

// ─ Toggle Function ─

function onOff() {
  const isActive = document.body.classList.toggle("ui-debugger");
  console.log(`UI Debugger: ${isActive ? "ON" : "OFF"}`);

  if (!isActive) {
    overlay.style.display = "none";
    hideAllMeasurements();
  }
}

// ─ Message Listener (receives toggle command from popup) ─

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleDebugger") {
    onOff();
  }
});

