function onOff() {
    document.querySelector('body').classList.toggle('ui-debugger');
    console.log("Content script loaded and ready to receive messages.");
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleDebugger") {
        onOff();
    }
});
