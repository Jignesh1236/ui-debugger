console.log("Content script loaded");
const overlay = document.createElement("div");

overlay.style.cssText = `
    position: fixed;
    background: #1e90ff;
    color: #fff;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
    pointer-events: none;
    z-index: 2147483647;
    display: none;
`;

overlay.id = "width-height";
    document.body.appendChild(overlay);
function onOff() {
  document.body.classList.toggle("ui-debugger");
  console.log("Toggled");
  document.body.classList.contains("ui-debugger") ? console.log("on") : console.log("off");
  // show width and height of element on hover toggle disply hidden and visible useing css #width-height

  document.addEventListener("mousemove", (event) => {
    if (!document.body.classList.contains("ui-debugger")) return;

    const width = event.target.offsetWidth;
    const height = event.target.offsetHeight;

    overlay.textContent = `Width: ${width}px Height: ${height}px`;
    // Mouse ke thoda upar-right
    overlay.style.left = (event.clientX + 12) + "px";
    overlay.style.top = (event.clientY - 28) + "px";

    overlay.style.display = "block";
});
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleDebugger") {
    onOff();
  }
});
