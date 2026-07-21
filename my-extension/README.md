# UI FACECARD

UI FACECARD is a Chrome extension built to enhance web UI inspection with a polished popup facecard interface.

It helps developers and designers quickly understand page structure, selected elements, and visual measurements without leaving the browser.

## What this extension does

- Injects a live UI debugger overlay into web pages on demand.
- Lets users select a DOM element and inspect tag, ID, class, text, size, background, text color, and font.
- Displays layout measurements and element metadata in the side drawer.
- Includes a popup UI with a facecard image and a toggle button.
- Provides a lightweight UI debugging workflow without AI or chat functionality.

## Key files

- `content.js` - main content script for overlay creation, element selection, and metadata display.
- `assets/styles/content.css` - styling for the debugger panel, drawer, footer, and error states.
- `popup/popup.html` - popup UI with the facecard and toggle button.
- `manifest.json` - extension configuration, including the icon settings.
- `icons/ON.svg` - extension icon used in the browser toolbar and manifest.

## Setup

1. Open a terminal in `my-extension`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Load the extension as an unpacked extension in Chrome/Edge using the `my-extension` folder.

## Usage

1. Click the extension icon to open the popup.
2. The popup displays the `UI FACECARD` face image from `assets/images/image.png`.
3. Click **Toggle UI Debugger** to enable or disable the overlay on the current page.
4. Use the page overlay to inspect elements and view metadata for selected UI components.

## Icon support

- The extension now includes `icons/ON.svg`.
- `manifest.json` uses this icon for the browser toolbar and extension listing.
- `action.default_icon` and `icons` entries are configured for 16, 32, 48, and 128 sizes.

## Environment config

- This extension no longer uses AI or OpenRouter.
- There is no `.env` or API configuration required.

## Notes

- The popup uses a local facecard image at `../assets/images/image.png`.
- If you want to replace the icon, update `icons/ON.svg` and the manifest references.
