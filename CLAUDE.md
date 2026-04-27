# CLAUDE.md — Bambu Labs Printer
> Loaded automatically every Claude Code session.

---

## Project Overview

**Name:** Bambu Labs Printer Integration
**Status:** Connected — MQTT telemetry flowing

Monitoring, troubleshooting, and automation for a Bambu Labs 3D printer via local MQTT and MCP server.

---

## Infrastructure

### Printer
| Layer | Tech |
|-------|------|
| Protocol | MQTT over TLS (port 8883) |
| Auth | Serial number + LAN access code |
| Mode | Requires Developer Mode (LAN Only > Developer Mode) |
| Model | P2S |

### MCP Server
| Layer | Tech |
|-------|------|
| Server | bambu-printer-mcp (DMontgomery40) |
| Runtime | Node.js 20 |
| Config | Env vars: PRINTER_HOST, BAMBU_SERIAL, BAMBU_TOKEN, BAMBU_MODEL |

### Protocols
| Protocol | Port | Purpose |
|----------|------|---------|
| MQTT/TLS | 8883 | Real-time telemetry + commands (start, cancel, set temp) |
| FTP/TLS | 990 | File upload (gcode/3MF to printer SD card) |

---

## Available Telemetry

- **Temperatures:** nozzle, bed, chamber (current/target)
- **Print progress:** state, completion %, layer, remaining time, filename
- **Fans:** part cooling, auxiliary, chamber, heatbreak
- **AMS:** per-unit temp/humidity, per-tray filament colour/type/weight
- **Errors:** fail_reason, print_error, HMS alerts
- **Hardware:** nozzle diameter, SD card, WiFi signal
- **Camera:** XCam features (first layer inspector, spaghetti detector)

---

## Key Patterns

- **Read-first approach** — monitoring/troubleshooting over control
- **MCP for Claude** — conversational access to printer state, errors, logs
- **Local only** — no cloud dependency, all MQTT via LAN
- **Credentials in .env** — never hardcode IPs, tokens, or serial numbers
