# Bambu Lab P2S — MQTT Monitor & Claude Code Integration

Real-time MQTT print monitor and [Claude Code](https://claude.ai/claude-code) integration for Bambu Lab printers via the local network. No cloud dependency.

## What This Does

- **Live print monitoring** — tracks state, progress, temperatures, fan speeds, errors, and HMS alerts via MQTT
- **MCP integration** — lets Claude Code query printer status, control prints, upload files, and slice models conversationally
- **Troubleshooting reference** — documented a real P2S extruder failure diagnosis using MQTT telemetry (see [troubleshooting.md](troubleshooting.md))

## Architecture

```
Bambu P2S Printer (IoT network)
    |
    |-- MQTT/TLS :8883 --> monitor.js (telemetry + commands)
    |-- FTP/TLS  :990  --> file upload (gcode/3MF)
    |
    +-- MCP Server (bambu-printer-mcp) --> Claude Code
```

### Protocols

| Protocol | Port | Purpose |
|----------|------|---------|
| MQTT over TLS | 8883 | Real-time telemetry, print commands (start, cancel, set temp) |
| FTP implicit TLS | 990 | Upload gcode/3MF to printer SD card |

### Available Telemetry

- Temperatures (nozzle, bed, chamber — current/target)
- Print progress (state, %, layer, ETA, filename)
- Fan speeds (part cooling, auxiliary, chamber, heatbreak)
- AMS status (temp, humidity, per-tray filament colour/type/weight)
- Error codes (fail_reason, print_error, HMS alerts)
- Hardware info (nozzle diameter, SD card, WiFi signal)

## Prerequisites

- Bambu Lab printer with **Developer Mode** enabled (Settings > Network > LAN Only Mode > Developer Mode)
- Printer IP, serial number, and LAN access code from the printer's network settings screen
- Node.js 20+
- Network route from your machine to the printer (if on different VLANs, ensure firewall allows 8883/990)

## Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/bambu-monitor.git
cd bambu-monitor
npm install
```

2. Copy `.env.example` to `.env` and fill in your printer details:

```bash
cp .env.example .env
```

3. Run the monitor:

```bash
node monitor.js
```

The monitor will:
- Connect to your printer via MQTT
- Log state changes, progress (every 2%), errors, and HMS alerts
- Send a `pushall` request every 30 seconds for full status updates
- Write all output to both stdout and `print_monitor.log`

## MCP Server (Claude Code Integration)

This project uses [bambu-printer-mcp](https://github.com/DMontgomery40/bambu-printer-mcp) as an MCP server, giving Claude Code conversational access to:

| Action | MCP Tool |
|--------|----------|
| Get live status | `get_printer_status` |
| Set nozzle/bed temperature | `set_temperature` |
| Cancel current print | `cancel_print` |
| Start a file on printer | `start_print_job` |
| Upload gcode | `upload_gcode` |
| Upload any file (+ auto-start) | `upload_file` |
| Slice STL/3MF | `slice_stl` |
| Full print pipeline (slice + upload + start) | `print_3mf` |
| List files on printer | `list_printer_files` |
| STL manipulation | `scale_stl`, `rotate_stl`, `extend_stl_base`, `get_stl_info` |

### MCP Server Setup

```bash
# Install the MCP server
git clone https://github.com/DMontgomery40/bambu-printer-mcp.git
cd bambu-printer-mcp
npm install && npm run build

# Configure in Claude Code settings (~/.claude/settings.json or project .mcp.json)
```

## Files

| File | Description |
|------|-------------|
| `monitor.js` | MQTT print monitor — connects to printer, logs telemetry and errors |
| `troubleshooting.md` | Real-world P2S extruder failure diagnosis log with error codes and resolution |
| `CLAUDE.md` | Claude Code project context (loaded automatically each session) |
| `.env.example` | Template for printer credentials |

## Troubleshooting

See [troubleshooting.md](troubleshooting.md) for a detailed log of diagnosing a P2S extruder failure using MQTT telemetry. Includes:

- HMS error code reference
- Systematic elimination of causes
- Root cause: undersized bearing in factory gear assembly
- Lessons learned for MQTT-based diagnosis

## Licence

MIT
