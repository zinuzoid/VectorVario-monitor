# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (hot reload)
- `npm run build` — production build
- `npm run preview` — preview production build locally

No test runner or linter is configured.

## Architecture

VV-Monitor is a React SPA that connects to a **VectorVario** BLE sensor (paragliding instrument) via Web Bluetooth and displays real-time telemetry: true airspeed (TAS), temperature, humidity, and battery level.

### Data flow

1. **`src/services/VectorVarioService.js`** — singleton BLE service class. Handles Web Bluetooth device pairing (filters devices with `[VV]` name prefix), GATT connection, subscribing to BLE characteristic notifications, and parsing raw DataView values. Uses standard BLE UUIDs for Environmental Sensing (0x181a) and Battery (0x180f), plus a custom UUID for TAS.
2. **`src/hooks/useVectorVario.js`** — React hook that wraps the BLE service. Manages all sensor state, maintains 1-hour rolling time-series buffers (`addToBuffer`), estimates battery time remaining from drain rate, and provides a simulation mode for UI testing without hardware.
3. **`src/App.jsx`** — orchestrates the UI: StatusHeader for connection controls, BigNumber readouts, and two graph panels.

### Components

- **`StatusHeader`** — connection/disconnect buttons, simulation toggle, graph time-window selector (10m/20m/30m/1h), battery display with estimated time remaining.
- **`BigNumber`** — large numeric readout (temp, humidity, TAS).
- **`EnvGraph`** — dual-axis Recharts line chart (temperature + humidity) with configurable time window.
- **`TASGraph`** — single-axis Recharts line chart for airspeed.

### Key conventions

- All data points use `{ time: number, value: number }` shape where `time` is `Date.now()` ms timestamp.
- Graphs filter data client-side to the selected window; the hook buffer retains up to 1 hour max.
- Styling: Tailwind CSS with a dark slate theme (`bg-slate-800`, `text-slate-300`, etc.). No custom Tailwind config beyond defaults.
- All components use named exports except `App` (default export).
- JSX files use `.jsx` extension; plain JS uses `.js`.

## Stack

- React 18, Vite 6, Tailwind CSS 3, Recharts 2
- No TypeScript, no state management library, no router
- CI: GitHub Actions runs `npm ci && npm run build` on `main` branch
