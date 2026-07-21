console.log("Content script loaded");

function onOff() {
    document.body.classList.toggle("ui-debugger");
    console.log("Toggled");
    document.body.classList.contains("ui-debugger") ? console.log("on") : console.log("off");
    // show width and height of element on hover
    document.body.addEventListener("mouseover", (event) => {
        if (document.body.classList.contains("ui-debugger")) {
            const element = event.target;
            const width = element.offsetWidth;
            const height = element.offsetHeight;
            console.log(`Width: ${width}px, Height: ${height}px`);
        }
    });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleDebugger") {
        onOff();
    }
});