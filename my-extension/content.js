console.log("Content script loaded");
const overlay = document.createElement("div");
overlay.innerHTML = `hello`;



function onOff() {
    document.body.classList.toggle("ui-debugger");
    console.log("Toggled");
    document.body.classList.contains("ui-debugger") ? console.log("on") : console.log("off");

    if (document.body.classList.contains("ui-debugger")) {
        overlay.style.display = "block";
        document.addEventListener("mousemove", moveOverlay);
    } else {
        overlay.style.display = "none";
        document.removeEventListener("mousemove", moveOverlay);
    }
}

function moveOverlay(e) {
    const rect = e.target.getBoundingClientRect();

    overlay.style.left = rect.left + "px";
    overlay.style.top = rect.top + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
}


chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleDebugger") {
        onOff();
    }
});