# Atmos — Weather Dashboard

A responsive weather dashboard with live current conditions, a five-day forecast, and Celsius/Fahrenheit switching.

## Features

- Search for cities around the world
- Optional browser location access (falls back to Kathmandu)
- Current temperature, apparent temperature, conditions, humidity, and wind
- Daily high/low temperatures and UV index
- Five-day forecast with weather icons and rain probability
- Celsius and Fahrenheit display
- Responsive layout for mobile and desktop

## Weather data

Powered by the free [Open-Meteo API](https://open-meteo.com/). No API key is required. City search and geocoding are also provided by Open-Meteo.

## Run locally

Open `index.html` in a modern browser. For best results, use a local web server or GitHub Pages because browser location access requires a secure context (HTTPS or localhost).

## Publish with GitHub Pages

1. Open repository **Settings → Pages**.
2. Select **Deploy from a branch**.
3. Choose `main` and `/(root)`, then save.
4. Open the published URL after deployment completes.

## Privacy

The app requests browser location permission to show nearby weather. If permission is denied or unavailable, it loads Kathmandu. The selected city is sent to Open-Meteo to retrieve weather information. No account or API key is required.

## Files

- `index.html` — dashboard structure
- `style.css` — responsive design
- `script.js` — API requests and rendering

## License

MIT. See [LICENSE](LICENSE).
