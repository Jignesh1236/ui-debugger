console.log("Content script loaded");

function onOff() {
    document.body.classList.toggle("ui-debugger");
    console.log("Toggled");
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleDebugger") {
        onOff();
    }
});