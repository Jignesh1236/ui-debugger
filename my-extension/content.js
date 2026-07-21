console.log("UI Debugger: Content script loaded");

// ─ DOM Elements (created once at script load) ─

// Overlay box for width/height display
const overlay = document.createElement("div");
overlay.id = "debugger-overlay";

// Simple side drawer to show latest clicked element data
const drawer = document.createElement("div");
drawer.id = "debugger-drawer";
drawer.className = "ui-debugger-drawer";

const drawerToggle = document.createElement("button");
drawerToggle.className = "debugger-drawer-toggle";
drawerToggle.textContent = "☰";

const drawerHeader = document.createElement("div");
drawerHeader.className = "debugger-drawer-header";
drawerHeader.innerHTML = "<strong>Selected Element</strong>";
drawerHeader.appendChild(drawerToggle);

const drawerContent = document.createElement("div");
drawerContent.className = "debugger-drawer-content";

drawer.appendChild(drawerHeader);
drawer.appendChild(drawerContent);

// Track last selected element info for drawer display
let lastSelectedInfo = null;

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
  overlay, drawer,
  topLine, rightLine, bottomLine, leftLine,
  topLabel, rightLabel, bottomLabel, leftLabel,
];
elements.forEach(function(el) {
  document.body.appendChild(el);
});

// ─ Helper functions 

function copyTextToClipboard(text) {
  if (!text) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(function() {
      fallbackCopyText(text);
    });
    return;
  }

  fallbackCopyText(text);
}

function fallbackCopyText(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  tempInput.setAttribute("readonly", "");
  tempInput.style.position = "fixed";
  tempInput.style.left = "-9999px";
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  tempInput.remove();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function hideAllMeasurements() {
  [topLine, rightLine, bottomLine, leftLine,
   topLabel, rightLabel, bottomLabel, leftLabel,
  ].forEach(function(el) {
    el.style.display = "none";
  });
}

function setDrawerVisible(isVisible) {
  drawer.style.display = isVisible ? "block" : "none";
  if (isVisible) {
    drawer.classList.add("open");
  } else {
    drawer.classList.remove("open");
  }
}

function updateDrawer(target) {
  const computedStyle = window.getComputedStyle(target);
  const tagName = target.tagName || "DIV";
  const idValue = target.id || "-";
  const classValue = target.className || "-";
  const textValue = (target.textContent || "").trim().slice(0, 80) || "-";
  const sizeValue = `${target.offsetWidth}px × ${target.offsetHeight}px`;
  const bgColor = computedStyle.backgroundColor || "transparent";
  const textColor = computedStyle.color || "inherit";
  const fontValue = computedStyle.fontFamily || "inherit";

  drawerContent.innerHTML = [
    `<div class="debugger-drawer-item" data-copy-value="${escapeHtml(tagName)}"><strong>Tag:</strong> ${escapeHtml(tagName)}</div>`,
    `<div class="debugger-drawer-item" data-copy-value="${escapeHtml(idValue)}"><strong>ID:</strong> ${escapeHtml(idValue)}</div>`,
    `<div class="debugger-drawer-item" data-copy-value="${escapeHtml(classValue)}"><strong>Class:</strong> ${escapeHtml(classValue)}</div>`,
    `<div class="debugger-drawer-item" data-copy-value="${escapeHtml(textValue)}"><strong>Text:</strong> ${escapeHtml(textValue)}</div>`,
    `<div class="debugger-drawer-item" data-copy-value="${escapeHtml(sizeValue)}"><strong>Size:</strong> ${escapeHtml(sizeValue)}</div>`,
    `<div class="debugger-drawer-item" data-copy-value="${escapeHtml(bgColor)}"><strong>BG:</strong> ${escapeHtml(bgColor)}</div>`,
    `<div class="debugger-drawer-item" data-copy-value="${escapeHtml(textColor)}"><strong>Text Color:</strong> ${escapeHtml(textColor)}</div>`,
    `<div class="debugger-drawer-item" data-copy-value="${escapeHtml(fontValue)}"><strong>Font:</strong> ${escapeHtml(fontValue)}</div>`
  ].join("");

  setDrawerVisible(true);
}

function updateOverlayBox(event) {
  if (!document.body.classList.contains("ui-debugger")) {
    overlay.style.display = "none";
    return;
  }

  const target = event.target;
  const computedStyle = window.getComputedStyle(target);
  const bgColor = computedStyle.backgroundColor || "transparent";
  const textColor = computedStyle.color || "inherit";
  const fontValue = computedStyle.fontFamily || "inherit";

  overlay.innerHTML = [
    `<div class="debugger-overlay-title">Size: ${target.offsetWidth}px × ${target.offsetHeight}px</div>`,
    `<div class="debugger-overlay-row" data-copy-value="${bgColor}"><span>BG:</span> <span class="debugger-overlay-value">${bgColor}</span></div>`,
    `<div class="debugger-overlay-row" data-copy-value="${textColor}"><span>Text:</span> <span class="debugger-overlay-value">${textColor}</span></div>`,
    `<div class="debugger-overlay-row" data-copy-value="${fontValue}"><span>Font:</span> <span class="debugger-overlay-value">${fontValue}</span></div>`
  ].join("");

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
  let topLabelLeft = topLabelOffset;
  if (topLabelOffset + 60 > windowWidth) {
    topLabelLeft = rect.left + rect.width / 2 - 70;
  }
  topLabel.style.left = topLabelLeft + "px";
  topLabel.style.top = Math.max(0, rect.top / 2 - 8) + "px";

  //  Right label 
  rightLabel.textContent = `Right: ${Math.round(rightDistance)}px`;
  rightLabel.style.display = "block";
  const rightLabelX = rect.right + Math.max(0, rightDistance) / 2 - 25;
  let rightLabelLeft = rightLabelX;
  if (rightLabelX + 50 > windowWidth) {
    rightLabelLeft = rect.right - 60;
  }
  rightLabel.style.left = rightLabelLeft + "px";
  rightLabel.style.top = rect.top + rect.height / 2 - 8 + "px";

  //  Bottom label 
  bottomLabel.textContent = `Bottom: ${Math.round(bottomDistance)}px`;
  bottomLabel.style.display = "block";
  const bottomLabelY = rect.bottom + Math.max(0, bottomDistance) / 2 - 8;
  let bottomLabelTop = bottomLabelY;
  if (bottomLabelY + 20 > windowHeight) {
    bottomLabelTop = rect.bottom - 20;
  }
  bottomLabel.style.left = rect.left + rect.width / 2 - 20 + "px";
  bottomLabel.style.top = bottomLabelTop + "px";

  //  Left label 
  leftLabel.textContent = `Left: ${Math.round(leftDistance)}px`;
  leftLabel.style.display = "block";
  const leftLabelX = Math.max(0, leftDistance) / 2 - 15;
  let leftLabelLeft = leftLabelX;
  if (leftLabelX < 0) {
    leftLabelLeft = 4;
  }
  leftLabel.style.left = leftLabelLeft + "px";
  leftLabel.style.top = rect.top + rect.height / 2 - 8 + "px";
}

// Event Listeners (registered once at the top level) 

document.addEventListener("mousemove", function(event) {
  if (!document.body.classList.contains("ui-debugger")) return;
  updateOverlayBox(event);
});

overlay.addEventListener("click", function(event) {
  const row = event.target.closest(".debugger-overlay-row");
  if (!row) return;

  const value = row.getAttribute("data-copy-value");
  copyTextToClipboard(value);
  row.classList.add("copied");
  setTimeout(function() {
    row.classList.remove("copied");
  }, 800);
});

drawerToggle.addEventListener("click", function() {
  if (!document.body.classList.contains("ui-debugger")) return;
  drawer.classList.toggle("open");
  drawer.style.display = "block";
});

drawerContent.addEventListener("click", function(event) {
  const item = event.target.closest(".debugger-drawer-item");
  if (!item) return;

  const value = item.getAttribute("data-copy-value");
  copyTextToClipboard(value);
  item.classList.add("copied");
  setTimeout(function() {
    item.classList.remove("copied");
  }, 800);
});

document.addEventListener("click", function(event) {
  if (!document.body.classList.contains("ui-debugger")) return;

  const target = event.target;
  if (target.closest("#debugger-drawer")) return;
  if (target.classList.contains("ui-debugger-line") ||
      target.classList.contains("ui-debugger-label") ||
      target.id === "debugger-overlay") {
    return;
  }

  updateDrawer(target);
});

document.addEventListener("mouseover", function(event) {
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
document.addEventListener("mouseout", function(event) {
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

// Toggle Function

function onOff() {
  const isActive = document.body.classList.toggle("ui-debugger");
  if (isActive) {
    console.log("UI Debugger: ON");
  } else {
    console.log("UI Debugger: OFF");
  }

  if (isActive) {
    setDrawerVisible(true);
  } else {
    setDrawerVisible(false);
    overlay.style.display = "none";
    hideAllMeasurements();
  }
}

// Message Listener (receives toggle command from popup)



chrome.runtime.onMessage.addListener(function(message) {
  if (message.action === "toggleDebugger") {
    onOff();
  }
});

