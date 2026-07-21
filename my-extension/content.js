console.log("Content script loaded");

function onOff() {
    document.body.classList.toggle("ui-debugger");
    console.log("Toggled");
    document.body.classList.contains("ui-debugger") ? console.log("on") : console.log("off");
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleDebugger") {
        onOff();
    }
});