# Contribution Banner Generator

A local React/Vite app that generates a GitHub-style contribution banner for X/Twitter.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL in your browser.

## Features

- GitHub-style contribution graph, cropped tight for an X banner
- Text rendered into the contribution grid via a built-in 5×7 pixel font
- Editable handle, year, and graph text
- Six color themes (Classic, Ocean, Grape, Halloween, Sunset, Light)
- Adjustable background contribution density
- Profile picture upload
- Shuffle background contribution cells
- Copy PNG to clipboard, or export as SVG / 2× PNG

## Project structure

| File | Responsibility |
| --- | --- |
| `src/glyphs.js` | 5×7 pixel font and text-to-grid rendering |
| `src/grid.js` | Seeded noise, grid building, contribution count |
| `src/themes.js` | Color palettes |
| `src/Banner.jsx` | The exported banner SVG |
| `src/App.jsx` | Controls, state, and export actions |

## Notes

The graph is intentionally limited to short text, around 8 characters, because a real GitHub contribution graph is 53 weeks by 7 days.
