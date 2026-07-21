# UI FACECARD

UI FACECARD is a Chrome extension designed for quick UI inspection and layout debugging directly in the browser.

## Features
- Adds a live UI debugging overlay to any webpage so users can inspect elements without opening developer tools.
- Lets you click any element on the page and instantly view its tag name, ID, CSS classes, and visible text content.
- Displays size information for the selected element, including its width and height in pixels.
- Shows background and text colors with visual swatches, making it easier to compare styling at a glance.
- Includes typography details such as font family, font weight, and font size for the selected element.
- Provides a visual box model preview showing margin, border, padding, and content area in a browser-style layout.
- Highlights element positions with on-screen measurement lines and labels for top, right, bottom, and left distances.
- Supports quick copying of values by clicking on any displayed property, which is useful for debugging and handoff workflows.
- Includes a polished popup interface with a toggle button to turn the debugger on or off from the browser toolbar.
- Designed as a lightweight developer tool for designers, frontend developers, and anyone who wants to inspect    webpage structure faster.

## Author
UI FACECARD
- [Project Repository](https://github.com)

## Socials
- [Instagram](https://www.instagram.com/p/DbDk4stiNgT/)
- [Reddit Hackathon](https://www.reddit.com/r/hackathon/s/ce4ez1R6nm)
- [Reddit Hackathon Post](https://www.reddit.com/r/hackathon/s/T5fOpdTqZZ)
- [Reddit Hackathon Update](https://www.reddit.com/r/hackathon/s/rSbwFyKMhX)

## Requirements
### Knowledge
- HTML
- CSS
- JavaScript
- Chrome Extension APIs

### Tools
- Google Chrome Browser
- VS Code or any code editor

## Setup Instructions
### For Developers
1. Clone or download this project.
2. Open Google Chrome.
3. Go to chrome://extensions/.
4. Enable Developer Mode.
5. Click Load Unpacked.
6. Select the project folder and confirm.
7. Reload the extension after changes to see updates.

### For End Users
1. Install the extension in Chrome.
2. Open any webpage.
3. Click the extension icon to open the popup.
4. Toggle the UI debugger to inspect elements and view layout details.

## Project Structure
- content.js - main logic for overlay, selection, and drawer metadata
- assets/styles/content.css - styling for the debugging UI
- popup/popup.html - popup interface
- manifest.json - extension configuration
- icons/ON.svg - extension icon

## License
Please refer to the LICENSE file.
