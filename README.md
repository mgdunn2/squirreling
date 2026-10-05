# Squirreling

A private, local-first squirrel sighting log designed as an installable iPhone web app.

## Features

- One-tap squirrel sightings
- Configurable primary and quick-species buttons
- Optional GPS coordinates
- Camera capture with on-device photo compression
- Calendar and complete sighting history
- OpenStreetMap/Leaflet sighting map
- Offline app shell
- JSON backup and restore

All sightings, coordinates, settings, and photos are stored locally in the browser using IndexedDB and localStorage. There is no application server or user account.

## Run locally

Serve the `dist` directory over HTTP:

```sh
python3 -m http.server 8000 --directory dist
```

Then open [http://localhost:8000](http://localhost:8000).

Browser security requires HTTPS or localhost for geolocation, service workers, and camera behavior.

## Install on iPhone

Open the hosted app in Safari, choose **Share → Add to Home Screen**, enable **Open as Web App**, and tap **Add**.

## Hosted version

[Open Squirreling](https://squirreling-log.mgdunnvt.chatgpt.site)
