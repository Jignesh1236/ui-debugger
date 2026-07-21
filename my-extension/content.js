console.log("Content script loaded");
const overlay = document.createElement("div");
overlay.id = "width-height";
function onOff() {
    document.body.classList.toggle("ui-debugger");
    console.log("Toggled");
    document.body.classList.contains("ui-debugger") ? console.log("on") : console.log("off");
    // show width and height of element on hover toggle disply hidden and visible useing css #width-height
    let elements = document.querySelectorAll("*");
    elements.forEach((element) => {
        element.addEventListener("mouseover", (event) => {
            if (document.body.classList.contains("ui-debugger")) {
                const width = event.target.offsetWidth;
                const height = event.target.offsetHeight;
                overlay.textContent = `Width: ${width}px, Height: ${height}px`;
            }
        });
    });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleDebugger") {
        onOff();
    }
});