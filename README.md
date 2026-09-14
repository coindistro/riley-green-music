# Riley Green Music

A static one-page recreation of the Riley Green official site homepage for local preview and GitHub hosting.

## Run Locally

Open `index.html` directly in a browser, or serve the Riley Green folder with any static server.

```bash
http://127.0.0.1:8087/local-one-page/
```

## Files

- `index.html` - homepage sections, navigation, splash, and footer
- `fan-club.html` - premium fan club membership page with test BTC checkout buttons
- `styles.css` - responsive Riley Green-inspired styling
- `script.js` - splash, mobile menu, local form, and fixed-rate BTC checkout interactions
- `assets/` - local Riley Green image and logo assets from the mirrored site

## Payment Test Setup

The fan club checkout currently uses a fixed test conversion rate of `1 BTC = $100,000`.
Replace `BTC_ADDRESS_HERE` and the empty `qrImage` value in `script.js` before using real payment details.
