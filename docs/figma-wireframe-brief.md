# Figma Wireframe Brief

Date: 2026-05-14

## Purpose

Use this document as the starting point for Figma wireframes and a clickable prototype before implementation.

## Figma File

- File name: `Eightcap Market Demo - Wireframes`
- URL: https://www.figma.com/design/CsK2FHAqyu4bmOkiXTmkGp
- Pages: `00 Cover`, `01 Wireframes`, `02 Components`
- Status: mobile-first wireframes created, basic prototype navigation wired, and visually checked against standard phone and tablet-web preview frames.

## Frames

- `01 Market Home / iPhone 15`
- `02 Instrument Detail / iPhone 15`
- `03 Watchlist / iPhone 15`
- `04 Insights / iPhone 15`
- `05 Disclaimer / iPhone 15`
- `06 Market Home / Small Phone`
- `07 Market Home / Tablet-Web Preview`

## Created Component References

- App header with search and market status.
- Segmented control.
- Instrument row with symbol, name, price, change, spread, and sparkline.
- Stat tile.
- Insight card.
- Disclosure/risk notice.

## Components To Design First

- App header with search and market status.
- Instrument row with symbol, name, price, change, spread, and sparkline.
- Category segmented control.
- Chart range segmented control.
- Stat tile.
- Insight card.
- Disclosure/risk notice.
- Empty state and loading skeleton.

## Layout Notes

- Start mobile-first at 390 x 844.
- Keep dense market data readable; prioritize scan speed over decorative sections.
- Use a centered max-width content column on web preview.
- Use top safe-area spacing and bottom tab/CTA spacing.
- Avoid a marketing landing page as the first screen; the first view should be the usable market dashboard.

## Visual Tokens To Explore

- Background: white / near-white.
- Text: near-black, gray secondary.
- Accent: bright green.
- Movement up: green.
- Movement down: red.
- Warning/risk: amber.
- Radius: compact 4-8 px.
- Typography: Work Sans-inspired scale, or platform-native equivalent.

## Prototype Flow

1. Open Market Home.
2. Tap XAUUSD or EURUSD.
3. View instrument detail.
4. Change time range.
5. Add/remove from watchlist.
6. Open Insights.
7. Open Disclaimer.

Implemented prototype links:

- Market Home rows `XAUUSD` and `EURUSD` navigate to Instrument Detail.
- Watchlist row `XAUUSD` navigates to Instrument Detail.
- Header info icons navigate to Disclaimer.
- Disclaimer CTA returns to Market Home.
- Bottom tab hotspots navigate between Markets, Watchlist, and Insights.

## Copy Guidelines

- Keep UI copy short and practical.
- Label the app as a demo where trading-like content appears.
- Avoid official Eightcap claims or regulated product promises.
- Do not present mock data as live data.
