# VectorVario Monitor
[![CI](https://github.com/zinuzoid/VectorVario-monitor/actions/workflows/ci.yml/badge.svg)](https://github.com/zinuzoid/VectorVario-monitor/actions/workflows/ci.yml)

**Live:** [vv.lazyrasp.com](https://vv.lazyrasp.com/)

Real-time telemetry dashboard for the [VectorVario](https://vectorvario.com). Connects via Web Bluetooth to display true airspeed (TAS), temperature, humidity, and battery status with live-updating graphs.

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## Features

- **Web Bluetooth** connection to VectorVario devices (filters by `[VV]` name prefix)
- **Big-number readouts** for TAS (km/h), temperature (°C), and humidity (%)
- **Time-series graphs** with selectable window (10m / 20m / 30m / 1h)
  - Dual-axis environment chart (temperature + humidity)
  - Airspeed chart
- **Battery monitoring** with estimated time remaining based on drain rate
- **Simulation mode** for UI testing without hardware
- Dark, high-contrast UI optimized for outdoor/cockpit use

## Requirements

- Node.js 20+
- A browser with [Web Bluetooth support](https://caniuse.com/web-bluetooth) (Chrome, Edge, Opera)

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, then either:

- Click **Connect VectorVario** to pair with a nearby sensor
- Click **Start Sim** to run with simulated data

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## BLE Protocol

The app connects to three GATT services on the VectorVario:

| Service | UUID | Characteristic | Data Format |
|---------|------|-----------------|-------------|
| Environmental Sensing | `0x181A` | Temperature (`0x2A6E`) | Sint16, 0.01 °C, LE |
| Environmental Sensing | `0x181A` | Humidity (`0x2A6F`) | Uint16, 0.01 %, LE |
| Battery | `0x180F` | Battery Level (`0x2A19`) | Uint8, % |
| TAS (custom) | `2fce4890-...` | Airspeed (`2fce4892-...`) | Uint16, 0.1 km/h, LE |

All characteristics use BLE notifications for real-time streaming. Initial values are read on connect.

## Tech Stack

- **React 18** — UI framework
- **Vite 6** — build tool and dev server
- **Tailwind CSS 3** — utility-first styling (dark slate theme)
- **Recharts 2** — time-series line charts
