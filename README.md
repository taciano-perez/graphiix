# GraphIIx

GraphIIx is a minimal web-based pixel editor inspired by the Apple II. It displays an 8×7 grid of cells that can be toggled on and off to create simple monochrome graphics.

The editor can generate three representations of the drawing: a raw bit pattern, a hexadecimal pattern and a decimal pattern.
When generating, each bit pattern line is horizontally inverted so that a sequence like `10001000` becomes `00010001`.

## Running the app

Open `index.html` in a modern web browser. No build step is required; the page uses plain HTML, CSS, and JavaScript. You can also serve the folder with any static file server (for example: `python -m http.server`) and navigate to the page.

## Testing

Automated tests verify that the grid is created correctly and that clicking a cell toggles its state. Run the tests with:

```
npm test
```

This executes `test.js`, which stubs the DOM and exercises the grid logic.

## Design notes

On `DOMContentLoaded`, `script.js` constructs a grid of 56 `<div>` elements inside the `#grid` container. Each cell listens for click events that toggle the `active` class. `styles.css` lays out the 8×7 grid and colours active cells black. The lightweight structure makes it easy for developers to extend the editor with additional features such as larger canvases or colour support.

Custom fonts from the `font` directory are used: the title is rendered with `PrintChar21`, while buttons and captions use `PRNumber3`.

